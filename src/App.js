import logo from './logo.svg';
import './App.css';
import React, { useState, useRef, useEffect } from 'react';

function App() {
  const [affectionPoints, setAffectionPoints] = useState(0);
  const [isPetting, setIsPetting] = useState(false);
  const [pinkHearts, setPinkHearts] = useState(0);
  const petAreaRef = useRef(null);

  // Thresholds for each heart
  const heartThresholds = [15, 25, 50, 75, 100];

  const handleMouseEnter = () => {
    setIsPetting(true);
  };

  const handleMouseLeave = () => {
    setIsPetting(false);
  };

  // Use useEffect for consistent 1 point per second increment
  useEffect(() => {
    let intervalId;
    if (isPetting) {
      intervalId = setInterval(() => {
        setAffectionPoints(prev => {
          // Get the current heart's threshold
          const currentThreshold = heartThresholds[pinkHearts];
          
          // Increment points, but don't exceed current threshold
          const newPoints = Math.min(prev + 1, currentThreshold);
          
          // Check if we've reached the current heart's threshold
          if (newPoints === currentThreshold) {
            // Turn the next heart pink
            setPinkHearts(current => Math.min(current + 1, 5));
            
            // Reset points to 0 for the next heart
            return 0;
          }
          
          return newPoints;
        });
      }, 1000); // 1 second interval
    }
    
    return () => clearInterval(intervalId);
  }, [isPetting, pinkHearts]);

  // Render heart icons based on their state
  const renderHearts = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <span 
        key={index} 
        className={`text-3xl ${index < pinkHearts ? 'text-pink-500' : 'text-gray-300'}`}
      >
        ♥
      </span>
    ));
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold mb-2">Pet Simulator</h1>
        {isPetting && (
          <div className="text-green-600 font-semibold">
            You are petting the pet! 🐾
          </div>
        )}
      </div>

      {/* Hearts Display */}
      <div className="mb-4 flex space-x-2">
        {renderHearts()}
      </div>

      {/* Pet Area */}
      <div 
        ref={petAreaRef}
        className={`w-64 h-64 ${isPetting ? 'bg-blue-300' : 'bg-blue-200'} 
        rounded-lg mb-4 flex items-center justify-center cursor-pointer`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="text-center">
          <div className="text-4xl">🐶</div>
          <p className="mt-2 text-gray-700">Pet me!</p>
        </div>
      </div>

      {/* Affection Bar */}
      <div className="w-64 bg-gray-200 rounded-full h-6 dark:bg-gray-700">
        <div 
          className="bg-green-600 h-6 rounded-full transition-all duration-200" 
          style={{
            width: `${(affectionPoints / heartThresholds[pinkHearts]) * 100}%`
          }}
        >
          <span className="text-white text-sm flex items-center justify-center h-full">
            {Math.round((affectionPoints / heartThresholds[pinkHearts]) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;