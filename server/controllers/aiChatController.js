const User = require("../models/User");
const CourseProgress = require("../models/CourseProgress");

// Helper function to query Groq Cloud API
const callGroqAPI = async (systemPrompt, userMessages = []) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.startsWith("gsk_vM6Hn4t7Yw8X9z0A1B2C3D4E5F6G7H8I9J0K") || apiKey.includes("your_groq_api_key")) {
    return null;
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          ...userMessages,
        ],
        temperature: 0.7,
        max_tokens: 350,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn("Groq API warning/error response:", response.status, errText);
      return null;
    }

    const data = await response.json();
    return data?.choices?.[0]?.message?.content || null;
  } catch (err) {
    console.error("Error connecting to Groq API:", err.message);
    return null;
  }
};

// 1. AI Motivator Chatbot Endpoint
exports.getAIMotivation = async (req, res) => {
  try {
    const { messages, courseId } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    let userContext = `Student Name: ${user?.firstName || "Learner"}.`;

    if (courseId) {
      const progress = await CourseProgress.findOne({ courseID: courseId, userId });
      const userCourse = user?.courses?.find(
        (c) => (c.courseId?._id || c.courseId)?.toString() === courseId.toString()
      );
      if (progress) {
        userContext += ` Completed lessons: ${progress.completedVideos?.length || 0}. Target speed: ${userCourse?.videosPerDay || progress.targetVideosPerDay || 1} videos/day.`;
      }
    }

    const systemPrompt = `You are SkillStep's AI Motivational Coach & Learning Mentor. Your role is to inspire, encourage, and give practical study tips to tech students. Keep your tone enthusiastic, warm, concise, and empowering (2-4 sentences max per response). ${userContext}`;

    const formattedMessages = (messages || []).map((m) => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text,
    }));

    const aiReply = await callGroqAPI(systemPrompt, formattedMessages);

    if (aiReply) {
      return res.status(200).json({
        success: true,
        reply: aiReply,
        source: "groq",
      });
    }

    // Fallback motivational responses if Groq API key is unconfigured
    const lastUserMessage = (messages?.[messages.length - 1]?.text || "").toLowerCase();
    let fallbackReply = `Hey ${user?.firstName || "there"}! Every single lesson you complete brings you closer to your career goals. Keep up the consistent effort today! 🚀`;

    if (lastUserMessage.includes("stuck") || lastUserMessage.includes("hard")) {
      fallbackReply = `Feeling stuck is just proof that your brain is building new pathways! Break the current topic into smaller 5-minute chunks, take a short breather, and try one more video today. You've got this! 💪`;
    } else if (lastUserMessage.includes("consistent") || lastUserMessage.includes("habit")) {
      fallbackReply = `Consistency beats intensity every time! Setting a fixed 20-minute daily study slot will build momentum faster than weekend cramming. Stay steady! ✨`;
    } else if (lastUserMessage.includes("behind") || lastUserMessage.includes("slow")) {
      fallbackReply = `Don't measure your progress against anyone else. Even 1 video per day puts you miles ahead of where you were yesterday! Focus on today's goal. 🎯`;
    }

    return res.status(200).json({
      success: true,
      reply: fallbackReply,
      source: "fallback",
    });
  } catch (error) {
    console.error("AI Motivation Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate AI motivation message.",
    });
  }
};

exports.callAIAPI = callGroqAPI;
exports.callGroqAPI = callGroqAPI;
