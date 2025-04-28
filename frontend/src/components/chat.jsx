import "./chat.css";

import React, { useState } from "react";

import ReactMarkdown from 'react-markdown';

const Chat = () => {
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Hi! How can I help you explore NYC today?" }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input;
        setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
        setInput("");
        setIsTyping(true);

        try {
            const res = await fetch("http://127.0.0.1:5000/chatbot", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: userMessage }),
            });

            const data = await res.json();
            const botReply = data.reply || "Sorry, I couldn't understand.";

            setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
        } catch (err) {
            console.error("Error communicating with chatbot:", err);
            setMessages((prev) => [...prev, { sender: "bot", text: "Oops! Something went wrong." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="chat-wrapper">
            <div className="chat-messages">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`chat-message ${msg.sender}`}>
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                    <div className="chat-message bot typing-indicator">
                        <em>Typing...</em>
                    </div>
                )}
            </div>

            <div className="chat-input-area">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                />
                <button onClick={handleSend}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
