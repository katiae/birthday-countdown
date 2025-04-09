
import React, { useEffect, useState } from "react";

const CONFETTI_COLORS = ["#FF8EC7", "#FFD166", "#FFFFFF"];
const CONFETTI_COUNT = 150;

interface ConfettiPiece {
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  animationDuration: number;
  animationDelay: number;
  type: "circle" | "square" | "triangle";
}

const ConfettiExplosion: React.FC = () => {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  
  useEffect(() => {
    const pieces: ConfettiPiece[] = [];
    
    for (let i = 0; i < CONFETTI_COUNT; i++) {
      pieces.push({
        x: Math.random() * 100, // Position horizontally (0-100%)
        y: -5 - Math.random() * 10, // Start slightly above the viewport
        size: 5 + Math.random() * 10, // Random size between 5-15px
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        rotation: Math.random() * 360,
        animationDuration: 4 + Math.random() * 6, // Duration between 4-10s
        animationDelay: Math.random() * 2, // Delay up to 2s
        type: ["circle", "square", "triangle"][Math.floor(Math.random() * 3)] as "circle" | "square" | "triangle",
      });
    }
    
    setConfetti(pieces);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {confetti.map((piece, index) => (
        <div
          key={index}
          className={`absolute ${
            piece.type === "circle" 
              ? "rounded-full"
              : piece.type === "square" 
                ? ""
                : "triangle"
          }`}
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.type !== "triangle" ? piece.color : "transparent",
            borderLeft: piece.type === "triangle" ? `${piece.size / 2}px solid transparent` : undefined,
            borderRight: piece.type === "triangle" ? `${piece.size / 2}px solid transparent` : undefined,
            borderBottom: piece.type === "triangle" ? `${piece.size}px solid ${piece.color}` : undefined,
            transform: `rotate(${piece.rotation}deg)`,
            animation: `confetti-${["slow", "medium", "fast"][Math.floor(Math.random() * 3)]} ${piece.animationDuration}s linear ${piece.animationDelay}s infinite`,
          }}
        />
      ))}
    </div>
  );
};

export default ConfettiExplosion;
