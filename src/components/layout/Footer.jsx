import { Eye } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#071840] py-8 px-6 border-t border-[#1A3A6B]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
            <Eye size={14} className="text-white" />
          </div>
          <span className="font-bold text-white text-sm">EmotionVision</span>
        </div>
        <p
          className="text-[#4A6098] text-xs"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Real-Time Face Detection &amp; Emotion Recognition · Browser-only · No backend
        </p>
      </div>
    </footer>
  );
}