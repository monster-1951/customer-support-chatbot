'use client';
import React from "react";
import { Avatar } from "@/components/ui/avatar";
import { MessageCircle, Bot } from "lucide-react";

export type MessageType = {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
};

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  return (
    <div
      className={`flex items-start gap-3 mb-4 ${
        message.isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!message.isUser && (
        <Avatar className="h-8 w-8 border-2 border-purple-500/50 bg-[#171923] flex items-center justify-center">
          <Bot className="h-4 w-4 text-purple-300" />
        </Avatar>
      )}

      <div
        className={`rounded-xl p-3 max-w-[80%] shadow-md opacity-90 text-white text-sm md:text-base animate-fade-in ${
          message.isUser
            ? "bg-gradient-to-br from-[#4299E1] to-[#90CDF4]"
            : "backdrop-blur-lg bg-black/20 border border-white/10"
        }`}
      >
        <p>{message.content}</p>
        <div
          className={`text-[10px] mt-1 opacity-70 ${
            message.isUser ? "text-right" : "text-left"
          }`}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>

      {message.isUser && (
        <Avatar className="h-8 w-8 border-2 border-blue-500/50 bg-[#171923] flex items-center justify-center">
          <MessageCircle className="h-4 w-4 text-blue-300" />
        </Avatar>
      )}
    </div>
  );
};

export default Message;