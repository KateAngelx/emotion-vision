import { Link } from "react-router-dom";
import { Eye } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Eye size={16} className="text-white" />
          </div>
          <span className="font-bold text-[#0B2255] text-lg tracking-tight">
            EmotionVision
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          {/* Added Home anchor button */}
          <a href="/#" className="hover:text-foreground transition-colors">Home</a>
          <a href="/#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="/#how" className="hover:text-foreground transition-colors">How it works</a>
          <a href="/#emotions" className="hover:text-foreground transition-colors">Emotions</a>
          <a href="/#about" className="hover:text-foreground transition-colors">About</a>
        </div>
        <a
          href="#"
          className="hidden md:flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#163FA0] transition-colors"
        >
          View on GitHub
        </a>
      </div>
    </nav>
  );
}