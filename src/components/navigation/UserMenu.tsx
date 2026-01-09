import { motion, AnimatePresence } from "motion/react";
import { LogOut, CircleUserRound, Menu, BarChart3 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../store/AuthContext";
import type { User as FirebaseUser } from "firebase/auth";

interface UserMenuProps {
  user: FirebaseUser | null;
  onLogin: () => void;
  onLogout: () => void;
  onViewPastDreams?: () => void;
  onToggleAnalysis?: () => void;
  currentView?: string;
  theme?: any;
}

export function UserMenu({
  user,
  onLogin,
  onLogout,
  onViewPastDreams,
  onToggleAnalysis,
  currentView,
  theme,
}: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { signOut } = useAuth();

  const getInitials = (user: FirebaseUser) => {
    if (user.displayName) {
      return user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }

    if (user.email) {
      return user.email[0].toUpperCase();
    }

    return "?";
  };

  if (!user) {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onLogin}
        className="w-10 h-10 p-2! rounded-full flex items-center justify-center backdrop-blur-md shadow-lg transition-all"
        style={{ border: `1px solid ${theme?.borderColor || "#e5e7eb"}` }}
      >
        <CircleUserRound
          className="w-5 h-5"
          style={{ color: theme?.primaryColor || "#9333ea" }}
        />
      </motion.button>
    );
  }

  return (
    <div className="relative">
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 text-white rounded-full flex items-center justify-center shadow-lg"
        style={{ backgroundColor: theme?.primaryColor || "#9333ea" }}
      >
        <span className="text-sm font-semibold">{getInitials(user)}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 p-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl min-w-[200px]"
          >
            <div className="px-3 py-2 border-b border-gray-200">
              <p className="text-sm font-medium text-gray-900">
                {user.displayName ?? "Anonymous"}
              </p>
              <p className="text-xs text-gray-600">{user.email}</p>
            </div>

            <div className="mt-2">
              {onViewPastDreams && (
                <button
                  onClick={() => {
                    onViewPastDreams();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-left"
                >
                  <Menu
                    className="w-4 h-4"
                    style={{ color: theme?.primaryColor || "#9333ea" }}
                  />
                  <span className="text-sm text-gray-700">Past Dreams</span>
                </button>
              )}

              {onToggleAnalysis && (
                <button
                  onClick={() => {
                    onToggleAnalysis();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-left"
                >
                  <BarChart3
                    className="w-4 h-4"
                    style={{ color: theme?.primaryColor || "#9333ea" }}
                  />
                  <span className="text-sm text-gray-700">
                    {currentView === "analysis" ? "Home" : "Analysis"}
                  </span>
                </button>
              )}

              <button
                onClick={async () => {
                  await signOut();
                  onLogout();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-left"
              >
                <LogOut className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
