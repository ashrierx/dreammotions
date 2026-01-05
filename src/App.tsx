import { useState } from "react";
import { Sparkles, Smile } from "lucide-react";

const themes = {
  joyful: {
    name: "Joyful",
    gradient: "from-pink-200 via-purple-200 to-orange-200",
    icon: "😊",
    primary: "purple-600",
    secondary: "pink-500",
    text: "purple-800",
    border: "purple-100",
    focus: "purple-400",
    button: "from-purple-500 to-pink-500",
    buttonHover: "from-purple-600 to-pink-600",
  },
  peaceful: {
    name: "Peaceful",
    gradient: "from-blue-100 via-cyan-50 to-teal-50",
    icon: "🕊️",
    primary: "blue-600",
    secondary: "cyan-500",
    text: "blue-800",
    border: "blue-100",
    focus: "blue-400",
    button: "from-blue-500 to-cyan-500",
    buttonHover: "from-blue-600 to-cyan-600",
  },
  melancholy: {
    name: "Melancholy",
    gradient: "from-slate-200 via-blue-100 to-indigo-100",
    icon: "🌙",
    primary: "indigo-600",
    secondary: "slate-500",
    text: "indigo-800",
    border: "indigo-100",
    focus: "indigo-400",
    button: "from-indigo-500 to-blue-500",
    buttonHover: "from-indigo-600 to-blue-600",
  },
  energetic: {
    name: "Energetic",
    gradient: "from-orange-100 via-amber-50 to-yellow-100",
    icon: "⚡",
    primary: "orange-600",
    secondary: "amber-500",
    text: "orange-800",
    border: "orange-100",
    focus: "orange-400",
    button: "from-orange-500 to-amber-500",
    buttonHover: "from-orange-600 to-amber-600",
  },
  mysterious: {
    name: "Mysterious",
    gradient: "from-purple-100 via-indigo-100 to-blue-100",
    icon: "🔮",
    primary: "purple-600",
    secondary: "indigo-500",
    text: "purple-800",
    border: "purple-100",
    focus: "purple-400",
    button: "from-purple-500 to-indigo-500",
    buttonHover: "from-purple-600 to-indigo-600",
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

  const theme = themes[currentTheme];

  const handleAnalyze = async () => {
    if (!dreamDescription.trim()) {
      alert("Please describe your dream first!");
      return;
    }

    setIsAnalyzing(true);
    setAnalysis("");

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
        .filter((item: { type: string; }) => item.type === "text")
        .map((item: { text: any; }) => item.text)
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

  // Floating clouds animation
  const clouds = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 10}s`,
    duration: `${15 + Math.random() * 20}s`,
  }));

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${theme.gradient} p-4 md:p-8 relative overflow-hidden transition-all duration-700`}
    >
      {/* Floating Clouds Background */}
      {clouds.map((cloud) => (
        <div
          key={cloud.id}
          className="absolute pointer-events-none animate-float"
          style={{
            left: cloud.left,
            top: cloud.top,
            animationDelay: cloud.delay,
            animationDuration: cloud.duration,
          }}
        >
          <div className="w-24 h-16 bg-white opacity-30 rounded-full blur-xl"></div>
        </div>
      ))}

      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(30px, -20px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 30px) scale(0.9);
          }
          75% {
            transform: translate(40px, 10px) scale(1.05);
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>

      {/* Header */}
      <header className="max-w-6xl mx-auto mb-8 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <Sparkles
            className={`w-8 h-8 text-${theme.primary} transition-colors duration-700`}
          />
          <h1
            className={`text-2xl md:text-3xl font-bold text-${theme.text} transition-colors duration-700`}
          >
            DreamMotions
          </h1>
        </div>

        {/* Theme Toggler */}
        <div className="relative z-50">
          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
          >
            <Smile
              className={`w-6 h-6 text-${theme.primary} transition-colors duration-700`}
            />
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
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Form Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 mb-8 transition-all duration-700">
          <div className="text-center mb-8">
            <h2
              className={`text-4xl md:text-5xl font-bold text-${theme.text} mb-3 transition-colors duration-700`}
            >
              Dream Analysis
            </h2>
            <p
              className={`text-lg text-${theme.primary} transition-colors duration-700`}
            >
              Uncover the hidden meanings in your dreams
            </p>
          </div>

          {/* Dream Description - REQUIRED */}
          <div className="mb-6">
            <label
              className={`block text-${theme.text} font-semibold mb-2 text-lg transition-colors duration-700`}
            >
              Describe your dream <span className="text-red-500">*</span>
            </label>
            <textarea
              value={dreamDescription}
              onChange={(e) => setDreamDescription(e.target.value)}
              placeholder="I was floating through a garden filled with glowing butterflies..."
              required
              className={`w-full h-32 px-4 py-3 border-2 border-${theme.border} rounded-2xl focus:outline-none focus:border-${theme.focus} resize-none text-gray-700 placeholder-${theme.border} transition-colors duration-700`}
            />
          </div>

          {/* Emotion Input - OPTIONAL */}
          <div className="mb-6">
            <label
              className={`block text-${theme.text} font-semibold mb-2 text-lg transition-colors duration-700`}
            >
              What emotion does it invoke?
            </label>
            <input
              type="text"
              value={emotion}
              onChange={(e) => setEmotion(e.target.value)}
              placeholder="Peace, anxiety, joy, confusion..."
              className={`w-full px-4 py-3 border-2 border-${theme.border} rounded-2xl focus:outline-none focus:border-${theme.focus} text-gray-700 placeholder-${theme.border} transition-colors duration-700`}
            />
          </div>

          {/* Recurring Theme Radio - OPTIONAL */}
          <div className="mb-6">
            <label
              className={`block text-${theme.text} font-semibold mb-3 text-lg transition-colors duration-700`}
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
                  className={`w-5 h-5 text-${theme.primary} cursor-pointer transition-colors duration-700`}
                />
                <span
                  className={`text-${theme.text} font-medium transition-colors duration-700`}
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
                  className={`w-5 h-5 text-${theme.primary} cursor-pointer transition-colors duration-700`}
                />
                <span
                  className={`text-${theme.text} font-medium transition-colors duration-700`}
                >
                  No
                </span>
              </label>
            </div>
          </div>

          {/* Dream Time - NEW FIELD */}
          <div className="mb-6">
            <label
              className={`block text-${theme.text} font-semibold mb-2 text-lg transition-colors duration-700`}
            >
              When did you have this dream?
            </label>
            <select
              value={dreamTime}
              onChange={(e) => setDreamTime(e.target.value)}
              className={`w-full px-4 py-3 border-2 border-${theme.border} rounded-2xl focus:outline-none focus:border-${theme.focus} text-gray-700 bg-white transition-colors duration-700`}
            >
              <option value="">Select time...</option>
              <option value="last-night">Last night</option>
              <option value="this-week">Earlier this week</option>
              <option value="this-month">This month</option>
              <option value="longer-ago">Longer ago (but memorable)</option>
            </select>
          </div>

          {/* Key Symbols - NEW FIELD */}
          <div className="mb-6">
            <label
              className={`block text-${theme.text} font-semibold mb-2 text-lg transition-colors duration-700`}
            >
              Key symbols or elements (optional)
            </label>
            <input
              type="text"
              value={symbols}
              onChange={(e) => setSymbols(e.target.value)}
              placeholder="e.g., water, animals, specific colors, people..."
              className={`w-full px-4 py-3 border-2 border-${theme.border} rounded-2xl focus:outline-none focus:border-${theme.focus} text-gray-700 placeholder-${theme.border} transition-colors duration-700`}
            />
          </div>

          {/* Recent Life Events - NEW FIELD */}
          <div className="mb-8">
            <label
              className={`block text-${theme.text} font-semibold mb-2 text-lg transition-colors duration-700`}
            >
              Any recent significant life events? (optional)
            </label>
            <textarea
              value={recentEvents}
              onChange={(e) => setRecentEvents(e.target.value)}
              placeholder="Recent changes, stresses, celebrations, or concerns..."
              className={`w-full h-20 px-4 py-3 border-2 border-${theme.border} rounded-2xl focus:outline-none focus:border-${theme.focus} resize-none text-gray-700 placeholder-${theme.border} transition-colors duration-700`}
            />
            <p
              className={`text-sm text-${theme.secondary} mt-2 transition-colors duration-700`}
            >
              This helps provide context for a more personalized analysis
            </p>
          </div>

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className={`w-full bg-gradient-to-r ${theme.button} hover:${theme.buttonHover} text-white font-bold py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed duration-700`}
          >
            <Sparkles className="w-5 h-5" />
            {isAnalyzing ? "Analyzing..." : "Analyze Dream"}
          </button>
        </div>

        {/* Analysis Results */}
        {(isAnalyzing || analysis) && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12">
            <h3
              className={`text-2xl font-bold text-${theme.text} mb-4 transition-colors duration-700`}
            >
              Your Dream Analysis
            </h3>
            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div
                  className={`animate-spin rounded-full h-12 w-12 border-b-2 border-${theme.primary} mb-4 transition-colors duration-700`}
                ></div>
                <p
                  className={`text-${theme.primary} transition-colors duration-700`}
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
                          key={index}
                          className={`text-${theme.text} font-bold mt-6 mb-2 text-lg transition-colors duration-700`}
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
