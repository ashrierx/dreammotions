import { useState, useMemo, useRef, useEffect } from "react";
import { Sparkles, RotateCcw } from "lucide-react";

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
    useState<keyof typeof themes>("joyful");
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

  const clouds = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 10}s`,
        duration: `${15 + Math.random() * 20}s`,
      })),
    []
  );

  const handleAnalyze = async () => {
    if (!dreamDescription.trim()) {
      alert("Please describe your dream first!");
      return;
    }

    setIsAnalyzing(true);
    setAnalysis("");
    setIsEditing(false);

    // Build the prompt for OpenAI
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
      // Real API call to Claude/OpenAI
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      const analysisText = data.content
        .filter((item: { type: string }) => item.type === "text")
        .map((item: { text: any }) => item.text)
        .join("\n");

      setAnalysis(analysisText);
    } catch (error) {
      console.error("Error analyzing dream:", error);
      // Fallback to mock data if API fails
      const mockAnalysis = `**Symbolic Interpretation:**
The garden filled with glowing butterflies represents transformation and personal growth. Gardens often symbolize the mind or inner world, while butterflies are classic symbols of metamorphosis and change. The glowing quality suggests these changes are bringing illumination or awareness to your life.

**Emotional Context:**
The ${
        emotion || "emotions you experienced"
      } during this dream provide important context about your subconscious state. This emotional tone suggests you may be in a period of personal development.

**Psychological Insights:**
Your subconscious is processing themes of change and transformation. The peaceful setting of a garden suggests you're in a receptive state for this growth.

**Archetypal Themes:**
The butterfly is a universal symbol of transformation across cultures. This dream taps into the archetypal journey of metamorphosis and rebirth.

${
  isRecurring === "yes"
    ? `**Recurring Theme Analysis:**
Since this is a recurring theme, your subconscious is emphasizing the importance of this message. Pay attention to what aspects of transformation you might be resisting or embracing in your waking life.`
    : ""
}

**Practical Insights:**
- Journal about areas of your life where you're experiencing or seeking change
- Reflect on what "transformation" means to you currently
- Notice if similar imagery appears in future dreams
- Consider speaking with a therapist if the dream feels particularly significant`;

      setAnalysis(mockAnalysis);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div
      className={`min-h-screen bg-linear-to-br ${theme.gradient} p-4 md:p-8 relative overflow-hidden transition-all duration-700`}
    >
      {/* Floating Clouds Background */}
      {clouds.map((cloud) => (
        <div
          key={cloud.id}
          className="absolute pointer-events-none animate-float"
          style={{
            left: `-${Math.random() * 30}%`,
            top: cloud.top,
            animationDelay: cloud.delay,
            animationDuration: cloud.duration,
          }}
        >
          <div className="w-24 h-16 bg-white opacity-90 rounded-full blur-xl"></div>
        </div>
      ))}

      <style>{`
       @keyframes drift {
        from {
          transform: translateX(-120px);
        }
        to {
          transform: translateX(calc(100vw + 120px));
        }
      }
      .animate-float {
        animation-name: drift;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
      }
      `}</style>

      {/* Header */}
      <header className=" mx-auto mb-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <Sparkles
            className="w-6 h-6 transition-colors duration-700"
            style={{ color: theme.primaryColor }}
          />
          <p
            className="text-3xl font-bold transition-colors duration-700"
            style={{ color: theme.textColor }}
          >
            DreamMotions
          </p>
        </div>

        {/* Theme Toggler */}
        <div ref={themeMenuRef} className="relative z-50">
          <button
            className="w-12 h-12 p-2! rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-700"
            style={{ backgroundColor: theme.primaryColor }}
            onClick={() => setShowThemeMenu(!showThemeMenu)}
          >
            <span className="text-2xl">{theme.icon}</span>
          </button>

          {showThemeMenu && (
            <div className="absolute right-0 mt-2 bg-white rounded-2xl shadow-xl p-3 w-56 z-50">
              {Object.entries(themes).map(([key, themeOption]) => (
                <button
                  key={key}
                  onClick={() => {
                    setCurrentTheme(key as keyof typeof themes);
                    setShowThemeMenu(false);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors ${
                    key === currentTheme ? "bg-gray-100" : ""
                  }`}
                >
                  <span className="text-2xl">{themeOption.icon}</span>
                  <span className="text-gray-700 font-medium">
                    {themeOption.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto relative z-8">
        {/* Form Card */}
        <div className="relative bg-white/60 backdrop-blur-sm rounded-3xl shadow-2xl py-12 md:py-6 px-6 md:px-14 mb-8 transition-all duration-700">
          {/* Edit / Reset Controls */}

          <div className="absolute top-5 right-5 flex gap-2">
            {/* Reset */}
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
              className="w-10 h-10 p-2! rounded-full bg-white/80 backdrop-blur-sm border 
                 flex items-center justify-center transition hover:scale-105"
              style={{ borderColor: theme.borderColor }}
            >
              <RotateCcw
                className="w-5 h-5"
                style={{ color: theme.textColor }}
              />
            </button>
          </div>

          <div className="text-center mb-8">
            <h2
              className="text-4xl md:text-5xl font-bold mb-3 transition-colors duration-700"
              style={{ color: theme.textColor }}
            >
              Dream Analysis
            </h2>
            <p
              className="text-lg transition-colors duration-700"
              style={{ color: theme.primaryColor }}
            >
              Uncover the hidden meanings in your dreams
            </p>
          </div>

          {/* Dream Description - REQUIRED */}
          <div className="mb-6">
            <label
              className="block font-semibold mb-2 text-lg transition-colors duration-700"
              style={{ color: theme.textColor }}
            >
              Describe your dream <span className="text-red-500">*</span>
            </label>
            <textarea
              value={dreamDescription}
              onChange={(e) => setDreamDescription(e.target.value)}
              placeholder="I was floating through a garden filled with glowing butterflies..."
              required
              className="w-full h-28 px-4 py-3 border-2 rounded-2xl focus:outline-none resize-none text-gray-700 transition-all duration-700 bg-white/40"
              style={{ borderColor: theme.borderColor }}
              onFocus={(e) => (e.target.style.borderColor = theme.focusColor)}
              onBlur={(e) => (e.target.style.borderColor = theme.borderColor)}
              disabled={!isEditing}
            />
          </div>

          {/* Emotion Input - OPTIONAL */}
          {/* <div className="mb-6">
            <label
              className="block font-semibold mb-2 text-lg transition-colors duration-700"
              style={{ color: theme.textColor }}
            >
              What emotion does it invoke?
            </label>
            <input
              type="text"
              value={emotion}
              onChange={(e) => setEmotion(e.target.value)}
              placeholder="Peace, anxiety, joy, confusion..."
              className="w-full px-4 py-3 border-2 rounded-2xl focus:outline-none resize-none text-gray-700 transition-all duration-700"
              style={{ borderColor: theme.borderColor }}
              onFocus={(e) => (e.target.style.borderColor = theme.focusColor)}
              onBlur={(e) => (e.target.style.borderColor = theme.borderColor)}
            />
          </div> */}

          {/* Recurring Theme Radio  */}
          <div className="mb-6">
            <label
              className="block font-semibold mb-2 text-lg transition-colors duration-700"
              style={{ color: theme.textColor }}
            >
              Is this a recurring theme?
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="recurring"
                  value="yes"
                  checked={isRecurring === "yes"}
                  onChange={(e) => setIsRecurring(e.target.value)}
                  className="w-5 h-5 cursor-pointer transition-colors duration-700"
                  style={{ accentColor: theme.primaryColor }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = theme.focusColor)
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = theme.borderColor)
                  }
                  disabled={!isEditing}
                />
                <span
                  className="font-medium transition-colors duration-700"
                  style={{ color: theme.textColor }}
                >
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
                  className="w-5 h-5 cursor-pointer transition-colors duration-700"
                  style={{ accentColor: theme.primaryColor }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = theme.focusColor)
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = theme.borderColor)
                  }
                />
                <span
                  className="font-medium transition-colors duration-700"
                  style={{ color: theme.textColor }}
                >
                  No
                </span>
              </label>
            </div>
          </div>

          {/* Dream Time */}
          <div className="mb-6">
            <label
              className="block font-semibold mb-2 text-lg transition-colors duration-700"
              style={{ color: theme.textColor }}
            >
              When did you have this dream?
            </label>
            <select
              value={dreamTime}
              onChange={(e) => setDreamTime(e.target.value)}
              className="w-full px-4 py-3 border-2 rounded-2xl focus:outline-none resize-none text-gray-700 transition-all duration-700 bg-white/40"
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

          {/* Recent Life Events  */}
          <div className="mb-8">
            <label
              className="block font-semibold mb-2 text-lg transition-colors duration-700"
              style={{ color: theme.textColor }}
            >
              Any recent significant life events? (optional)
            </label>
            <textarea
              value={recentEvents}
              onChange={(e) => setRecentEvents(e.target.value)}
              placeholder="Recent changes, stresses, celebrations, or concerns..."
              className="w-full h-32 px-4 py-3 border-2 rounded-2xl focus:outline-none resize-none text-gray-700 transition-all duration-700 bg-white/40"
              style={{ borderColor: theme.borderColor }}
              onFocus={(e) => (e.target.style.borderColor = theme.focusColor)}
              onBlur={(e) => (e.target.style.borderColor = theme.borderColor)}
              disabled={!isEditing}
            />
          </div>

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className={`w-full bg-linear-to-r ${theme.buttonGradient} text-white font-bold py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed duration-700`}
          >
            <Sparkles className="w-5 h-5" />
            {isAnalyzing ? "Analyzing..." : "Analyze Dream"}
          </button>
        </div>

        {/* Analysis Results */}
        {(isAnalyzing || analysis) && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12">
            <h3
              className="text-2xl font-bold mb-4 transition-colors duration-700"
              style={{ color: theme.textColor }}
            >
              Your Dream Analysis
            </h3>
            {isAnalyzing ? (
              <div
                className="animate-spin rounded-full h-12 w-12 border-b-2 mb-4 transition-colors duration-700"
                style={{ borderColor: theme.primaryColor }}
              >
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4 transition-colors duration-700"></div>
                <p
                  className="transition-colors duration-700"
                  style={{ color: theme.primaryColor }}
                >
                  Analyzing your dream...
                </p>
              </div>
            ) : (
              <div className="prose prose-blue max-w-none">
                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {analysis.split("\n").map((line, index) => {
                    if (line.startsWith("**") && line.endsWith("**")) {
                      return (
                        <h4
                          className="font-bold mt-6 mb-2 text-lg transition-colors duration-700"
                          style={{ color: theme.textColor }}
                        >
                          {line.replace(/\*\*/g, "")}
                        </h4>
                      );
                    }
                    return (
                      line && (
                        <p key={index} className="mb-3">
                          {line}
                        </p>
                      )
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DreamAnalysisLanding;
