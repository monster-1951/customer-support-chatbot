// src/app/page.tsx
import Chatbot from "@/components/custom/ChatBot";
import Header from "@/components/custom/Header";

export default function Home() {
  return (
      <>
      <Header/>
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md h-[600px]">
        <Chatbot />
      </div>
    </div>
      </>
  );
}
