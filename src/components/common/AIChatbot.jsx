import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineSparkles, HiX, HiPaperAirplane } from "react-icons/hi";
import { fetchAIMotivation } from "../../services/operations/courseDetailsAPI";

export default function AIChatbot({ courseId }) {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: `Hey ${user?.firstName || "there"}! I'm your SkillStep AI Mentor. How can I boost your learning journey today? 🚀`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  const quickPrompts = [
    "🔥 Give me daily motivation",
    "💡 Tips for consistency",
    "⚡ I feel stuck on a lesson",
    "🎯 How do I complete courses faster?",
  ];

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  if (!token) return null;

  const handleSend = async (customText) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg = { sender: "user", text: textToSend };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    if (!customText) setInput("");
    setLoading(true);

    const reply = await fetchAIMotivation(updatedMessages, courseId, token);

    const aiMsg = {
      sender: "ai",
      text: reply || "Keep putting in the work! Every video completed is a step closer to your dream tech role. 🚀",
    };

    setMessages((prev) => [...prev, aiMsg]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="w-80 sm:w-96 h-[480px] bg-richblack-800/95 border border-richblack-700 backdrop-blur-md rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-3"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-richblack-900 via-blue-950 to-richblack-900 p-4 border-b border-richblack-700 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-yellow-50/20 border border-yellow-50/40 flex items-center justify-center text-yellow-50 text-base">
                  ✨
                </div>
                <div>
                  <h3 className="text-sm font-bold text-richblack-5">SkillStep AI Mentor</h3>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-richblack-300 hover:text-white p-1 rounded-lg hover:bg-richblack-700 transition-colors"
              >
                <HiX className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-3.5 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-richblack-700">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                      m.sender === "user"
                        ? "bg-yellow-50 text-richblack-900 font-semibold rounded-br-none shadow-md"
                        : "bg-richblack-700/90 text-richblack-5 border border-richblack-600/80 rounded-bl-none shadow-sm"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-richblack-700/80 text-yellow-50 text-xs px-3.5 py-2 rounded-2xl rounded-bl-none border border-richblack-600 flex items-center gap-1.5">
                    <span className="animate-spin">⚡</span> AI Mentor is thinking...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Prompt Pills */}
            <div className="px-3 py-2 bg-richblack-900/50 border-t border-richblack-700/60 overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-none">
              {quickPrompts.map((prompt, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => handleSend(prompt)}
                  disabled={loading}
                  className="inline-block text-[11px] text-richblack-200 bg-richblack-800 hover:bg-richblack-700 border border-richblack-600/80 hover:border-yellow-50/40 px-2.5 py-1 rounded-full transition-all flex-shrink-0 cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-richblack-900 border-t border-richblack-700 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your AI Mentor..."
                className="flex-1 bg-richblack-800 text-richblack-5 text-xs px-3.5 py-2.5 rounded-xl border border-richblack-700 focus:outline-none focus:border-yellow-50/60 placeholder:text-richblack-400"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2.5 rounded-xl bg-yellow-50 text-richblack-900 font-bold hover:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-md"
              >
                <HiPaperAirplane className="w-4 h-4 transform rotate-90" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-13 h-13 rounded-full bg-gradient-to-tr from-yellow-500 via-yellow-300 to-amber-200 text-richblack-900 p-3.5 shadow-2xl flex items-center justify-center relative border-2 border-yellow-100 cursor-pointer"
      >
        <HiOutlineSparkles className="w-6 h-6 text-richblack-900" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-richblack-900 rounded-full animate-pulse" />
      </motion.button>
    </div>
  );
}
