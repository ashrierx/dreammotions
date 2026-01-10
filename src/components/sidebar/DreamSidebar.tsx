import { motion, AnimatePresence } from "motion/react";
import { X, Calendar, Sparkles, Trash2 } from "lucide-react";
import type { DreamEntry } from "../../App";

interface DreamsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  dreams: DreamEntry[];
  onSelectDream: (dream: DreamEntry) => void;
  onDeleteDream: (dreamId: string) => void;
}

export function DreamsSidebar({
  isOpen,
  onClose,
  dreams,
  onSelectDream,
  onDeleteDream
}: DreamsSidebarProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
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
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed left-0 top-0 h-full w-80 bg-white/80 backdrop-blur-lg shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white/90 backdrop-blur-md p-6 border-b border-purple-200/50">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl text-purple-800">Past Dreams</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-purple-100 bg-purple-100! rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-purple-600" />
                </button>
              </div>
              <p className="text-sm text-purple-600">
                {dreams.length} dream{dreams.length !== 1 ? "s" : ""} recorded
              </p>
            </div>

            {/* Dreams List */}
            <div className="p-4 space-y-3">
              {dreams.length === 0 ? (
                <div className="text-center py-12">
                  <Sparkles className="w-12 h-12 text-purple-300 mx-auto mb-3" />
                  <p className="text-purple-600">No dreams yet</p>
                  <p className="text-sm text-purple-400 mt-1">
                    Start analyzing to build your dream journal
                  </p>
                </div>
              ) : (
                dreams.map((dream, index) => (
                  <motion.button
                    key={dream.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      onSelectDream(dream);
                      onClose();
                    }}
                    className="w-full text-left p-4 bg-white/60! hover:bg-white/80 rounded-xl border border-purple-200/50 hover:border-purple-300 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs capitalize">
                        {dream.emotion}
                      </span>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-xs text-purple-500">
                          <Calendar className="w-3 h-3" />
                          {formatDate(dream.date)}
                        </div>

                        {/* Delete button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteDream(dream.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-red-50"
                          aria-label="Delete dream"
                        >
                          <Trash2 className="w-4 h-4 text-red-500 hover:text-red-600" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-purple-900 line-clamp-2 group-hover:text-purple-700 transition-colors">
                      {dream.dream}
                    </p>
                    {dream.recurring === "yes" && (
                      <span className="inline-block mt-2 text-xs text-pink-600">
                        ⭐ Recurring
                      </span>
                    )}
                  </motion.button>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
