// src/components/custom/ChatBot.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import axios from "axios";
import { Bot, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sessionUser } from "@/types/session";
import MessageInput from "./MessageInput";
import { Badge } from "../ui/badge";
import Message, { MessageType } from "./Message";
import { v4 as uuidv4 } from "uuid";

interface AIMessage {
  lc: number;
  type: string;
  id: string[];
  kwargs: {
    content: string;
    additional_kwargs: Record<string, any>;
    response_metadata: Record<string, any>;
    id: string;
    tool_calls: any[];
    invalid_tool_calls: any[];
    usage_metadata: Record<string, any>;
  };
}

interface StepData {
  messages?: AIMessage | AIMessage[];
  nextRepresentative?: string;
}

interface Step {
  [key: string]: StepData | InterruptMessage[];
}

interface InterruptMessage {
  value: string;
  when: string;
}

interface ChatResponse {
  steps: Step[];
  currentState: { messages: AIMessage[]; nextRepresentative: string | null }[];
  status: number;
}

interface ChatInterfaceProps {
  isOpen?: boolean;
  onClose?: () => void;
}
export default function Chatbot({
  isOpen = true,
  onClose,
}: ChatInterfaceProps) {
  const { data: session } = useSession();
  const user: sessionUser = session?.user;
  console.log(user);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleChat = async (input: string) => {
    if (!input.trim()) return;

    const userMessage: MessageType = {
      isUser: true,
      content: input,
      timestamp: new Date(),
      id: uuidv4(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await axios.post<ChatResponse>("/api/chat", { UserMessage: input });
      const data = response.data;
      console.log(response);

      const lastStep = data.steps[data.steps.length - 1];

      if (lastStep) {
        const stepKey = Object.keys(lastStep)[0];
        const stepData = lastStep[stepKey];

        if (stepKey === "__interrupt__") {
          setMessages((prev) => [
            ...prev,
            { isUser: false, content: "I can assist you with that. Transferring to our billing department.", timestamp: new Date(), id: uuidv4() },
            { isUser: false, content: "Our billing agent will contact you shortly.", timestamp: new Date(), id: uuidv4() },
          ]);
        } else if (stepData && typeof stepData === "object" && "messages" in stepData && stepData.messages) {
          let lastMessage: AIMessage | null = null;

          if (Array.isArray(stepData.messages) && stepData.messages.length > 0) {
            lastMessage = stepData.messages[stepData.messages.length - 1];
          } else if (!Array.isArray(stepData.messages)) {
            lastMessage = stepData.messages;
          }

          if (lastMessage && lastMessage.kwargs?.content) {
            setMessages((prev) => [...prev, { isUser: false, content: lastMessage.kwargs.content, timestamp: new Date(), id: uuidv4() }]);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching chat response:", error);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <>
     
      <div className="flex flex-col h-full bg-gradient-to-b from-chatbot-dark to-chatbot-darker rounded-xl shadow-xl overflow-hidden border border-white/10">
        <div className="p-3 glass-effect flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-chatbot-accent/20 text-white border-none px-2 py-1">
              <Bot className="h-3 w-3 mr-1" />
              AI Support
            </Badge>
            <span className="text-xs text-white/70">Online</span>
          </div>
          {onClose && <button onClick={onClose} className="rounded-full h-6 w-6 flex items-center justify-center hover:bg-white/10 transition-colors">
            <X className="h-4 w-4 text-white/70" />
          </button>}
        </div>

        <div className="flex-1 overflow-y-auto p-4 scrollbar-hidden">
          {messages.length === 0 ? (
            <div className="text-xl font-extrabold text-center mb-6 bg-gradient-to-br from-[#4299E1] to-[#90CDF4] text-transparent bg-clip-text">
              <p>Welcome to LangCorp AI Support.</p>
              <p>How can we assist you today?</p>
            </div>
          ) : (
            messages.map((message) => <Message key={message.id} message={message} />)
          )}

          {isTyping && (
            <div className="flex items-start gap-3 mb-4">
              <div className="h-8 w-8 rounded-full bg-chatbot-dark border-2 border-purple-500/50 flex items-center justify-center">
                <Bot className="h-4 w-4 text-purple-300" />
              </div>
              <div className="glass-effect message-bubble">
                <p className="text-sm md:text-base typing-indicator">Typing</p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-4">
          <MessageInput onSendMessage={handleChat} disabled={isTyping} />
        </div>
      </div>
    </>
  );
}
