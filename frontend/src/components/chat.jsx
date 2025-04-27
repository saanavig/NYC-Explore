import "./chat.css";

import React, { useState } from "react";

const generateBotResponse = (userInput) => {
    if (userInput.toLowerCase().includes("music"))
    {
        return "You might enjoy a live concert happening downtown tonight!";
    }
    else if (userInput.toLowerCase().includes("food"))
    {
        return "There’s a food festival in Queens you should check out!";
    }
    else
    {
        return "Tell me what you're interested in — music, art, food, outdoor events?";
    }
};

const Chat = () => {
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Hi! How can I help you explore NYC today?" }
    ]);
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim()) return;

        setMessages((prev) => [...prev, { sender: "user", text: input }]);
        const botReply = generateBotResponse(input);
        setInput("");

        setTimeout(() => {
            setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
        }, 500);
    };

    return (
        <div className="chat-wrapper">
            <div className="chat-messages">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`chat-message ${msg.sender}`}>
                        {msg.text}
                    </div>
                ))}
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
