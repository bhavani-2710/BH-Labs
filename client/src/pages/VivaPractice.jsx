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
} from "react-icons/md";

const QUESTIONS = [
  {
    id: 1,
    label: "Viva Question 1 of 3",
    question: "What is the time complexity of Bubble Sort in the worst-case scenario and why?",
    code: `for (int i = 0; i < n-1; i++) {\n    for (int j = 0; j < n-i-1; j++) {\n        if (arr[j] > arr[j+1])\n            swap(arr[j], arr[j+1]);\n    }\n}`,
    hint: "Think about how many comparisons occur if the array is in reverse order.",
    masteryTopic: "Time Complexity",
    transcript: "The worst-case time complexity is O n squared. This occurs because of the nested loops...",
  },
  {
    id: 2,
    label: "Viva Question 2 of 3",
    question: "Explain the role of the swap operation and why a temporary variable is necessary.",
    code: `void swap(int *x, int *y) {\n    int temp = *x;\n    *x = *y;\n    *y = temp;\n}`,
    hint: "What happens to the value of *x if you overwrite it directly with *y without saving it first?",
    masteryTopic: "Swapping Logic",
    transcript: "The swap interchanges two element values...",
  },
  {
    id: 3,
    label: "Viva Question 3 of 3",
    question: "What is the space complexity of this implementation and can it be further optimised?",
    code: `// Space analysis:\n// - Input array of size n (not counted)\n// - Only one temp variable for swapping\n// → O(1) auxiliary space`,
    hint: "Check whether any extra arrays or data structures are created during sorting.",
    masteryTopic: "Space Optimization",
    transcript: "The space complexity is O one auxiliary space...",
  },
];

const INITIAL_MASTERY = {
  "Swapping Logic": "completed",
  "Iterative Pass": "completed",
  "Time Complexity": "pending",
  "Space Optimization": "locked",
};

export default function VivaPractice({ onBack, onCompleteViva }) {
  const [mode, setMode] = useState("voice");
  const [isListening, setIsListening] = useState(false);
  const [qIdx, setQIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [ended, setEnded] = useState(false);
  const [confidence, setConfidence] = useState(82);
  const [insight, setInsight] = useState("Your explanation of the adjacent comparison was excellent. Focus on nested loops.");
  const [seconds, setSeconds] = useState(0);
  const [mastery, setMastery] = useState(INITIAL_MASTERY);
  const listenRef = useRef(null);

  const currentQ = QUESTIONS[qIdx];

  useEffect(() => {
    const iv = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(iv);
  }, []);

  const timerStr = `${String(Math.floor(seconds / 60)).padStart(2, "0")}m ${String(seconds % 60).padStart(2, "0")}s`;

  const toggleListening = () => {
    if (isListening) {
      clearInterval(listenRef.current);
      setIsListening(false);
      return;
    }
    setIsListening(true);
    setAnswer("");
    const full = currentQ.transcript;
    let len = 0;
    listenRef.current = setInterval(() => {
      len = Math.min(len + 16, full.length);
      setAnswer(full.substring(0, len));
      if (len >= full.length) {
        clearInterval(listenRef.current);
        setIsListening(false);
      }
    }, 300);
  };

  const handleSubmit = () => {
    if (!answer.trim()) return;
    // Basic scoring logic
    setConfidence(c => Math.min(c + 8, 98));
    setAnswer("");
    if (qIdx < QUESTIONS.length - 1) {
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
      default: return null;
    }
  };

  if (ended) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-7xl mb-6">🏆</div>
          <h2 className="text-3xl font-bold mb-3">Viva Session Completed!</h2>
          <p className="text-gray-600 mb-8">Excellent performance!</p>
          <button onClick={onBack} className="bg-[#630ed4] text-white px-8 py-3.5 rounded-full flex items-center gap-2 mx-auto">
            Return to Workspace <Icon name="arrow_forward" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-8 h-14 bg-white shadow-sm border-b">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
            <Icon name="arrow_back" size={20} />
          </button>
          <div>
            <h1 className="text-base font-semibold text-[#630ed4]">Bubble Sort</h1>
            <p className="text-[10px] text-gray-500 -mt-0.5">Viva Practice Session</p>
          </div>
        </div>
      </header>

      <main className="pt-16 pb-12 px-4 md:px-8 max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-6">
          {/* Question Card */}
          <section className="bg-white border border-gray-200 rounded-3xl p-7 md:p-9 shadow-sm relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-500/5 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full mb-5">
                {currentQ.label}
              </span>
              <h2 className="text-[22px] leading-tight font-bold mb-6">
                {currentQ.question}
              </h2>
              {currentQ.code && (
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-xs font-mono text-gray-700 overflow-x-auto">
                  <pre>{currentQ.code}</pre>
                </div>
              )}
            </div>
          </section>

          {/* Interaction Area */}
          <section className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
            <div className="flex flex-col items-center gap-6">
              {/* Mode Tabs */}
              <div className="flex bg-gray-100 p-1 rounded-full w-fit text-sm">
                {["voice", "type"].map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`px-7 py-2.5 rounded-full font-medium transition-all ${mode === m ? "bg-white shadow text-[#630ed4]" : "text-gray-500"}`}
                  >
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </button>
                ))}
              </div>

              {mode === "voice" ? (
                <div
                  onClick={toggleListening}
                  className={`w-full flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-3xl cursor-pointer transition-all ${isListening ? "border-[#630ed4] bg-purple-50" : "border-gray-300 hover:border-purple-400"}`}
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-5 ${isListening ? "bg-purple-100 scale-110" : "bg-purple-50"}`}>
                    <Icon name={isListening ? "stop" : "mic"} size={42} color="#630ed4" />
                  </div>
                  <p className={`font-semibold text-lg mb-1 ${isListening ? "text-[#630ed4]" : "text-gray-700"}`}>
                    {isListening ? "Listening..." : "Click to speak your answer"}
                  </p>
                  <p className="text-xs text-gray-500">AI is listening for technical keywords...</p>
                </div>
              ) : (
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your explanation here..."
                  rows={5}
                  className="w-full p-5 border border-gray-300 rounded-2xl focus:border-[#630ed4] text-sm resize-none"
                />
              )}

              <div className="w-full flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={!answer.trim()}
                  className="bg-[#630ed4] disabled:bg-gray-300 text-white px-8 py-3 rounded-full font-medium flex items-center gap-2 text-sm"
                >
                  Submit Answer <Icon name="arrow_forward" size={18} />
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Progress */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Your Progress</h3>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Current Confidence</span>
              <span className="font-bold text-emerald-600">{confidence}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full mb-6 overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full transition-all" style={{ width: `${confidence}%` }} />
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-[#630ed4] text-white rounded-3xl p-6 shadow-lg relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <MdAutoAwesome size={20} />
              <h3 className="font-semibold text-base">AI Insights</h3>
            </div>
            <div className="bg-white/10 rounded-2xl p-5 text-sm leading-relaxed">
              "{insight}"
            </div>
          </div>

          {/* Hint Section - Matching Image */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
            <div className="flex gap-4">
              <div className="w-11 h-11 bg-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <MdLightbulb size={26} className="text-purple-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm mb-2">Need a hint?</h4>
                <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-xs leading-relaxed text-gray-700 mb-4">
                  {currentQ?.hint}
                </div>
                <button className="text-blue-600 hover:underline text-xs font-medium">
                  Show full hint (−5 points)
                </button>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}