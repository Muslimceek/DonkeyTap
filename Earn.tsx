import React, { useState, useEffect } from 'react';
import './Earn.css';

interface Task {
  id: number;
  description: string;
  reward: number;
  completed: boolean;
  link?: string;
  details: string;
}

const Earn: React.FC<{ addPoints: (points: number) => void }> = ({ addPoints }) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      description: 'Subscribe to @Crypto_mem_news on Telegram',
      reward: 1000,
      completed: false,
      link: 'https://t.me/Crypto_mem_news',
      details: 'Subscribe to our Telegram channel to stay updated on the latest news and promotions!',
    },
    {
      id: 2,
      description: 'Follow Instagram @muslim_ameen',
      reward: 2000,
      completed: false,
      link: 'https://www.instagram.com/muslim_ameen/',
      details: 'Follow us for updates and unique content on Instagram!',
    },
    {
      id: 3,
      description: 'Subscribe to @donkey_tap on Telegram',
      reward: 1000,
      completed: false,
      link: 'https://t.me/donkey_tap',
      details: 'Subscribe to our Telegram channel to stay updated on the latest news and promotions!',
    },
    {
      id: 3,
      description: 'Subscribe to ton on Telegram',
      reward: 1000,
      completed: false,
      link: 'https://t.me/at_not_blum_dogs_ton',
      details: 'Subscribe to our Telegram channel to stay updated on the latest news and promotions!',
    },
    {
      id: 3,
      description: 'Subscribe to @treder_shoxboz on Telegram',
      reward: 1000,
      completed: false,
      link: 'https://t.me/@treder_shoxboz',
      details: 'Subscribe to our Telegram channel to stay updated on the latest news and promotions!',
    },
    {
      id: 3,
      description: 'Subscribe to @donkey_tap on Telegram',
      reward: 1000,
      completed: false,
      link: 'https://t.me/donkey_tap',
      details: 'Subscribe to our Telegram channel to stay updated on the latest news and promotions!',
    },
  
  
  ]);

  const [loadingTaskId, setLoadingTaskId] = useState<number | null>(null);
  const [points, setPoints] = useState<number>(0); // State for points

  // Load tasks and points state from Local Storage
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    const savedPoints = localStorage.getItem('points');

    // Check for existence and validity of data
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        if (Array.isArray(parsedTasks)) {
          setTasks(parsedTasks);
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    }

    if (savedPoints) {
      const parsedPoints = Number(savedPoints);
      if (!isNaN(parsedPoints)) {
        setPoints(parsedPoints);
      }
    }
  }, []);

  // Save tasks and points state to Local Storage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('points', JSON.stringify(points));
  }, [tasks, points]);

  const completeTask = (taskId: number) => {
    const task = tasks.find(task => task.id === taskId);

    if (task && !task.completed) {
      // Open the link
      window.open(task.link, '_blank');

      setLoadingTaskId(taskId);
      setTimeout(() => {
        // Update task state and add points
        setTasks(prevTasks =>
          prevTasks.map(t =>
            t.id === taskId ? { ...t, completed: true } : t
          )
        );
        setPoints(prevPoints => prevPoints + task.reward); // Update points
        addPoints(task.reward);
        setLoadingTaskId(null);
      }, 500); // Change delay time if necessary
    }
  };

  return (
    <div className="earn-container">
      <h1>Earn Bonuses</h1>
      <h2>Your Points: {points}</h2> {/* Display current points */}
      <div className="tasks-container">
        {tasks.map(task => ( // Display all tasks
          <div
            key={task.id}
            className={`task-item ${task.completed ? 'completed' : ''}`}
          >
            <span>
              {task.description}
              {task.link && (
                <a href={task.link} target="_blank" rel="noopener noreferrer" className="link-icon">
                  {task.description.includes('Telegram') ? (
                    <img
                      src="https://i.ibb.co/dPVVGkT/telegram-icon-1.png"
                      alt="Telegram"
                      className="social-icon"
                    />
                  ) : task.description.includes('Instagram') ? (
                    <img
                      src="https://i.ibb.co/WPBzS9q/instagram-icon-1.png"
                      alt="Instagram"
                      className="social-icon"
                    />
                  ) : null}
                </a>
              )}
            </span>
            <p className="task-details">{task.details}</p>
            <button
              disabled={task.completed || loadingTaskId === task.id}
              onClick={() => completeTask(task.id)}
              className={`task-button ${task.completed ? 'completed' : ''} ${loadingTaskId === task.id ? 'loading' : ''}`}
            >
              {loadingTaskId === task.id ? (
                <span className="loading-spinner"></span>
              ) : task.completed ? (
                'Completed'
              ) : (
                `Earn ${task.reward} Points`
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Earn;