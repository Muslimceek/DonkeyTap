import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css'; 
import Header from './components/Header';
import BottomNavigation from './components/Navigation'; 
import Friends from './Friends'; 
import Earn from './Earn'; 
import { mainCharacter } from './images'; 

const App: React.FC = () => {
  const levelNames = ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Epic", "Legendary", "Master", "GrandMaster", "Lord"];
  const levelMinPoints = [0, 5000, 25000, 100000, 1000000, 2000000, 10000000, 50000000, 100000000, 1000000000];

  const [levelIndex, setLevelIndex] = useState(() => {
    const savedLevelIndex = localStorage.getItem('levelIndex');
    return savedLevelIndex ? parseInt(savedLevelIndex, 10) : 0;
  });

  const [points, setPoints] = useState(() => {
    const savedPoints = localStorage.getItem('points');
    return savedPoints ? parseInt(savedPoints, 10) : 0;
  });

  const [clicks, setClicks] = useState<{ id: number, x: number, y: number }[]>([]);
  const pointsToAdd = 1;

  const location = useLocation();

  // Handle click and touch events
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const isTouchEvent = e.type === 'touchstart';
    const touchEvent = isTouchEvent ? e as React.TouchEvent<HTMLDivElement> : null;
    const mouseEvent = !isTouchEvent ? e as React.MouseEvent<HTMLDivElement> : null;

    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();

    // Get coordinates based on event type
    const x = isTouchEvent 
      ? touchEvent?.touches[0]?.clientX! - rect.left - rect.width / 2 
      : mouseEvent?.clientX! - rect.left - rect.width / 2;
    const y = isTouchEvent 
      ? touchEvent?.touches[0]?.clientY! - rect.top - rect.height / 2 
      : mouseEvent?.clientY! - rect.top - rect.height / 2;

    // Add animation class on click
    card.classList.add('click-animation');
    setTimeout(() => {
      card.classList.remove('click-animation'); // Remove class after animation duration
    }, 300); // Duration of the animation

    card.style.transform = `perspective(1000px) rotateX(${-y / 10}deg) rotateY(${x / 10}deg)`;
    setTimeout(() => {
      card.style.transform = '';
    }, 100);

    // Add points for each touch or click
    const newPoints = points + (isTouchEvent ? touchEvent?.touches.length || 0 : 1) * pointsToAdd;
    setPoints(newPoints);
    localStorage.setItem('points', newPoints.toString());

    // Update click state for animation
    const newClicks = Array.from({ length: isTouchEvent ? touchEvent?.touches.length || 0 : 1 }).map(() => ({
      id: Date.now(),
      x: isTouchEvent ? touchEvent?.touches[0]?.clientX || 0 : mouseEvent?.clientX || 0,
      y: isTouchEvent ? touchEvent?.touches[0]?.clientY || 0 : mouseEvent?.clientY || 0,
    }));

    setClicks(prevClicks => [...prevClicks, ...newClicks]);
  };

  // Handle the end of the animation for click indicators
  const handleAnimationEnd = (id: number) => {
    setClicks(prevClicks => prevClicks.filter(click => click.id !== id));
  };

  // Update level based on points
  useEffect(() => {
    const newLevelIndex = levelMinPoints.findIndex((minPoints, index) => 
      points >= minPoints && (index === levelMinPoints.length - 1 || points < levelMinPoints[index + 1])
    );

    if (newLevelIndex !== -1 && newLevelIndex !== levelIndex) {
      setLevelIndex(newLevelIndex);
      localStorage.setItem('levelIndex', newLevelIndex.toString());
    }
  }, [points, levelIndex]);

  // Calculate progress towards the next level
  const calculateProgress = () => {
    if (levelIndex >= levelNames.length - 1) return 100;

    const currentLevelMin = levelMinPoints[levelIndex];
    const nextLevelMin = levelMinPoints[levelIndex + 1];
    const progress = ((points - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100;

    return Math.min(progress, 100);
  };

  // Function to add points from other components
  const addPoints = (newPoints: number) => {
    setPoints(prevPoints => {
      const updatedPoints = prevPoints + newPoints;
      localStorage.setItem('points', updatedPoints.toString());
      return updatedPoints;
    });
  };

  return (
    <div className="bg-gradient-to-b from-blue-500 to-blue-800 flex justify-center">
      <div className="w-full text-white h-screen font-bold flex flex-col max-w-xl">
        {location.pathname === '/' && (
          <Header
            levelNames={levelNames}
            levelIndex={levelIndex}
            calculateProgress={calculateProgress}
            points={points}
            setPoints={setPoints}
          />
        )}
        <Routes>
          <Route path="/" element={
            <>
              <div className="px-4 mt-4 flex justify-center">
                <div className="px-4 py-2 flex items-center space-x-2">
                  <p className="text-4xl text-yellow-300">{points.toLocaleString()}</p>
                </div>
              </div>
              <div className="px-4 mt-4 flex justify-center">
                <div className="w-80 h-80 p-4 rounded-full circle-outer" onClick={handleCardClick} onTouchStart={handleCardClick}>
                  <div className="w-full h-full rounded-full circle-inner">
                    <img src={mainCharacter} alt="Main Character" className="w-full h-full" />
                  </div>
                </div>
              </div>
            </>
          } />
          <Route path="/friends" element={<Friends addPoints={addPoints} />} />
          <Route path="/earn" element={<Earn addPoints={addPoints} />} />
        </Routes>

        <BottomNavigation />

        {clicks.map((click) => (
          <div
            key={click.id}
            className="absolute text-5xl font-bold opacity-0 text-white pointer-events-none"
            style={{
              top: `${click.y - 42}px`,
              left: `${click.x - 28}px`,
              animation: `float 1s ease-out`
            }}
            onAnimationEnd={() => handleAnimationEnd(click.id)}
          >
            {pointsToAdd}
          </div>
        ))}
      </div>
    </div>
  );
};

const AppWithRouter: React.FC = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default AppWithRouter;