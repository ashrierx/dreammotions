import { useMemo, useState } from "react";

const ThemeBackground = ({ themeName }: { themeName: string }) => {
  // Generate clouds
  const clouds = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top:
          themeName === "melancholy" || themeName === "energetic"
            ? `${Math.random() * 30}%` // Clouds at top for rain/lightning themes
            : `${Math.random() * 100}%`,
        delay: `${Math.random() * -20}s`,
        duration: `${25 + Math.random() * 15}s`,
        scale: 0.7 + Math.random() * 0.6,
      })),
    [themeName]
  );

  // Generate raindrops for melancholy theme
  const raindrops = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 2}s`,
        duration: `${2.9 + Math.random() * 2.9}s`,
      })),
    []
  );

  // Generate lightning bolts for energetic theme
  const [showLightning, setShowLightning] = useState(false);

  useMemo(() => {
    if (themeName === "energetic") {
      const interval = setInterval(() => {
        setShowLightning(true);
        setTimeout(() => setShowLightning(false), 200); // Longer flash
      }, 9000 + Math.random() * 9000); // Strike every 6-12 seconds
      return () => clearInterval(interval);
    }
  }, [themeName]);

  return (
    <>
      <style>{`
        @keyframes float-cloud {
          0%, 100% { transform: translateX(0) scale(var(--scale)); }
          50% { transform: translateX(30px) scale(var(--scale)); }
        }
        
        @keyframes rain-fall {
          0% { transform: translateY(-10px); opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0.3; }
        }
        
        @keyframes aurora-wave {
          0%, 100% { 
            transform: translateX(0%) skewX(0deg);
            opacity: 0.6;
          }
          25% { 
            transform: translateX(5%) skewX(5deg);
            opacity: 0.8;
          }
          50% { 
            transform: translateX(-5%) skewX(-3deg);
            opacity: 0.7;
          }
          75% { 
            transform: translateX(3%) skewX(4deg);
            opacity: 0.9;
          }
        }
        
        @keyframes pulse-sun {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.05); opacity: 1; }
        }

        @keyframes lightning-flash {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
      `}</style>

      {/* Sun for Joyful theme */}
      {themeName === "joyful" && (
        <div
          className="absolute top-8 right-8 w-24 h-24 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(251, 191, 36, 0.8) 0%, rgba(251, 191, 36, 0.4) 50%, transparent 70%)",
            boxShadow: "0 0 60px rgba(251, 191, 36, 0.6)",
            animation: "pulse-sun 4s ease-in-out infinite",
          }}
        />
      )}

      {/* Clouds - visible for joyful, peaceful, melancholy, energetic */}
      {(themeName === "joyful" ||
        themeName === "peaceful" ||
        themeName === "melancholy" ||
        themeName === "energetic") &&
        clouds.map((cloud) => (
          <div
            key={cloud.id}
            className="absolute pointer-events-none"
            style={
              {
                left: cloud.left,
                top: cloud.top,
                animationDelay: cloud.delay,
                animation: `float-cloud ${cloud.duration} ease-in-out infinite`,
                "--scale": cloud.scale,
              } as React.CSSProperties
            }
          >
            <svg
              className="text-white w-32 h-20"
              style={{ opacity: 0.7 }}
              fill="currentColor"
              viewBox="0 0 200 120"
            >
              <ellipse cx="50" cy="80" rx="50" ry="35" />
              <ellipse cx="90" cy="70" rx="55" ry="40" />
              <ellipse cx="140" cy="75" rx="45" ry="35" />
              <ellipse cx="105" cy="60" rx="40" ry="30" />
            </svg>
          </div>
        ))}

      {/* Rain for Melancholy theme */}
      {themeName === "melancholy" &&
        raindrops.map((drop) => (
          <div
            key={drop.id}
            className="absolute w-0.5 h-12 bg-gradient-to-b from-blue-300 to-transparent pointer-events-none"
            style={{
              left: drop.left,
              top: "-50px",
              animationDelay: drop.delay,
              animation: `rain-fall ${drop.duration} linear infinite`,
              opacity: 0.6,
            }}
          />
        ))}

      {/* Lightning for Energetic theme */}
      {themeName === "energetic" && showLightning && (
        <>
          <div
            className="absolute inset-0 bg-yellow-200 pointer-events-none"
            style={{
              animation: "lightning-flash 0.2s ease-in-out",
              opacity: 0.3,
            }}
          />
          <svg
            className="absolute pointer-events-none"
            style={{
              left: "60%",
              top: "20%",
              width: "100px",
              height: "200px",
              filter: "drop-shadow(0 0 10px rgba(251, 191, 36, 0.8))",
            }}
            viewBox="0 0 100 200"
            fill="none"
          >
            <path
              d="M50 0 L30 70 L45 70 L20 150 L60 80 L45 80 L70 0 Z"
              fill="rgba(251, 191, 36, 0.9)"
              stroke="rgba(255, 255, 255, 0.8)"
              strokeWidth="2"
            />
          </svg>
        </>
      )}

      {/* Northern Lights for Mysterious theme */}
      {themeName === "mysterious" && (
        <div className="absolute top-0 left-0 right-0 h-64 overflow-hidden pointer-events-none">
          <div
            className="absolute w-full h-full"
            style={{
              background:
                "linear-gradient(to bottom, rgba(139, 92, 246, 0.4) 0%, rgba(59, 130, 246, 0.3) 50%, transparent 100%)",
              animation: "aurora-wave 8s ease-in-out infinite",
            }}
          />
          <div
            className="absolute w-full h-full"
            style={{
              background:
                "linear-gradient(to bottom, rgba(34, 197, 94, 0.3) 0%, rgba(139, 92, 246, 0.4) 50%, transparent 100%)",
              animation: "aurora-wave 10s ease-in-out infinite",
              animationDelay: "-3s",
            }}
          />
          <div
            className="absolute w-full h-full"
            style={{
              background:
                "linear-gradient(to bottom, rgba(59, 130, 246, 0.35) 0%, rgba(34, 197, 94, 0.25) 50%, transparent 100%)",
              animation: "aurora-wave 12s ease-in-out infinite",
              animationDelay: "-6s",
            }}
          />
        </div>
      )}
    </>
  );
};

export default ThemeBackground;
