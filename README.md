# Pocket Knowledge Bot

A lightweight web chatbot prototype where users maintain a list of facts and ask questions through a floating chat window. The bot answers by quoting the most relevant facts from the user's knowledge base.

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

## 🧪 Testing

The app includes a token-based authentication system for testing different company configurations. Select a company from the dropdown in the chat interface to test with different tokens.

**Test companies are configured in**: `src/setting/userInfo.js`

## 🔧 Key Features

- **Real-time fact matching** - Automatically finds relevant facts for user questions
- **Streaming responses** - Low-latency conversational experience
- **Responsive design** - Works on desktop and mobile
- **Persistent storage** - Facts saved locally across sessions
- **Multi-company support** - Token authentication for testing scenarios

## 🛡️ Security

- API keys stored server-side only
- Token-based authentication prevents unauthorized access
- Input validation on all API endpoints

