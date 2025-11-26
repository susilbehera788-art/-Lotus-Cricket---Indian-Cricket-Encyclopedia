import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Menu, X, Phone, Mail, MapPin, ExternalLink, Trophy, Users, History, AlertTriangle, Building2, Home as HomeIcon, Gamepad2, Dice5, Disc, Target, Box, Grid3X3, Star, HelpCircle, Footprints, Shield, PlayCircle, ArrowDown, ChevronRight, Dna, BarChart3, Newspaper, User, Search, Filter, Award } from 'lucide-react';
import AdPlaceholder from './components/AdPlaceholder';
import AIContentCard from './components/AIContentCard';

// --- DATA ---

const PLAYERS_DB = {
  legends: [
    { name: "Sachin Tendulkar", role: "Right-hand Bat", imgColor: "bg-blue-600" },
    { name: "MS Dhoni", role: "Wicketkeeper Bat", imgColor: "bg-yellow-500" },
    { name: "Virat Kohli", role: "Right-hand Bat", imgColor: "bg-red-600" },
    { name: "Kapil Dev", role: "All-rounder", imgColor: "bg-orange-600" },
    { name: "Sunil Gavaskar", role: "Right-hand Bat", imgColor: "bg-indigo-600" },
    { name: "Rahul Dravid", role: "Right-hand Bat", imgColor: "bg-slate-600" },
    { name: "Sourav Ganguly", role: "Left-hand Bat", imgColor: "bg-blue-800" },
    { name: "Anil Kumble", role: "Leg Spinner", imgColor: "bg-cyan-700" },
    { name: "Virender Sehwag", role: "Right-hand Bat", imgColor: "bg-orange-500" },
    { name: "Yuvraj Singh", role: "All-rounder", imgColor: "bg-purple-600" },
    { name: "Zaheer Khan", role: "Left-arm Fast", imgColor: "bg-teal-700" },
    { name: "Mithali Raj", role: "Right-hand Bat", imgColor: "bg-pink-600" },
    { name: "Jhulan Goswami", role: "Right-arm Fast", imgColor: "bg-emerald-600" },
  ],
  men: [
    { name: "Rohit Sharma", role: "Captain / Batter", imgColor: "bg-blue-500" },
    { name: "Jasprit Bumrah", role: "Fast Bowler", imgColor: "bg-blue-700" },
    { name: "Ravindra Jadeja", role: "All-rounder", imgColor: "bg-yellow-600" },
    { name: "Hardik Pandya", role: "All-rounder", imgColor: "bg-indigo-500" },
    { name: "Shubman Gill", role: "Batter", imgColor: "bg-sky-500" },
    { name: "Rishabh Pant", role: "Wicketkeeper", imgColor: "bg-red-500" },
    { name: "Mohammed Shami", role: "Fast Bowler", imgColor: "bg-purple-700" },
    { name: "KL Rahul", role: "Batter", imgColor: "bg-slate-500" },
    { name: "Yashasvi Jaiswal", role: "Batter", imgColor: "bg-pink-500" },
    { name: "Mohammed Siraj", role: "Fast Bowler", imgColor: "bg-blue-800" },
    { name: "R Ashwin", role: "Spinner", imgColor: "bg-orange-400" },
    { name: "Suryakumar Yadav", role: "Batter", imgColor: "bg-cyan-600" },
  ],
  women: [
    { name: "Harmanpreet Kaur", role: "Captain / All-rounder", imgColor: "bg-blue-600" },
    { name: "Smriti Mandhana", role: "Left-hand Bat", imgColor: "bg-pink-500" },
    { name: "Jemimah Rodrigues", role: "Batter", imgColor: "bg-purple-500" },
    { name: "Shafali Verma", role: "Batter", imgColor: "bg-orange-500" },
    { name: "Deepti Sharma", role: "All-rounder", imgColor: "bg-teal-600" },
    { name: "Renuka Singh", role: "Fast Bowler", imgColor: "bg-blue-400" },
    { name: "Richa Ghosh", role: "Wicketkeeper", imgColor: "bg-red-400" },
    { name: "Pooja Vastrakar", role: "All-rounder", imgColor: "bg-indigo-600" },
  ]
};

// --- GAMES COMPONENTS ---

const LudoClassic: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  // pawnPosition is the index in the playerPath array. -1 means in base.
  const [pawnPosition, setPawnPosition] = useState(-1); 
  const [message, setMessage] = useState("Roll 6 to start!");
  const [lastRoll, setLastRoll] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);

  // Coordinate path for Blue Player (Bottom-Left Base)
  // Coordinates are [row, col] on a 15x15 grid (0-14)
  const playerPath = [
    [13, 6], [12, 6], [11, 6], [10, 6], [9, 6],  // Up bottom-left track
    [8, 5], [8, 4], [8, 3], [8, 2], [8, 1], [8, 0], // Left arm bottom row
    [7, 0], [6, 0], // Turn Up, then Right
    [6, 1], [6, 2], [6, 3], [6, 4], [6, 5], // Left arm top row
    [5, 6], [4, 6], [3, 6], [2, 6], [1, 6], [0, 6], // Top arm left col
    [0, 7], [0, 8], // Turn Right, then Down
    [1, 8], [2, 8], [3, 8], [4, 8], [5, 8], // Top arm right col
    [6, 9], [6, 10], [6, 11], [6, 12], [6, 13], [6, 14], // Right arm top row
    [7, 14], [8, 14], // Turn Down, then Left
    [8, 13], [8, 12], [8, 11], [8, 10], [8, 9], // Right arm bottom row
    [9, 8], [10, 8], [11, 8], [12, 8], [13, 8], [14, 8], // Bottom arm right col
    [14, 7], // Turn Left (Start of Home Run)
    [13, 7], [12, 7], [11, 7], [10, 7], [9, 7], // Home Run (Up)
    [7, 7] // WIN (Center)
  ];

  const rollDice = () => {
    if (isRolling) return;
    setIsRolling(true);
    setMessage("Rolling...");
    
    let counter = 0;
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      counter++;
      if (counter > 10) {
        clearInterval(interval);
        const finalRoll = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalRoll);
        setLastRoll(finalRoll);
        setIsRolling(false);
        handleMove(finalRoll);
      }
    }, 80);
  };

  const handleMove = (roll: number) => {
    // Logic for Blue Player
    if (pawnPosition === -1) {
      if (roll === 6) {
        setMessage("Opened! Moving to start.");
        setTimeout(() => setPawnPosition(0), 500); // Move to start of path
      } else {
        setMessage("Need a 6 to open. Try again.");
      }
    } else {
      const nextPos = pawnPosition + roll;
      if (nextPos >= playerPath.length) {
        setMessage("Move not possible. Wait for next turn.");
      } else if (nextPos === playerPath.length - 1) {
        setPawnPosition(nextPos);
        setMessage("🏆 WINNER! 🏆");
      } else {
        setMessage(`Moving ${roll} steps...`);
        // Animate step by step (simplified to jump for now)
        setTimeout(() => setPawnPosition(nextPos), 500);
      }
    }
  };

  // Safe spots (Stars) coordinates [row, col]
  const safeSpots = [
    [8, 2], [6, 12], [2, 6], [12, 8], // Standard stars
    [13, 6], [6, 1], [1, 8], [8, 13]  // Start points often safe
  ];

  const isSafeSpot = (r: number, c: number) => {
    return safeSpots.some(([sr, sc]) => sr === r && sc === c);
  };

  const getCellClass = (r: number, c: number) => {
    // Base Areas (4 Corners)
    if (r < 6 && c < 6) return 'bg-red-500 border-2 border-red-700'; // Red Base
    if (r < 6 && c > 8) return 'bg-green-500 border-2 border-green-700'; // Green Base
    if (r > 8 && c < 6) return 'bg-blue-500 border-2 border-blue-700'; // Blue Base
    if (r > 8 && c > 8) return 'bg-yellow-400 border-2 border-yellow-600'; // Yellow Base

    // Center
    if (r >= 6 && r <= 8 && c >= 6 && c <= 8) return 'bg-white'; 

    // Home Runs
    if (r === 7 && c >= 1 && c <= 5) return 'bg-red-500';
    if (c === 7 && r >= 1 && r <= 5) return 'bg-green-500';
    if (r === 7 && c >= 9 && c <= 13) return 'bg-yellow-400';
    if (c === 7 && r >= 9 && r <= 13) return 'bg-blue-500';

    // Tracks (White)
    return 'bg-white border-[0.5px] border-gray-300 relative';
  };

  const renderCellContent = (r: number, c: number) => {
    // Render Base Inner Circles
    if (r === 2 && c === 2) return <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border-4 border-red-500 shadow-inner"><div className="w-8 h-8 rounded-full bg-red-200 opacity-50"></div></div>;
    if (r === 2 && c === 12) return <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border-4 border-green-500 shadow-inner"><div className="w-8 h-8 rounded-full bg-green-200 opacity-50"></div></div>;
    if (r === 12 && c === 2) {
       // Blue Home Base Slot
       return (
         <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border-4 border-blue-500 shadow-inner relative">
            {pawnPosition === -1 && (
               <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-white shadow-lg animate-bounce absolute"></div>
            )}
            {pawnPosition !== -1 && <div className="w-8 h-8 rounded-full bg-blue-100 opacity-50"></div>}
         </div>
       );
    }
    if (r === 12 && c === 12) return <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border-4 border-yellow-400 shadow-inner"><div className="w-8 h-8 rounded-full bg-yellow-100 opacity-50"></div></div>;

    // Render Center Triangle
    if (r === 7 && c === 7) return <div className="w-full h-full bg-white flex items-center justify-center text-[8px] md:text-xs font-bold text-gray-400 z-10 shadow-sm">HOME</div>;
    if (r >= 6 && r <= 8 && c >= 6 && c <= 8) {
       if (r===6 && c===7) return null; 
       if (r===7 && c===6) return <div className="w-full h-full bg-red-500" style={{clipPath: 'polygon(0 0, 100% 50%, 0 100%)'}}></div>
       if (r===6 && c===7) return <div className="w-full h-full bg-green-500" style={{clipPath: 'polygon(0 0, 100% 0, 50% 100%)'}}></div>
       if (r===7 && c===8) return <div className="w-full h-full bg-yellow-400" style={{clipPath: 'polygon(0 50%, 100% 0, 100% 100%)'}}></div>
       if (r===8 && c===7) return <div className="w-full h-full bg-blue-500" style={{clipPath: 'polygon(0 0, 100% 0, 50% 100%)', transform: 'rotate(180deg)'}}></div>
    }

    // Render Star
    if (isSafeSpot(r, c)) {
       return <Star size={14} className="text-gray-300 absolute top-0.5 left-0.5" fill="#d1d5db" />;
    }

    // Render Player Pawn
    if (pawnPosition >= 0) {
      const [pr, pc] = playerPath[pawnPosition];
      if (pr === r && pc === c) {
        return (
          <div className="w-5 h-5 md:w-7 md:h-7 bg-blue-600 rounded-full border-2 border-white shadow-xl z-30 relative flex items-center justify-center transform transition-all duration-300">
             <div className="w-1.5 h-1.5 bg-white rounded-full opacity-70"></div>
          </div>
        );
      }
    }
    
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-2 md:p-4 font-sans relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200/30 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Bar */}
      <div className="w-full max-w-xl flex justify-between items-center mb-6 px-2 z-10">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-bold bg-white px-4 py-2 rounded-full shadow-sm border hover:bg-gray-50 transition">
           &larr; Exit
        </button>
        <div className="flex items-center gap-2">
           <h2 className="text-2xl font-black text-blue-900 tracking-tight drop-shadow-sm">LUDO CLASSIC</h2>
        </div>
        <button onClick={() => setShowTutorial(true)} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-bold bg-white px-4 py-2 rounded-full shadow-sm border hover:bg-blue-50 transition">
           <HelpCircle size={20} /> <span className="hidden sm:inline">How to Play</span>
        </button>
      </div>

      {/* Tutorial Overlay */}
      {showTutorial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 rounded-[2.5rem] shadow-2xl max-w-sm w-full overflow-hidden relative border-[6px] border-white/20 ring-4 ring-black/10 flex flex-col max-h-[90vh]">
              
              <button 
                onClick={() => setShowTutorial(false)} 
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-md transition z-20"
              >
                <X size={20} strokeWidth={3} />
              </button>

              {/* Header */}
              <div className="text-center pt-8 pb-4 relative z-10 shrink-0">
                 <h2 className="text-3xl font-black text-white tracking-wider drop-shadow-lg font-game">HOW TO PLAY</h2>
                 <p className="text-blue-100 text-sm font-medium opacity-90 tracking-wide mt-1">Master the board in 4 steps!</p>
              </div>

              {/* Steps Body */}
              <div className="px-6 pb-4 space-y-3 overflow-y-auto hide-scrollbar relative z-10">
                 
                 {/* Step 1: Roll Dice */}
                 <div className="bg-white rounded-2xl p-3 flex items-center gap-4 shadow-xl border-b-4 border-gray-100 transform hover:scale-[1.02] transition-transform">
                    <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white shadow-lg rotate-3 border-2 border-red-200">
                       <Dice5 size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                       <h3 className="font-extrabold text-gray-800 text-base uppercase tracking-tight">1. Roll the Dice</h3>
                       <p className="text-gray-600 text-xs font-semibold mt-0.5">
                         You need a <span className="text-red-600 font-black">6</span> to start!
                       </p>
                    </div>
                 </div>

                 {/* Connector Arrow */}
                 <div className="flex justify-center -my-2 opacity-60">
                    <ArrowDown className="text-white drop-shadow-md" size={20} strokeWidth={3} />
                 </div>

                 {/* Step 2: Move Token */}
                 <div className="bg-white rounded-2xl p-3 flex items-center gap-4 shadow-xl border-b-4 border-gray-100 transform hover:scale-[1.02] transition-transform">
                    <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white shadow-lg -rotate-2 border-2 border-blue-200">
                       <Footprints size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                       <h3 className="font-extrabold text-gray-800 text-base uppercase tracking-tight">2. Move Your Token</h3>
                       <p className="text-gray-600 text-xs font-semibold mt-0.5">
                         Follow the path & arrows.
                       </p>
                    </div>
                 </div>

                 <div className="flex justify-center -my-2 opacity-60">
                    <ArrowDown className="text-white drop-shadow-md" size={20} strokeWidth={3} />
                 </div>

                 {/* Step 3: Enter Safe Zone */}
                 <div className="bg-white rounded-2xl p-3 flex items-center gap-4 shadow-xl border-b-4 border-gray-100 transform hover:scale-[1.02] transition-transform">
                    <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-white shadow-lg rotate-2 border-2 border-amber-200">
                       <Shield size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                       <h3 className="font-extrabold text-gray-800 text-base uppercase tracking-tight">3. Enter Safe Zone</h3>
                       <p className="text-gray-600 text-xs font-semibold mt-0.5">
                         Land on <Star size={10} className="inline text-amber-500 fill-amber-500" /> to stay safe!
                       </p>
                    </div>
                 </div>

                 <div className="flex justify-center -my-2 opacity-60">
                    <ArrowDown className="text-white drop-shadow-md" size={20} strokeWidth={3} />
                 </div>

                 {/* Step 4: Reach Home */}
                 <div className="bg-white rounded-2xl p-3 flex items-center gap-4 shadow-xl border-b-4 border-gray-100 transform hover:scale-[1.02] transition-transform">
                    <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white shadow-lg -rotate-1 border-2 border-green-200">
                       <Trophy size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                       <h3 className="font-extrabold text-gray-800 text-base uppercase tracking-tight">4. Reach Home</h3>
                       <p className="text-gray-600 text-xs font-semibold mt-0.5">
                         Get to the center triangle to win.
                       </p>
                    </div>
                 </div>

              </div>

              {/* Footer Action */}
              <div className="p-5 pt-4 bg-transparent flex justify-center pb-8 z-10 shrink-0">
                 <button 
                   onClick={() => setShowTutorial(false)} 
                   className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-black text-xl py-3 px-6 rounded-2xl shadow-[0_4px_0_rgb(180,83,9)] hover:shadow-[0_2px_0_rgb(180,83,9)] hover:translate-y-[2px] transition-all flex items-center justify-center gap-2 uppercase tracking-wider active:scale-95"
                 >
                    <PlayCircle size={24} fill="white" className="text-orange-600" /> Play Now
                 </button>
              </div>
              
              {/* Background Decoration */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                  <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-white/10 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-purple-500/20 rounded-full blur-3xl"></div>
              </div>

           </div>
        </div>
      )}

      {/* Game Board Container */}
      <div className="bg-white p-2 md:p-3 rounded-2xl shadow-2xl border-4 border-white ring-4 ring-blue-100 relative z-0">
        <div 
          className="grid grid-cols-15 grid-rows-15 bg-gray-900 gap-[1px] border-2 border-gray-900 rounded-lg overflow-hidden"
          style={{ 
            width: 'min(90vw, 500px)', 
            height: 'min(90vw, 500px)',
            gridTemplateColumns: 'repeat(15, 1fr)',
            gridTemplateRows: 'repeat(15, 1fr)'
          }}
        >
          {Array.from({ length: 225 }).map((_, i) => {
            const r = Math.floor(i / 15);
            const c = i % 15;
            return (
              <div 
                key={i} 
                className={`w-full h-full flex items-center justify-center overflow-hidden ${getCellClass(r, c)}`}
              >
                {renderCellContent(r, c)}
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 flex flex-col items-center gap-4 w-full max-w-md z-10">
         <div className="text-lg font-bold text-blue-800 bg-white/90 backdrop-blur px-8 py-3 rounded-2xl shadow-sm border border-white w-full text-center">
            {message}
         </div>
         
         <div className="flex items-center gap-6 justify-center w-full">
            <div className="relative group cursor-pointer" onClick={rollDice}>
               <div className={`w-20 h-20 bg-gradient-to-br from-white to-gray-100 rounded-2xl border-4 border-white flex items-center justify-center shadow-xl text-5xl text-gray-800 transition-all duration-300 ${isRolling ? 'animate-spin' : 'group-hover:scale-105 group-hover:-rotate-3'}`}>
                  {/* Unicode Dice Faces */}
                  {diceValue === 1 && '⚀'}
                  {diceValue === 2 && '⚁'}
                  {diceValue === 3 && '⚂'}
                  {diceValue === 4 && '⚃'}
                  {diceValue === 5 && '⚄'}
                  {diceValue === 6 && '⚅'}
               </div>
               {/* Tap hint */}
               {!isRolling && pawnPosition === -1 && diceValue !== 6 && (
                 <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-blue-600 bg-white px-2 py-1 rounded-full shadow animate-bounce whitespace-nowrap">
                   Tap Me!
                 </div>
               )}
            </div>
            
            <button 
              onClick={rollDice} 
              disabled={isRolling || (pawnPosition === playerPath.length - 1)}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transform transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-xl tracking-wider border-b-4 border-blue-900 flex items-center justify-center gap-2"
            >
              {pawnPosition === playerPath.length - 1 ? 'GAME OVER' : 'ROLL DICE'}
            </button>
         </div>
         
         {pawnPosition === playerPath.length - 1 && (
            <button 
              onClick={() => { setPawnPosition(-1); setMessage("Roll 6 to start!"); }} 
              className="text-sm font-semibold text-blue-700 bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition mt-2"
            >
              Play Again
            </button>
         )}
      </div>

      <div className="mt-4 w-full max-w-md opacity-90 hover:opacity-100 transition z-10">
         <AdPlaceholder size="leaderboard" className="scale-90 origin-center" />
      </div>
    </div>
  );
};

const SpinGo: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [slots, setSlots] = useState(['🏏', '🏏', '🏏']);
  const [spinning, setSpinning] = useState(false);
  const [message, setMessage] = useState('Spin to Win!');
  const [score, setScore] = useState(0);

  const symbols = ['🏏', '⚾', '🏆', '🧤'];

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setMessage('Spinning...');
    let count = 0;
    const interval = setInterval(() => {
      setSlots([
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
      ]);
      count++;
      if (count > 20) {
        clearInterval(interval);
        const finalSlots = [
          symbols[Math.floor(Math.random() * symbols.length)],
          symbols[Math.floor(Math.random() * symbols.length)],
          symbols[Math.floor(Math.random() * symbols.length)]
        ];
        setSlots(finalSlots);
        setSpinning(false);
        checkWin(finalSlots);
      }
    }, 100);
  };

  const checkWin = (currentSlots: string[]) => {
    if (currentSlots[0] === currentSlots[1] && currentSlots[1] === currentSlots[2]) {
      setMessage('JACKPOT! +50 Points');
      setScore(s => s + 50);
    } else if (currentSlots[0] === currentSlots[1] || currentSlots[1] === currentSlots[2] || currentSlots[0] === currentSlots[2]) {
      setMessage('Two of a kind! +10 Points');
      setScore(s => s + 10);
    } else {
      setMessage('Try Again!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full mx-auto text-center border-t-4 border-india-blue relative">
        <button onClick={onBack} className="absolute top-2 left-2 p-2 text-gray-400 hover:text-gray-600">&larr; Back</button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-center gap-2"><Dice5 className="text-india-orange" /> SpinGo Cricket</h2>
        
        <div className="flex justify-center gap-4 mb-8">
          {slots.map((s, i) => (
            <div key={i} className="w-20 h-24 bg-gray-100 border-2 border-gray-300 rounded-lg flex items-center justify-center text-4xl shadow-inner animate-pulse">
              {s}
            </div>
          ))}
        </div>

        <div className="mb-6 h-8 text-lg font-semibold text-india-blue">{message}</div>
        <div className="mb-6 text-gray-600">Score: <span className="font-bold text-black">{score}</span></div>

        <div className="flex gap-4 justify-center">
          <button 
            onClick={spin} 
            disabled={spinning}
            className="w-full bg-india-orange text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-orange-600 disabled:opacity-50 transition transform hover:scale-105"
          >
            {spinning ? 'Spinning...' : 'SPIN NOW'}
          </button>
        </div>
      </div>
    </div>
  );
};

const WinWheel: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [prize, setPrize] = useState('Spin to find your Cricketer!');

  const segments = [
    'Sachin Tendulkar 🏏', 
    'Virat Kohli 👑', 
    'MS Dhoni 🚁', 
    'Rohit Sharma ⚡', 
    'Kapil Dev 🏆', 
    'Sunil Gavaskar 🛡️', 
    'Jasprit Bumrah 🎯', 
    'Rahul Dravid 🧱'
  ];

  const spinWheel = () => {
    if (spinning) return;
    setSpinning(true);
    setPrize('Who will it be? ...');
    
    // Random rotation between 720 and 1440 degrees (2 to 4 full spins) plus segment offset
    const spins = Math.floor(Math.random() * 5) + 5; 
    const randomDegree = Math.floor(Math.random() * 360);
    const totalRotation = rotation + (spins * 360) + randomDegree;
    
    setRotation(totalRotation);

    setTimeout(() => {
        setSpinning(false);
        const resultIndex = Math.floor(Math.random() * segments.length);
        setPrize(`You got: ${segments[resultIndex]}!`);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-indigo-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md text-center relative overflow-hidden">
        <button onClick={onBack} className="absolute top-4 left-4 z-10 bg-gray-100 p-2 rounded-full hover:bg-gray-200"><X size={16}/></button>
        <h2 className="text-2xl font-black text-indigo-900 mb-2">CRICKET WHEEL</h2>
        <p className="text-sm text-gray-500 mb-8">Discover your inner legend</p>
        
        <div className="relative w-64 h-64 mx-auto mb-8">
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20 w-8 h-8 text-red-500">
             <div className="w-0 h-0 border-l-[10px] border-l-transparent border-t-[20px] border-t-red-600 border-r-[10px] border-r-transparent"></div>
          </div>
          
          {/* Wheel */}
          <div 
            className="w-full h-full rounded-full border-8 border-indigo-200 shadow-inner relative transition-transform duration-[3000ms] cubic-bezier(0.2, 0.8, 0.2, 1)"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
             {segments.map((seg, i) => (
                <div 
                  key={i} 
                  className="absolute w-full h-full top-0 left-0 flex justify-center pt-2 text-[10px] font-bold text-indigo-900"
                  style={{ transform: `rotate(${i * (360/segments.length)}deg)` }}
                >
                  <span className="mt-2">{i+1}</span>
                </div>
             ))}
             <div className="absolute inset-0 rounded-full border-[32px] border-transparent border-t-indigo-100 opacity-30"></div>
             <div className="absolute inset-0 rounded-full border-[32px] border-transparent border-r-blue-100 opacity-30 transform rotate-90"></div>
          </div>
          
          {/* Center Cap */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center font-bold text-indigo-600 z-10 border-4 border-indigo-50">
             LOTUS
          </div>
        </div>

        <div className="bg-indigo-50 p-4 rounded-lg mb-6">
           <p className="font-bold text-indigo-800 text-lg animate-pulse">{prize}</p>
        </div>

        <button 
          onClick={spinWheel} 
          disabled={spinning}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition transform active:scale-95 disabled:opacity-50"
        >
          {spinning ? 'SPINNING...' : 'SPIN WHEEL'}
        </button>
      </div>
    </div>
  );
};

// --- LAYOUT COMPONENTS ---

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/', icon: <HomeIcon size={20} /> },
    { label: 'Players', path: '/players', icon: <Users size={20} /> },
    { label: 'History', path: '/history', icon: <History size={20} /> },
    { label: 'Associations', path: '/associations', icon: <Building2 size={20} /> },
    { label: 'Games', path: '/games', icon: <Gamepad2 size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-india-blue rounded-full flex items-center justify-center">
                <Dna className="text-white w-5 h-5" />
             </div>
             <h1 className="text-xl font-bold tracking-tight text-gray-900">
               Lotus <span className="text-india-blue">Cricket</span>
             </h1>
          </div>

          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  location.pathname === item.path ? 'text-india-blue bg-blue-50 px-3 py-1.5 rounded-md' : 'text-gray-600 hover:text-india-blue'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-200 shadow-lg py-4 px-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  location.pathname === item.path ? 'bg-blue-50 text-india-blue' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4 mt-auto">
        <div className="max-w-7xl mx-auto text-center">
           <p className="mb-2">© 2024 Lotus Cricket. All rights reserved.</p>
           <div className="flex justify-center gap-4 text-sm">
              <a href="#" className="hover:text-white">Privacy</a>
              <a href="#" className="hover:text-white">Terms</a>
              <a href="#" className="hover:text-white">Contact</a>
           </div>
        </div>
      </footer>
    </div>
  );
};

const PlayersPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'legends' | 'men' | 'women'>('legends');
  const [searchQuery, setSearchQuery] = useState('');

  const getFilteredPlayers = (list: typeof PLAYERS_DB['legends']) => {
    if (!searchQuery) return list;
    return list.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.role.toLowerCase().includes(searchQuery.toLowerCase()));
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const renderPlayerGrid = (players: typeof PLAYERS_DB['legends']) => {
    if (players.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-gray-500">No players found matching "{searchQuery}"</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {players.map((player) => (
          <div 
            key={player.name}
            onClick={() => navigate(`/player/${encodeURIComponent(player.name)}`)}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer group overflow-hidden flex flex-col"
          >
            <div className={`h-24 ${player.imgColor} opacity-90 relative`}>
              {/* Decorative Circle */}
              <div className="absolute -bottom-6 left-6 w-16 h-16 bg-white rounded-full p-1 shadow-md z-10">
                 <div className={`w-full h-full rounded-full ${player.imgColor} flex items-center justify-center text-white font-bold text-lg`}>
                    {getInitials(player.name)}
                 </div>
              </div>
            </div>
            <div className="p-5 pt-8 flex-1 flex flex-col">
               <h3 className="text-lg font-bold text-gray-900 group-hover:text-india-blue transition-colors">{player.name}</h3>
               <p className="text-sm text-gray-500 font-medium mb-4">{player.role}</p>
               <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center text-sm">
                  <span className="text-gray-400">View Profile</span>
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                     <ChevronRight size={16} />
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Player Directory</h2>
          <p className="text-gray-500 mt-1">Explore the profiles of India's cricketing heroes.</p>
        </div>
        
        {/* Search */}
        <div className="relative w-full md:w-64">
           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
           </div>
           <input 
             type="text" 
             placeholder="Search players..." 
             className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-india-blue/20 focus:border-india-blue transition"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
           />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-100">
         <button 
           onClick={() => setActiveTab('legends')}
           className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'legends' ? 'bg-india-blue text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
         >
           <Award size={16} /> Legends
         </button>
         <button 
           onClick={() => setActiveTab('men')}
           className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'men' ? 'bg-india-blue text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
         >
           <User size={16} /> Men's Team
         </button>
         <button 
           onClick={() => setActiveTab('women')}
           className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'women' ? 'bg-india-blue text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
         >
           <User size={16} /> Women's Team
         </button>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
         {activeTab === 'legends' && renderPlayerGrid(getFilteredPlayers(PLAYERS_DB.legends))}
         {activeTab === 'men' && renderPlayerGrid(getFilteredPlayers(PLAYERS_DB.men))}
         {activeTab === 'women' && renderPlayerGrid(getFilteredPlayers(PLAYERS_DB.women))}
      </div>
      
      <AdPlaceholder size="leaderboard" />
    </div>
  );
};

const PlayerProfile: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'news'>('overview');
  const decodedName = decodeURIComponent(name || 'Unknown Player');

  // Generate a consistent color based on name length for avatar
  const getAvatarColor = (name: string) => {
    const colors = ['bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-orange-600', 'bg-pink-600', 'bg-teal-600'];
    return colors[name.length % colors.length];
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 relative">
        <div className="h-40 bg-gradient-to-r from-gray-900 to-gray-800 relative">
           <div className="absolute inset-0 bg-pattern opacity-10"></div>
        </div>
        
        <div className="px-6 pb-6 relative">
          <div className="flex flex-col md:flex-row items-end -mt-16 mb-6 gap-6">
             {/* Photo Placeholder */}
             <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-2xl p-1.5 shadow-xl relative z-10 rotate-2">
                <div className={`w-full h-full rounded-xl ${getAvatarColor(decodedName)} flex flex-col items-center justify-center text-white shadow-inner`}>
                   <User size={48} className="mb-2 opacity-80" />
                   <span className="text-2xl font-black opacity-40 uppercase tracking-widest">{decodedName.substring(0, 3)}</span>
                </div>
                <div className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow text-india-blue">
                   <Target size={16} />
                </div>
             </div>
             
             <div className="flex-1 pb-2">
                <div className="flex flex-wrap gap-2 mb-2">
                   <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide">Team India</span>
                   <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide">Professional Cricketer</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">{decodedName}</h1>
             </div>

             <div className="hidden md:block pb-4">
                 <button onClick={() => window.history.back()} className="text-gray-500 hover:text-gray-900 font-medium text-sm">
                    &larr; Back to List
                 </button>
             </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-gray-100 overflow-x-auto hide-scrollbar">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'overview' ? 'border-india-orange text-india-orange' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              <User size={18} /> Overview
            </button>
            <button 
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'stats' ? 'border-india-orange text-india-orange' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              <BarChart3 size={18} /> Stats & Scores
            </button>
            <button 
              onClick={() => setActiveTab('news')}
              className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'news' ? 'border-india-orange text-india-orange' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              <Newspaper size={18} /> News & Media
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-2 fade-in duration-300">
             <div className="lg:col-span-2 space-y-6">
                <AIContentCard 
                  title="Biography"
                  prompt={`Write a comprehensive biography for Indian cricketer ${decodedName}. Include sections for Early Life, Domestic Career, and International Debut.`}
                />
                <AIContentCard 
                  title="Life Achievements"
                  prompt={`List the most significant life achievements and awards (like Arjuna Award, Khel Ratna, etc.) for ${decodedName}.`}
                  className="border-l-4 border-yellow-400"
                />
             </div>
             <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                   <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Trophy size={18} className="text-yellow-500"/> Key Highlights</h3>
                   <div className="space-y-3">
                      <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
                         Playing Role <br/> 
                         <span className="font-bold text-gray-900">International Cricketer</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
                         Country <br/> 
                         <span className="font-bold text-gray-900">India 🇮🇳</span>
                      </div>
                   </div>
                </div>
                <AdPlaceholder size="rectangle" />
             </div>
          </div>
        )}

        {activeTab === 'stats' && (
           <div className="space-y-6 animate-in slide-in-from-bottom-2 fade-in duration-300">
             <AIContentCard 
               title="Career Statistics & Scorecard"
               prompt={`Create a detailed statistical table for ${decodedName} (Cricket). Include columns for Matches, Innings, Runs, Wickets, Average, Strike Rate for Test, ODI, and T20I formats. Display it as a clear markdown table.`}
               className="overflow-x-auto"
             />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AIContentCard 
                   title="Batting Analysis"
                   prompt={`Provide a brief analysis of ${decodedName}'s batting style and strengths.`}
                />
                <AIContentCard 
                   title="Bowling Analysis"
                   prompt={`Provide a brief analysis of ${decodedName}'s bowling style (if applicable) or fielding contributions.`}
                />
             </div>
           </div>
        )}

        {activeTab === 'news' && (
           <div className="space-y-6 animate-in slide-in-from-bottom-2 fade-in duration-300">
              <AIContentCard 
                title="Latest Updates"
                prompt={`What is the latest news, recent match performance, and current status of cricketer ${decodedName}?`}
                useSearch={true}
                className="border-l-4 border-green-500"
              />
              <AIContentCard 
                title="Social Media Buzz"
                prompt={`What are fans saying about ${decodedName} recently on social media? Summarize the sentiment.`}
              />
           </div>
        )}
      </div>
    </div>
  );
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-india-blue to-blue-800 text-white p-8 md:p-12 shadow-xl">
         <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">The Heartbeat of <br/><span className="text-india-orange">Indian Cricket</span></h2>
            <p className="text-blue-100 text-lg mb-8 max-w-md">Live scores, historical archives, and interactive games for every cricket fan.</p>
            <div className="flex flex-wrap gap-4">
               <button onClick={() => navigate('/history')} className="bg-white text-india-blue font-bold px-6 py-3 rounded-full shadow-lg hover:bg-gray-100 transition">
                 Explore History
               </button>
               <button onClick={() => navigate('/games')} className="bg-india-orange text-white font-bold px-6 py-3 rounded-full shadow-lg hover:bg-orange-600 transition flex items-center gap-2">
                 <Gamepad2 size={20} /> Play Games
               </button>
            </div>
         </div>
         {/* Abstract BG Shapes */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
         <div className="absolute bottom-0 left-0 w-48 h-48 bg-india-orange opacity-10 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>
      </section>

      {/* Live AI Update */}
      <AIContentCard 
        title="Today's Cricket Pulse" 
        prompt="Give me a 3 bullet point summary of the most important cricket news involving India today. Keep it short and exciting."
        useSearch={true}
        className="border-l-4 border-india-orange"
      />

      {/* Featured Games Preview */}
      <section>
        <div className="flex justify-between items-end mb-6">
           <h3 className="text-2xl font-bold text-gray-900">Fan Zone Games</h3>
           <Link to="/games" className="text-india-blue font-semibold hover:underline flex items-center gap-1">View All <ChevronRight size={16} /></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div onClick={() => navigate('/ludo')} className="group cursor-pointer bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all border border-gray-100">
              <div className="h-32 bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                 <Dice5 size={48} className="text-white opacity-90 group-hover:scale-110 transition-transform" />
              </div>
              <div className="p-5">
                 <h4 className="font-bold text-lg mb-1">Ludo Classic</h4>
                 <p className="text-gray-500 text-sm">Roll the dice and race to home!</p>
              </div>
           </div>
           
           <div onClick={() => navigate('/spingo')} className="group cursor-pointer bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all border border-gray-100">
              <div className="h-32 bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                 <Target size={48} className="text-white opacity-90 group-hover:scale-110 transition-transform" />
              </div>
              <div className="p-5">
                 <h4 className="font-bold text-lg mb-1">SpinGo Cricket</h4>
                 <p className="text-gray-500 text-sm">Test your luck with cricket slots.</p>
              </div>
           </div>

           <div onClick={() => navigate('/wheel')} className="group cursor-pointer bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all border border-gray-100">
              <div className="h-32 bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                 <Disc size={48} className="text-white opacity-90 group-hover:scale-110 transition-transform" />
              </div>
              <div className="p-5">
                 <h4 className="font-bold text-lg mb-1">Win Wheel</h4>
                 <p className="text-gray-500 text-sm">Spin to reveal your cricket star.</p>
              </div>
           </div>
        </div>
      </section>

      <AdPlaceholder size="leaderboard" />
    </div>
  );
};

const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const legends = ['Sachin Tendulkar', 'Virat Kohli', 'MS Dhoni', 'Rohit Sharma', 'Kapil Dev', 'Rahul Dravid'];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <h2 className="text-3xl font-bold text-gray-900">Cricket History</h2>
      </div>

      <section>
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Trophy className="text-india-orange" size={20} /> Hall of Fame
        </h3>
        <p className="text-sm text-gray-500 mb-4">Click on a legend to view their detailed profile, statistics, and latest news.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
           {legends.map((player) => (
             <div 
               key={player}
               onClick={() => navigate(`/player/${encodeURIComponent(player)}`)}
               className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer text-center group"
             >
                <div className="w-16 h-16 bg-blue-50 rounded-full mx-auto mb-3 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                   <User size={24} />
                </div>
                <h4 className="font-bold text-sm text-gray-800">{player}</h4>
                <span className="text-xs text-india-blue font-medium mt-1 block opacity-0 group-hover:opacity-100 transition-opacity">View Profile</span>
             </div>
           ))}
        </div>
      </section>

      <AIContentCard 
         title="Historical Moments"
         prompt="Describe 3 distinct historical turning points in Indian Cricket history besides the 1983 and 2011 World Cup wins."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-xl mb-4 text-india-blue">1983 World Cup</h3>
            <p className="text-gray-600">The moment that changed Indian cricket forever. Kapil's Devils defeated the mighty West Indies at Lord's.</p>
         </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-xl mb-4 text-india-blue">2011 World Cup</h3>
            <p className="text-gray-600">"Dhoni finishes off in style!" India lifted the cup at home in Mumbai after 28 years.</p>
         </div>
      </div>
    </div>
  );
};

const AssociationsPage: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-gray-900">State Associations</h2>
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
       <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
             <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Association</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Headquarters</th>
             </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
             {[
               { name: 'Mumbai Cricket Association', state: 'Maharashtra', hq: 'Wankhede Stadium' },
               { name: 'Delhi & District Cricket Association', state: 'Delhi', hq: 'Arun Jaitley Stadium' },
               { name: 'Tamil Nadu Cricket Association', state: 'Tamil Nadu', hq: 'M. A. Chidambaram Stadium' },
               { name: 'Karnataka State Cricket Association', state: 'Karnataka', hq: 'M. Chinnaswamy Stadium' },
             ].map((assoc, idx) => (
                <tr key={idx}>
                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{assoc.name}</td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{assoc.state}</td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{assoc.hq}</td>
                </tr>
             ))}
          </tbody>
       </table>
    </div>
  </div>
);

// --- APP COMPONENT ---

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/players" element={<Layout><PlayersPage /></Layout>} />
        <Route path="/history" element={<Layout><HistoryPage /></Layout>} />
        <Route path="/associations" element={<Layout><AssociationsPage /></Layout>} />
        <Route path="/games" element={<Layout><HomePage /></Layout>} />
        
        {/* Dynamic Player Route */}
        <Route path="/player/:name" element={<Layout><PlayerProfile /></Layout>} />
        
        {/* Full Screen Game Routes */}
        <Route path="/ludo" element={<LudoClassic onBack={() => window.history.back()} />} />
        <Route path="/spingo" element={<SpinGo onBack={() => window.history.back()} />} />
        <Route path="/wheel" element={<WinWheel onBack={() => window.history.back()} />} />
        
        <Route path="*" element={<Layout><div className="p-10 text-center">Page Not Found</div></Layout>} />
      </Routes>
    </Router>
  );
};

export default App;