"use client";

import { useState, useEffect, useRef } from "react";
import Paper from "@mui/material/Paper";
import InputGroup from "@/components/FormElements/InputGroup";
import { useLanguage } from "@/contexts/LanguageContext";

type Message = {
    sender: "user" | "assistant";
    text: string;
};

export default function NewChatPage() {
    const { t } = useLanguage();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);
    const [hasStarted, setHasStarted] = useState(false);

    const handleSend = () => {
        if (!input.trim()) return;

        if (!hasStarted) setHasStarted(true);

        const userMessage: Message = { sender: "user", text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");

        setTimeout(() => {
            const assistantMessage: Message = {
                sender: "assistant",
                text: `You said: "${input}"`,
            };
            setMessages((prev) => [...prev, assistantMessage]);
        }, 500);
    };


    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex flex-col h-[calc(100vh-140px)]">
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3 relative">
                {!hasStarted && messages.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h1 className="text-4xl font-bold text-gray-400 text-center px-4">
                            {t('home.welcome')}
                        </h1>
                    </div>
                )}
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`max-w-[75%] text-lg px-4 py-2 rounded-xl whitespace-pre-wrap ${
                            msg.sender === "user" ? "bg-blue-100 ml-auto" : "bg-blue-50 mr-auto"
                        }`}
                    >
                        {msg.text}
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            <Paper
                elevation={0}
                sx={{
                    borderRadius: 4,
                    px: 2,
                    py: 1.5
                }}
            >
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSend();
                    }}
                    className="flex items-end gap-4"
                >
                    <InputGroup
                        placeholder={t('home.description')}
                        type="text"
                        value={input}
                        handleChange={(e) => setInput(e.target.value)}
                        className="w-full h-18"
                        label={""}
                    />
                    <button
                        type="submit"
                        className="bg-primary text-white font-medium px-6 h-12 rounded-lg translate-y-[-10px]"
                    >
                        {t('common.send')}
                    </button>
                </form>
            </Paper>
        </div>
    );
}
