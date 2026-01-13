import { motion } from "motion/react";
import {
  Sparkles,
  TrendingUp,
  Heart,
  Brain,
  Moon,
  ArrowLeft,
} from "lucide-react";
import type { DreamEntry, ThemeConfig } from "../../App";
import { useMemo } from "react";

interface AnalysisPageProps {
  dreams: DreamEntry[];
  theme: ThemeConfig;
  onBack: () => void;
}

export function AnalysisPage({ dreams, onBack }: AnalysisPageProps) {
  // Analyze dreams by emotion
  const emotionAnalysis = useMemo(() => {
    const emotionCount: { [key: string]: number } = {};
    dreams.forEach((dream) => {
      const emotion = dream.emotion.toLowerCase();
      emotionCount[emotion] = (emotionCount[emotion] || 0) + 1;
    });
    return Object.entries(emotionCount)
      .map(([emotion, count]) => ({ emotion, count }))
      .sort((a, b) => b.count - a.count);
  }, [dreams]);

  // Find common themes (recurring dreams)
  const recurringDreams = useMemo(() => {
    return dreams.filter((d) => d.recurring === "yes");
  }, [dreams]);

  // Recent activity
  const recentDreams = useMemo(() => {
    return [...dreams]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [dreams]);

  const getEmotionColor = (emotion: string) => {
    const emotionColors: { [key: string]: string } = {
      joy: "bg-yellow-100 text-yellow-700 border-yellow-300",
      anxiety: "bg-orange-100 text-orange-700 border-orange-300",
      fear: "bg-red-100 text-red-700 border-red-300",
      sadness: "bg-blue-100 text-blue-700 border-blue-300",
      peace: "bg-green-100 text-green-700 border-green-300",
      nostalgia: "bg-purple-100 text-purple-700 border-purple-300",
      confusion: "bg-gray-100 text-gray-700 border-gray-300",
      excitement: "bg-pink-100 text-pink-700 border-pink-300",
    };
    return (
      emotionColors[emotion.toLowerCase()] ||
      "bg-purple-100 text-purple-700 border-purple-300"
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative z-8 w-full max-w-6xl mx-auto px-6 py-8 bg-white/40 rounded-md"
    >
      <div className="flex items-center justify-between mb-8">
        <button
          className="p-2 bg-white/60! backdrop-blur-lg rounded-full border border-white/40"
          onClick={onBack}
        >
          <ArrowLeft className="w-5 h-5 text-purple-600" />
        </button>
        <h2 className="text-xl text-purple-800">Dream Analysis</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Total Dreams Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 border border-white/40"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 mb-1">Total Dreams</p>
              <p className="text-3xl text-purple-900">{dreams.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Moon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        {/* Recurring Dreams Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 border border-white/40"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 mb-1">Recurring Dreams</p>
              <p className="text-3xl text-purple-900">
                {recurringDreams.length}
              </p>
            </div>
            <div className="p-3 bg-pink-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-pink-600" />
            </div>
          </div>
        </motion.div>

        {/* Most Common Emotion Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 border border-white/40"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 mb-1">Top Emotion</p>
              <p className="text-2xl text-purple-900 capitalize">
                {emotionAnalysis[0]?.emotion || "None"}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Heart className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emotions Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 border border-white/40"
        >
          <h3 className="text-xl text-purple-800 mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Emotion Analysis
          </h3>
          <div className="space-y-3">
            {emotionAnalysis.length === 0 ? (
              <p className="text-purple-600 text-center py-8">
                No dreams analyzed yet
              </p>
            ) : (
              emotionAnalysis.map((item, index) => (
                <motion.div
                  key={item.emotion}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <span
                    className={`px-3 py-1 rounded-lg text-sm capitalize border ${getEmotionColor(
                      item.emotion
                    )} min-w-[100px]`}
                  >
                    {item.emotion}
                  </span>
                  <div className="flex-1 bg-purple-100 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(item.count / dreams.length) * 100}%`,
                      }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                      className="h-full bg-linear-to-r from-purple-400 to-pink-400"
                    />
                  </div>
                  <span className="text-sm text-purple-700 min-w-[30px] text-right">
                    {item.count}
                  </span>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 border border-white/40"
        >
          <h3 className="text-xl text-purple-800 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Recent Dreams
          </h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
            {recentDreams.length === 0 ? (
              <p className="text-purple-600 text-center py-8">
                No recent dreams
              </p>
            ) : (
              recentDreams.map((dream, index) => (
                <motion.div
                  key={dream.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="p-3 bg-white/50 rounded-lg border border-purple-200/50"
                >
                  <div className="flex items-start justify-between mb-1">
                    <span
                      className={`px-2 py-0.5 rounded text-xs capitalize ${getEmotionColor(
                        dream.emotion
                      )}`}
                    >
                      {dream.emotion}
                    </span>
                    <span className="text-xs text-purple-500">
                      {formatDate(dream.date)}
                    </span>
                  </div>
                  <p className="text-sm text-purple-900 line-clamp-2 mt-2">
                    {dream.dream}
                  </p>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Recurring Dreams Section */}
      {recurringDreams.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-6 bg-white/60 backdrop-blur-lg rounded-2xl p-6 border border-white/40"
        >
          <h3 className="text-xl text-purple-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Recurring Themes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recurringDreams.map((dream, index) => (
              <motion.div
                key={dream.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="p-4 bg-linear-to-br from-pink-50 to-purple-50 rounded-xl border border-pink-200"
              >
                <div className="flex items-start justify-between mb-2">
                  <span
                    className={`px-2 py-1 rounded-lg text-xs capitalize ${getEmotionColor(
                      dream.emotion
                    )}`}
                  >
                    {dream.emotion}
                  </span>
                  <span className="text-xs text-purple-500">
                    {formatDate(dream.date)}
                  </span>
                </div>
                <p className="text-sm text-purple-900 line-clamp-3">
                  {dream.dream}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
