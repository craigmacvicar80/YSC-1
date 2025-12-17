import React, { useState, useEffect } from 'react';
import { HelpCircle, Trophy, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import { MEDLE_CASES } from '../data/medleCases'; 
import { useAuth } from '../context/AuthContext'; // 1. Import Auth

// --- DAILY ROTATION LOGIC ---
const getDailyCase = () => {
  if (!MEDLE_CASES || MEDLE_CASES.length === 0) return null;

  const startDate = new Date('2024-01-01').getTime();
  const today = new Date().getTime();
  const oneDay = 24 * 60 * 60 * 1000;
  
  const daysPassed = Math.floor((today - startDate) / oneDay);
  const index = daysPassed % MEDLE_CASES.length;
  
  return {
    data: MEDLE_CASES[index],
    dayIndex: daysPassed
  };
};

export default function Medle() {
  const { currentUser } = useAuth(); // 2. Get Current User
  
  // --- STATE ---
  const [dailyData, setDailyData] = useState(null);
  const [cluesRevealed, setCluesRevealed] = useState(1);
  const [gameState, setGameState] = useState('playing'); 
  const [userGuess, setUserGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showInput, setShowInput] = useState(false);
  
  // Stats State
  const [stats, setStats] = useState({ streak: 0, wins: 0, lastPlayedIndex: -1 });

  // --- INITIALIZATION ---
  useEffect(() => {
    if (!currentUser) return; // Wait for user to load

    const daily = getDailyCase();
    if (!daily) return;

    setDailyData(daily);

    // 3. CREATE UNIQUE STORAGE KEYS BASED ON USER ID
    const STATE_KEY = `medle_state_${currentUser.uid}`;
    const STATS_KEY = `medle_stats_${currentUser.uid}`;

    // Load Stats
    const savedStats = JSON.parse(localStorage.getItem(STATS_KEY)) || { streak: 0, wins: 0, lastPlayedIndex: -1 };
    setStats(savedStats);

    // Load Game Progress
    const savedState = JSON.parse(localStorage.getItem(STATE_KEY));

    // Check if save file belongs to TODAY'S puzzle
    if (savedState && savedState.dayIndex === daily.dayIndex) {
      setCluesRevealed(savedState.cluesRevealed);
      setGameState(savedState.gameState);
    } else {
      // New Day: Reset board
      setCluesRevealed(1);
      setGameState('playing');
      // Note: We don't clear stats, just the daily board
    }
  }, [currentUser]); // Run whenever user changes

  // --- SAVE STATE ON CHANGE ---
  useEffect(() => {
    if (!dailyData || !currentUser) return;

    const STATE_KEY = `medle_state_${currentUser.uid}`;
    
    localStorage.setItem(STATE_KEY, JSON.stringify({
      dayIndex: dailyData.dayIndex,
      cluesRevealed,
      gameState
    }));
  }, [cluesRevealed, gameState, dailyData, currentUser]);

  // --- HANDLERS ---
  const handleGetClue = () => {
    if (cluesRevealed < dailyData.data.Max_Clues) {
      setCluesRevealed(prev => prev + 1);
      setShowInput(false); 
      setFeedback('');
    }
  };

  const updateStats = (isWin) => {
    const STATS_KEY = `medle_stats_${currentUser.uid}`;
    
    // Prevent double counting if they reload page after winning
    if (stats.lastPlayedIndex === dailyData.dayIndex) return;

    const newStats = {
      streak: isWin ? stats.streak + 1 : 0,
      wins: isWin ? stats.wins + 1 : stats.wins,
      lastPlayedIndex: dailyData.dayIndex
    };

    setStats(newStats);
    localStorage.setItem(STATS_KEY, JSON.stringify(newStats));
  };

  const checkGuess = () => {
    if (!userGuess.trim()) return;

    const currentCase = dailyData.data;
    const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
    const guess = normalize(userGuess);
    
    const keywords = currentCase.Keywords.map(k => normalize(k));
    const matchCount = keywords.filter(k => guess.includes(k)).length;

    if (matchCount >= 2) {
      setGameState('won');
      setFeedback('');
      updateStats(true);
    } else {
      if (cluesRevealed < currentCase.Max_Clues) {
        setFeedback("Incorrect. Try getting another clue.");
      } else {
        setGameState('lost');
        updateStats(false);
      }
    }
  };

  if (!dailyData) return <div className="p-10 text-center">Loading Daily Case...</div>;

  const activeCase = dailyData.data;
  const isGameOver = gameState !== 'playing';

  return (
    <div className="min-h-screen bg-slate-50 p-4 flex flex-col items-center">
      
      {/* HEADER */}
      <div className="text-center mb-8 w-full max-w-lg flex justify-between items-end border-b border-slate-200 pb-4">
        <div className="text-left">
            <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">MEDLE</h1>
            <p className="text-slate-500 text-xs font-bold">Daily Challenge</p>
        </div>
        <div className="text-right">
            <div className="text-xs text-slate-400 uppercase font-bold">Streak</div>
            <div className="text-2xl font-bold text-emerald-600">{stats.streak} 🔥</div>
        </div>
      </div>

      {/* GAME CONTAINER */}
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        
        {/* CASE FILE HEADER */}
        <div className="bg-slate-100 p-4 border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Layers size={20} className="text-slate-500" />
            <span className="font-bold text-slate-700">Case #{dailyData.dayIndex + 1}</span>
          </div>
          <span className="text-xs font-bold bg-slate-200 text-slate-600 px-2 py-1 rounded">
            Clue {cluesRevealed}/{activeCase.Max_Clues}
          </span>
        </div>

        {/* CLUES LIST */}
        <div className="p-6 space-y-4 min-h-[200px]">
          {Array.from({ length: cluesRevealed }).map((_, i) => {
            const clueNum = i + 1;
            const clueKey = `Clue_${clueNum}`;
            const isLast = clueNum === cluesRevealed;
            
            return (
              <div 
                key={clueNum} 
                className={`p-3 rounded-lg border-l-4 text-sm transition-all duration-500 ${
                  isLast ? 'border-blue-500 bg-blue-50 text-slate-800 font-medium scale-100' : 'border-slate-300 text-slate-500 opacity-70'
                }`}
              >
                <span className="text-xs font-bold uppercase block mb-1 opacity-50">Clue {clueNum}</span>
                {activeCase[clueKey]}
              </div>
            );
          })}

          {/* RESULTS CARD */}
          {isGameOver && (
            <div className={`mt-6 p-5 rounded-xl text-center animate-in fade-in zoom-in duration-300 ${gameState === 'won' ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex justify-center mb-2">
                {gameState === 'won' ? <Trophy size={40} className="text-emerald-500" /> : <AlertCircle size={40} className="text-red-500" />}
              </div>
              <h2 className={`text-2xl font-bold mb-1 ${gameState === 'won' ? 'text-emerald-700' : 'text-red-700'}`}>
                {gameState === 'won' ? 'Diagnosis Correct!' : 'Diagnosis Failed'}
              </h2>
              <p className="text-slate-600 mb-4 text-sm">
                {gameState === 'won' ? `You solved it in ${cluesRevealed} clues.` : 'Better luck tomorrow.'}
              </p>
              
              <div className="bg-white p-3 rounded border border-slate-200 text-left">
                <p className="text-xs text-slate-400 uppercase font-bold">Answer</p>
                <p className="text-lg font-bold text-slate-800">{activeCase["Correct Diagnosis"]}</p>
                <p className="text-xs text-blue-600 font-bold mt-1">{activeCase.Specialty}</p>
                <div className="mt-2 text-xs text-slate-500 border-t pt-2">
                  <strong>Summary:</strong> {activeCase.Summary}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CONTROLS */}
        {!isGameOver && (
          <div className="p-4 bg-slate-50 border-t border-slate-200">
            {feedback && <p className="text-center text-red-500 text-sm font-bold mb-3 animate-pulse">{feedback}</p>}

            {!showInput ? (
              <div className="flex gap-3">
                <button 
                  onClick={handleGetClue}
                  disabled={cluesRevealed >= activeCase.Max_Clues}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cluesRevealed >= activeCase.Max_Clues ? "No More Clues" : `Get Clue ${cluesRevealed + 1}`}
                </button>
                <button 
                  onClick={() => setShowInput(true)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-bold transition"
                >
                  Make Diagnosis
                </button>
              </div>
            ) : (
              <div className="animate-in slide-in-from-bottom-2 duration-200">
                <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">Enter Diagnosis</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={userGuess}
                    onChange={(e) => setUserGuess(e.target.value)}
                    placeholder="e.g. Appendicitis"
                    className="flex-1 border-2 border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-emerald-500 transition"
                    onKeyDown={(e) => e.key === 'Enter' && checkGuess()}
                    autoFocus
                  />
                  <button 
                    onClick={checkGuess}
                    className="bg-emerald-600 text-white px-4 rounded-lg font-bold hover:bg-emerald-700"
                  >
                    Submit
                  </button>
                </div>
                <button onClick={() => setShowInput(false)} className="text-xs text-slate-400 mt-2 hover:text-slate-600 underline">
                  Cancel & Get More Clues
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="mt-8 text-center text-slate-400 text-xs">
        <p>Next case available tomorrow at midnight.</p>
        <button 
          onClick={() => { 
              // Debug reset specific to user
              localStorage.removeItem(`medle_state_${currentUser?.uid}`); 
              window.location.reload(); 
          }}
          className="mt-2 text-slate-300 hover:text-slate-500 flex items-center gap-1 mx-auto"
        >
          <RefreshCw size={12} /> Reset My Progress (Debug)
        </button>
      </div>

    </div>
  );
}