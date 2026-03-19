import React, { useEffect, useRef, useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AiChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/v2/chat-endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.choices?.[0]?.message?.content || 'Fel vid svar.',
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Något gick fel.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-full flex-col rounded-lg border">
      <div className="flex-grow overflow-auto p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'} text-sm text-[#F3EEE4]`}
          >
            <strong>{msg.role === 'user' ? 'Du:' : 'Margot:'}</strong>{' '}
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t p-4">
        <textarea
          className="w-full resize-none rounded border border-gray-600 bg-gray-800 p-2 text-white"
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Fråga Margot..."
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="mt-2 rounded bg-[#B69852] px-4 py-2 text-white hover:bg-[#a08547] disabled:opacity-50"
        >
          {loading ? 'Skickar...' : 'Skicka'}
        </button>
      </div>
    </div>
  );
};

export default AiChat;
