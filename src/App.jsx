import React, { useState, useEffect } from 'react';
import { Sparkles, Moon, Star, Heart, Leaf, Bird, Cloud, Sun, Droplets, Feather, CheckCircle2, XCircle, ArrowRight, RotateCcw, Award } from 'lucide-react';

// --- Web Audio API for Dreamy Sounds ---
const playTone = (freq, type, duration, vol = 0.1) => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = type;
    oscillator.frequency.value = freq;
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(vol, audioCtx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.log("Audio not supported or user hasn't interacted yet");
  }
};

const sounds = {
  click: () => playTone(800, 'sine', 0.1, 0.05),
  correct: () => {
    playTone(880, 'sine', 0.2, 0.05); // A5
    setTimeout(() => playTone(1108, 'sine', 0.2, 0.05), 100); // C#6
    setTimeout(() => playTone(1318, 'sine', 0.4, 0.05), 200); // E6
  },
  wrong: () => {
    playTone(300, 'triangle', 0.2, 0.05);
    setTimeout(() => playTone(250, 'triangle', 0.3, 0.05), 150);
  },
  victory: () => {
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      setTimeout(() => playTone(freq, 'sine', 0.3, 0.05), i * 150);
    });
  }
};

// --- Lesson Content Data ---
const lessonContent = [
  {
    id: 1,
    title: "Lesson 1: Animal Superpowers & Journeys! 🦅",
    icon: <Bird className="w-8 h-8 text-pink-400" />,
    color: "from-pink-100 to-rose-50 border-pink-200",
    textColor: "text-pink-900",
    sections: [
      { subtitle: "The Desert Survivor 🐪", text: "The Dorcas gazelle hides perfectly in the sand with its sandy color and can survive for several months without drinking any water!" },
      { subtitle: "Where Do Behaviors Come From? 🧬", text: "Inherited behaviors come naturally from parents. Acquired behaviors are learned by interacting with the environment." },
      { subtitle: "Types of Adaptation 🐾", text: "Structural: A physical body change (like thick fur). Behavioral: An action change (like migrating)." },
      { subtitle: "Amazing Bird Migration 🌍", text: "Millions of birds travel to find food and reproduce. Egypt is a favorite rest stop because of its lovely, moderate winter climate!" },
      { subtitle: "What Helps Things Grow? 🌱", text: "Environmental Factors (light, water, food) outside the body, and Genetic Factors (traits from parents) inside the body." }
    ]
  },
  {
    id: 2,
    title: "Lesson 2: Amazing Environments! 🐧",
    icon: <Leaf className="w-8 h-8 text-teal-400" />,
    color: "from-teal-100 to-emerald-50 border-teal-200",
    textColor: "text-teal-900",
    sections: [
      { subtitle: "Awesome Animal Adaptations ❄️☀️", text: "Emperor penguins have thick blubber for the ice. African penguins have bare skin around their eyes to cool down fast in the heat! Arctic foxes have white fur for snow, and poison dart frogs have huge eyes for the dark rainforest." },
      { subtitle: "Desert Plant Secrets 🌵", text: "Plants like the acacia have short roots for morning dew, thick stems to store water, and sharp thorns to keep hungry animals away!" },
      { subtitle: "Ecosystem Magic 🌍", text: "Biotic factors are LIVING things (plants, animals). Abiotic factors are NONLIVING things (sunlight, water, air, soil)." },
      { subtitle: "The Power of Light ☀️", text: "Sunlight's intensity and duration affect growth. The Chrysanthemum plant only flowers when days are shorter than nights!" }
    ]
  }
];

// --- Quiz Questions Data ---
const quizData = [
  {
    q: "Which of the following is a Behavioral adaptation? 🐾",
    options: ["Thick white fur on a fox", "Thorns on a plant stem", "Birds migrating in winter", "Sandy body color"],
    answer: 2,
    motivation: "Brilliant! Migration is an action they choose to do!"
  },
  {
    q: "How does the Dorcas gazelle survive in the hot desert? 🐪",
    options: ["It lives in the snow", "It drinks gallons of water daily", "It survives months without drinking water", "It grows thick blubber"],
    answer: 2,
    motivation: "Wow! You remembered the desert survivor's secret!"
  },
  {
    q: "A trait that an animal gets naturally from its parents is called... 🧬",
    options: ["An acquired behavior", "An inherited behavior", "An abiotic factor", "A structural mistake"],
    answer: 1,
    motivation: "Genius! It's in their genes!"
  },
  {
    q: "Why do millions of migratory birds love to stop in Egypt? 🦅",
    options: ["Because of its freezing weather", "Because of its moderate winter climate", "To hide in the snow", "Because there are no plants"],
    answer: 1,
    motivation: "Perfect! Egypt has beautiful weather for birds!"
  },
  {
    q: "How does the African penguin cool down in South Africa? 🐧",
    options: ["It eats lots of snow", "It has thick blubber", "It has bare skin with no feathers around its eyes", "It hides in a cave"],
    answer: 2,
    motivation: "So smart! That skin helps the heat escape!"
  },
  {
    q: "In an ecosystem, things like sunlight, water, air, and soil are called... ☀️",
    options: ["Biotic factors", "Abiotic factors", "Animals", "Acquired traits"],
    answer: 1,
    motivation: "You nailed it! Abiotic means nonliving!"
  },
  {
    q: "Which plant only produces flowers when the days are shorter than the nights? 🌸",
    options: ["Acacia tree", "Chrysanthemum", "Opuntia", "Palm tree"],
    answer: 1,
    motivation: "Beautiful! You know your magical plants!"
  },
  {
    q: "Why do desert plants usually have sharp thorns? 🌵",
    options: ["To catch morning dew", "To store water", "To keep hungry animals away", "To look pretty"],
    answer: 2,
    motivation: "Ouch! Exactly right, it keeps them safe!"
  }
];

// --- Subcomponents ---

const FloatingBackground = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {[...Array(15)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full bg-white opacity-40 animate-float"
        style={{
          width: Math.random() * 8 + 4 + 'px',
          height: Math.random() * 8 + 4 + 'px',
          left: Math.random() * 100 + 'vw',
          top: Math.random() * 100 + 'vh',
          animationDuration: Math.random() * 10 + 15 + 's',
          animationDelay: `-${Math.random() * 10}s`,
        }}
      />
    ))}
    <style dangerouslySetInnerHTML={{__html: `
      @keyframes float {
        0% { transform: translateY(0) scale(1); opacity: 0.3; }
        50% { transform: translateY(-50vh) scale(1.5); opacity: 0.8; }
        100% { transform: translateY(-100vh) scale(1); opacity: 0; }
      }
      .pop-in { animation: pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
      @keyframes pop-in { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
      .glass-card { background: rgba(255, 255, 255, 0.65); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.8); }
    `}} />
  </div>
);

// --- Main App ---
export default function App() {
  const [activeTab, setActiveTab] = useState('learn'); // 'learn' or 'quiz'
  
  // Quiz State
  const [quizState, setQuizState] = useState('start'); // start, playing, feedback, result
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState({ isCorrect: false, msg: "" });

  const handleTabSwitch = (tab) => {
    sounds.click();
    setActiveTab(tab);
  };

  const startQuiz = () => {
    sounds.click();
    setQuizState('playing');
    setCurrentQ(0);
    setScore(0);
  };

  const handleAnswer = (index) => {
    const isCorrect = index === quizData[currentQ].answer;
    if (isCorrect) {
      sounds.correct();
      setScore(s => s + 1);
      setFeedback({ isCorrect: true, msg: quizData[currentQ].motivation });
    } else {
      sounds.wrong();
      setFeedback({ isCorrect: false, msg: "Oops! It's okay, you're still learning! Let's keep trying! 💕" });
    }
    setQuizState('feedback');
  };

  const nextQuestion = () => {
    sounds.click();
    if (currentQ + 1 < quizData.length) {
      setCurrentQ(c => c + 1);
      setQuizState('playing');
    } else {
      sounds.victory();
      setQuizState('result');
    }
  };

  const getRewardTitle = () => {
    const percentage = score / quizData.length;
    if (percentage === 1) return "Adaptation Queen 👑✨";
    if (percentage >= 0.75) return "Nature Princess 🌸🌿";
    if (percentage >= 0.5) return "Clever Explorer 🦊🔭";
    return "Curious Dreamer ☁️💕";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-100 to-teal-100 font-[Quicksand,sans-serif] text-slate-700 relative overflow-x-hidden selection:bg-pink-300">
      <FloatingBackground />
      
      {/* Header */}
      <div className="relative z-10 max-w-4xl mx-auto pt-10 px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-white/50 rounded-full mb-4 shadow-sm backdrop-blur-sm animate-bounce" style={{animationDuration: '3s'}}>
            <Sparkles className="w-10 h-10 text-pink-400" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500 drop-shadow-sm mb-3">
            Nature's Dream Academy
          </h1>
          <p className="text-lg font-bold text-purple-800/80 bg-white/40 inline-block px-6 py-2 rounded-full shadow-sm">
            Concept 4.1: Adapting to Survive 🌿
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-4 mb-10">
          <button 
            onClick={() => handleTabSwitch('learn')}
            className={`flex items-center gap-2 px-8 py-4 rounded-full font-extrabold text-lg transition-all duration-300 shadow-md ${activeTab === 'learn' ? 'bg-white text-pink-500 scale-105 ring-4 ring-pink-200' : 'bg-white/50 text-slate-500 hover:bg-white/80 hover:scale-105'}`}
          >
            <BookOpenIcon className="w-5 h-5" /> Study Notes
          </button>
          <button 
            onClick={() => handleTabSwitch('quiz')}
            className={`flex items-center gap-2 px-8 py-4 rounded-full font-extrabold text-lg transition-all duration-300 shadow-md ${activeTab === 'quiz' ? 'bg-white text-teal-500 scale-105 ring-4 ring-teal-200' : 'bg-white/50 text-slate-500 hover:bg-white/80 hover:scale-105'}`}
          >
            <GamepadIcon className="w-5 h-5" /> Quiz Adventure
          </button>
        </div>

        {/* --- STUDY NOTES SECTION --- */}
        {activeTab === 'learn' && (
          <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-5 duration-500">
            {lessonContent.map(lesson => (
              <div key={lesson.id} className={`glass-card rounded-[2.5rem] p-6 sm:p-10 shadow-xl border-t-4 border-l-4 ${lesson.color}`}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 bg-white rounded-2xl shadow-sm">{lesson.icon}</div>
                  <h2 className={`text-2xl sm:text-3xl font-extrabold ${lesson.textColor}`}>{lesson.title}</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {lesson.sections.map((sec, i) => (
                    <div key={i} className="bg-white/50 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 border border-white/60">
                      <h3 className={`font-extrabold text-lg mb-2 flex items-center gap-2 ${lesson.textColor}`}>
                        <Star className="w-4 h-4 fill-current opacity-70" /> {sec.subtitle}
                      </h3>
                      <p className="text-slate-700 font-medium leading-relaxed">
                        {sec.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="text-center mt-8 text-pink-600 font-bold italic animate-pulse">
              "You are an Adaptation Ace! Keep shining and dreaming big!" ✨💕
            </div>
          </div>
        )}

        {/* --- QUIZ SECTION --- */}
        {activeTab === 'quiz' && (
          <div className="pb-20 animate-in zoom-in-95 duration-500">
            <div className="glass-card rounded-[3rem] p-6 sm:p-12 shadow-2xl border-4 border-white min-h-[500px] flex flex-col justify-center items-center relative overflow-hidden">
              
              {/* Quiz Start Screen */}
              {quizState === 'start' && (
                <div className="text-center pop-in z-10">
                  <div className="relative inline-block mb-6">
                    <Heart className="w-24 h-24 text-pink-400 fill-pink-200 animate-pulse" />
                    <Sparkles className="w-8 h-8 text-yellow-400 absolute -top-2 -right-4" />
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-purple-900 mb-4">Ready for a Magical Quiz?</h2>
                  <p className="text-lg text-purple-700 font-medium mb-8 max-w-md mx-auto">
                    Let's test your knowledge about animal superpowers and amazing environments!
                  </p>
                  <button 
                    onClick={startQuiz}
                    className="group relative inline-flex items-center justify-center px-10 py-5 font-extrabold text-white transition-all duration-200 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full hover:scale-105 hover:shadow-[0_10px_20px_rgba(236,72,153,0.4)]"
                  >
                    Start Adventure <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}

              {/* Quiz Playing Screen */}
              {quizState === 'playing' && (
                <div className="w-full max-w-2xl pop-in z-10">
                  {/* Progress Header */}
                  <div className="flex justify-between items-end mb-4">
                    <span className="text-sm font-extrabold text-purple-500 uppercase tracking-wider">Question {currentQ + 1} of {quizData.length}</span>
                    <div className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-1.5 rounded-full font-bold shadow-sm">
                      <Star className="w-4 h-4 fill-yellow-400" /> Score: {score}
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="h-3 w-full bg-purple-100 rounded-full mb-8 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-pink-400 to-teal-400 transition-all duration-500 ease-out relative"
                      style={{ width: `${((currentQ) / quizData.length) * 100}%` }}
                    ></div>
                  </div>

                  {/* Question */}
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-8 leading-tight">
                    {quizData[currentQ].q}
                  </h3>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {quizData[currentQ].options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        className="bg-white/80 border-2 border-transparent hover:border-pink-300 hover:bg-pink-50 text-slate-700 font-bold py-5 px-6 rounded-3xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 text-left flex items-center gap-4 group"
                      >
                        <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center flex-shrink-0 font-extrabold group-hover:bg-pink-200 transition-colors">
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span className="text-lg">{opt}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quiz Feedback Screen */}
              {quizState === 'feedback' && (
                <div className="text-center pop-in z-10 w-full max-w-md">
                  <div className="flex justify-center mb-6">
                    <div className={`p-6 rounded-full shadow-lg ${feedback.isCorrect ? 'bg-green-100' : 'bg-rose-100'}`}>
                      {feedback.isCorrect 
                        ? <CheckCircle2 className="w-16 h-16 text-green-500" strokeWidth={3} /> 
                        : <XCircle className="w-16 h-16 text-rose-500" strokeWidth={3} />
                      }
                    </div>
                  </div>
                  
                  <h3 className={`text-4xl font-extrabold mb-4 ${feedback.isCorrect ? 'text-green-500' : 'text-rose-500'}`}>
                    {feedback.isCorrect ? "Yay! Correct! ✨" : "Oopsie! 🌙"}
                  </h3>
                  
                  <div className="bg-white/80 p-6 rounded-3xl shadow-sm border border-white mb-8">
                    <p className="text-xl font-bold text-slate-700">
                      {feedback.msg}
                    </p>
                  </div>

                  <button 
                    onClick={nextQuestion}
                    className="w-full inline-flex items-center justify-center px-8 py-5 font-extrabold text-white transition-all duration-200 bg-slate-800 rounded-full hover:bg-slate-700 hover:shadow-lg hover:-translate-y-1"
                  >
                    {currentQ + 1 < quizData.length ? "Next Question" : "See My Results!"} <ArrowRight className="ml-2 w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Quiz Results Screen */}
              {quizState === 'result' && (
                <div className="text-center pop-in z-10 w-full">
                  <div className="relative inline-block mb-4">
                    <Award className="w-28 h-28 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)] animate-bounce" style={{animationDuration: '2s'}} />
                  </div>
                  
                  <h2 className="text-4xl font-extrabold text-purple-900 mb-2">Quiz Complete!</h2>
                  
                  <div className="bg-white/60 p-8 rounded-[3rem] shadow-inner border-2 border-white max-w-sm mx-auto my-6">
                    <p className="text-purple-600 font-bold text-lg mb-2">Your Score</p>
                    <p className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                      {score}<span className="text-3xl text-purple-300">/{quizData.length}</span>
                    </p>
                  </div>
                  
                  <div className="mb-8">
                    <p className="text-slate-600 font-medium text-lg">You earned the title:</p>
                    <p className="text-3xl font-extrabold text-teal-600 mt-1">{getRewardTitle()}</p>
                  </div>

                  <button 
                    onClick={startQuiz}
                    className="inline-flex items-center justify-center px-10 py-5 font-extrabold text-pink-600 bg-white border-4 border-pink-200 transition-all duration-200 rounded-full hover:bg-pink-50 hover:scale-105"
                  >
                    <RotateCcw className="mr-2 w-5 h-5" /> Play Again
                  </button>
                </div>
              )}

              {/* Decorative background blurs inside the card */}
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// Icon Helpers
function BookOpenIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  );
}

function GamepadIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" x2="10" y1="12" y2="12"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="15" x2="15.01" y1="13" y2="13"/><line x1="18" x2="18.01" y1="11" y2="11"/><rect width="20" height="12" x="2" y="6" rx="2"/>
    </svg>
  );
}

