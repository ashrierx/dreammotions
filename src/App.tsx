import { useState, useRef, useEffect } from "react";
import { Sparkles, RotateCcw, MoonStar, Palette } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ThemeBackground from "./ThemeBackground";

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

  const theme = themes[currentTheme];

  const themeMenuRef = useRef<HTMLDivElement>(null);

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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze");
      }

      setAnalysis(data.text);
    } catch (error) {
      console.error(error);
      setAnalysis("Something went wrong. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div
      className={`min-h-screen bg-linear-to-br ${theme.gradient} p-4 md:p-8 relative overflow-hidden transition-all duration-700`}
    >
      <ThemeBackground themeName={currentTheme} />
      {/* Floating Clouds */}
      {/* {clouds.map((cloud) => (
        <div
          key={cloud.id}
          className="absolute pointer-events-none select-none will-change-transform animate-[float_18s_ease-in-out_infinite]"
          style={{
            left: cloud.left,
            top: cloud.top,
            animationDuration: cloud.duration,
            animationDelay: cloud.delay,
            transform: `scale(${cloud.scale})`,
            filter: cloud.scale < 0.8 ? "blur(1px)" : "none",
          }}
        >
          <svg
            className="text-white/40 w-24 h-16"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17.5,19c-3.037,0-5.5-2.463-5.5-5.5c0-0.007,0-0.013,0-0.02C11.362,13.84,10.697,14,10,14c-2.209,0-4-1.791-4-4 c0-2.198,1.779-3.978,3.974-4C10.147,4.018,11.055,3,12.5,3c1.933,0,3.5,1.567,3.5,3.5c0,0.066-0.003,0.131-0.007,0.197 C16.339,6.257,16.904,6,17.5,6c2.485,0,4.5,2.015,4.5,4.5S19.985,15,17.5,15" />
          </svg>
        </div>
      ))}

      <style>{`
        @keyframes float {
          0% { transform: translate3d(0,0,0); }
          50% { transform: translate3d(20px,-15px,0); }
          100% { transform: translate3d(0,0,0); }
        }
      `}</style> */}

      {/* Header */}
      <header className="max-w-5xl mx-auto mb-3 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg bg-white/60 backdrop-blur-md"
            style={{ border: `1px solid ${theme.borderColor}` }}
          >
            <MoonStar
              className="w-6 h-6"
              style={{ color: theme.primaryColor }}
            />
          </div>
          <div>
            <p
              className="text-3xl font-semibold tracking-tight"
              style={{ color: theme.textColor }}
            >
              DreamMotions
            </p>
            <p className="text-xs text-black/50">
              A gentle space to explore your inner night world
            </p>
          </div>
        </div>

        {/* Theme Toggler */}
        <div ref={themeMenuRef} className="relative z-10">
          <button
            className="group w-12 h-12 rounded-full shadow-lg flex items-center justify-center bg-white/70 backdrop-blur-md border transition-all duration-300 hover:shadow-xl"
            style={{ borderColor: theme.borderColor }}
            onClick={() => setShowThemeMenu((p) => !p)}
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">
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
                      active ? "bg-gray-100" : "hover:bg-gray-50"
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
      </header>

      {/* Main Content: two-column on md+ */}
      <main className="max-w-5xl mx-auto relative z-9">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          {/* Form Card */}
          <section className="relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl py-8 px-6 md:px-8 border border-white/60">
            {/* Edit / Reset */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => {
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
                className="w-9 h-9 rounded-full p-2! bg-white/90 border flex items-center justify-center hover:scale-105 transition"
                style={{ borderColor: theme.borderColor }}
              >
                <RotateCcw
                  className="w-4 h-4"
                  style={{ color: theme.textColor }}
                />
              </button>
            </div>

            <div className="mb-4">
              <h1
                className="text-2xl! md:text-3xl font-bold mb-1 tracking-tight"
                style={{ color: theme.textColor }}
              >
                Dream analysis
              </h1>
              <p
                className="text-sm text-gray-600"
                style={{ color: theme.primaryColor }}
              >
                Describe your dream and receive a reflective, symbolic reading.
              </p>
            </div>

            {/* Dream Description */}
            <div className="mb-3">
              <label
                className="block font-semibold mb-2 text-sm md:text-base"
                style={{ color: theme.textColor }}
              >
                Dream narrative <span className="text-red-500">*</span>
              </label>
              <textarea
                value={dreamDescription}
                onChange={(e) => setDreamDescription(e.target.value)}
                placeholder="For example: I was floating through a garden filled with glowing butterflies..."
                required
                className="w-full h-28 md:h-32 px-4 py-3 border-2 rounded-2xl focus:outline-none resize-none text-gray-700 transition-all bg-white/60 text-sm md:text-base"
                style={{ borderColor: theme.borderColor }}
                onFocus={(e) => (e.target.style.borderColor = theme.focusColor)}
                onBlur={(e) => (e.target.style.borderColor = theme.borderColor)}
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
                className="block font-semibold mb-2 text-sm md:text-base"
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
                  <span className="font-medium text-gray-700">Yes</span>
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
                  <span className="font-medium text-gray-700">No</span>
                </label>
              </div>
            </div>

            {/* Time */}
            <div className="mb-3">
              <label
                className="block font-semibold mb-2 text-sm md:text-base"
                style={{ color: theme.textColor }}
              >
                When did you have this dream?
              </label>
              <select
                value={dreamTime}
                onChange={(e) => setDreamTime(e.target.value)}
                className="w-full px-4 py-3 border-2 rounded-2xl focus:outline-none text-gray-700 transition-all bg-white/60 text-sm md:text-base"
                style={{ borderColor: theme.borderColor }}
                onFocus={(e) => (e.target.style.borderColor = theme.focusColor)}
                onBlur={(e) => (e.target.style.borderColor = theme.borderColor)}
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
                className="block font-semibold mb-2 text-sm md:text-base"
                style={{ color: theme.textColor }}
              >
                Recent life context (optional)
              </label>
              <textarea
                value={recentEvents}
                onChange={(e) => setRecentEvents(e.target.value)}
                placeholder="Recent changes, stresses, celebrations, or concerns..."
                className="w-full h-24 px-4 py-3 border-2 rounded-2xl focus:outline-none resize-none text-gray-700 transition-all bg-white/60 text-sm md:text-base"
                style={{ borderColor: theme.borderColor }}
                onFocus={(e) => (e.target.style.borderColor = theme.focusColor)}
                onBlur={(e) => (e.target.style.borderColor = theme.borderColor)}
                disabled={!isEditing}
              />
            </div>

            {/* Analyze button */}
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className={`w-full bg-gradient-to-r ${theme.buttonGradient} hover:${theme.buttonHoverGradient} text-white font-semibold py-3.5 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 text-base shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed`}
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
                    After you share your dream, your personalized analysis will
                    appear here.
                  </p>
                </div>
              )}

              {!isAnalyzing && analysis && (
                <div className="mt-2 overflow-y-auto max-h-[550px] pr-1">
                  <div className="prose prose-sm md:prose-base prose-blue max-w-none">
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
    </div>
  );
};

export default DreamAnalysisLanding;
