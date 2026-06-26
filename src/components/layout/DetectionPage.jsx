import { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import { Camera, RefreshCw, Check, AlertCircle, User, Smile, ArrowLeft, Shield, ShieldOff, Sliders, Maximize2, UserCheck, Image, Trash2, Download, Grid, Palette, ShieldCheck, Sparkles, ToggleLeft, ToggleRight } from "lucide-react";
import { loadModels, detectFaceAndEmotions } from "../../services/faceApiService";

const EMOTION_STYLES = {
  happy: { label: "Happy", color: "#10B981", bg: "#ECFDF5", border: "#6EE7B7" },
  neutral: { label: "Neutral", color: "#3B82F6", bg: "#EFF6FF", border: "#93C5FD" },
  sad: { label: "Sad", color: "#6366F1", bg: "#EEF2FF", border: "#A5B4FC" },
  angry: { label: "Angry", color: "#EF4444", bg: "#FEF2F2", border: "#FCA5A5" },
  surprise: { label: "Surprise", color: "#F59E0B", bg: "#FFFBEB", border: "#FCD34D" },
  surprised: { label: "Surprise", color: "#F59E0B", bg: "#FFFBEB", border: "#FCD34D" },
  fear: { label: "Fear", color: "#8B5CF6", bg: "#F5F3FF", border: "#C4B5FD" },
  fearful: { label: "Fear", color: "#8B5CF6", bg: "#F5F3FF", border: "#C4B5FD" },
  disgust: { label: "Disgust", color: "#F97316", bg: "#FFF7ED", border: "#FDBA74" },
  disgusted: { label: "Disgust", color: "#F97316", bg: "#FFF7ED", border: "#FDBA74" }
};

const STRIP_LAYOUTS = {
  strip3: { id: "strip3", label: "Layout A (Vertical · 3 Pose)", poses: 3, type: "strip" },
  strip4: { id: "strip4", label: "Layout C (Vertical · 4 Pose)", poses: 4, type: "strip" },
  grid4: { id: "grid4", label: "Layout F (Grid · 4 Pose)", poses: 4, type: "grid" },
  single: { id: "single", label: "Layout L (Card · 1 Pose)", poses: 1, type: "single" }
};

export default function DetectionPage() {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [loadingError, setLoadingError] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  
  const [faceDetected, setFaceDetected] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState("neutral");
  const [confidence, setConfidence] = useState(0);

  // --- PRIVACY BLINDER STATES ---
  const [privacyMode, setPrivacyMode] = useState(false);
  const [facePrivacyStyle, setFacePrivacyStyle] = useState("blur"); 
  const [customMaskColor, setCustomMaskColor] = useState("#3B82F6"); 
  const [faceBox, setFaceBox] = useState({ left: 0, top: 0, width: 0, height: 0, rawX: 0, rawY: 0, rawW: 0, rawH: 0 });

  // --- HARDWARE / EFFECTS STATES ---
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [aspectRatio, setAspectRatio] = useState("4/3"); 
  const [colorFilter, setColorFilter] = useState("none");

  // --- PRINT TELEMETRY OVERLAY SELECTION STATES ---
  const [includeEmotionTag, setIncludeEmotionTag] = useState(true);
  const [includeFaceSquare, setIncludeFaceSquare] = useState(true);

  // --- PHOTOBOOTH ENGINE STATES ---
  const [currentLayout, setCurrentLayout] = useState("strip4");
  const [capturedPhotos, setCapturedPhotos] = useState([]); 
  const [countdown, setCountdown] = useState(null);
  const [isShooting, setIsShooting] = useState(false);
  const [flashActive, setFlashActive] = useState(false);
  const [compiledStripUrl, setCompiledStripUrl] = useState(null);

  const webcamRef = useRef(null);
  const loopRef = useRef(null);
  const navigate = useNavigate();

  // References to accurately pass current state values directly into the async canvas draw cycle
  const emotionRef = useRef("neutral");
  const includeEmotionTagRef = useRef(true);
  const includeFaceSquareRef = useRef(true);
  const faceDetectedRef = useRef(false);

  useEffect(() => { emotionRef.current = currentEmotion; }, [currentEmotion]);
  useEffect(() => { includeEmotionTagRef.current = includeEmotionTag; }, [includeEmotionTag]);
  useEffect(() => { includeFaceSquareRef.current = includeFaceSquare; }, [includeFaceSquare]);
  useEffect(() => { faceDetectedRef.current = faceDetected; }, [faceDetected]);

  const activeStyle = EMOTION_STYLES[currentEmotion] || EMOTION_STYLES["neutral"];

  const aspectClassMap = {
    "4/3": "aspect-[4/3] w-full",
    "16/9": "aspect-[16/9] w-full",
    "1/1": "aspect-square max-w-[440px] mx-auto" 
  };

  useEffect(() => {
    async function initModels() {
      try {
        await loadModels();
        setModelsLoaded(true);
      } catch (err) {
        setLoadingError(true);
      }
    }
    initModels();
    return () => { if (loopRef.current) cancelAnimationFrame(loopRef.current); };
  }, []);

  useEffect(() => {
    if (isTracking && modelsLoaded) {
      const runDetectionLoop = async () => {
        if (webcamRef.current && webcamRef.current.video && webcamRef.current.video.readyState === 4) {
          const videoElement = webcamRef.current.video;
          const result = await detectFaceAndEmotions(videoElement);

          if (result && result.bbox) {
            setFaceDetected(true);
            setCurrentEmotion(result.emotion.toLowerCase());
            setConfidence(Math.round(result.confidence * 100));

            const { x, y, width, height } = result.bbox;
            const videoWidth = videoElement.videoWidth;
            const videoHeight = videoElement.videoHeight;

            setFaceBox({
              left: (x / videoWidth) * 100,
              top: (y / videoHeight) * 100,
              width: (width / videoWidth) * 100,
              height: (height / videoHeight) * 100,
              rawX: x,
              rawY: y,
              rawW: width,
              rawH: height
            });
          } else {
            setFaceDetected(false);
          }
        }
        loopRef.current = requestAnimationFrame(runDetectionLoop);
      };
      loopRef.current = requestAnimationFrame(runDetectionLoop);
    } else {
      if (loopRef.current) cancelAnimationFrame(loopRef.current);
      setFaceDetected(false);
    }
    return () => { if (loopRef.current) cancelAnimationFrame(loopRef.current); };
  }, [isTracking, modelsLoaded]);

  useEffect(() => {
    const layoutConfig = STRIP_LAYOUTS[currentLayout];
    if (capturedPhotos.length === layoutConfig.poses) {
      compilePhotoboothStrip();
    } else {
      setCompiledStripUrl(null);
    }
  }, [capturedPhotos, currentLayout]);

  const captureFrameWithTelemetry = (snapshotEmotion) => {
    if (!webcamRef.current || !webcamRef.current.video) return null;
    
    const video = webcamRef.current.video;
    const canvas = document.createElement("canvas");
    
    const nativeWidth = video.videoWidth;
    const nativeHeight = video.videoHeight;

    let targetWidth = nativeWidth;
    let targetHeight = nativeHeight;
    let sx = 0;
    let sy = 0;

    if (aspectRatio === "1/1") {
      const minDim = Math.min(nativeWidth, nativeHeight);
      targetWidth = minDim;
      targetHeight = minDim;
      sx = (nativeWidth - minDim) / 2;
      sy = (nativeHeight - minDim) / 2;
    } else if (aspectRatio === "16/9") {
      targetHeight = nativeWidth * (9 / 16);
      if (targetHeight > nativeHeight) {
        targetHeight = nativeHeight;
        targetWidth = nativeHeight * (16 / 9);
      }
      sx = (nativeWidth - targetWidth) / 2;
      sy = (nativeHeight - targetHeight) / 2;
    } else if (aspectRatio === "4/3") {
      targetHeight = nativeWidth * (3 / 4);
      if (targetHeight > nativeHeight) {
        targetHeight = nativeHeight;
        targetWidth = nativeHeight * (4 / 3);
      }
      sx = (nativeWidth - targetWidth) / 2;
      sy = (nativeHeight - targetHeight) / 2;
    }

    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");

    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, sx, sy, targetWidth, targetHeight, 0, 0, canvas.width, canvas.height);
    ctx.setTransform(1, 0, 0, 1, 0, 0); 

    const adjustedX = faceBox.rawX - sx;
    const adjustedY = faceBox.rawY - sy;
    const fw = faceBox.rawW;
    const fh = faceBox.rawH;

    if (colorFilter === "red") {
      ctx.fillStyle = "rgba(239, 68, 68, 0.25)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (colorFilter === "blue") {
      ctx.fillStyle = "rgba(59, 130, 246, 0.25)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (colorFilter === "black") {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const brightnessValue = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
        data[i] = brightnessValue;     
        data[i + 1] = brightnessValue; 
        data[i + 2] = brightnessValue; 
      }
      ctx.putImageData(imgData, 0, 0);
    }

    if (faceDetectedRef.current && privacyMode && adjustedX >= 0 && adjustedY >= 0) {
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(adjustedX + fw / 2, adjustedY + fh / 2, fw / 2 * 1.1, fh / 2 * 1.2, 0, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      if (facePrivacyStyle === "blur") {
        ctx.fillStyle = `${customMaskColor}33`;
        ctx.fillRect(adjustedX, adjustedY, fw, fh);
        ctx.filter = "blur(30px)";
        ctx.drawImage(canvas, 0, 0);
        ctx.filter = "none";
      } else {
        ctx.fillStyle = customMaskColor;
        ctx.fill();
        ctx.fillStyle = "#FFFFFF";
        ctx.font = `bold ${Math.floor(fw * 0.15)}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("MASKED", adjustedX + fw / 2, adjustedY + fh / 2);
      }
      ctx.restore();
    }

    const activeStyleLocal = EMOTION_STYLES[snapshotEmotion] || EMOTION_STYLES["neutral"];

    // --- FULLY INDEPENDENT EVALUATION FOR THE SQUARE CORNER BRACKETS ---
    if (faceDetectedRef.current && includeFaceSquareRef.current) {
      ctx.strokeStyle = activeStyleLocal.color;
      ctx.lineWidth = Math.max(3, canvas.width * 0.006);
      
      const padX = fw * 0.15;
      const padY = fh * 0.15;
      const bx = adjustedX - padX;
      const by = adjustedY - padY;
      const bw = fw + (padX * 2);
      const bh = fh + (padY * 2);
      const len = Math.min(bw, bh) * 0.15; 

      // Top-Left Corner
      ctx.beginPath(); ctx.moveTo(bx + len, by); ctx.lineTo(bx, by); ctx.lineTo(bx, by + len); ctx.stroke();
      // Top-Right Corner
      ctx.beginPath(); ctx.moveTo(bx + bw - len, by); ctx.lineTo(bx + bw, by); ctx.lineTo(bx + bw, by + len); ctx.stroke();
      // Bottom-Left Corner
      ctx.beginPath(); ctx.moveTo(bx + len, by + bh); ctx.lineTo(bx, by + bh); ctx.lineTo(bx, by + bh - len); ctx.stroke();
      // Bottom-Right Corner
      ctx.beginPath(); ctx.moveTo(bx + bw - len, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by + bh - len); ctx.stroke();
    }

    // --- FULLY INDEPENDENT EVALUATION FOR THE EMOTION PILL BADGE ---
    if (faceDetectedRef.current && includeEmotionTagRef.current) {
      const boxWidth = canvas.width * 0.36;
      const boxHeight = canvas.height * 0.09;
      const bx = 24;
      const by = canvas.height - boxHeight - 24;

      ctx.fillStyle = activeStyleLocal.bg;
      ctx.strokeStyle = activeStyleLocal.border;
      ctx.lineWidth = 2;
      
      ctx.beginPath();
      ctx.roundRect(bx, by, boxWidth, boxHeight, boxHeight / 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = activeStyleLocal.color;
      ctx.beginPath();
      ctx.arc(bx + boxHeight * 0.4, by + boxHeight / 2, boxHeight * 0.12, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#0B2255"; 
      ctx.font = `bold ${Math.floor(boxHeight * 0.35)}px sans-serif`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(activeStyleLocal.label, bx + boxHeight * 0.7, by + boxHeight / 2);

      ctx.fillStyle = "#94A3B8"; 
      ctx.font = `bold ${Math.floor(boxHeight * 0.3)}px monospace`;
      ctx.textAlign = "right";
      ctx.fillText(`${confidence}%`, bx + boxWidth - boxHeight * 0.5, by + boxHeight / 2);
    }

    return canvas.toDataURL("image/jpeg");
  };

  const startPhotoboothSession = async () => {
    if (!isTracking || isShooting) return;
    setIsShooting(true);
    setCapturedPhotos([]);
    setCompiledStripUrl(null);

    const layoutConfig = STRIP_LAYOUTS[currentLayout];

    for (let i = 0; i < layoutConfig.poses; i++) {
      for (let count = 3; count > 0; count--) {
        setCountdown(String(count));
        await new Promise((r) => setTimeout(r, 1000));
      }
      setCountdown("SMILE");
      await new Promise((r) => setTimeout(r, 400));
      setCountdown(null);

      setFlashActive(true);
      setTimeout(() => setFlashActive(false), 150);

      const liveDetectedEmotion = emotionRef.current;
      const frameData = captureFrameWithTelemetry(liveDetectedEmotion);
      if (frameData) {
        setCapturedPhotos((prev) => [...prev, frameData]);
      }
      await new Promise((r) => setTimeout(r, 1200));
    }
    setIsShooting(false);
  };

  const compilePhotoboothStrip = () => {
    if (capturedPhotos.length === 0) return;

    const layoutConfig = STRIP_LAYOUTS[currentLayout];
    const firstImg = new window.Image();
    firstImg.src = capturedPhotos[0];

    firstImg.onload = () => {
      const nativeAspect = firstImg.naturalWidth / firstImg.naturalHeight;
      
      const imgW = 400;
      const imgH = 400 / nativeAspect; 
      const padding = 24;
      const footerHeight = 64;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (layoutConfig.type === "strip") {
        canvas.width = imgW + padding * 2;
        canvas.height = (imgH * layoutConfig.poses) + (padding * (layoutConfig.poses + 1)) + footerHeight;
        
        ctx.fillStyle = "#0B1020"; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let loaded = 0;
        capturedPhotos.forEach((src, idx) => {
          const img = new window.Image();
          img.src = src;
          img.onload = () => {
            const dy = padding + idx * (imgH + padding);
            ctx.drawImage(img, padding, dy, imgW, imgH);
            loaded++;
            if (loaded === capturedPhotos.length) finishDrawingBrandFooter(canvas, ctx, footerHeight);
          };
        });
      } else if (layoutConfig.type === "grid") {
        canvas.width = (imgW * 2) + padding * 3;
        canvas.height = (imgH * Math.ceil(layoutConfig.poses / 2)) + (padding * (Math.ceil(layoutConfig.poses / 2) + 1)) + footerHeight;

        ctx.fillStyle = "#0B1020";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let loadedCount = 0;
        capturedPhotos.forEach((src, idx) => {
          const img = new window.Image();
          img.src = src;
          img.onload = () => {
            const col = idx % 2;
            const row = Math.floor(idx / 2);
            const dx = padding + col * (imgW + padding);
            const dy = padding + row * (imgH + padding);
            ctx.drawImage(img, dx, dy, imgW, imgH);
            
            loadedCount++;
            if (loadedCount === capturedPhotos.length) finishDrawingBrandFooter(canvas, ctx, footerHeight);
          };
        });
      } else {
        canvas.width = imgW + padding * 2;
        canvas.height = imgH + padding * 2 + footerHeight;
        ctx.fillStyle = "#0B1020";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const img = new window.Image();
        img.src = capturedPhotos[0];
        img.onload = () => {
          ctx.drawImage(img, padding, padding, imgW, imgH);
          finishDrawingBrandFooter(canvas, ctx, footerHeight);
        };
      }
    };
  };

  const finishDrawingBrandFooter = (canvas, ctx, footerHeight) => {
    ctx.fillStyle = "#1E293B";
    ctx.fillRect(0, canvas.height - footerHeight, canvas.width, footerHeight);

    ctx.fillStyle = "#38BDF8";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("EMOTIONVISION LABS", canvas.width / 2, canvas.height - footerHeight / 2);

    setCompiledStripUrl(canvas.toDataURL("image/jpeg"));
  };

  const resolvedStylesFilter = `
    brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) 
    ${colorFilter === "red" ? "sepia(1) hue-rotate(-50deg) saturate(3)" : ""}
    ${colorFilter === "blue" ? "sepia(1) hue-rotate(180deg) saturate(3)" : ""}
    ${colorFilter === "black" ? "grayscale(1)" : ""}
  `;

  return (
    <div className="pt-28 pb-16 px-6 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        
        {/* TOP INTERFACE ROW */}
        <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-semibold text-sm bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <ArrowLeft size={16} /> Back to Home
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setPrivacyMode(!privacyMode)}
              className={`flex items-center gap-2 font-bold text-sm px-5 py-2 rounded-xl border shadow-sm transition-all cursor-pointer ${
                privacyMode ? "bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {privacyMode ? <Shield size={16} /> : <ShieldOff size={16} />}
              {privacyMode ? "Face Masking: ACTIVE" : "Mask Face Only"}
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          
          {/* CAMERA FEED PREVIEW VIEWPORT AREA */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden relative">
              <div 
                className={`bg-[#0B1020] flex flex-col items-center justify-center relative text-slate-400 select-none overflow-hidden transition-all duration-300 ${aspectClassMap[aspectRatio]}`}
              >
                {isTracking ? (
                  <div className="w-full h-full relative">
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      videoConstraints={{ facingMode: "user" }}
                      style={{ filter: resolvedStylesFilter }}
                      className="w-full h-full object-cover transform -scale-x-100"
                    />

                    {/* FLASH OVERLAY */}
                    {flashActive && <div className="absolute inset-0 bg-white z-40 animate-fade-out pointer-events-none" />}

                    {/* COUNTDOWN INTERFACE */}
                    {countdown !== null && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-30 pointer-events-none">
                        <div className="bg-indigo-600 text-white font-black text-4xl px-8 py-4 rounded-2xl shadow-xl flex items-center gap-3">
                          {countdown === "SMILE" && <Smile size={36} className="animate-bounce text-emerald-400" />}
                          {countdown}
                        </div>
                      </div>
                    )}

                    {/* DYNAMIC FACE MASK ACCENTS */}
                    {faceDetected && (
                      <>
                        {privacyMode && (
                          <div 
                            className="absolute pointer-events-none transition-all duration-75"
                            style={{
                              right: `${faceBox.left}%`, 
                              top: `${faceBox.top}%`,
                              width: `${faceBox.width}%`,
                              height: `${faceBox.height}%`,
                            }}
                          >
                            {facePrivacyStyle === "blur" ? (
                              <div className="w-full h-full backdrop-blur-3xl rounded-[100%] border-2 scale-105 transition-colors duration-200" style={{ borderColor: customMaskColor, backgroundColor: `${customMaskColor}25` }} />
                            ) : (
                              <div className="w-full h-full rounded-[100%] flex items-center justify-center border-2 shadow-lg transition-colors duration-200" style={{ backgroundColor: customMaskColor, borderColor: customMaskColor }}>
                                <UserCheck size={28} className="text-white animate-pulse" />
                              </div>
                            )}
                          </div>
                        )}

                        {/* Bracket overlay target bounds */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-56 h-64 border-2 rounded-2xl relative" style={{ borderColor: activeStyle.color }}>
                            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 -mt-[2px] -ml-[2px]" style={{ borderColor: activeStyle.color }} />
                            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 -mt-[2px] -mr-[2px]" style={{ borderColor: activeStyle.color }} />
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 -mb-[2px] -ml-[2px]" style={{ borderColor: activeStyle.color }} />
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 -mb-[2px] -mr-[2px]" style={{ borderColor: activeStyle.color }} />
                          </div>
                        </div>

                        {/* Live Telemetry Display */}
                        <div 
                          className="absolute bottom-4 left-4 px-4 py-2 rounded-xl border text-white flex flex-col gap-0.5 z-10"
                          style={{ backgroundColor: "rgba(11, 16, 32, 0.85)", borderColor: activeStyle.color, fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          <span className="text-[10px] uppercase text-slate-400 font-bold tracking-widest flex items-center gap-1">Live Engine Telemetry</span>
                          <span className="text-sm font-black tracking-wider" style={{ color: activeStyle.color }}>
                            {activeStyle.label} · {confidence}%
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    <Camera size={48} className="mb-4 opacity-40" />
                    <p className="text-sm font-medium">Camera Feed Suspended</p>
                    <p className="text-xs opacity-60 mt-1">Activate the detection feed to start processing data.</p>
                  </>
                )}
              </div>

              {/* ACTION COMMAND ROW RECTANGLE CONTROLS */}
              <div className="p-4 bg-slate-100 border-t border-slate-200 flex flex-wrap gap-3 justify-between items-center">
                <button 
                  disabled={!modelsLoaded}
                  onClick={() => setIsTracking(!isTracking)}
                  className={`px-5 py-2 rounded-lg font-semibold text-sm transition-colors cursor-pointer text-white ${
                    !modelsLoaded ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : isTracking ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isTracking ? "Stop Detection" : "Start Detection"}
                </button>

                {isTracking && (
                  <button
                    disabled={isShooting}
                    onClick={startPhotoboothSession}
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-sm font-bold px-5 py-2 rounded-lg transition-all shadow cursor-pointer"
                  >
                    <Image size={16} />
                    {isShooting ? `Taking Pose ${capturedPhotos.length + 1}...` : "Capture Photobooth Strip"}
                  </button>
                )}
              </div>
            </div>

            {/* PREVIEW CONTAINER CARD */}
            {compiledStripUrl && (
              <div className="bg-white rounded-2xl border-2 border-indigo-500 p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-md font-bold text-[#0B2255] flex items-center gap-1.5">🎉 Your Photobooth Poster Print Ready</span>
                  <div className="flex items-center gap-3">
                    <a 
                      href={compiledStripUrl} 
                      download="photobooth-print-strip.jpg"
                      className="flex items-center gap-1.5 bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-emerald-700 transition-all shadow cursor-pointer"
                    >
                      <Download size={14} /> Download Final Card
                    </a>
                    <button 
                      onClick={() => { setCapturedPhotos([]); setCompiledStripUrl(null); }}
                      className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 size={12}/> Clear All
                    </button>
                  </div>
                </div>
                <div className="flex justify-center bg-slate-100 py-6 rounded-xl border border-slate-200">
                  <img src={compiledStripUrl} className="max-h-[500px] rounded shadow-md border border-slate-300" alt="Compiled Strip Output Preview" />
                </div>
              </div>
            )}
          </div>

          {/* RIGHT PANELS CONTROL LAYER COLUMN */}
          <div className="space-y-6">
            
            {/* PRINT TELEMETRY OVERLAY OPTIONS SWITCHES */}
            <div className="bg-white rounded-2xl border border-blue-200 p-6 shadow-md bg-blue-50/10">
              <h3 className="font-bold text-sm text-[#0B2255] mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Sliders size={16} className="text-blue-600" /> Photo Print Overlay Options
              </h3>
              <div className="space-y-3.5 pt-1">
                {/* Toggle for Emotion Tag Bar */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">Include Emotion Pill Badge</span>
                  <button
                    onClick={() => setIncludeEmotionTag(!includeEmotionTag)}
                    className="text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                  >
                    {includeEmotionTag ? <ToggleRight size={28} /> : <ToggleLeft size={28} className="text-slate-400" />}
                  </button>
                </div>
                
                {/* Toggle for Face Square Brackets */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">Include Face Corner Brackets</span>
                  <button
                    onClick={() => setIncludeFaceSquare(!includeFaceSquare)}
                    className="text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                  >
                    {includeFaceSquare ? <ToggleRight size={28} /> : <ToggleLeft size={28} className="text-slate-400" />}
                  </button>
                </div>
              </div>
            </div>

            {/* PHOTOBOOTH STRUCTURE SELECTOR LAYOUT CONTROL */}
            <div className="bg-white rounded-2xl border border-indigo-200 p-6 shadow-md bg-indigo-50/10">
              <h3 className="font-bold text-sm text-indigo-900 mb-3 flex items-center gap-2 border-b border-indigo-100 pb-2">
                <Grid size={16} className="text-indigo-600" /> Photobooth Film Strip Layouts
              </h3>
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500">Pick Structural Film Template</label>
                <div className="flex flex-col gap-2">
                  {Object.values(STRIP_LAYOUTS).map((layout) => (
                    <button
                      key={layout.id}
                      disabled={isShooting}
                      onClick={() => { setCurrentLayout(layout.id); setCapturedPhotos([]); setCompiledStripUrl(null); }}
                      className={`text-left text-xs font-semibold px-4 py-2.5 rounded-xl border transition-all cursor-pointer ${
                        currentLayout === layout.id ? "bg-indigo-600 text-white border-indigo-600 shadow" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {layout.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* DYNAMIC LIVE PHOTO FILTERS CONTROL ROW */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md">
              <h3 className="font-bold text-sm text-[#0B2255] mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Palette size={16} className="text-blue-600" /> Photobooth Color Filters
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "none", label: "Standard FX" },
                  { id: "red", label: "Red Filter" },
                  { id: "blue", label: "Blue Filter" },
                  { id: "black", label: "Black & White" }
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setColorFilter(filter.id)}
                    className={`text-xs font-bold py-2 rounded-lg border transition-all cursor-pointer ${
                      colorFilter === filter.id ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* BIOMETRIC OVAL SETTINGS TINT MODIFIERS */}
            {privacyMode && (
              <div className="bg-white rounded-2xl border border-emerald-200 p-6 shadow-md bg-emerald-50/20">
                <h3 className="font-bold text-sm text-emerald-800 mb-3 flex items-center gap-2 border-b border-emerald-100 pb-2">
                  <Shield size={16} /> Face Mask Shape &amp; Tint Control
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setFacePrivacyStyle("blur")}
                      className={`text-xs font-bold py-2 rounded-lg border transition-all cursor-pointer ${
                        facePrivacyStyle === "blur" ? "bg-emerald-600 border-emerald-600 text-white" : "bg-white border-slate-200 text-slate-600"
                      }`}
                    >
                      Biometric Oval Blur
                    </button>
                    <button
                      onClick={() => setFacePrivacyStyle("ghost")}
                      className={`text-xs font-bold py-2 rounded-lg border transition-all cursor-pointer ${
                        facePrivacyStyle === "ghost" ? "bg-emerald-600 border-emerald-600 text-white" : "bg-white border-slate-200 text-slate-600"
                      }`}
                    >
                      Cyber Silhouette
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 flex items-center gap-1">🎨 Mask Shield Core Color Tint</label>
                    <div className="flex items-center gap-2.5 bg-white p-2 border border-slate-200 rounded-xl">
                      <input 
                        type="color" value={customMaskColor} onChange={(e) => setCustomMaskColor(e.target.value)}
                        className="w-8 h-8 rounded border-0 cursor-pointer overflow-hidden p-0"
                      />
                      <span className="text-xs font-mono font-bold text-slate-600 uppercase">{customMaskColor}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* HARDWARE EFFECTS AND BRIGHTNESS CONTROLS */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md">
              <h3 className="font-bold text-sm text-[#0B2255] mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Sliders size={16} className="text-blue-600" /> Camera Tuning Sliders
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 flex items-center gap-1"><Maximize2 size={12}/> Aspect Feed Ratio</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: "4/3", label: "4:3" },
                      { id: "16/9", label: "16:9" },
                      { id: "1/1", label: "1:1" }
                    ].map((size) => (
                      <button
                        key={size.id}
                        onClick={() => setAspectRatio(size.id)}
                        className={`text-xs font-bold py-1.5 rounded-lg border transition-all cursor-pointer ${
                          aspectRatio === size.id ? "bg-blue-50 border-blue-500 text-blue-600 shadow-sm" : "bg-white border-slate-200 text-slate-500"
                        }`}
                      >
                        {size.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-slate-600"><span>Brightness</span><span className="font-mono text-slate-400">{brightness}%</span></div>
                  <input type="range" min="50" max="150" value={brightness} onChange={(e) => setBrightness(e.target.value)} className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"/>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-slate-600"><span>Contrast</span><span className="font-mono text-slate-400">{contrast}%</span></div>
                  <input type="range" min="50" max="150" value={contrast} onChange={(e) => setContrast(e.target.value)} className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"/>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-slate-600"><span>Saturation</span><span className="font-mono text-slate-400">{saturation}%</span></div>
                  <input type="range" min="0" max="200" value={saturation} onChange={(e) => setSaturation(e.target.value)} className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"/>
                </div>
              </div>
            </div>

            {/* --- SECURITY & PRIVACY VERIFICATION CHECKLIST --- */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md">
              <h3 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
                <ShieldCheck size={16} className="text-emerald-600" /> On-Device Privacy Shield
              </h3>
              <div className="space-y-2.5 text-xs text-slate-500 leading-normal">
                <div className="flex gap-2 items-start">
                  <Check size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Zero Server Uploads:</strong> Visual streams feed directly into client runtime memory loops via hardware lines.</span>
                </div>
                <div className="flex gap-2 items-start">
                  <Check size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Local Sandboxing:</strong> Photobooth strip poster generation is computed strictly using client canvas layers. No images leave your browser.</span>
                </div>
                <div className="flex gap-2 items-start">
                  <Check size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><strong>No Database Anchors:</strong> Application state flushes completely on tab closures or refresh actions.</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}