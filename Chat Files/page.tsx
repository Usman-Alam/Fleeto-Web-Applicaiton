"use client";
import { useState } from "react";

export default function Home() {
    const [messages, setMessages] = useState<{role: string; text: string}[]>([]);
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)

    const sendMessage = async () => {
        if (!input.trim()) {return}

        const userMessage = {role: 'user', text: input};
        setMessages((prev) => [...prev, userMessage]);
        setInput('')
        setLoading(true)

        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: input }),
        })

        const data = await res.json();
        const botMessage = { role: 'gordon', text: data.message };
        setMessages((prev) => [...prev, botMessage]);
        setLoading(false);
    }

    return (
        <div style={{ maxWidth: '600px', margin: '2rem auto', fontFamily: 'Arial' }}>
          <h1>🔥 Gordon Ramsay Food AI</h1>
          <div style={{ border: '1px solid #ccc', padding: '1rem', height: '400px', overflowY: 'scroll' }}>
            {messages.map((msg, i) => (
              <p key={i}>
                <strong>{msg.role === 'user' ? 'You' : 'Gordon Ramsay'}:</strong> {msg.text}
              </p>
            ))}
            {loading && <p><em>Gordon is typing some brutal honesty...</em></p>}
          </div>
    
          <div style={{ marginTop: '1rem' }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Gordon anything food-related..."
              style={{ width: '80%', padding: '0.5rem' }}
            />
            <button onClick={sendMessage} style={{ padding: '0.5rem 1rem' }}>Send</button>
          </div>
        </div>
      )
}