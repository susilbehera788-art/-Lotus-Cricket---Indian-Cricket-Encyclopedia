import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, MapPin, ExternalLink, Trophy, Users, History, AlertTriangle, Building2, Home as HomeIcon, Gamepad2, Dice5, Disc, Target, Box, Grid3X3, Star, HelpCircle, Footprints, Shield, PlayCircle } from 'lucide-react';
import AdPlaceholder from './components/AdPlaceholder';
import AIContentCard from './components/AIContentCard';

// --- GAMES COMPONENTS ---

const LudoClassic: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  // pawnPosition is the index in the playerPath array. -1 means in base.
  const [pawnPosition, setPawnPosition] = useState(-1); 
  const [message, setMessage] = useState("Roll 6 to start!");
  const [lastRoll, setLastRoll] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-2 md:p-4 font-sans">
      
      {/* Top Bar */}
      <div className="w-full max-w-xl flex justify-between items-center mb-6 px-2">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-bold bg-white px-4 py-2 rounded-full shadow-sm border hover:bg-gray-50 transition">
           &larr; Exit
        </button>
        <div className="flex items-center gap-2">
           <h2 className="text-2xl font-black text-blue-900 tracking-tight">LUDO CLASSIC</h2>
        </div>
        <button onClick={() => setShowTutorial(true)} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-bold bg-white px-4 py-2 rounded-full shadow-sm border hover:bg-blue-50 transition">
           <HelpCircle size={20} /> <span className="hidden sm:inline">How to Play</span>
        </button>
      </div>

      {/* Tutorial Overlay */}
      {showTutorial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white rounded-[2rem] shadow-2xl max-w-md w-full overflow-hidden relative border-4 border-white transform transition-all scale-100">
              
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center">
                 <h2 className="text-3xl font-black text-white tracking-wide uppercase drop-shadow-md">Game Guide</h2>
                 <p className="text-blue-100 text-sm mt-1">Master the board in 4 steps!</p>
                 <button 
                  onClick={() => setShowTutorial(false)} 
                  className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-md transition"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Steps Body */}
              <div className="p-6 space-y-4 bg-gray-50 max-h-[60vh] overflow-y-auto hide-scrollbar">
                 
                 {/* Step 1 */}
                 <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white shadow-lg rotate-3">
                       <Dice5 size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                       <h3 className="font-bold text-gray-800 text-lg">1. Roll the Dice</h3>
                       <p className="text-gray-500 text-sm leading-relaxed mt-1">
                         Tap the dice block. You need a <span className="font-bold text-red-500 bg-red-50 px-1 rounded">6</span> to unlock your pawn from the base!
                       </p>
                    </div>
                 </div>

                 {/* Step 2 */}
                 <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white shadow-lg -rotate-3">
                       <Footprints size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                       <h3 className="font-bold text-gray-800 text-lg">2. Move Token</h3>
                       <p className="text-gray-500 text-sm leading-relaxed mt-1">
                         Move clockwise along the path. Follow the arrow direction to circle the board.
                       </p>
                    </div>
                 </div>

                 {/* Step 3 */}
                 <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-white shadow-lg rotate-2">
                       <Shield size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                       <h3 className="font-bold text-gray-800 text-lg">3. Safe Zones</h3>
                       <p className="text-gray-500 text-sm leading-relaxed mt-1">
                         Land on <span className="font-bold text-amber-500 bg-amber-50 px-1 rounded">Stars</span> to stay safe. Opponents cannot cut your pawn here.
                       </p>
                    </div>
                 </div>

                 {/* Step 4 */}
                 <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white shadow-lg -rotate-1">
                       <Trophy size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                       <h3 className="font-bold text-gray-800 text-lg">4. Reach Home</h3>
                       <p className="text-gray-500 text-sm leading-relaxed mt-1">
                         Complete the full lap and enter the <span className="font-bold text-green-600">Home Triangle</span> to win!
                       </p>
                    </div>
                 </div>

              </div>

              {/* Footer Action */}
              <div className="p-5 bg-white border-t border-gray-100 flex justify-center pb-8">
                 <button 
                   onClick={() => setShowTutorial(false)} 
                   className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                 >
                    <PlayCircle size={20} /> Let's Play!
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Game Board Container */}
      <div className="bg-white p-2 md:p-3 rounded-2xl shadow-2xl border-4 border-white ring-4 ring-blue-100 relative">
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
      <div className="mt-8 flex flex-col items-center gap-4 w-full max-w-md">
         <div className="text-lg font-bold text-blue-800 bg-white/80 backdrop-blur px-8 py-3 rounded-2xl shadow-sm border border-white w-full text-center">
            {message}
         </div>
         
         <div className="flex items-center gap-6 justify-center w-full">
            <div className="relative group cursor-pointer" onClick={rollDice}>
               <div className={`w-24 h-24 bg-gradient-to-br from-white to-gray-100 rounded-2xl border-4 border-white flex items-center justify-center shadow-xl text-6xl text-gray-800 transition-all duration-300 ${isRolling ? 'animate-spin' : 'group-hover:scale-105 group-hover:-rotate-3'}`}>
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
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 px-12 rounded-2xl shadow-lg transform transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-xl tracking-wider border-b-4 border-blue-900 flex items-center gap-2"
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

      <div className="mt-4 w-full max-w-md opacity-80 hover:opacity-100 transition">
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
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto text-center border-t-4 border-india-blue">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-center gap-2"><Dice5 className="text-india-orange" /> SpinGo Cricket</h2>
      
      <div className="flex justify-center gap-4 mb-8">
        {slots.map((s, i) => (
          <div key={i} className="w-20 h-24 bg-gray-100 border-2 border-gray-300 rounded-lg flex items-center justify-center text-4xl shadow-inner">
            {s}
          </div>
        ))}
      </div>

      <div className="mb-6 h-8 text-lg font-semibold text-india-blue">{message}</div>
      <div className="mb-6 text-gray-600">Score: <span className="font-bold text-black">{score}</span></div>

      <div className="flex gap-4 justify-center">
        <button onClick={onBack} className="px-4 py-2 text-gray-500 hover:text-gray-700">Exit</button>
        <button 
          onClick={spin} 
          disabled={spinning}
          className="bg-india-orange text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-orange-600 disabled:opacity-50 transition transform hover:scale-105"
        >
          {spinning ? 'Spinning...' : 'SPIN NOW'}
        </button>
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
    
    // Add multiple rotations (at least 4 full spins = 1440deg) + random segment
    const newRotation = rotation + 1440 + Math.floor(Math.random() * 360); 
    setRotation(newRotation);

    setTimeout(() => {
      setSpinning(false);
      const normalizedRotation = newRotation % 360;
      const segmentAngle = 360 / segments.length;
      
      // Calculate winning index based on rotation.
      // 0deg is top in CSS conic gradient logic usually, but let's assume standard behavior:
      // If we rotate clockwise, the item at the top changes counter-clockwise relative to the wheel start.
      // This formula approximates the segment under the pointer at the top.
      const winningIndex = Math.floor(((360 - (normalizedRotation % 360)) % 360) / segmentAngle);
      
      setPrize(`Your favourite cricketer is: ${segments[winningIndex]}`);
    }, 3000);
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto text-center border-t-4 border-india-green">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-center gap-2"><Disc className="text-india-green" /> Star Player Wheel</h2>
      
      <div className="relative w-64 h-64 mx-auto mb-8">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -ml-4 -mt-2 z-10 w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[20px] border-t-red-600"></div>
        
        {/* Wheel */}
        <div 
          className="w-full h-full rounded-full border-8 border-gray-200 overflow-hidden relative transition-transform duration-[3000ms] cubic-bezier(0.25, 0.1, 0.25, 1)"
          style={{ 
            transform: `rotate(${rotation}deg)`,
            background: 'conic-gradient(#ff9933 0deg 45deg, #ffffff 45deg 90deg, #138808 90deg 135deg, #0033cc 135deg 180deg, #ff9933 180deg 225deg, #ffffff 225deg 270deg, #138808 270deg 315deg, #0033cc 315deg 360deg)'
          }}
        >
          {/* Simple overlay to make it look like a wheel */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-full shadow-md z-10 flex items-center justify-center text-xs font-bold text-gray-400">
               LOTUS
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 text-xl font-bold text-india-blue min-h-[3rem] px-4 py-2 bg-blue-50 rounded-lg flex items-center justify-center">
        {prize}
      </div>

      <div className="flex gap-4 justify-center">
        <button onClick={onBack} className="px-4 py-2 text-gray-500 hover:text-gray-700">Exit</button>
        <button 
          onClick={spinWheel} 
          disabled={spinning}
          className="bg-india-green text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-green-700 disabled:opacity-50 transition transform hover:scale-105"
        >
          SPIN
        </button>
      </div>
    </div>
  );
};

const TapScoreCricket: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [ballPos, setBallPos] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = right, -1 = left
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [lastResult, setLastResult] = useState('Tap Start to Play');
  const requestRef = useRef<number>(0);
  const speedRef = useRef<number>(2);

  const moveBall = () => {
    setBallPos(prev => {
      const next = prev + speedRef.current * direction;
      if (next >= 100 || next <= 0) {
        setDirection(d => d * -1);
        return prev; // Clamp for one frame
      }
      return next;
    });
    requestRef.current = requestAnimationFrame(moveBall);
  };

  // Toggle direction properly in the effect if needed, but simple bounce logic in setState is easier
  // Actually, updating direction inside setBallPos callback is tricky. 
  // Let's use a simpler useEffect for the loop.

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setBallPos(prev => {
          let next = prev + (2 * direction); // simplified logic
          if (next >= 100) {
            setDirection(-1);
            next = 100;
          } else if (next <= 0) {
            setDirection(1);
            next = 0;
          }
          return next;
        });
      }, 16); // ~60fps
      return () => clearInterval(interval);
    }
  }, [isPlaying, direction]);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setWickets(0);
    setLastResult("Game On! Tap when marker is green.");
  };

  const tap = () => {
    if (!isPlaying) {
      startGame();
      return;
    }

    // Logic: 40-60 is 6 runs (Green), 20-40 & 60-80 is 4 runs (Yellow), else Out
    if (ballPos >= 45 && ballPos <= 55) {
      setScore(s => s + 6);
      setLastResult("HUGE SIX! 6️⃣");
      speedRef.current += 0.5; // increase difficulty
    } else if ((ballPos >= 30 && ballPos < 45) || (ballPos > 55 && ballPos <= 70)) {
      setScore(s => s + 4);
      setLastResult("Good Shot! 4️⃣");
    } else {
      setWickets(w => w + 1);
      setLastResult("OUT! ☝️");
      if (wickets >= 2) { // 3 wickets total
        setIsPlaying(false);
        setLastResult(`Game Over! Final Score: ${score}`);
      }
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto text-center border-t-4 border-red-500">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-center gap-2"><Target className="text-red-600" /> Tap Score</h2>
      
      <div className="relative w-full h-12 bg-gray-200 rounded-full mb-8 overflow-hidden border-2 border-gray-400">
        {/* Zones */}
        <div className="absolute top-0 bottom-0 left-[30%] right-[30%] bg-yellow-200 opacity-50"></div>
        <div className="absolute top-0 bottom-0 left-[45%] right-[45%] bg-green-500 opacity-60"></div>
        
        {/* Ball Marker */}
        <div 
          className="absolute top-1 bottom-1 w-4 bg-red-600 rounded-full shadow-md transition-none"
          style={{ left: `${ballPos}%` }}
        ></div>
      </div>

      <div className="flex justify-between items-center mb-6 px-4">
        <div className="text-gray-700 font-bold">Score: {score}</div>
        <div className="text-red-600 font-bold">Wickets: {wickets}/3</div>
      </div>

      <div className="mb-6 text-xl font-bold text-india-blue h-8">{lastResult}</div>

      <div className="flex gap-4 justify-center">
        <button onClick={onBack} className="px-4 py-2 text-gray-500 hover:text-gray-700">Exit</button>
        <button 
          onClick={tap} 
          className={`px-8 py-3 rounded-full font-bold shadow-md transition transform active:scale-95 text-white ${isPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-india-blue hover:bg-blue-700'}`}
        >
          {isPlaying ? 'HIT!' : 'START MATCH'}
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-4">Tip: Hit in the green zone for 6, yellow for 4.</p>
    </div>
  );
};

const GamesPage: React.FC = () => {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  if (activeGame === 'SpinGo') return <SpinGo onBack={() => setActiveGame(null)} />;
  if (activeGame === 'WinWheel') return <WinWheel onBack={() => setActiveGame(null)} />;
  if (activeGame === 'TapScore') return <TapScoreCricket onBack={() => setActiveGame(null)} />;
  if (activeGame === 'LudoClassic') return <LudoClassic onBack={() => setActiveGame(null)} />;

  return (
    <div className="space-y-8">
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
          <Gamepad2 size={40} className="text-india-blue" /> 
          Lotus Game Zone
        </h1>
        <p className="text-gray-600">Take a break and test your luck and skills!</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Game 1 */}
        <div 
          onClick={() => setActiveGame('SpinGo')}
          className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition transform hover:-translate-y-1 group border border-gray-100"
        >
          <div className="h-40 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
            <Dice5 className="text-white w-16 h-16 group-hover:scale-110 transition duration-300" />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">SpinGo</h3>
            <p className="text-gray-600 text-sm">Spin the slots and match cricket icons to win!</p>
            <div className="mt-4 text-india-orange font-semibold flex items-center gap-1 text-sm">Play Now &rarr;</div>
          </div>
        </div>

        {/* Game 2 */}
        <div 
           onClick={() => setActiveGame('WinWheel')}
           className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition transform hover:-translate-y-1 group border border-gray-100"
        >
          <div className="h-40 bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
            <Disc className="text-white w-16 h-16 group-hover:rotate-180 transition duration-700" />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">WinWheel</h3>
            <p className="text-gray-600 text-sm">Find your cricket soulmate!</p>
            <div className="mt-4 text-india-green font-semibold flex items-center gap-1 text-sm">Play Now &rarr;</div>
          </div>
        </div>

        {/* Game 3 */}
        <div 
           onClick={() => setActiveGame('TapScore')}
           className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition transform hover:-translate-y-1 group border border-gray-100"
        >
          <div className="h-40 bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
            <Target className="text-white w-16 h-16 group-hover:scale-110 transition duration-300" />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Tap Score</h3>
            <p className="text-gray-600 text-sm">Test your timing! Score boundaries.</p>
            <div className="mt-4 text-india-blue font-semibold flex items-center gap-1 text-sm">Play Now &rarr;</div>
          </div>
        </div>

        {/* Game 4: Ludo */}
        <div 
           onClick={() => setActiveGame('LudoClassic')}
           className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition transform hover:-translate-y-1 group border border-gray-100"
        >
          <div className="h-40 bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center relative overflow-hidden">
             <Grid3X3 className="text-white w-16 h-16 group-hover:scale-110 transition duration-500" />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Ludo Classic</h3>
            <p className="text-gray-600 text-sm">The authentic 2D board game experience.</p>
            <div className="mt-4 text-yellow-600 font-semibold flex items-center gap-1 text-sm">Play Now &rarr;</div>
          </div>
        </div>
      </div>

      <AdPlaceholder size="leaderboard" />
    </div>
  );
};

// Pages
const Home: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-india-blue to-blue-900 text-white p-8 rounded-2xl overflow-hidden shadow-xl">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Lotus Cricket</h1>
          <p className="text-lg text-blue-100 max-w-2xl mb-6">
            The ultimate encyclopedia for Indian Cricket. From the debut at Lord's in 1932 to the T20 glories of today. 
            Explore history, stats, and real-time updates.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/live" className="bg-india-orange hover:bg-orange-600 text-white px-6 py-2 rounded-full font-semibold transition">
              Live Scores
            </Link>
            <Link to="/games" className="bg-white/10 hover:bg-white/20 backdrop-blur text-white px-6 py-2 rounded-full font-semibold transition flex items-center gap-2">
              <Gamepad2 size={18} /> Game Zone
            </Link>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10">
          <Trophy size={300} />
        </div>
      </section>

      <AdPlaceholder size="leaderboard" />

      {/* Live Updates Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
          Latest Match Updates
        </h2>
        <AIContentCard 
          title="Current Matches Involving India" 
          prompt="What is the latest live score or result of the most recent Indian cricket match (Men or Women)? Provide a short summary including key performers. Use a concise format." 
          useSearch={true}
        />
      </section>

      {/* Featured Sections */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/players" className="group bg-white p-6 rounded-xl shadow-sm border hover:border-india-blue transition">
          <Users className="text-india-blue mb-4" size={32} />
          <h3 className="text-xl font-bold mb-2 group-hover:text-india-blue">Player Profiles</h3>
          <p className="text-gray-600 text-sm">Detailed biographies of legends from Gavaskar to Tendulkar to Kohli.</p>
        </Link>
        <Link to="/tournaments" className="group bg-white p-6 rounded-xl shadow-sm border hover:border-india-blue transition">
          <Trophy className="text-india-blue mb-4" size={32} />
          <h3 className="text-xl font-bold mb-2 group-hover:text-india-blue">Tournaments</h3>
          <p className="text-gray-600 text-sm">Ranji, Duleep, Irani Cup, and complete IPL records.</p>
        </Link>
        <Link to="/games" className="group bg-white p-6 rounded-xl shadow-sm border hover:border-india-blue transition">
          <Gamepad2 className="text-india-blue mb-4" size={32} />
          <h3 className="text-xl font-bold mb-2 group-hover:text-india-blue">Game Zone</h3>
          <p className="text-gray-600 text-sm">Play SpinGo, WinWheel, and Tap Cricket for fun!</p>
        </Link>
      </div>

       <div className="grid md:grid-cols-2 gap-8">
          <AIContentCard 
            title="On This Day in Indian Cricket" 
            prompt="What significant event happened on this date in history regarding Indian cricket? If nothing specific, tell me a random interesting fact about Indian cricket history."
            className="h-full"
          />
           <AIContentCard 
            title="Trending News" 
            prompt="What are the top 3 trending headlines in Indian cricket right now?"
            useSearch={true}
            className="h-full"
          />
       </div>
    </div>
  );
};

const HistoryPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-xl shadow-sm border-l-4 border-india-blue">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">History of Indian Cricket (1932 - Present)</h1>
        <p className="text-gray-600">A journey from the British Raj to becoming the global powerhouse of cricket.</p>
      </div>
      
      <AdPlaceholder size="leaderboard" />

      <AIContentCard 
        title="1932-1950: The Beginning" 
        prompt="Write a detailed summary of Indian cricket history from 1932 to 1950. Highlight the first test match, CK Nayudu, and the first victory."
      />
      
      <AIContentCard 
        title="1952-1982: Finding Feet & The Spin Quartet" 
        prompt="Summarize Indian cricket from 1952 to 1982. Focus on the first series win, the emergence of the spin quartet (Bedi, Prasanna, Chandrasekhar, Venkataraghavan), and Sunil Gavaskar's debut."
      />

      <AdPlaceholder size="rectangle" className="float-right ml-6" />

      <AIContentCard 
        title="1983: The Turning Point" 
        prompt="Write a detailed account of India's 1983 World Cup victory under Kapil Dev and its impact on the nation."
      />

      <AIContentCard 
        title="1984-2000: Sachin Era & Match Fixing" 
        prompt="Cover the period of 1984 to 2000 in Indian cricket. Discuss the 1985 World Championship of Cricket, the rise of Sachin Tendulkar, and the dark phase of the match-fixing scandal."
      />

      <AIContentCard 
        title="2000-2011: The Golden Generation" 
        prompt="Summarize the Sourav Ganguly captaincy era, the 2007 T20 World Cup win under Dhoni, and the 2011 ODI World Cup victory."
      />

      <AIContentCard 
        title="2012-Present: Global Dominance" 
        prompt="Discuss Indian cricket from 2012 to present. Rise of Virat Kohli, the dominance in Test cricket, 2013 Champions Trophy, and the growth of IPL talent."
      />
    </div>
  );
};

const PlayersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  const popularPlayers = ["Sachin Tendulkar", "Virat Kohli", "MS Dhoni", "Kapil Dev", "Sunil Gavaskar", "Rohit Sharma", "Jasprit Bumrah", "Mithali Raj", "Jhulan Goswami"];

  return (
    <div className="space-y-6">
       <div className="bg-white p-6 rounded-xl shadow-sm">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Player Profiles</h1>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Search for any Indian cricketer (e.g. Rahul Dravid)..." 
            className="flex-1 border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-india-blue"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchTerm) setSelectedPlayer(searchTerm);
            }}
          />
          <button 
            onClick={() => setSelectedPlayer(searchTerm)}
            className="bg-india-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
          >
            Search
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm text-gray-500 py-1">Popular:</span>
          {popularPlayers.map(p => (
            <button 
              key={p}
              onClick={() => { setSearchTerm(p); setSelectedPlayer(p); }}
              className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <AdPlaceholder size="leaderboard" />

      {selectedPlayer ? (
        <div className="space-y-6">
          <AIContentCard 
            title={`Profile: ${selectedPlayer}`}
            prompt={`Create a detailed profile for Indian cricketer ${selectedPlayer}. Include: 
            1. Full Name, Date of Birth, Birthplace.
            2. Role (Batsman/Bowler/All-rounder).
            3. International Debut and Retirement dates (Test, ODI, T20I).
            4. Detailed Biography and Life Story.
            5. Key Records and Achievements.
            6. Career Stats Summary (approximate).`}
            useSearch={true} // Use search for accurate stats
          />
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <Users size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-gray-500 font-medium">Search for a player to view their full profile</h3>
        </div>
      )}
    </div>
  );
};

const AssociationsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Trusts & Associations</h1>
        <p className="text-gray-600">Details of the governing bodies that manage cricket in India.</p>
      </div>

      <AIContentCard 
        title="BCCI (Board of Control for Cricket in India)" 
        prompt="Provide a detailed overview of the BCCI. Include its history (founded 1928), current key office bearers (President, Secretary), headquarters, and its role in global cricket."
        useSearch={true}
      />

      <div className="grid md:grid-cols-2 gap-6">
        <AIContentCard 
          title="North & East Zone Associations" 
          prompt="List key state cricket associations in North and East India (e.g., DDCA, CAB). Include their stadium names and history."
        />
        <AIContentCard 
          title="West & South Zone Associations" 
          prompt="List key state cricket associations in West and South India (e.g., MCA, TNCA, KSCA). Include their stadium names and history."
        />
      </div>
      
      <AdPlaceholder size="leaderboard" />
    </div>
  );
};

const TournamentsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Tournaments & Trophies</h1>
      
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AIContentCard 
            title="Ranji Trophy" 
            prompt="Detailed history and format of the Ranji Trophy. List the most successful teams (like Mumbai) and recent winners."
          />
           <AIContentCard 
            title="Indian Premier League (IPL)" 
            prompt="Comprehensive overview of the IPL. History since 2008, list of all winning teams by year, impact on Indian cricket, and current team captains."
            useSearch={true}
          />
        </div>
        <div className="space-y-6">
          <AdPlaceholder size="sidebar" />
          <AIContentCard 
            title="Other Major Trophies" 
            prompt="Brief summaries of Duleep Trophy, Irani Cup, Vijay Hazare Trophy, and Syed Mushtaq Ali Trophy."
          />
        </div>
      </div>
    </div>
  );
};

const ControversiesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-red-50 p-6 rounded-xl border border-red-100">
        <h1 className="text-3xl font-bold text-red-900 mb-2 flex items-center gap-2">
          <AlertTriangle />
          Controversies & Challenges
        </h1>
        <p className="text-red-700">A timeline of moments that tested the spirit of the game.</p>
      </div>

      <AIContentCard 
        title="Major Controversies Timeline" 
        prompt="Create a timeline of major controversies in Indian cricket history. Include the 2000 Match Fixing scandal, the Monkeygate scandal (2008), the Chappell-Ganguly conflict, and the 2013 IPL spot-fixing scandal. Be objective and factual."
      />
      <AdPlaceholder size="leaderboard" />
    </div>
  );
};

// Layout Component
const Layout: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/', icon: HomeIcon },
    { label: 'History', path: '/history', icon: History },
    { label: 'Players', path: '/players', icon: Users },
    { label: 'Game Zone', path: '/games', icon: Gamepad2 },
    { label: 'Associations', path: '/associations', icon: Building2 },
    { label: 'Tournaments', path: '/tournaments', icon: Trophy },
    { label: 'Controversies', path: '/controversies', icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Header */}
      <header className="bg-india-blue text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-india-blue font-bold text-xl">L</div>
              <span className="text-xl font-bold tracking-tight">LOTUS CRICKET</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <Link 
                  key={item.path} 
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${location.pathname === item.path ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-800'}`}
                >
                  <item.icon size={16} />
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-blue-800 px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path}
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <item.icon size={18} />
                  {item.label}
                </div>
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <div className="w-8 h-8 bg-india-orange rounded-full flex items-center justify-center text-gray-900 text-lg">L</div>
                Lotus Corporation
              </h3>
              <p className="text-sm text-gray-400">
                Celebrating the spirit of cricket in India. Bringing you closer to the game, the legends, and the history.
              </p>
              <div className="space-y-2 pt-2">
                 <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-india-orange mt-1 shrink-0" />
                  <span>CDA Sector 9,<br/>Cuttack 753014, Odisha, India</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={20} className="text-india-orange" />
                  <a href="mailto:connect.lotus@gmail.com" className="hover:text-white transition">connect.lotus@gmail.com</a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={20} className="text-india-orange" />
                  <span>+91 84804 47800</span>
                </div>
              </div>
            </div>

            {/* Quick Links & WhatsApp */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Connect With Us</h4>
              <a 
                href="https://wa.me/918480447800" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg w-fit transition"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                <span>Chat on WhatsApp</span>
              </a>
              <div className="pt-4">
                 <Link to="/players" className="block text-gray-400 hover:text-white mb-2">Players Directory</Link>
                 <Link to="/tournaments" className="block text-gray-400 hover:text-white mb-2">Tournament Records</Link>
                 <Link to="/games" className="block text-gray-400 hover:text-white mb-2">Game Zone</Link>
                 <Link to="/controversies" className="block text-gray-400 hover:text-white">Controversies</Link>
              </div>
            </div>

            {/* Google Maps */}
            <div className="w-full h-48 bg-gray-800 rounded-lg overflow-hidden relative">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3738.423985135135!2d85.8828!3d20.4500!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjDCsDI3JzAwLjAiTiA4NcKwNTInNTguMSJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{border:0}} 
                allowFullScreen={true} 
                loading="lazy"
                title="Office Location"
              ></iframe>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Lotus Corporation. All rights reserved. <br/>
            Designed with <span className="text-red-500">♥</span> for Cricket.
          </div>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/players" element={<PlayersPage />} />
          <Route path="/associations" element={<AssociationsPage />} />
          <Route path="/tournaments" element={<TournamentsPage />} />
          <Route path="/controversies" element={<ControversiesPage />} />
          <Route path="/games" element={<GamesPage />} />
          {/* Redirects or 404 can be added here */}
          <Route path="/live" element={<Home />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;