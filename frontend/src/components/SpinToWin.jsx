import React, { useState, useEffect } from 'react';
import { Gift, X, Copy, CheckCircle2, PartyPopper } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

const SEGMENTS = [
  { id: 1, label: '10% OFF', code: 'SPIN10', color: '#ec4899', isWin: true }, // Pink-500
  { id: 2, label: 'Try Again', code: null, color: '#f3f4f6', isWin: false }, // Gray-100
  { id: 3, label: '20% OFF', code: 'SPIN20', color: '#8b5cf6', isWin: true }, // Violet-500
  { id: 4, label: '5% OFF', code: 'SPIN5', color: '#ec4899', isWin: true },   // Pink-500
  { id: 5, label: 'Almost!', code: null, color: '#f3f4f6', isWin: false }, // Gray-100
  { id: 6, label: '15% OFF', code: 'SPIN15', color: '#8b5cf6', isWin: true }, // Violet-500
];

const SpinToWin = ({ isOpen, onClose }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [hasSpun, setHasSpun] = useState(false);
  const [winningSegment, setWinningSegment] = useState(null);
  const [copied, setCopied] = useState(false);
  
  const { success } = useToast();

  // If closed, wait a bit then reset state if they want to spin again later (or we can enforce 1 spin only)
  useEffect(() => {
    if (!isOpen && hasSpun) {
      // Optional: reset after closing, or keep it as 'already spun'
      // setHasSpun(false);
      // setWinningSegment(null);
      // setRotation(0);
    }
  }, [isOpen, hasSpun]);

  if (!isOpen) return null;

  const handleSpin = () => {
    if (isSpinning || hasSpun) return;

    setIsSpinning(true);
    
    // We want it to spin at least 5 times (1800 deg)
    const spins = 5;
    const baseRotation = spins * 360;
    
    // Pick a random segment (let's weight it towards smaller discounts or just purely random)
    const randomSegmentIndex = Math.floor(Math.random() * SEGMENTS.length);
    
    // Calculate the degree to stop at so the pointer (at the top) points to the center of the winning segment
    // Each segment is 60 degrees. 
    // Segment 1 (index 0) is at 0-60deg. Center is 30deg.
    // However, the pointer is at the top (0deg). 
    // If the wheel rotates X degrees, the segment that lands at 0deg is the winner.
    // To land segment i at the top, we need to rotate backwards by its center angle, or forwards by 360 - center angle.
    const segmentAngle = 360 / SEGMENTS.length;
    const centerOffset = segmentAngle / 2;
    const targetAngle = 360 - (randomSegmentIndex * segmentAngle + centerOffset);

    const totalRotation = rotation + baseRotation + targetAngle - (rotation % 360);

    setRotation(totalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setHasSpun(true);
      setWinningSegment(SEGMENTS[randomSegmentIndex]);
    }, 5000); // 5 seconds spin duration
  };

  const handleCopy = () => {
    if (winningSegment?.code) {
      navigator.clipboard.writeText(winningSegment.code);
      setCopied(true);
      success('Copied!', 'Coupon code copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full relative overflow-hidden flex flex-col items-center p-8">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Spin & Win!</h2>
          <p className="text-gray-600">Try your luck for an exclusive discount on your entire order today.</p>
        </div>

        {/* Wheel Container */}
        <div className="relative w-64 h-64 mb-8">
          {/* Pointer */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 z-10 drop-shadow-lg">
            <div className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[24px] border-t-gray-900"></div>
          </div>

          {/* The Wheel */}
          <div 
            className="w-full h-full rounded-full border-4 border-gray-900 shadow-xl overflow-hidden relative"
            style={{
              transition: 'transform 5s cubic-bezier(0.15, 0.85, 0.35, 1)',
              transform: `rotate(${rotation}deg)`,
              // Conic gradient mapping
              background: `conic-gradient(
                ${SEGMENTS[0].color} 0deg 60deg,
                ${SEGMENTS[1].color} 60deg 120deg,
                ${SEGMENTS[2].color} 120deg 180deg,
                ${SEGMENTS[3].color} 180deg 240deg,
                ${SEGMENTS[4].color} 240deg 300deg,
                ${SEGMENTS[5].color} 300deg 360deg
              )`
            }}
          >
            {/* Wheel Labels */}
            {SEGMENTS.map((segment, index) => {
              const rotationAngle = (index * 60) + 30; // Center of segment
              return (
                <div 
                  key={segment.id}
                  className="absolute inset-0 flex items-start justify-center text-center font-bold"
                  style={{ transform: `rotate(${rotationAngle}deg)` }}
                >
                  <span 
                    className="mt-6 text-sm whitespace-nowrap"
                    style={{ 
                      color: segment.color === '#f3f4f6' ? '#111827' : '#ffffff',
                      textShadow: segment.color === '#f3f4f6' ? 'none' : '0 1px 2px rgba(0,0,0,0.3)'
                    }}
                  >
                    {segment.label}
                  </span>
                </div>
              );
            })}
            
            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white border-4 border-gray-900 rounded-full z-10"></div>
          </div>
        </div>

        {/* Action / Result Area */}
        <div className="w-full text-center h-24 flex flex-col justify-center animate-in fade-in zoom-in duration-300">
          {!hasSpun ? (
            <button
              onClick={handleSpin}
              disabled={isSpinning}
              className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-lg"
            >
              {isSpinning ? 'Spinning...' : 'SPIN THE WHEEL'}
            </button>
          ) : (
            <div className="space-y-3">
              {winningSegment?.isWin ? (
                <>
                  <div className="flex items-center justify-center gap-2 text-green-600 font-bold mb-1">
                    <PartyPopper className="w-5 h-5" />
                    <span>You won {winningSegment.label}!</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 border-2 border-dashed border-gray-300 p-3 rounded-xl justify-between">
                    <span className="font-mono font-bold text-gray-900 tracking-widest text-lg">{winningSegment.code}</span>
                    <button 
                      onClick={handleCopy}
                      className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors text-gray-700"
                    >
                      {copied ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center space-y-2">
                  <p className="text-gray-900 font-bold text-lg">Aww, Better Luck Next Time!</p>
                  <p className="text-gray-500 text-sm">You didn't win a discount this time.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpinToWin;
