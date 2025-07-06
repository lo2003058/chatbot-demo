// src/app/page.js
'use client';
import FactsEditor from '@/components/FactsEditor/FactsEditor';
import ChatButton from '@/components/ChatBot/ChatButton';
import ChatPanel from '@/components/ChatBot/ChatPanel';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <FactsEditor />

      <ChatButton />
      <ChatPanel />
    </main>
  );
}
