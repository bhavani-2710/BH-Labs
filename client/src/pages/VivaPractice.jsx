import { useState, useEffect, useRef } from "react";
import {
  MdArrowBack,
  MdArrowForward,
  MdCheckCircle,
  MdPending,
  MdLock,
  MdPsychology,
  MdAutoAwesome,
  MdLightbulb,
  MdMic,
  MdStop,
  MdHistory,
  MdPerson,
  MdVolumeUp,
  MdVolumeOff,
} from "react-icons/md";

const formatCode = (code) => {
  if (!code) return "";
  // Split by double-quoted strings so we don't accidentally replace literal \n inside printf or similar C-strings.
  const parts = code.split(/(".*?")/g);
  return parts.map(part => {
    if (part.startsWith('"') && part.endsWith('"')) {
      return part; // keep literal \n inside strings intact
    }
    // outside strings, replace AI's unescaped \n texts with actual newlines
    return part.replace(/\\n/g, '\n').replace(/\\t/g, '  ');
  }).join('');
};

export default function VivaPractice({ subjectId, experiment, onBack, onCompleteViva }) {
  const [mode, setMode] = useState("voice");
  const [isListening, setIsListening] = useState(false);
  const [qIdx, setQIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [ended, setEnded] = useState(false);
  const [insight, setInsight] = useState("Explain the logic clearly, and I will evaluate your response in real-time.");
  const [seconds, setSeconds] = useState(0);
  const [mastery, setMastery] = useState({});

  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [subjectName, setSubjectName] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);

  // Real-time confidence scores list based on user responses
  const [scores, setScores] = useState([]);

  // Compute confidence dynamically as the average of student's scores so far (starts at 0%)
  const confidence = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  const listenRef = useRef(null);
  const currentQ = questions[qIdx];

  const [showHint, setShowHint] = useState(false);
  const [hintDeduction, setHintDeduction] = useState(0);

  // Timer counter
  useEffect(() => {
    const iv = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(iv);
  }, []);

  const timerStr = `${String(Math.floor(seconds / 60)).padStart(2, "0")}m ${String(seconds % 60).padStart(2, "0")}s`;

  // Fetch AI generated questions from backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const API = import.meta.env.VITE_API_URL || "/api";
        let targetSubjectId = subjectId;
        if (!targetSubjectId && experiment?.subjectId) {
          targetSubjectId = experiment.subjectId._id || experiment.subjectId;
        }

        if (!targetSubjectId) {
          setQuestions([]);
          setSubjectName(experiment?.title || "Viva Practice");
          setLoadingQuestions(false);
          return;
        }

        const res = await fetch(`${API}/vivas/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subjectId: targetSubjectId })
        });

        if (res.ok) {
          const data = await res.json();
          setQuestions(data.questions || []);
          setSubjectName(data.subjectName || "Viva Practice");

          // Re-initialize topics mastery dynamically based on the generated topics as pending (no locked questions)
          const newMastery = {};
          if (data.questions && data.questions.length > 0) {
            data.questions.forEach((q) => {
              if (q.masteryTopic) {
                newMastery[q.masteryTopic] = "pending";
              }
            });
          }
          setMastery(newMastery);
        } else {
          throw new Error("Failed to load AI questions");
        }
      } catch (err) {
        console.error("Fetch questions error:", err);
        setQuestions([]);
        setSubjectName(experiment?.title || "Viva Practice");
        setMastery({});
      } finally {
        setLoadingQuestions(false);
      }
    };

    fetchQuestions();
  }, [subjectId, experiment]);

  // Voice speech output logic (Text to speech)
  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith("en"));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  // Speaks greeting at start, or questions as we progress
  useEffect(() => {
    if (questions && questions[qIdx] && !isMuted) {
      if (qIdx === 0 && !hasGreeted) {
        speakText(`Hello Rahul Sharma. Welcome to your ${subjectName} viva practice session. I am your AI examiner. Let's begin. Question 1: ${questions[0].question}`);
        setHasGreeted(true);
      } else {
        speakText(`Question ${qIdx + 1}: ${questions[qIdx].question}`);
      }
    }
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [qIdx, questions, isMuted, hasGreeted, subjectName]);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const autoStopRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0); // 0-100 live mic level
  const recordingTimerRef = useRef(null);

  const MAX_RECORD_SECONDS = 60;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      cancelAnimationFrame(animFrameRef.current);
      clearTimeout(autoStopRef.current);
      clearInterval(recordingTimerRef.current);
    };
  }, []);

  const stopRecording = () => {
    clearTimeout(autoStopRef.current);
    clearInterval(recordingTimerRef.current);
    cancelAnimationFrame(animFrameRef.current);
    setRecordingSeconds(0);
    setAudioLevel(0);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsListening(false);
  };

  // Toggle mic: start/stop MediaRecorder, then send audio to Whisper
  const toggleListening = async () => {
    if (isListening) {
      stopRecording();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      // ── Live audio level meter via AnalyserNode ──────────────────────────────
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const tick = () => {
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
        animFrameRef.current = requestAnimationFrame(tick);
      };
      animFrameRef.current = requestAnimationFrame(tick);

      // Prefer webm/opus; Safari falls back
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "audio/ogg";

      const recorder = new MediaRecorder(stream, { mimeType });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        audioCtx.close();

        if (audioChunksRef.current.length === 0) {
          setIsTranscribing(false);
          return;
        }

        const ext = mimeType.includes("ogg") ? "ogg" : "webm";
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        audioChunksRef.current = [];

        setIsTranscribing(true);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);
        try {
          const API = import.meta.env.VITE_API_URL || "/api";
          const formData = new FormData();
          formData.append("audio", blob, `recording.${ext}`);

          const res = await fetch(`${API}/vivas/transcribe`, {
            method: "POST",
            body: formData,
            signal: controller.signal,
          });

          if (res.ok) {
            const data = await res.json();
            setAnswer(data.transcript || "");
          } else {
            const err = await res.json().catch(() => ({}));
            console.error("Transcription error:", err.error || res.status);
            if (res.status === 503) {
              alert("Whisper not configured. Please add your GROQ_API_KEY to the server .env file, or switch to Type mode.");
            }
          }
        } catch (e) {
          if (e.name === "AbortError") {
            console.error("Whisper request timed out");
          } else {
            console.error("Whisper request failed:", e);
          }
        } finally {
          clearTimeout(timeout);
          setIsTranscribing(false);
        }
      };

      recorder.start(250);
      mediaRecorderRef.current = recorder;
      setAnswer("");
      setIsListening(true);
      setRecordingSeconds(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((s) => {
          if (s + 1 >= MAX_RECORD_SECONDS) clearInterval(recordingTimerRef.current);
          return s + 1;
        });
      }, 1000);

      autoStopRef.current = setTimeout(() => stopRecording(), MAX_RECORD_SECONDS * 1000);

    } catch (err) {
      console.error("Microphone access error:", err);
      alert("Could not access microphone. Please allow microphone permission and try again.");
    }
  };




  // Submit and grade answer via backend AI evaluator
  const handleSubmit = async () => {
    if (!answer.trim() || isEvaluating) return;
    setIsEvaluating(true);

    try {
      const API = import.meta.env.VITE_API_URL || "/api";
      const res = await fetch(`${API}/vivas/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentQ.question,
          studentAnswer: answer,
          modelAnswer: currentQ.transcript
        })
      });

      if (res.ok) {
        const data = await res.json();
        let score = typeof data.score === "number" ? data.score : 80;
        score = Math.max(0, score - hintDeduction);

        // Append user response score
        setScores(prev => [...prev, score]);
        setInsight(data.feedback || "Your explanation was recorded. Keep it up!");

        // Speak the feedback review out loud
        if (!isMuted) {
          speakText(data.feedback || "Your answer was processed successfully.");
        }

        // Update topics mastery state to completed (no locked topics logic)
        if (currentQ.masteryTopic) {
          setMastery(prev => {
            const next = { ...prev };
            next[currentQ.masteryTopic] = "completed";
            return next;
          });
        }

        setIsAnswered(true);
      } else {
        throw new Error("Evaluation error");
      }
    } catch (e) {
      console.error(e);
      let score = answer.trim().length > 15 ? 50 : 5;
      score = Math.max(0, score - hintDeduction);
      setScores(prev => [...prev, score]);
      const fallbackFeedback = "Your response has been recorded. Focus on explaining core algorithm complexity bounds.";
      setInsight(fallbackFeedback);
      if (!isMuted) {
        speakText(fallbackFeedback);
      }
      setIsAnswered(true);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNext = () => {
    setIsAnswered(false);
    setAnswer("");
    setShowHint(false);
    setHintDeduction(0);
    if (qIdx < questions.length - 1) {
      setQIdx(i => i + 1);
    } else {
      setEnded(true);
      if (onCompleteViva) onCompleteViva(confidence);
    }
  };

  const Icon = ({ name, size = 20, color }) => {
    const props = { size, color: color || "currentColor" };
    switch (name) {
      case "arrow_back": return <MdArrowBack {...props} />;
      case "arrow_forward": return <MdArrowForward {...props} />;
      case "check_circle": return <MdCheckCircle {...props} />;
      case "pending": return <MdPending {...props} />;
      case "lock": return <MdLock {...props} />;
      case "psychology": return <MdPsychology {...props} />;
      case "auto_awesome": return <MdAutoAwesome {...props} />;
      case "lightbulb": return <MdLightbulb {...props} />;
      case "mic": return <MdMic {...props} />;
      case "stop": return <MdStop {...props} />;
      case "history": return <MdHistory {...props} />;
      case "volume_up": return <MdVolumeUp {...props} />;
      case "volume_off": return <MdVolumeOff {...props} />;
      default: return null;
    }
  };

  if (loadingQuestions) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAFAFA] gap-4 select-none">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-[#630ed4] animate-spin"></div>
        <p className="text-sm font-semibold text-slate-500">Generating Viva Questions via AI...</p>
      </div>
    );
  }

  if (ended) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
        <div className="text-center max-w-md bg-white border border-[#ccc3d8] p-12 rounded-[24px] shadow-sm relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#630ed4]/5 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="text-7xl mb-6">🏆</div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-3">Viva Session Completed!</h2>
            <p className="text-slate-500 mb-8 text-sm">Excellent job demonstrating your technical logic.</p>
            <button
              onClick={onBack}
              className="bg-[#630ed4] hover:bg-[#520cb2] text-white font-semibold text-xs px-8 py-3.5 rounded-full flex items-center gap-2 mx-auto cursor-pointer active:scale-95 shadow-md transition-all"
            >
              Return to Workspace <Icon name="arrow_forward" size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-800 antialiased font-sans">
      <style>{`
        .recording-pulse {
          animation: pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: .7; transform: scale(1.05); }
        }
        .glass-panel {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(8px);
          border: 1px solid #ccc3d8;
        }
      `}</style>

      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-8 h-16 bg-white shadow-sm border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors cursor-pointer active:scale-95 border border-slate-100 shadow-sm"
          >
            <Icon name="arrow_back" size={20} color="#4a4455" />
          </button>
          <div>
            <h1 style={{ fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: 700 }} className="text-[#630ed4] leading-tight">{subjectName}</h1>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 600 }} className="text-slate-400 uppercase tracking-wider">Viva Practice Session</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="font-bold text-[11px] text-[#630ed4] hover:bg-[#630ed4]/5 px-4 py-2 rounded-full transition-all active:scale-95 cursor-pointer"
          >
            End Session
          </button>
          <div className="w-8 h-8 rounded-full bg-[#f6f2f5] text-[#7b7487] flex items-center justify-center border border-[#ccc3d8] select-none shadow-sm">
            <MdPerson size={18} />
          </div>
        </div>
      </header>

      {/* Main Grid content */}
      <main className="pt-24 pb-12 px-4 md:px-8 max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Center Stage: Question Area */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Question Card */}
          <section className="bg-white border border-[#ccc3d8] rounded-[24px] p-8 md:p-10 shadow-sm relative overflow-hidden">
            {/* Decorative AI Gradient */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#630ed4]/5 rounded-full blur-3xl pointer-events-none select-none"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5">
                <span className="inline-block px-3 py-1 rounded-full bg-[#eaddff] text-[#25005a] font-bold text-[10px] tracking-wider uppercase">
                  {currentQ?.label}
                </span>

                {/* AI Audio speaking mute toggle */}
                <button
                  onClick={() => setIsMuted(prev => !prev)}
                  className="p-2 rounded-full border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer text-slate-500 active:scale-95 shadow-sm bg-white"
                  title={isMuted ? "Unmute AI Voice" : "Mute AI Voice"}
                >
                  <Icon name={isMuted ? "volume_off" : "volume_up"} size={15} />
                </button>
              </div>

              <h2 style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 700 }} className="text-slate-900 mb-6 leading-snug">
                {currentQ?.question}
              </h2>
              {/* Code Snippet Context */}
              {currentQ?.code && (
                <div className="bg-[#1E1E1E] rounded-xl p-5 shadow-inner border border-white/5 overflow-hidden">
                  <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2 select-none">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]"></div>
                    <span className="ml-2 font-mono text-[9px] text-white/40">snippet_code</span>
                  </div>
                  <pre className="font-mono text-xs overflow-x-auto leading-relaxed text-[#D4D4D4] whitespace-pre-wrap">
                    <code>{formatCode(currentQ.code)}</code>
                  </pre>
                </div>
              )}
            </div>
          </section>

          {/* Interaction Area */}
          <section className="bg-white border border-[#ccc3d8] rounded-[24px] p-6 shadow-sm">
            <div className="flex flex-col items-center gap-6">
              {/* Tabs for Input Method */}
              <div className="flex bg-[#f6f2f5] p-1 rounded-full w-fit">
                <button
                  onClick={() => setMode("voice")}
                  disabled={isAnswered}
                  className={`px-6 py-2 rounded-full font-bold text-[11px] transition-all ${isAnswered ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${mode === "voice" ? "bg-white shadow text-[#630ed4]" : "text-slate-400"}`}
                >
                  Voice
                </button>
                <button
                  onClick={() => setMode("type")}
                  disabled={isAnswered}
                  className={`px-6 py-2 rounded-full font-bold text-[11px] transition-all ${isAnswered ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${mode === "type" ? "bg-white shadow text-[#630ed4]" : "text-slate-400"}`}
                >
                  Type
                </button>
              </div>

              {/* Recording Visualizer / Input Field */}
              {mode === "voice" ? (
                <div
                  className={`w-full flex flex-col items-center justify-center py-10 border-2 border-dashed rounded-[32px] transition-all
                    ${isListening ? "border-[#630ed4] bg-[#630ed4]/5" : isTranscribing ? "border-amber-400 bg-amber-50" : "border-[#ccc3d8] bg-white"}`}
                >
                  {/* Mic / Spinner Icon */}
                  <div className={`w-20 h-20 rounded-full bg-[#630ed4]/5 flex items-center justify-center mb-4 ${isListening ? "recording-pulse" : ""}`}>
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg ${isTranscribing ? "bg-amber-400 shadow-amber-400/20" : "bg-[#630ed4] shadow-[#630ed4]/20"}`}>
                      {isTranscribing
                        ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        : <Icon name={isListening ? "stop" : "mic"} size={28} color="#ffffff" />
                      }
                    </div>
                  </div>

                  <p className={`text-sm font-bold mb-1 ${isListening ? "text-[#630ed4]" : isTranscribing ? "text-amber-600" : "text-slate-800"}`}>
                    {isAnswered ? "Answer Submitted" : isTranscribing ? "Transcribing with Whisper..." : isListening ? `Recording — ${recordingSeconds}s` : "Click mic to speak"}
                  </p>
                  <p className="text-xs text-slate-400 mb-4 text-center px-4">
                    {isAnswered ? "Your response has been evaluated by the AI." : isTranscribing ? "Sending audio to Whisper AI..." : isListening ? `Auto-stops at ${MAX_RECORD_SECONDS}s. Click Stop when done.` : "Powered by OpenAI Whisper for accurate recognition"}
                  </p>

                  {/* Live audio level bars — react to actual mic input */}
                  {isListening && (
                    <div className="flex items-end gap-1 mb-4 h-10 select-none">
                      {[0.3, 0.6, 1.0, 0.7, 0.5, 0.8, 0.4].map((factor, i) => {
                        const h = Math.max(4, Math.round(audioLevel * factor));
                        return (
                          <div
                            key={i}
                            className="w-2 rounded-full bg-[#630ed4] transition-all duration-75"
                            style={{ height: `${h}px`, opacity: 0.4 + factor * 0.6 }}
                          />
                        );
                      })}
                    </div>
                  )}

                  {/* Action buttons */}
                  {!isAnswered && (
                    <div className="flex gap-3">
                      {!isListening && !isTranscribing && (
                        <button
                          onClick={toggleListening}
                          className="px-5 py-2 bg-[#630ed4] text-white text-xs font-bold rounded-full shadow hover:bg-[#5209b8] active:scale-95 transition-all cursor-pointer"
                        >
                          🎙 Start Recording
                        </button>
                      )}
                      {isListening && (
                        <button
                          onClick={stopRecording}
                          className="px-5 py-2 bg-red-500 text-white text-xs font-bold rounded-full shadow hover:bg-red-600 active:scale-95 transition-all cursor-pointer"
                        >
                          ⏹ Stop Recording
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  disabled={isAnswered}
                  placeholder="Type your explanation here..."
                  rows={6}
                  className={`w-full p-5 border border-[#ccc3d8] rounded-[24px] focus:border-[#630ed4] text-xs resize-none outline-none bg-white font-sans leading-relaxed ${isAnswered ? "bg-slate-50 text-slate-500 cursor-not-allowed" : ""}`}
                />
              )}

              {/* Transcribed answer preview in voice mode */}
              {mode === "voice" && !isListening && !isTranscribing && !isAnswered && (
                <div className="w-full">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-1">
                    {answer.trim() ? "📝 Transcribed — edit if needed:" : "No answer recorded yet"}
                  </p>
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Your spoken answer will appear here after recording. You can also type to correct it..."
                    rows={4}
                    className="w-full p-4 border border-[#ccc3d8] rounded-[20px] focus:border-[#630ed4] text-xs resize-none outline-none bg-white font-sans leading-relaxed"
                  />
                </div>
              )}

              {/* Action Button */}
              <div className="w-full flex justify-end items-center gap-4 border-t border-slate-100 pt-6 select-none">
                {isEvaluating ? (
                  <span className="text-[10px] font-bold text-[#630ed4] italic animate-pulse">Evaluating answer via AI...</span>
                ) : isTranscribing ? (
                  <span className="text-[10px] font-bold text-amber-500 italic animate-pulse">Transcribing your voice...</span>
                ) : answer.trim() && !isAnswered ? (
                  <span className="text-[10px] font-bold text-slate-400 italic">Ready to submit</span>
                ) : null}

                {isAnswered ? (
                  <button
                    onClick={handleNext}
                    className="bg-[#630ed4] hover:bg-[#520cb2] text-white font-bold text-xs px-8 py-3 rounded-full transition-all flex items-center gap-2 active:scale-95 shadow-md cursor-pointer"
                  >
                    {qIdx < questions.length - 1 ? "Next Question" : "Finish Session"} <Icon name="arrow_forward" size={16} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!answer.trim() || isEvaluating || isTranscribing}
                    className="bg-[#630ed4] hover:bg-[#520cb2] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs px-8 py-3 rounded-full transition-all flex items-center gap-2 active:scale-95 shadow-md cursor-pointer disabled:cursor-not-allowed"
                  >
                    Submit Answer <Icon name="arrow_forward" size={16} />
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Side Panel: Progress & Feedback */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          {/* Progress Section */}
          <div className="bg-white border border-[#ccc3d8] rounded-[24px] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6 select-none">
              <h3 className="font-bold text-[10px] uppercase tracking-widest text-slate-400">Performance Metrics</h3>
              <MdHistory size={20} className="text-slate-400" />
            </div>
            <div className="mb-6">
              <div className="flex items-end justify-between mb-3 select-none">
                <div>
                  <p className="text-2xl font-extrabold text-slate-900 leading-tight">{confidence}%</p>
                  <p className="text-[10px] font-bold text-slate-400">Current Confidence</p>
                </div>
                <div className="text-right">
                  
                </div>
              </div>
              <div className="w-full h-1.5 bg-[#eae7ea] rounded-full overflow-hidden">
                <div className="h-full bg-[#006e2d] rounded-full transition-all duration-1000" style={{ width: `${confidence}%` }}></div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest select-none">Topics Mastery</p>
              <div className="grid grid-cols-2 gap-3 select-none">
                {Object.entries(mastery).map(([topic, status]) => {
                  if (status === "completed") {
                    return (
                      <div key={topic} className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#E8F5E9]/50 border border-[#81C784]/40 text-[#1B5E20] shadow-sm">
                        <Icon name="check_circle" size={16} color="#2E7D32" />
                        <span style={{ fontFamily: "Inter, sans-serif" }} className="text-[10px] font-bold tracking-tight">{topic}</span>
                      </div>
                    );
                  }
                  if (status === "pending" || topic === currentQ?.masteryTopic) {
                    return (
                      <div key={topic} className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#5521FF]/5 border border-[#5521FF]/20 text-[#5521FF] shadow-sm">
                        <Icon name="pending" size={16} color="#5521FF" />
                        <span style={{ fontFamily: "Inter, sans-serif" }} className="text-[10px] font-bold tracking-tight">{topic}</span>
                      </div>
                    );
                  }
                  return (
                    <div key={topic} className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#F5F5F5] border border-[#E0E0E0] text-[#9E9E9E] shadow-sm opacity-60">
                      <Icon name="lock" size={16} />
                      <span style={{ fontFamily: "Inter, sans-serif" }} className="text-[10px] font-bold tracking-tight">{topic}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* AI Feedback Section */}
          <div className="glass-panel rounded-[24px] p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none select-none">
              <Icon name="psychology" size={120} color="#630ed4" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4 select-none">
                <Icon name="auto_awesome" size={20} color="#630ed4" />
                <h3 className="font-extrabold text-sm text-slate-900">AI Insights</h3>
              </div>
              <div className="space-y-4">
                <div className="bg-[#630ed4]/5 border border-[#630ed4]/10 rounded-xl p-4">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    "{insight}"
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 select-none">
                  <span className="text-[10px] font-bold text-slate-400">Previous Feedback: <span className="font-extrabold text-slate-800">Stable</span></span>
                  <button className="text-[10px] font-bold border border-[#ccc3d8] px-3 py-1 rounded-full hover:bg-slate-50 transition-colors text-slate-500 cursor-pointer">
                    View Log
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Hint Card */}
          <div className="bg-[#f6f2f5] border border-[#ccc3d8] border-dashed rounded-[24px] p-6">
            <div className="flex gap-4 items-start">
              <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm shrink-0 select-none">
                <Icon name="lightbulb" size={20} color="#630ed4" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-[11px] text-slate-800 mb-1 select-none">Need a hint?</h4>
                <div className="relative">
                  <p 
                    className={`text-xs text-slate-600 leading-relaxed transition-all duration-300 ${
                      showHint ? "" : "blur-[4px] select-none pointer-events-none"
                    }`}
                  >
                    {currentQ?.hint || "Think about the core concept behind this question."}
                  </p>
                  {!showHint && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-[1px] rounded">
                      <span className="text-[10px] font-bold text-[#630ed4] uppercase bg-white border border-[#ccc3d8] px-2.5 py-1 rounded-full shadow-sm">
                        Hint Hidden
                      </span>
                    </div>
                  )}
                </div>
                
                {!showHint ? (
                  <button 
                    onClick={() => {
                      setShowHint(true);
                      setHintDeduction(5);
                    }}
                    className="mt-3 font-bold text-[10px] text-[#630ed4] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    Show hint (-5 points penalty)
                  </button>
                ) : (
                  <p className="mt-3 text-[9px] font-semibold text-red-500 italic">
                    Hint revealed (-5 points will be deducted from your score for this question)
                  </p>
                )}
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Footer Stats (Mobile Optimized) */}
      <footer className="w-full py-6 px-4 md:px-8 border-t border-slate-200 bg-white mt-12 select-none">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold text-slate-400">© 2026 BH.Lab AI Engineering. Built for students.</p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#006e2d]"></span>
              <span className="text-[10px] font-bold text-slate-400">AI Tutor Online</span>
            </div>
            <div className="h-4 w-px bg-slate-200"></div>
            <div className="flex items-center gap-2">
              <Icon name="history" size={16} color="#630ed4" />
              <span className="text-[10px] font-bold text-slate-400">Session: {timerStr}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}