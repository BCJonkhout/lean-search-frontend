"use client";

import { useState, useEffect, useRef } from "react";
import Paper from "@mui/material/Paper";
import InputGroup from "@/components/FormElements/InputGroup";
import { useLanguage } from "@/contexts/LanguageContext";
import { chatService } from "@/services";

type Message = {
    sender: "user" | "assistant";
    text: string;
};

export default function NewChatPage() {
    const { t } = useLanguage();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);
    const currentMessageRef = useRef<string>("");
    const [hasStarted, setHasStarted] = useState(false);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        if (!hasStarted) setHasStarted(true);

        const userMessage: Message = { sender: "user", text: input };
        setMessages((prev) => [...prev, userMessage]);
        const currentInput = input;
        setInput("");
        setIsLoading(true);

        const aiMessage: Message = {
            sender: "assistant",
            text: "",
        };

        setMessages((prev) => [...prev, aiMessage]);
        currentMessageRef.current = "";

        const onChunk = (chunk: string) => {
            currentMessageRef.current += chunk;
            setMessages((prev) => {
                const updated = [...prev];
                const lastMessage = updated[updated.length - 1];
                if (lastMessage.sender === "assistant") {
                    lastMessage.text = currentMessageRef.current;
                }
                return updated;
            });
        };

        const onError = (error: any) => {
            console.error("Chat error:", error);
            setMessages((prev) => {
                const updated = [...prev];
                const lastMessage = updated[updated.length - 1];
                if (lastMessage.sender === "assistant") {
                    lastMessage.text = "Sorry, an error occurred while processing your message.";
                }
                return updated;
            });
            setIsLoading(false);
        };

        const onComplete = () => {
            setIsLoading(false);
        };

        try {
            await chatService.chat(
                {
                    message: currentInput,
                    conversation_id: conversationId!,
                },
                onChunk,
                onError,
                onComplete
            );
        } catch (error) {
            onError(error);
        }
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
                        disabled={isLoading}
                        className="bg-primary text-white font-medium px-6 h-12 rounded-lg translate-y-[-10px] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? t('common.sending') || 'Sending...' : t('common.send')}
                    </button>
                </form>
            </Paper>
        </div>
    );
}
