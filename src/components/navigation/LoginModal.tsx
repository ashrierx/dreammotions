import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles } from "lucide-react";
import type { User } from "../../App"

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mock login - in real app, this would call authentication API
    const user: User = {
      name: name || email.split("@")[0],
      email: email,
    };

    onLogin(user);

    // Reset form
    setName("");
    setEmail("");
    setPassword("");
    setIsSignUp(false);
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
              className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/60 w-full max-w-md"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl text-purple-800">
                  {isSignUp ? "Create Account" : "Welcome Back"}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-purple-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-purple-600" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <div>
                    <label className="block text-purple-800 mb-2">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-4 py-3 bg-white/70 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-purple-300"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-purple-800 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-white/70 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-purple-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-purple-800 mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-white/70 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-purple-300"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  {isSignUp ? "Sign Up" : "Sign In"}
                </button>
              </form>

              {/* Toggle */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-purple-600 hover:text-purple-800 transition-colors"
                >
                  {isSignUp
                    ? "Already have an account? Sign in"
                    : "Don't have an account? Sign up"}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
