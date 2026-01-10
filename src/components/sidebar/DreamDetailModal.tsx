import { motion, AnimatePresence } from "motion/react";
import { X, Calendar, Sparkles } from "lucide-react";
import type { DreamEntry } from "../../App";

interface DreamDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  dream: DreamEntry | null;
  onDeleteDream: (dreamId: string) => void;
}

export function DreamDetailModal({
  isOpen,
  onClose,
  dream,
}: DreamDetailModalProps) {
  if (!dream) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/60 w-full max-w-2xl max-h-[85vh] overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-purple-200/50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm capitalize">
                        {dream.emotion}
                      </span>
                      {dream.recurring === "yes" && (
                        <span className="inline-block px-3 py-1 bg-pink-100 text-pink-700 rounded-lg text-sm">
                          ⭐ Recurring
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-purple-600">
                      <Calendar className="w-4 h-4" />
                      {formatDate(dream.date)}
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-purple-100 bg-purple-100! rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-purple-600" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(85vh-180px)] custom-scrollbar">
                <div className="mb-6">
                  <h3 className="text-lg text-purple-800 mb-2 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Your Dream
                  </h3>
                  <p className="text-purple-900 leading-relaxed">
                    {dream.dream}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg text-purple-800 mb-2 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Interpretation
                  </h3>
                  <div className="prose prose-purple max-w-none">
                    {dream.interpretation
                      .split("\n\n")
                      .map((paragraph, index) => (
                        <p
                          key={index}
                          className="text-purple-900 mb-4 leading-relaxed"
                        >
                          {paragraph}
                        </p>
                      ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
