import { useState, useRef, useEffect } from "react";
import { Sparkles, RotateCcw, MoonStar, Palette } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ThemeBackground from "./ThemeBackground";
import { DreamsSidebar } from "./components/sidebar/DreamSidebar";
import { DreamDetailModal } from "./components/sidebar/DreamDetailModal";
import { EditModal } from "./components/sidebar/EditModal";
import { LoginModal } from "./components/navigation/LoginModal";
import { UserMenu } from "./components/navigation/UserMenu";
import { AnalysisPage } from "./components/views/AnalysisPage";
import { useAuth } from "./store/AuthContext";
import {
  getUserDreams,
  saveDream,
  deleteDream,
} from "./firebase/FirestoreService";
import { motion } from "motion/react";

const themes = {
  joyful: {
    name: "Joyful",
    gradient: "from-pink-200 via-purple-200 to-orange-200",
    icon: "😊",
    primaryColor: "#9333ea",
    secondaryColor: "#ec4899",
    textColor: "#6b21a8",
    borderColor: "rgba(147, 51, 234, 0.35)",
    focusColor: "#c084fc",
    buttonGradient: "from-purple-500 to-pink-500",
    buttonHoverGradient: "from-purple-600 to-pink-600",
  },
  peaceful: {
    name: "Peaceful",
    gradient: "from-blue-100 via-cyan-50 to-teal-50",
    icon: "🕊️",
    primaryColor: "#2563eb",
    secondaryColor: "#06b6d4",
    textColor: "#1e40af",
    borderColor: "rgba(37, 99, 235, 0.35)",
    focusColor: "#60a5fa",
    buttonGradient: "from-blue-500 to-cyan-500",
    buttonHoverGradient: "from-blue-600 to-cyan-600",
  },
  melancholy: {
    name: "Melancholy",
    gradient: "from-slate-200 via-blue-100 to-indigo-100",
    icon: "🌙",
    primaryColor: "#4f46e5",
    secondaryColor: "#64748b",
    textColor: "#3730a3",
    borderColor: "rgba(79, 70, 229, 0.35)",
    focusColor: "#818cf8",
    buttonGradient: "from-indigo-500 to-blue-500",
    buttonHoverGradient: "from-indigo-600 to-blue-600",
  },
  energetic: {
    name: "Energetic",
    gradient: "from-orange-100 via-amber-50 to-yellow-100",
    icon: "⚡",
    primaryColor: "#ea580c",
    secondaryColor: "#f59e0b",
    textColor: "#9a3412",
    borderColor: "rgba(234, 88, 12, 0.35)",
    focusColor: "#fb923c",
    buttonGradient: "from-orange-500 to-amber-500",
    buttonHoverGradient: "from-orange-600 to-amber-600",
  },
  mysterious: {
    name: "Mysterious",
    gradient: "from-purple-100 via-indigo-100 to-blue-100",
    icon: "🔮",
    primaryColor: "#9333ea",
    secondaryColor: "#6366f1",
    textColor: "#6b21a8",
    borderColor: "rgba(147, 51, 234, 0.35)",
    focusColor: "#c084fc",
    buttonGradient: "from-purple-500 to-indigo-500",
    buttonHoverGradient: "from-purple-600 to-indigo-600",
  },
};

export interface FormData {
  dream: string;
  emotion: string;
  recurring: string;
}
export interface User {
  name: string;
  email: string;
}

export interface DreamEntry {
  id: string;
  dream: string;
  emotion: string;
  recurring: string;
  time: string;
  symbols?: string;
  recentEvents: string;
  interpretation: string;
  date: string;
}

export type View = "home" | "analysis";

export type Theme =
  | "joyful"
  | "peaceful"
  | "melancholy"
  | "energetic"
  | "mysterious";

export interface ThemeConfig {
  name: string;
  gradient: string;
  icon: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  borderColor: string;
  focusColor: string;
  buttonGradient: string;
  buttonHoverGradient: string;
}

const DreamAnalysisLanding = () => {
  const [dreamDescription, setDreamDescription] = useState("");
  const [emotion, setEmotion] = useState("");
  const [isRecurring, setIsRecurring] = useState("");
  const [dreamTime, setDreamTime] = useState("");
  const [symbols, setSymbols] = useState("");
  const [recentEvents, setRecentEvents] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [currentTheme, setCurrentTheme] =
    useState<keyof typeof themes>("mysterious");
  const [isEditing, setIsEditing] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    dream: "",
    emotion: "",
    recurring: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [dreams, setDreams] = useState<DreamEntry[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDream, setSelectedDream] = useState<DreamEntry | null>(null);
  const [currentView, setCurrentView] = useState<View>("home");
  const [refreshKey, setRefreshKey] = useState(0);

  const theme = themes[currentTheme];

  const themeMenuRef = useRef<HTMLDivElement>(null);

  const { user: firebaseUser, signOut } = useAuth();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        themeMenuRef.current &&
        !themeMenuRef.current.contains(e.target as Node)
      ) {
        setShowThemeMenu(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (firebaseUser?.uid) {
      // Load dreams from Firestore
      getUserDreams(firebaseUser.uid).then(setDreams);
    }
  }, [firebaseUser?.uid]);

  // const clouds = useMemo(
  //   () =>
  //     Array.from({ length: 8 }, (_, i) => {
  //       const scale = 0.5 + Math.random();
  //       return {
  //         id: i,
  //         left: `${Math.random() * 100}%`,
  //         top: `${Math.random() * 100}%`,
  //         delay: `${Math.random() * -20}s`,
  //         duration: `${20 / scale}s`,
  //         scale,
  //       };
  //     }),
  //   []
  // );

  const handleAnalyze = async () => {
    if (!dreamDescription.trim()) {
      alert("Please describe your dream first!");
      return;
    }

    setIsAnalyzing(true);
    setAnalysis("");
    setIsEditing(false);

    const prompt = `You are an expert dream analyst with knowledge of Jungian psychology, symbolism, and the subconscious mind. Analyze the following dream in detail:

Dream Description: ${dreamDescription}

${emotion ? `Emotions Felt: ${emotion}` : ""}
${
  isRecurring
    ? `Recurring Theme: ${
        isRecurring === "yes"
          ? "Yes, this is a recurring dream or theme"
          : "No, this is a standalone dream"
      }`
    : ""
}
${dreamTime ? `When Dream Occurred: ${dreamTime}` : ""}
${symbols ? `Notable Symbols/Elements: ${symbols}` : ""}
${recentEvents ? `Recent Life Events: ${recentEvents}` : ""}

Please provide a comprehensive analysis that includes:
1. **Symbolic Interpretation**: What the main symbols and imagery might represent
2. **Emotional Context**: How the emotions relate to the dream's meaning
3. **Psychological Insights**: Potential connections to the dreamer's subconscious or waking life
4. **Archetypal Themes**: Any universal patterns or archetypes present
${
  isRecurring === "yes"
    ? "5. **Recurring Theme Analysis**: Why this theme keeps appearing and what it might be trying to communicate"
    : ""
}
6. **Practical Insights**: Actionable reflections or questions for the dreamer to consider

Keep the tone warm, insightful, and empowering. Format using markdown with bold headings.`;

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("API error:", text);
        throw new Error("API request failed");
      }

      const data = await response.json();

      setAnalysis(data.text);

      if (firebaseUser?.uid) {
        const dreamData: Omit<DreamEntry, "id"> = {
          dream: dreamDescription,
          emotion: emotion || "not specified",
          recurring: isRecurring || "no",
          time: dreamTime || "not specified",
          symbols: symbols || "",
          recentEvents: recentEvents || "",
          interpretation: data.text,
          date: new Date().toISOString(),
        };

        const dreamId = await saveDream(firebaseUser.uid, dreamData);

        // Add the new dream to the dreams array
        setDreams((prev) => [
          {
            id: dreamId,
            ...dreamData,
          },
          ...prev,
        ]);
      }
    } catch (error) {
      console.error(error);
      setAnalysis("Something went wrong. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveEdit = (data: FormData) => {
    setFormData(data);
    setShowModal(false);
    // Re-analyze with updated data
    // handleAnalyze(data);
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
  };

  const handleLogout = async () => {
    await signOut();
    setDreams([]);
    setSidebarOpen(false);
  };

  const handleSelectDream = (dream: DreamEntry) => {
    setSelectedDream(dream);
  };

  const handleDeleteDream = async (dreamId: string) => {
    if (!firebaseUser) return;

    const confirmed = confirm("Delete this dream permanently?");
    if (!confirmed) return;

    await deleteDream(firebaseUser.uid, dreamId);

    setDreams((prev) => prev.filter((d) => d.id !== dreamId));

    if (selectedDream?.id === dreamId) {
      setSelectedDream(null);
    }
  };

  // const handleDeleteDream = (id: string) => {
  //   setDreams(dreams.filter((d) => d.id !== id));
  //   if (selectedDream?.id === id) {
  //     setSelectedDream(null);
  //   }
  // };

  return (
    <div
      className={`min-h-screen bg-linear-to-br ${theme.gradient} p-4 md:p-8 relative overflow-hidden transition-all duration-700`}
    >
      <ThemeBackground themeName={currentTheme} />

      {/* Header */}
      <header className="max-w-5xl mx-auto mb-5 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-2xl flex items-center justify-center shadow-lg bg-white/60 backdrop-blur-md"
            style={{ border: `1px solid ${theme.borderColor}` }}
          >
            <MoonStar
              className="w-5 h-5"
              style={{ color: theme.primaryColor }}
            />
          </div>
          <div>
            <p
              className="text-2xl font-semibold tracking-tight"
              style={{ color: theme.textColor }}
            >
              DreamMotions
            </p>
            <p className="text-xs text-black/50">
              A gentle space to explore your inner night world
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggler */}
          <div ref={themeMenuRef} className="relative z-10">
            <button
              className="group w-9 h-9 rounded-full shadow-lg flex items-center justify-center bg-white/70! backdrop-blur-md border transition-all duration-300 hover:shadow-xl"
              style={{ borderColor: theme.borderColor }}
              onClick={() => setShowThemeMenu((p) => !p)}
            >
              <span className="text-xl group-hover:scale-110 transition-transform">
                {theme.icon}
              </span>
            </button>

            {showThemeMenu && (
              <div className="absolute right-0 mt-3 bg-white rounded-2xl shadow-2xl p-3 w-60 border border-gray-100">
                <div className="flex items-center gap-2 px-2 pb-2 border-b border-gray-100 mb-2">
                  <Palette className="w-4 h-4 text-gray-500" />
                  <span className="text-xs uppercase tracking-wide text-gray-500">
                    Dream palette
                  </span>
                </div>
                {Object.entries(themes).map(([key, themeOption]) => {
                  const active = key === currentTheme;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setCurrentTheme(key as keyof typeof themes);
                        setShowThemeMenu(false);
                      }}
                      className={`w-full flex items-center justify-between gap-3 p-2.5 rounded-xl text-sm transition-colors ${
                        active ? "bg-gray-100!" : "bg-gray-50!"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{themeOption.icon}</span>
                        <span className="text-gray-700 font-medium">
                          {themeOption.name}
                        </span>
                      </div>
                      {active && (
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: theme.primaryColor }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* User Menu */}
          <UserMenu
            user={firebaseUser}
            onLogin={() => setShowLoginModal(true)}
            onLogout={handleLogout}
            onViewPastDreams={
              firebaseUser ? () => setSidebarOpen(!sidebarOpen) : undefined
            }
            onToggleAnalysis={() =>
              setCurrentView(currentView === "home" ? "analysis" : "home")
            }
            currentView={currentView}
            theme={theme}
          />
        </div>
      </header>

      {/* Main Content */}
      {currentView === "home" ? (
        <main className="max-w-5xl mx-auto relative z-9">
          <div className="grid gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            {/* Form Card */}
            <section className="relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl py-8 px-6 md:px-8 border border-white/60">
              {/* Edit / Reset */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => {
                    setRefreshKey((k) => k + 1);

                    setDreamDescription("");
                    setEmotion("");
                    setIsRecurring("");
                    setDreamTime("");
                    setSymbols("");
                    setRecentEvents("");
                    setAnalysis("");
                    setIsEditing(true);
                  }}
                  title="Start over"
                  className="w-9 h-9 rounded-full p-2! bg-white/90! border flex items-center justify-center hover:scale-105 transition"
                  style={{ borderColor: theme.borderColor }}
                >
                  <motion.div
                    key={refreshKey}
                    initial={{ rotate: 0 }}
                    animate={{ rotate: -720 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  >
                    <RotateCcw
                      className="w-4 h-4"
                      style={{ color: theme.textColor }}
                    />
                  </motion.div>
                </button>
              </div>

              <div className="mb-4">
                <h1
                  className="text-xl! md:text-3xl font-bold mb-1 tracking-tight"
                  style={{ color: theme.textColor }}
                >
                  Dream analysis
                </h1>
                <p
                  className="text-xs text-gray-600"
                  style={{ color: theme.primaryColor }}
                >
                  Describe your dream and receive a reflective, symbolic
                  reading.
                </p>
              </div>

              {/* Dream Description */}
              <div className="mb-3">
                <label
                  className="block font-semibold mb-2 text-xs"
                  style={{ color: theme.textColor }}
                >
                  Dream narrative <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={dreamDescription}
                  onChange={(e) => setDreamDescription(e.target.value)}
                  placeholder="For example: I was floating through a garden filled with glowing butterflies..."
                  required
                  className="w-full h-20 md:h-26 px-4 py-3 border-2 rounded-2xl focus:outline-none resize-none text-gray-700 transition-all bg-white/60 text-xs"
                  style={{ borderColor: theme.borderColor }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = theme.focusColor)
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = theme.borderColor)
                  }
                  disabled={!isEditing}
                />
              </div>

              {/* Emotion */}
              {/* <div className="mb-5">
              <label
                className="block font-semibold mb-2 text-sm md:text-base"
                style={{ color: theme.textColor }}
              >
                Emotional tone (optional)
              </label>
              <input
                type="text"
                value={emotion}
                onChange={(e) => setEmotion(e.target.value)}
                placeholder="Peace, anxiety, curiosity, joy, confusion..."
                className="w-full px-4 py-3 border-2 rounded-2xl focus:outline-none text-gray-700 transition-all bg-white/60 text-sm md:text-base"
                style={{ borderColor: theme.borderColor }}
                onFocus={(e) => (e.target.style.borderColor = theme.focusColor)}
                onBlur={(e) => (e.target.style.borderColor = theme.borderColor)}
                disabled={!isEditing}
              />
            </div> */}

              {/* Recurring */}
              <div className="mb-3">
                <label
                  className="block font-semibold mb-2 text-xs"
                  style={{ color: theme.textColor }}
                >
                  Is this a recurring theme?
                </label>
                <div className="flex gap-4 text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="recurring"
                      value="yes"
                      checked={isRecurring === "yes"}
                      onChange={(e) => setIsRecurring(e.target.value)}
                      className="w-4 h-4 cursor-pointer"
                      style={{ accentColor: theme.primaryColor }}
                      disabled={!isEditing}
                    />
                    <span className="font-medium text-gray-700 text-xs">
                      Yes
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="recurring"
                      value="no"
                      checked={isRecurring === "no"}
                      onChange={(e) => setIsRecurring(e.target.value)}
                      className="w-4 h-4 cursor-pointer"
                      style={{ accentColor: theme.primaryColor }}
                      disabled={!isEditing}
                    />
                    <span className="font-medium text-gray-700 text-xs">
                      No
                    </span>
                  </label>
                </div>
              </div>

              {/* Time */}
              <div className="mb-3">
                <label
                  className="block font-semibold mb-2 text-xs"
                  style={{ color: theme.textColor }}
                >
                  When did you have this dream?
                </label>
                <select
                  value={dreamTime}
                  onChange={(e) => setDreamTime(e.target.value)}
                  className="w-full px-4 py-3 border-2 rounded-2xl focus:outline-none text-gray-700 transition-all bg-white/60 text-xs"
                  style={{ borderColor: theme.borderColor }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = theme.focusColor)
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = theme.borderColor)
                  }
                  disabled={!isEditing}
                >
                  <option value="">Select time...</option>
                  <option value="last-night">Last night</option>
                  <option value="this-week">Earlier this week</option>
                  <option value="this-month">This month</option>
                  <option value="longer-ago">Longer ago (but memorable)</option>
                </select>
              </div>

              {/* Symbols */}
              {/* <div className="mb-5">
              <label
                className="block font-semibold mb-2 text-sm md:text-base"
                style={{ color: theme.textColor }}
              >
                Symbols or standout elements (optional)
              </label>
              <input
                type="text"
                value={symbols}
                onChange={(e) => setSymbols(e.target.value)}
                placeholder="For example: ocean, doors, animals, specific people..."
                className="w-full px-4 py-3 border-2 rounded-2xl focus:outline-none text-gray-700 transition-all bg-white/60 text-sm md:text-base"
                style={{ borderColor: theme.borderColor }}
                onFocus={(e) => (e.target.style.borderColor = theme.focusColor)}
                onBlur={(e) => (e.target.style.borderColor = theme.borderColor)}
                disabled={!isEditing}
              />
            </div> */}

              {/* Recent events */}
              <div className="mb-6">
                <label
                  className="block font-semibold mb-2 text-xs"
                  style={{ color: theme.textColor }}
                >
                  Recent life context (optional)
                </label>
                <textarea
                  value={recentEvents}
                  onChange={(e) => setRecentEvents(e.target.value)}
                  placeholder="Recent changes, stresses, celebrations, or concerns..."
                  className="w-full h-24 px-4 py-3 border-2 rounded-2xl focus:outline-none resize-none text-gray-700 transition-all bg-white/60 text-xs"
                  style={{ borderColor: theme.borderColor }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = theme.focusColor)
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = theme.borderColor)
                  }
                  disabled={!isEditing}
                />
              </div>

              {/* Analyze button */}
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className={`w-full bg-linear-to-r ${theme.buttonGradient} hover:${theme.buttonHoverGradient} text-white font-semibold py-3.5 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 text-base shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                <Sparkles className="w-5 h-5" />
                {isAnalyzing ? "Analyzing your dream..." : "Analyze dream"}
              </button>
            </section>

            {/* Analysis Panel */}
            <section className="relative">
              <div className="h-full rounded-3xl bg-white/75 backdrop-blur-xl shadow-2xl border border-white/60 p-6 md:p-7 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2
                      className="text-lg md:text-xl font-semibold"
                      style={{ color: theme.textColor }}
                    >
                      Your dream analysis
                    </h2>
                    <p className="text-xs text-gray-500">
                      Generated reflection, symbolism, and practical insights.
                    </p>
                  </div>
                </div>

                {isAnalyzing && (
                  <div className="flex flex-col items-center justify-center flex-1 py-6">
                    <div
                      className="mb-4 h-10 w-10 rounded-full border-2 border-t-transparent animate-spin"
                      style={{ borderColor: theme.primaryColor }}
                    />
                    <p
                      className="text-sm text-center text-gray-600"
                      style={{ color: theme.primaryColor }}
                    >
                      Tuning in to the symbols of your dream...
                    </p>
                  </div>
                )}

                {!isAnalyzing && !analysis && (
                  <div className="flex flex-col items-center justify-center flex-1 text-center text-gray-400 text-sm px-4">
                    <p>
                      After you share your dream, your personalized analysis
                      will appear here.
                    </p>
                  </div>
                )}

                {!isAnalyzing && analysis && (
                  <div className="mt-2 overflow-y-auto max-h-[550px] pr-1">
                    <div className="prose prose-sm md:prose-base prose-blue max-w-none text-xs">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {analysis}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>
      ) : (
        // Analytics Dashboard
        <AnalysisPage
          dreams={dreams}
          theme={theme}
          onBack={() => setCurrentView("home")}
        />
      )}

      {/* Edit Modal */}
      <EditModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        formData={formData}
        onSave={handleSaveEdit}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLoginSuccess}
      />

      {/* Dreams Sidebar */}
      {firebaseUser && (
        <DreamsSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          dreams={dreams}
          onSelectDream={handleSelectDream}
          onDeleteDream={handleDeleteDream}
        />
      )}

      {/* Dream Detail Modal */}
      <DreamDetailModal
        isOpen={selectedDream !== null}
        onClose={() => setSelectedDream(null)}
        dream={selectedDream}
        onDeleteDream={handleDeleteDream}
      />
    </div>
  );
};

export default DreamAnalysisLanding;
