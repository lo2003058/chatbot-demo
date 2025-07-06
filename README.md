# Pocket Knowledge Bot

A lightweight web chatbot prototype where users maintain a list of facts and ask questions through a floating chat
window. The bot answers by quoting the most relevant facts from the user's knowledge base.

## Deploy status

![Vercel Deploy](https://deploy-badge.vercel.app/vercel/chatbot-demo)

**Live demo:** [https://chatbot-demo-phi.vercel.app/](https://chatbot-demo-phi.vercel.app/)

## 🚀 Quick Start

1. **Clone and install**
   ```bash
   git clone <repository-url>
   cd chatbot_demo
   yarn install
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env.local
   ```

   Add your OpenAI API key to `.env.local`:
   ```env
   AI_SERVICE_API_ENDPOINT="https://api.openai.com/v1"
   AI_SERVICE_API_KEY="your-openai-api-key-here"
   AI_SERVICE_MODEL="gpt-3.5-turbo"
   AI_SERVICE_MAX_TOKENS="1000"
   ```

3. **Run locally**
   ```bash
   yarn dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

**Frontend**: Next.js 15 + React 19 + Redux Toolkit + Tailwind CSS
**Backend**: Next.js API routes with OpenAI integration
**Storage**: Browser localStorage for facts persistence
**Authentication**: Token-based system for multi-company testing

## 📱 How to Use

1. **Add Facts**: Use the left panel to add facts to your knowledge base
2. **Chat**: Click the floating chat button (bottom-right)
3. **Ask Questions**: Type questions related to your facts
4. **View Citations**: Bot responses include which facts were referenced

## 🧪 Live Demo Ready

**For the follow-up session:**

1. Run `yarn dev` and navigate to `http://localhost:3000`
2. Add sample facts (e.g., "Company founding date", "Office locations")
3. Click chat button and ask related questions
4. Observe fact citations in bot responses

**Testing features:**

- Multi-company token authentication (dropdown in chat)
- Real-time fact matching and citation
- Persistent storage across browser refresh
- Streaming response experience

## 🎯 Technical Highlights

- **Intelligent fact matching** - Custom algorithm finds relevant facts for user queries
- **Streaming architecture** - Real-time response chunks for low-latency feel
- **Secure API design** - Server-side OpenAI integration with token authentication
- **State management** - Redux + localStorage hybrid for optimal UX
- **Component architecture** - Modular React components with clean separation
