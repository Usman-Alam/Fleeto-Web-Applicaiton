"use client";

import { useState, useRef, useEffect } from "react";

export default function ChatbotPage() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const botMessage = { role: "gordon", text: data.message };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.log(error)
      const errorMessage = {
        role: "gordon",
        text: "Something went wrong, you donut!",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  return (
    <div className="w-[var(--section-width)] mt-[100px] mx-auto h-[70vh] bg-white rounded-2xl shadow-2xl border border-red-300 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-red-300 text-center text-lg font-semibold text-red-700">
        What do you want to ask Gordon?
      </div>

      {/* Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[75%] px-4 py-3 text-base rounded-2xl shadow-sm ${
              msg.role === "user"
                ? "bg-[var(--accent)] text-white self-end ml-auto"
                : "bg-[var(--bg2)] text-gray-800 self-start"
            }`}
          >
            <strong>{msg.role === "user" ? "You" : "Gordon"}:</strong> {msg.text}
          </div>
        ))}
        {loading && (
          <div className="text-sm italic text-gray-500">
            Gordon is typing some brutal honesty...
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-red-300 px-4 py-3 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Gordon anything food-related..."
          className="flex-1 p-3 rounded-full focus:outline-none focus:ring-2"
          style={{
            border: "1px solid var(--bg2)",
            backgroundColor: "var(--bg2)",
          }}
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 rounded-full transition"
          style={{
            backgroundColor: "var(--bg2)",
            color: "var(--accent)",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
