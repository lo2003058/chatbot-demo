// src/app/api/chat/route.js
import {NextResponse} from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: process.env.AI_SERVICE_API_ENDPOINT,
  apiKey: process.env.AI_SERVICE_API_KEY,
});

export async function POST(request) {
  try {
    const {message, facts} = await request.json();

    if (!message) {
      return NextResponse.json(
        {error: 'Message is required'},
        {status: 400}
      );
    }

    // Handle case when facts array is empty or null
    const factsList = facts || [];
    const relevantFacts = factsList.length > 0 ? findRelevantFacts(message, factsList) : [];

    // Create different system prompts based on whether facts exist
    let systemContent;

    if (factsList.length === 0) {
      // No facts available - general assistant mode
      systemContent = `
      You are a helpful assistant for a knowledge base system. 
      The user currently has no facts stored in their knowledge base. 
      You should:
      1. Politely explain that their knowledge base is empty
      2. Suggest they add some facts to get more specific answers
      3. Still try to be helpful by providing general information if appropriate
      4. Keep responses concise and friendly
      `;
    } else if (relevantFacts.length === 0) {
      // Facts exist but none are relevant
      systemContent = `
      You are a helpful assistant that answers questions based on a provided knowledge base. 
      The user has ${factsList.length} fact(s) in their knowledge base, but none appear to be relevant to their current question.
      You should:
      1. Politely explain that you don't have relevant information in their knowledge base for this question
      2. Suggest they might want to add more facts related to their question
      3. Optionally provide general information if appropriate
      4. Keep responses helpful and concise
      
      Available facts in knowledge base:
      ${factsList.map(fact => `- ${fact.title}`).join('\n')}
      `;
    } else {
      // Relevant facts found
      const context = relevantFacts.map(fact => `${fact.title}: ${fact.content}`).join('\n\n');
      systemContent = `
      You are a helpful assistant that answers questions based on the provided knowledge base facts. 
      Always cite which facts you're using in your response. 
      Keep your responses concise and helpful.
      
      Available relevant facts:
      ${context}
      `;
    }

    // Create streaming response
    const stream = await openai.chat.completions.create({
      model: process.env.AI_SERVICE_MODEL,
      messages: [
        {
          role: 'system',
          content: systemContent
        },
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: parseInt(process.env.AI_SERVICE_MAX_TOKENS),
      temperature: 0.4,
      stream: true,
    });

    // Create a readable stream for the response
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          // Send the cited facts first
          const factsData = {
            type: 'facts',
            citedFacts: relevantFacts
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(factsData)}\n\n`));

          // Then stream the response
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              const data = {
                type: 'content',
                content: content
              };
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
            }
          }

          // Send completion signal
          const endData = {type: 'end'};
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(endData)}\n\n`));
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          const errorData = {
            type: 'error',
            error: 'Failed to get response from AI service'
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorData)}\n\n`));
          controller.close();
        }
      }
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Chat API error:', error);

    if (error.status === 401 || error.code === 'invalid_api_key') {
      return NextResponse.json(
        {error: 'AI service API key is invalid'},
        {status: 401}
      );
    }

    if (error.status === 429) {
      return NextResponse.json(
        {error: 'Rate limit exceeded. Please try again later.'},
        {status: 429}
      );
    }

    return NextResponse.json(
      {error: 'Failed to get response from AI service'},
      {status: 500}
    );
  }
}

// Simple fact matching function
function findRelevantFacts(message, facts) {
  const messageLower = message.toLowerCase();
  const relevantFacts = [];

  facts.forEach(fact => {
    const titleLower = fact.title.toLowerCase();
    const contentLower = fact.content.toLowerCase();

    // Check if message contains keywords from fact title or content
    const titleWords = titleLower.split(/\s+/);
    const contentWords = contentLower.split(/\s+/);

    const hasRelevantKeywords = titleWords.some(word =>
      word.length > 2 && messageLower.includes(word)
    ) || contentWords.some(word =>
      word.length > 3 && messageLower.includes(word)
    );

    if (hasRelevantKeywords) {
      relevantFacts.push(fact);
    }
  });

  // If no specific matches found and we have few facts, include all for context
  if (relevantFacts.length === 0 && facts.length <= 5) {
    return facts;
  }

  // Return top 3 most relevant facts
  return relevantFacts.slice(0, 3);
}
