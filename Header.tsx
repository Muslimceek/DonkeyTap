import React, { useState, useEffect } from 'react';
import './Header.css';

interface HeaderProps {
  levelNames: string[];
  levelIndex: number;
  calculateProgress: () => number;
  points: number;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
}

const Header: React.FC<HeaderProps> = ({
  levelNames,
  levelIndex,
  calculateProgress,
  setPoints
}) => {
  const [subscribed, setSubscribed] = useState(() => {
    // Проверка, есть ли информация о подписке в локальном хранилище
    const savedSubscription = localStorage.getItem('subscribed');
    return savedSubscription === 'true';
  });
  
  const [bonus, setBonus] = useState('');
  const [bonusVisible, setBonusVisible] = useState(false);
  const [warning, setWarning] = useState(''); // Для предупреждения

  const handleSubscribe = () => {
    if (!subscribed) {
      const userSubscribed = window.confirm("Please confirm that you have subscribed to the Telegram channel.");
      
      if (userSubscribed) {
        setSubscribed(true);
        setPoints(prevPoints => {
          const newPoints = prevPoints + 50;
          // Сохранение обновленных очков в локальном хранилище
          localStorage.setItem('points', newPoints.toString());
          return newPoints;
        });
        setBonus('Thank you for subscribing! You received a bonus: +50 points!');
        setBonusVisible(true);
        setWarning(''); // Сброс предупреждения

        // Открыть ссылку на Telegram канал
        window.open('https://t.me/donkey_tap', '_blank');

        // Сохранение статуса подписки в локальном хранилище
        localStorage.setItem('subscribed', 'true');

        // Скрыть сообщение о бонусе через 5 секунд
        setTimeout(() => {
          setBonusVisible(false);
        }, 5000);
      } else {
        setWarning('You need to subscribe to the channel to receive the bonus.'); // Уведомление о необходимости подписки
      }
    }
  };

  useEffect(() => {
    if (bonusVisible) {
      const timer = setTimeout(() => {
        setBonusVisible(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [bonusVisible]);

  return (
    <header className="flex flex-col items-center z-10 px-4 pt-4 header-bg shadow-lg rounded-lg">
      <div className="flex items-center space-x-2 animate-pulse">
        <div className="icon-container transition-transform transform hover:scale-110">
          <img 
            src="https://i.ibb.co/7jz58vG/Component-3.png" 
            alt="Custom Icon" 
            className="w-8 h-8" 
          />
        </div>
        <p className="text-lg text-neon font-bold"> (Listing coming soon.)</p>
      </div>
      <div className="flex flex-col items-center justify-center mt-2 w-full">
        <div className="flex items-center justify-between w-full">
          <p className="text-md text-neon font-semibold">{levelNames[levelIndex]}</p>
          <p className="text-md text-neon font-semibold">
            {levelIndex + 1} <span className="text-[#d1d1d1]">/ {levelNames.length}</span>
          </p>
        </div>
        <div className="flex items-center w-full mt-1 border-2 border-[#ffcc00] rounded-full shadow-md">
          <div className="w-full h-2 bg-[#3c3c3c] rounded-full">
            <div
              className="progress-gradient h-2 rounded-full"
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
        </div>
      </div>

      <button
        onClick={handleSubscribe}
        className={`mt-4 button`}
        disabled={subscribed}
      >
        {subscribed ? 'You are subscribed!' : 'Subscribe to Telegram'}
      </button>

      {bonusVisible && <p className="bonus-message">{bonus}</p>}
      {warning && <p className="warning-message text-red-500">{warning}</p>} {/* Предупреждение */}
    </header>
  );
};

export default Header;