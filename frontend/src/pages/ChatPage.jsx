import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Circle,
  Plus,
  Mic,
  Lightbulb,
  Video,
  BookOpen,
  MoreHorizontal,
  Send,
  Bolt,
} from "lucide-react";
import { startConversation, sendMessage } from "../services/api";

// --- MessageBubble Component ---
// I've included this component here as it was missing from your code.
const MessageBubble = ({ sender, content, timestamp }) => {
  const isUser = sender === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : ""}`}
      >
        {/* Avatar Placeholder */}
        <div
          className={`h-8 w-8 rounded-full grid place-items-center flex-shrink-0 ${isUser ? "bg-blue-600" : "bg-[#2a2a2a]"
            }`}
        >
          {isUser ? (
            <span className="text-sm font-medium text-white">U</span>
          ) : (
            <Bolt size={16} className="text-white/70" />
          )}
        </div>

        {/* Message Content */}
        <div
          className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${isUser
            ? "bg-blue-600 text-white rounded-br-lg"
            : "bg-[#2a2a2a] text-white/90 rounded-bl-lg"
            }`}
        >
          <p className="text-sm">{content}</p>
        </div>
      </div>
    </motion.div>
  );
};


// --- Main Chat Component ---
export default function App() {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const messagesEndRef = useRef(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    let conv = conversation;

    // Add user message instantly
    const userMessage = {
      id: Date.now(),
      sender: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // If first message → start new conversation
    if (!conv) {
      try {
        const newConv = await startConversation({ title: input.substring(0, 30) });
        setConversation(newConv);
        conv = newConv;
      } catch (error) {
        console.error("Start conversation failed:", error);
        setIsLoading(false);
        // Optionally show error to user
        setMessages((prev) => prev.slice(0, -1)); // Remove optimistic user message
        return;
      }
    }

    try {
      // Send message to backend
      const response = await sendMessage({
        conversation_id: conv.id,
        sender: "user",
        content: userMessage.content,
      });

      // Add AI reply
      const aiMessage = {
        id: Date.now() + 1,
        sender: "ai",
        content: response?.ai_message?.content || "Sorry, I had trouble connecting.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Send message failed:", error);
      // Add a local error message
      const errorMessage = {
        id: Date.now() + 1,
        sender: "ai",
        content: "I couldn't get a response. Please try again.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // New handler to set input from chips
  const handleChipClick = (text) => {
    setInput(text);
  };

  return (
    <main className="relative min-h-screen bg-[#121212] text-white flex flex-col overflow-hidden p-4">

      {/* Header - Redesigned to match screenshot */}
      <header className="z-10 w-full max-w-3xl mx-auto py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-[#2a2a2a] grid place-items-center ring-1 ring-white/10">
            <Bolt size={18} className="text-white/70" />
          </div>
        </div>
        <button className="rounded-lg bg-[#2a2a2a] text-white/80 hover:bg-[#3a3a3a] ring-1 ring-white/10 px-3.5 py-2 text-sm font-medium transition">
          Upgrade
        </button>
      </header>

      {/* Main Content Area */}
      <div className="z-10 flex-1 w-full max-w-3xl mx-auto flex flex-col">
        <AnimatePresence mode="wait">
          {!conversation ? (
            // 🧠 Landing Screen - Redesigned to match screenshot
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex-1 flex flex-col items-center justify-center text-center px-4"
            >
              {/* Logo */}
              <div className="mx-auto mb-6 h-16 w-16 rounded-xl bg-[#2a2a2a] grid place-items-center ring-1 ring-white/10">
                <Bolt size={32} className="text-white/80" />
              </div>

              {/* Headings */}
              <p className="text-lg text-white/60">
                Good to See You!
              </p>
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-white mt-1">
                How Can I be an Assistance?
              </h1>
              <p className="mt-2 text-base text-white/50">
                I'm available 24/7 for you, ask me anything.
              </p>

              {/* Info Line */}
              <div className="flex justify-between items-center w-full max-w-lg mx-auto mt-10 text-xs text-white/40">
                <span className="flex items-center gap-2">
                  <Lock size={12} /> Unlock more features with the Pro plan.
                </span>
                <span className="flex items-center gap-2 text-green-500">
                  <Circle size={8} fill="currentColor" /> Active extensions
                </span>
              </div>

              {/* Input Field */}
              <div className="mt-4 relative max-w-lg w-full mx-auto">
                <div className="relative flex items-center w-full bg-[#1e1e1e] border border-white/10 rounded-xl shadow-lg">
                  <span className="pl-4 pr-2 text-white/40">
                    <Plus size={20} />
                  </span>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Ask anything..."
                    className="w-full bg-transparent text-white placeholder-white/50 py-4 pl-1 pr-14 focus:outline-none text-base"
                    disabled={isLoading}
                  />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition">
                    <Mic size={20} />
                  </button>
                </div>
              </div>

              {/* Suggested Prompts */}
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {[
                  { icon: <Lightbulb size={14} />, text: "Any advice for me?" },
                  { icon: <Video size={14} />, text: "Some youtube video idea" },
                  { icon: <BookOpen size={14} />, text: "Life lessons from Kratos" },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleChipClick(item.text)}
                    className="flex items-center gap-2 chip rounded-lg px-3 py-2 text-xs bg-[#2a2a2a] text-white/70 ring-1 ring-white/10 hover:bg-[#3a3a3a] transition"
                  >
                    {item.icon}
                    {item.text}
                  </button>
                ))}
                <button
                  className="flex items-center justify-center chip h-8 w-8 rounded-lg text-xs bg-[#2a2a2a] text-white/70 ring-1 ring-white/10 hover:bg-[#3a3a3a] transition"
                >
                  <MoreHorizontal size={14} />
                </button>
              </div>
            </motion.div>
          ) : (
            // 💬 Chat Interface
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex-1 flex flex-col overflow-hidden" // Use flex-1 here
            >
              {/* Messages */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2">
                {messages.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    sender={msg.sender}
                    content={msg.content}
                    timestamp={msg.timestamp}
                  />
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="h-8 w-8 rounded-full bg-[#2a2a2a] grid place-items-center flex-shrink-0">
                      <Bolt size={16} className="text-white/70" />
                    </div>
                    <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl bg-[#2a2a2a] text-white/90 rounded-bl-lg ml-2.5">
                      <motion.div
                        className="flex gap-1.5"
                        initial="start"
                        animate="end"
                        variants={{
                          start: {},
                          end: { transition: { staggerChildren: 0.2 } }
                        }}
                      >
                        <motion.div variants={{ start: { y: 0 }, end: { y: [0, -4, 0] } }} transition={{ repeat: Infinity, duration: 1.0 }} className="h-2 w-2 bg-white/40 rounded-full" />
                        <motion.div variants={{ start: { y: 0 }, end: { y: [0, -4, 0] } }} transition={{ repeat: Infinity, duration: 1.0, delay: 0.2 }} className="h-2 w-2 bg-white/40 rounded-full" />
                        <motion.div variants={{ start: { y: 0 }, end: { y: [0, -4, 0] } }} transition={{ repeat: Infinity, duration: 1.0, delay: 0.4 }} className="h-2 w-2 bg-white/40 rounded-full" />
                      </motion.div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input - sticky at the bottom */}
              <div className="sticky bottom-4 w-full mt-4">
                <div className="relative flex items-center w-full bg-[#1e1e1e] border border-white/10 rounded-xl shadow-lg">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type your message..."
                    className="w-full bg-transparent text-white placeholder-white/50 py-4 pl-5 pr-16 focus:outline-none text-base"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSend}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 grid place-items-center rounded-lg bg-white text-black text-sm font-medium hover:bg-white/90 transition disabled:opacity-50"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="z-10 text-center py-4 text-xs text-white/40">
        Unlock new era with MY AI.{" "}
        <a href="#" className="text-white/70 hover:underline">
          Sign up
        </a>
      </footer>
    </main>
  );
}
