import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { getProgressInsights } from "../../../services/operations/courseDetailsAPI";
import {
  HiOutlineLightningBolt,
  HiOutlineAcademicCap,
  HiOutlineCalendar,
  HiOutlineShieldCheck,
  HiChevronDown,
  HiChevronUp,
} from "react-icons/hi";

// Animated circular progress ring with high contrast text & colors
function CircularProgress({ value, size = 64, strokeWidth = 5, color }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255, 255, 255, 0.15)"
        strokeWidth={strokeWidth}
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy="0.35em"
        fill="#F1F2FF"
        fontSize={size * 0.23}
        fontWeight="bold"
        className="transform rotate-90"
        style={{ transformOrigin: "center" }}
      >
        {value}%
      </text>
    </svg>
  );
}

// Vibrant speed badge with high-contrast color coding
function SpeedBadge({ speed }) {
  const config = {
    Excellent: {
      bg: "bg-emerald-900/80",
      border: "border-emerald-400",
      text: "text-emerald-100",
      glow: "shadow-emerald-900/50",
    },
    Good: {
      bg: "bg-blue-900/80",
      border: "border-blue-400",
      text: "text-blue-100",
      glow: "shadow-blue-900/50",
    },
    Average: {
      bg: "bg-amber-900/80",
      border: "border-amber-400",
      text: "text-amber-100",
      glow: "shadow-amber-900/50",
    },
    "Needs Improvement": {
      bg: "bg-rose-900/80",
      border: "border-rose-400",
      text: "text-yellow-50",
      glow: "shadow-rose-900/50",
    },
  };

  const c = config[speed] || config["Average"];

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold border ${c.bg} ${c.border} text-yellow-50 ${c.text} shadow-md ${c.glow}`}
    >
      ⚡ {speed}
    </span>
  );
}

// High-contrast insight card
function InsightCard({ icon: Icon, label, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="flex items-start gap-3.5 p-4 rounded-xl bg-richblack-700/60 border border-richblack-600/80 shadow-md hover:bg-richblack-700/90 hover:border-richblack-500 transition-all duration-200"
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-yellow-50/10 border border-yellow-50/20 flex items-center justify-center text-yellow-50">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-richblack-200 uppercase tracking-wide mb-1">
          {label}
        </p>
        {children}
      </div>
    </motion.div>
  );
}

export default function ProgressInsights({ courseId }) {
  const { token } = useSelector((state) => state.auth);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchInsights = async () => {
      if (!courseId || !token) return;
      setLoading(true);
      const data = await getProgressInsights(courseId, token);
      setInsights(data);
      setLoading(false);
    };
    fetchInsights();
  }, [courseId, token]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-2">
        <div className="w-4 h-4 rounded-full bg-yellow-50/30 animate-pulse" />
        <span className="text-xs text-richblack-300 font-medium">
          Loading AI insights...
        </span>
      </div>
    );
  }

  if (!insights) {
    return null;
  }

  const {
    learningSpeed,
    knowledgeRetention,
    predictedCompletion,
    interviewReadiness,
    aiMotivation,
    stats,
  } = insights;

  const completionDate = predictedCompletion
    ? new Date(predictedCompletion).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year:
          new Date(predictedCompletion).getFullYear() !==
          new Date().getFullYear()
            ? "numeric"
            : undefined,
      })
    : "—";

  const isComplete = stats.completedCount >= stats.totalVideos;

  return (
    <div className="w-full">
      {/* Summary row — high contrast & clean layout */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-4 flex-wrap bg-richblack-900/60 p-3 rounded-lg border border-richblack-700/80"
      >
        <SpeedBadge speed={learningSpeed} />

        <div className="flex items-center gap-1.5 text-xs sm:text-sm">
          <span className="text-richblack-300 font-medium">Retention:</span>
          <span className="text-yellow-50 font-bold bg-richblack-800 px-2 py-0.5 rounded border border-richblack-700">
            {knowledgeRetention}%
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs sm:text-sm">
          <span className="text-richblack-300 font-medium">Readiness:</span>
          <span className="text-yellow-50 font-bold bg-richblack-800 px-2 py-0.5 rounded border border-richblack-700">
            {interviewReadiness}%
          </span>
        </div>

        {!isComplete && (
          <div className="flex items-center gap-1.5 text-xs sm:text-sm">
            <span className="text-richblack-300 font-medium">ETA:</span>
            <span className="text-richblack-5 font-semibold">
              {completionDate}
            </span>
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((prev) => !prev);
          }}
          className="ml-auto text-xs font-semibold text-yellow-5 bg-richblack-800 hover:bg-richblack-700 border border-richblack-600 px-3 py-1 rounded-full transition-all duration-200 flex items-center gap-1 shadow-sm"
        >
          <span>{expanded ? "Hide Details" : "Insights"}</span>
          {expanded ? (
            <HiChevronUp className="w-3.5 h-3.5 text-yellow-50" />
          ) : (
            <HiChevronDown className="w-3.5 h-3.5 text-yellow-50" />
          )}
        </button>
      </motion.div>

      {/* Expanded detail panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* AI Weekly Report Card (Option 4) */}
            {insights.aiWeeklyReport && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 p-4 rounded-xl bg-gradient-to-br from-richblack-800 via-richblack-800 to-blue-950/70 border border-yellow-50/40 text-richblack-25 shadow-xl"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base">🤖</span>
                  <span className="text-xs font-extrabold text-yellow-50 uppercase tracking-wider">
                    AI Weekly Report & Consistency Analysis
                  </span>
                </div>
                <div className="space-y-1 text-sm text-richblack-100">
                  <p className="text-yellow-5 text-base font-bold">
                    {insights.aiWeeklyReport.greeting}
                  </p>
                  <p className="font-semibold text-richblack-5">
                    {insights.aiWeeklyReport.completedText}
                  </p>
                  {insights.aiWeeklyReport.habitText && (
                    <p className="text-richblack-200">
                      {insights.aiWeeklyReport.habitText}
                    </p>
                  )}
                  {insights.aiWeeklyReport.projectionText && (
                    <p className="text-emerald-400 font-semibold">
                      {insights.aiWeeklyReport.projectionText}
                    </p>
                  )}
                  {insights.aiWeeklyReport.aiMessage && (
                    <p className="whitespace-pre-line text-richblack-100 italic bg-richblack-900/80 p-3 rounded-lg border border-richblack-700 mt-2">
                      "{insights.aiWeeklyReport.aiMessage}"
                    </p>
                  )}
                  <p className="text-yellow-50 font-bold mt-2">
                    {insights.aiWeeklyReport.closing}
                  </p>
                </div>
              </motion.div>
            )}

            {/* AI Daily Motivation Banner */}
            {aiMotivation && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-3 p-4 rounded-xl bg-gradient-to-r from-richblack-700 via-blue-950/70 to-purple-950/60 border border-blue-400/40 text-richblack-25 shadow-lg relative overflow-hidden"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-yellow-50/15 text-yellow-5 flex-shrink-0 text-xl border border-yellow-50/20">
                    ⚡
                  </div>
                  <div>
                    <span className="text-xs font-bold text-yellow-50 uppercase tracking-wider block mb-1">
                      Daily Motivation
                    </span>
                    <p className="text-sm font-medium text-richblack-5 leading-relaxed italic">
                      "{aiMotivation}"
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <InsightCard
                icon={HiOutlineLightningBolt}
                label="Learning Speed"
                delay={0}
              >
                <div className="flex items-center gap-2 mt-1">
                  <SpeedBadge speed={learningSpeed} />
                  <span className="text-xs text-richblack-200 font-medium">
                    ({stats.targetVideosPerDay || stats.videosPerDay} videos/day target • ~{stats.totalTargetDays} days)
                  </span>
                </div>
              </InsightCard>

              <InsightCard
                icon={HiOutlineAcademicCap}
                label="Knowledge Retention"
                delay={0.08}
              >
                <div className="flex items-center gap-3 mt-1">
                  <CircularProgress
                    value={knowledgeRetention}
                    size={52}
                    strokeWidth={4}
                    color="#818cf8"
                  />
                  <div>
                    <p className="text-base text-richblack-5 font-bold">
                      {knowledgeRetention}%
                    </p>
                    <p className="text-xs text-richblack-200 font-medium">
                      Based on {stats.activeDays} active days
                    </p>
                  </div>
                </div>
              </InsightCard>

              <InsightCard
                icon={HiOutlineCalendar}
                label="Predicted Completion"
                delay={0.16}
              >
                <p className="text-base font-bold text-richblack-5 mt-1">
                  {isComplete ? (
                    <span className="text-emerald-400">✓ Completed</span>
                  ) : (
                    completionDate
                  )}
                </p>
                <p className="text-xs text-richblack-200 font-medium mt-0.5">
                  {stats.completedCount} of {stats.totalVideos} videos done
                </p>
              </InsightCard>

              <InsightCard
                icon={HiOutlineShieldCheck}
                label="Interview Readiness"
                delay={0.24}
              >
                <div className="flex items-center gap-3 mt-1">
                  <CircularProgress
                    value={interviewReadiness}
                    size={52}
                    strokeWidth={4}
                    color={
                      interviewReadiness >= 80
                        ? "#34d399"
                        : interviewReadiness >= 50
                        ? "#fbbf24"
                        : "#f87171"
                    }
                  />
                  <div>
                    <p className="text-base text-richblack-5 font-bold">
                      {interviewReadiness >= 80
                        ? "Strong"
                        : interviewReadiness >= 50
                        ? "Building"
                        : "Early Stage"}
                    </p>
                    <p className="text-xs text-richblack-200 font-medium">
                      {interviewReadiness}% readiness score
                    </p>
                  </div>
                </div>
              </InsightCard>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
