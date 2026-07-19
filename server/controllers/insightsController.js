const Course = require("../models/Course");
const User = require("../models/User");
const Section = require("../models/Section");
const CourseProgress = require("../models/CourseProgress");
const { callAIAPI } = require("./aiChatController");

/**
 * Compute AI Progress Insights for a user's course enrollment.
 */
exports.getProgressInsights = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    if (!courseId) {
      return res
        .status(400)
        .json({ success: false, message: "Course ID is required" });
    }

    // Fetch all required data in parallel
    let [user, courseProgress, allSections] = await Promise.all([
      User.findById(userId),
      CourseProgress.findOne({ courseID: courseId, userId }),
      Section.find({ courseId }).sort({ releaseOffset: 1 }),
    ]);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User data not found" });
    }

    // Auto-initialize course progress if missing for user
    if (!courseProgress) {
      courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
      });
    }

    // Find the user's enrollment for this course safely
    const userCourse = user.courses?.find((c) => {
      if (!c || !c.courseId) return false;
      const cId = c.courseId._id ? c.courseId._id.toString() : c.courseId.toString();
      return cId === courseId.toString();
    });

    const enrollmentDate = new Date(
      userCourse?.enrollmentDate || user.createdAt || Date.now()
    );
    const now = new Date();
    const completedCount = courseProgress?.completedVideos?.length || 0;
    const totalVideos = allSections.length;
    const completionLog = courseProgress?.completionLog || [];

    // Days since enrollment (minimum 1 to avoid division by zero)
    const msPerDay = 24 * 60 * 60 * 1000;
    const daysEnrolled = Math.max(
      1,
      Math.floor((now - enrollmentDate) / msPerDay)
    );

    // User's chosen speed target
    const targetVideosPerDay = userCourse.videosPerDay || courseProgress.targetVideosPerDay || 1;
    const totalTargetDays = Math.ceil(totalVideos / Math.max(1, targetVideosPerDay));

    // ═══════════════════════════════════════════
    // 1. LEARNING SPEED
    // ═══════════════════════════════════════════
    const actualVideosPerDay = completedCount / daysEnrolled;
    const speedRatio = actualVideosPerDay / targetVideosPerDay;

    let learningSpeed;
    if (speedRatio >= 1.2) {
      learningSpeed = "Excellent";
    } else if (speedRatio >= 0.8) {
      learningSpeed = "Good";
    } else if (speedRatio >= 0.5) {
      learningSpeed = "Average";
    } else {
      learningSpeed = "Needs Improvement";
    }

    // If course is complete, always show Excellent
    if (completedCount >= totalVideos && totalVideos > 0) {
      learningSpeed = "Excellent";
    }

    // ═══════════════════════════════════════════
    // 2. KNOWLEDGE RETENTION
    // ═══════════════════════════════════════════
    // Based on consistency: how many unique days the user studied
    const activeDays = new Set();
    for (const log of completionLog) {
      const day = new Date(log.completedAt).toDateString();
      activeDays.add(day);
    }

    let retention;
    if (completionLog.length === 0) {
      // Fallback for legacy data without completionLog
      // Use a simple progress-based estimate
      retention = Math.min(100, Math.round((completedCount / Math.max(1, totalVideos)) * 100));
    } else {
      const consistencyRatio = activeDays.size / Math.max(1, daysEnrolled);
      retention = Math.min(100, Math.round(consistencyRatio * 100));
    }

    // ═══════════════════════════════════════════
    // 3. PREDICTED COMPLETION DATE
    // ═══════════════════════════════════════════
    let predictedCompletion = null;
    const remainingVideos = totalVideos - completedCount;

    if (remainingVideos <= 0) {
      predictedCompletion = userCourse.completionDate
        ? new Date(userCourse.completionDate).toISOString()
        : now.toISOString();
    } else if (actualVideosPerDay > 0) {
      const daysRemaining = Math.ceil(remainingVideos / actualVideosPerDay);
      const predicted = new Date(now);
      predicted.setDate(predicted.getDate() + daysRemaining);
      predictedCompletion = predicted.toISOString();
    } else {
      // User hasn't started — estimate based on their selected target speed
      const daysRemaining = Math.ceil(remainingVideos / targetVideosPerDay);
      const predicted = new Date(now);
      predicted.setDate(predicted.getDate() + daysRemaining);
      predictedCompletion = predicted.toISOString();
    }

    // ═══════════════════════════════════════════
    // 4. INTERVIEW READINESS
    // ═══════════════════════════════════════════
    const progressPercent = totalVideos > 0
      ? (completedCount / totalVideos) * 100
      : 0;

    // Speed score (0-100): normalize speedRatio
    const speedScore = Math.min(100, Math.round(speedRatio * 100));

    // Composite: progress(40%) + speed(30%) + retention(30%)
    const interviewReadiness = Math.min(
      100,
      Math.round(progressPercent * 0.4 + speedScore * 0.3 + retention * 0.3)
    );

    // ═══════════════════════════════════════════
    // 5. RECOMMENDED REVISION
    // ═══════════════════════════════════════════
    const revisionSections = [];

    if (completionLog.length >= 2) {
      const sortedLogs = [...completionLog].sort(
        (a, b) => new Date(a.completedAt) - new Date(b.completedAt)
      );

      for (let i = 1; i < sortedLogs.length; i++) {
        const diffMs =
          new Date(sortedLogs[i].completedAt) -
          new Date(sortedLogs[i - 1].completedAt);
        const diffMin = diffMs / (1000 * 60);

        if (diffMin < 2) {
          const section = allSections.find(
            (s) => s._id.toString() === sortedLogs[i].sectionId.toString()
          );
          if (section && !revisionSections.some((r) => r._id.toString() === section._id.toString())) {
            revisionSections.push({
              _id: section._id,
              title: section.title,
              reason: "Watched in rapid succession (may need review)",
            });
          }
        }
      }
    }

    // Calculate percentile rank among enrolled students for this course
    const allProgressForCourse = await CourseProgress.find({ courseID: courseId });
    const lessOrEqual = allProgressForCourse.filter(
      (p) => (p.completedVideos ? p.completedVideos.length : 0) <= completedCount
    ).length;
    const totalEnrolled = Math.max(1, allProgressForCourse.length);
    const percentile = Math.round((lessOrEqual / totalEnrolled) * 100);
    const topPercent = Math.max(5, Math.min(50, 100 - percentile + 5));

    let daysRemaining = 0;
    if (predictedCompletion) {
      daysRemaining = Math.max(1, Math.ceil((new Date(predictedCompletion) - now) / msPerDay));
    }

    let aiMotivation = "";
    if (completedCount === 0) {
      aiMotivation = `Target pace: ${targetVideosPerDay} video${targetVideosPerDay > 1 ? "s" : ""}/day (~${totalTargetDays} days total). Watch your first lesson to start your streak!`;
    } else if (completedCount >= totalVideos) {
      aiMotivation = `🎉 Incredible achievement! You've completed all ${totalVideos} lessons and reached the top 5% of learners. Claim your certificate!`;
    } else {
      aiMotivation = `🔥 You've completed ${completedCount} of ${totalVideos} lessons at ${targetVideosPerDay} video${targetVideosPerDay > 1 ? "s" : ""}/day. You're in the top ${topPercent}% of learners. Only ${daysRemaining} day${daysRemaining > 1 ? "s" : ""} left to finish!`;
    }

    // Option 4: AI Weekly Report Card Generation
    const daysSaved = Math.max(0, totalTargetDays - daysRemaining);
    const earlyText = daysSaved > 0
      ? `Based on your consistency, you'll finish the course ${daysSaved} day${daysSaved > 1 ? "s" : ""} earlier.`
      : `At your target pace of ${targetVideosPerDay} video${targetVideosPerDay > 1 ? "s" : ""}/day, you'll finish in about ${daysRemaining} day${daysRemaining > 1 ? "s" : ""}.`;

    const reportPrompt = `Generate a concise 4-bullet AI Weekly Learning Report for student ${user.firstName}. Stats: Completed ${completedCount} of ${totalVideos} videos (${Math.round(progressPercent)}%). Speed: ${learningSpeed}. Projection: ${earlyText}. Format output as short punchy lines.`;

    const groqReport = await callAIAPI(reportPrompt);

    let aiWeeklyReport = null;
    if (groqReport) {
      aiWeeklyReport = {
        greeting: "Great progress!",
        completedText: `You've completed ${completedCount} video${completedCount !== 1 ? "s" : ""}.`,
        aiMessage: groqReport,
        closing: "Keep going! 🚀",
      };
    } else {
      aiWeeklyReport = {
        greeting: progressPercent >= 50 ? "Great progress!" : "Awesome start!",
        completedText: `You've completed ${completedCount} video${completedCount !== 1 ? "s" : ""}.`,
        habitText: "You usually study with steady consistency.",
        projectionText: earlyText,
        closing: "Keep going! 🚀",
      };
    }

    return res.status(200).json({
      success: true,
      data: {
        learningSpeed,
        knowledgeRetention: retention,
        predictedCompletion,
        interviewReadiness,
        aiMotivation,
        aiWeeklyReport,
        stats: {
          completedCount,
          totalVideos,
          daysEnrolled,
          targetVideosPerDay,
          totalTargetDays,
          actualVideosPerDay: Math.round(actualVideosPerDay * 100) / 100,
          videosPerDay: Math.round(actualVideosPerDay * 100) / 100,
          progressPercent: Math.round(progressPercent),
          activeDays: activeDays.size,
          topPercent,
        },
      },
    });
  } catch (error) {
    console.error("Error computing progress insights:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to compute progress insights",
      error: error.message,
    });
  }
};
