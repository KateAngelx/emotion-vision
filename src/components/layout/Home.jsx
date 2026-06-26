import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Brain, Zap, Sliders, ShieldCheck, ChevronRight, Play, Eye, Grid, Palette, Globe, Mail, Radio, UserCheck } from "lucide-react";

const EMOTIONS = [
  { label: "Happy", color: "#10B981", bg: "#ECFDF5", border: "#6EE7B7" },
  { label: "Neutral", color: "#3B82F6", bg: "#EFF6FF", border: "#93C5FD" },
  { label: "Sad", color: "#6366F1", bg: "#EEF2FF", border: "#A5B4FC" },
  { label: "Angry", color: "#EF4444", bg: "#FEF2F2", border: "#FCA5A5" },
  { label: "Surprise", color: "#F59E0B", bg: "#FFFBEB", border: "#FCD34D" },
  { label: "Fear", color: "#8B5CF6", bg: "#F5F3FF", border: "#C4B5FD" },
  { label: "Disgust", color: "#F97316", bg: "#FFF7ED", border: "#FDBA74" },
];

const FEATURES = [
  { icon: Camera, title: "Change Screen Sizes", desc: "Easily switch your camera between standard 4:3, widescreen 16:9, or square 1:1 shapes without cutting off or stretching the image." },
  { icon: ShieldCheck, title: "Hide Your Face", desc: "Protect your privacy by covering your face with a smooth oval blur or a clean graphic cutout. You can even choose your favorite color for the cover." },
  { icon: Grid, title: "Fun Photobooth Strips", desc: "Take a quick series of photos with a live countdown timer. The app automatically groups them into a classic vertical strip or card you can save." },
  { icon: Brain, title: "Live Emotion Reading", desc: "Our built-in smart scanner reads your facial expressions frame-by-frame and shows you how certain it is about your current mood." },
  { icon: Sliders, title: "Camera Controls", desc: "Fine-tune your live video stream on the fly with easy sliders to adjust the picture brightness, contrast, and color richness." },
  { icon: Palette, title: "Retro Color Filters", desc: "Give your photos a vintage look using a classic monochrome black-and-white mode, an electric blue tone, or a warm retro red filter." },
];

const STEPS = [
  { num: "01", title: "Pick Your Filters & Layout", desc: "Choose your preferred screen shape, turn on a color filter, and adjust the brightness sliders to get the perfect picture style.", icon: Sliders },
  { num: "02", title: "Set Your Privacy Mask", desc: "If you want to keep your identity private, turn on the face cover mode and select your favorite mask shape and background color.", icon: ShieldCheck },
  { num: "03", title: "Snap a Photobooth Strip", desc: "Strike different poses during the live countdown timers to create and download your custom branded photo strip.", icon: Grid },
];

export default function Home() {
  const [activeEmotion, setActiveEmotion] = useState(0);
  const navigate = useNavigate();

  return (
    <div className="pt-16 bg-slate-50 min-h-screen">
      {/* HERO */}
      <section className="pt-16 pb-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div
              className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border"
              style={{
                color: "#1A4FBF",
                background: "#EBF0FF",
                borderColor: "#93C5FD",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              <Zap size={11} />
              Runs in Browser · Private & Secure · Custom Photobooth
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-[#0B2255] leading-[1.1] tracking-tight mb-5">
              Fun &amp; Private Face <span className="text-blue-600">Expression</span> Studio
            </h1>
            <p className="text-[#4A6098] text-lg leading-relaxed mb-8 max-w-md">
              A private web app that tracks your facial expressions entirely on your device. Adjust camera filters, blur out your face for privacy, and print your own vintage photo booth strips.
            </p>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => navigate("/detect")}
                className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#163FA0] transition-colors shadow-lg shadow-blue-200 cursor-pointer"
              >
                <Play size={16} />
                Open Studio Workspace
              </button>
              <a href="#how" className="flex items-center gap-2 border border-slate-200 text-[#0B2255] font-semibold px-6 py-3 rounded-xl hover:bg-white transition-colors">
                See How It Works
                <ChevronRight size={16} />
              </a>
            </div>
          </div>

          {/* MOCK DETECTION UI */}
          <div className="relative">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
              <div className="relative bg-[#0B1020] aspect-[4/3] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-blue-400 to-indigo-600" />
                <div className="relative w-40 h-48 border-2 rounded-[100%]" style={{ borderColor: EMOTIONS[activeEmotion].color }}>
                  <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold px-3 py-1 rounded-full"
                    style={{ background: EMOTIONS[activeEmotion].color, color: "#fff", fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {EMOTIONS[activeEmotion].label.toUpperCase()} · {(0.78 + activeEmotion * 0.02).toFixed(2)}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <Eye size={48} color={EMOTIONS[activeEmotion].color} />
                  </div>
                </div>
                {/* Replaced Pulse Emoji with Radio Icon */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "rgba(16,185,129,0.15)", color: "#10B981", fontFamily: "'JetBrains Mono', monospace" }}>
                  <Radio size={14} className="animate-pulse" />
                  LIVE PREVIEW
                </div>
              </div>
              <div className="p-4 flex gap-2 flex-wrap bg-white">
                {EMOTIONS.map((e, i) => (
                  <button
                    key={e.label}
                    onClick={() => setActiveEmotion(i)}
                    className="text-xs font-semibold px-3 py-1 rounded-full border transition-all cursor-pointer"
                    style={{
                      background: i === activeEmotion ? e.color : e.bg,
                      borderColor: i === activeEmotion ? e.color : e.border,
                      color: i === activeEmotion ? "#fff" : e.color,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {e.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <p className="text-xs font-semibold text-blue-600 mb-3 tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Features</p>
            <h2 className="text-4xl font-extrabold text-[#0B2255] tracking-tight">Everything in one place</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="group bg-slate-50 rounded-2xl border border-slate-100 p-6 hover:border-[#93C5FD] hover:shadow-lg hover:shadow-blue-50 transition-all">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-[#EBF0FF] transition-colors">
                  <f.icon size={20} className="text-blue-600" />
                </div>
                <h3 className="font-bold text-[#0B2255] mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <p className="text-xs font-semibold text-blue-600 mb-3 tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Steps</p>
            <h2 className="text-4xl font-extrabold text-[#0B2255] tracking-tight">How it works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.num} className="relative">
                {i < STEPS.length - 1 && <div className="hidden md:block absolute top-8 left-full w-full h-px bg-slate-200 z-0" />}
                <div className="relative bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                  <div className="text-5xl font-extrabold mb-6 leading-none text-blue-50" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{s.num}</div>
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center mb-4"><s.icon size={18} className="text-white" /></div>
                  <h3 className="font-bold text-[#0B2255] mb-2 text-lg">{s.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EMOTIONS SYSTEM MAP */}
      <section id="emotions" className="py-24 px-6 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-semibold text-blue-600 mb-3 tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>7 Settings</p>
              <h2 className="text-4xl font-extrabold text-[#0B2255] tracking-tight mb-5">Emotion color system</h2>
              <p className="text-slate-500 leading-relaxed mb-8">
                Each emotion has its own matching color. This color changes your screen overlay indicators, the data tags, and stays with your photos when they are saved to your photobooth strip.
              </p>
              <div className="flex flex-col gap-2">
                {EMOTIONS.map((e) => (
                  <div key={e.label} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: e.color }} />
                    <span className="text-sm font-semibold text-[#0B2255] w-20">{e.label}</span>
                    <div className="flex-1 h-2 rounded-full bg-slate-100" style={{ border: `1px solid ${e.border}` }}>
                      <div className="h-full rounded-full" style={{ width: `${45 + EMOTIONS.indexOf(e) * 8}%`, background: e.color, opacity: 0.7 }} />
                    </div>
                    <span className="text-xs w-10 text-right text-slate-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{45 + EMOTIONS.indexOf(e) * 8}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {EMOTIONS.map((e) => (
                <div key={e.label} className="rounded-2xl border p-5 transition-transform hover:scale-[1.02]" style={{ background: e.bg, borderColor: e.border }}>
                  <div className="text-xs font-bold mb-1" style={{ color: e.color, fontFamily: "'JetBrains Mono', monospace" }}>{e.label.toUpperCase()}</div>
                  <div className="w-8 h-1 rounded-full mt-2" style={{ background: e.color }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT / MEET THE DEVELOPER */}
      <section id="about" className="py-24 px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <p className="text-xs font-semibold text-blue-600 mb-3 tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              The Maker
            </p>
            <h2 className="text-4xl font-extrabold text-[#0B2255] tracking-tight">
              About the Developer
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12 items-start">
            {/* Developer Bio & Social Links Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-md">
              <h3 className="text-2xl font-extrabold text-[#0B2255] mb-1">Kate Angel</h3>
              <p className="text-xs font-mono font-bold text-blue-600 mb-4 uppercase tracking-wider">3rd Year &amp; Aspiring UI/UX Designer</p>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
               I enjoy building projects from scratch that focus on clean UI, highly responsive design, and intuitive user experiences, combining modern web aesthetics with smart, functional features.
              </p>
              
              {/* Connect Section */}
              <div className="border-t border-slate-100 pt-5 space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider text-left pl-1">Connect with me</p>
                <div className="grid grid-cols-2 gap-2">
                  <a href="#" className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-600 p-2 bg-slate-50 hover:bg-blue-50 rounded-xl border border-slate-100 transition-colors">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    GitHub
                  </a>
                  <a href="#" className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-600 p-2 bg-slate-50 hover:bg-blue-50 rounded-xl border border-slate-100 transition-colors">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    LinkedIn
                  </a>
                  <a href="#" className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-600 p-2 bg-slate-50 hover:bg-blue-50 rounded-xl border border-slate-100 transition-colors">
                    <Globe size={14} /> Portfolio
                  </a>
                  <a href="mailto:your-email@example.com" className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-600 p-2 bg-slate-50 hover:bg-blue-50 rounded-xl border border-slate-100 transition-colors">
                    <Mail size={14} /> Email
                  </a>
                </div>
              </div>
            </div>

            {/* Project Story - Changed title to simple text */}
            <div className="md:col-span-2 space-y-6 bg-white rounded-2xl border border-slate-200 p-8 shadow-md">
              <h4 className="text-xl font-bold text-[#0B2255] flex items-center gap-2 border-b border-slate-100 pb-3">
                {/* Changed from 🎨 icon to UserCheck icon */}
                <UserCheck size={20} className="text-blue-600" /> Project Story
              </h4>
              
              <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
                <p>
                  I built <strong>EmotionVision</strong> to create a simple, modern photo booth that keeps your privacy safe. Everything happens directly inside your web browser, so your video and photos are never sent to any online servers.
                </p>
                <p>
                  The app scans your camera feed right on your device to read expressions without any loading delay.
                </p>
                <p className="italic border-l-4 border-blue-500 pl-4 my-4 text-slate-500">
                  "The goal was making sure the camera box resizes perfectly to look great in any shape—whether you pick a square layout or widescreen. This keeps your privacy masks exactly over your face so you can safely snap and save your favorite photobooth cards."
                </p>
                <p>
                  This project shows that web apps can be creative, smart, and fun while keeping your personal camera data entirely yours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECURE LOCAL FOOTER */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 px-6 text-center border-t border-slate-800">
        <div className="max-w-6xl mx-auto space-y-2">
          <p className="font-semibold text-slate-200">
            &copy; 2026 EmotionVision · Created by Kate Angel
          </p>
          <p className="max-w-md mx-auto opacity-75 leading-relaxed">
            Your data is perfectly safe here. All live tracking, picture filtering, and photobooth card printing are done completely inside your browser memory layout. No video or images ever leave your device.
          </p>
        </div>
      </footer>
    </div>
  );
}