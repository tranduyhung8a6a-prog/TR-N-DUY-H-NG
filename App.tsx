import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { quizData } from './data/quizData';
import StartScreen from './components/StartScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import { QuizQuestion, TrueFalseQuestion } from './types';

type GameState = 'start' | 'quiz' | 'results';
type QuizMode = 'main' | 'review';

// Audio generation setup
let audioCtx: AudioContext;
const getAudioContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

const playSound = (type: 'correct' | 'incorrect' | 'click', volume: number = 0.3) => {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);

    switch (type) {
      case 'correct':
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(600, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
        break;
      case 'incorrect':
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(200, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);
        break;
      case 'click':
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(440, ctx.currentTime);
        break;
    }

    oscillator.start(ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.2);
    oscillator.stop(ctx.currentTime + 0.2);
  } catch (error) {
    console.error("Failed to play sound:", error);
  }
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('start');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [incorrectlyAnswered, setIncorrectlyAnswered] = useState<QuizQuestion[]>([]);
  const [quizMode, setQuizMode] = useState<QuizMode>('main');

  const [themeColor, setThemeColor] = useState<string>(() => localStorage.getItem('themeColor') || '#3b82f6');
  const [isMuted, setIsMuted] = useState<boolean>(() => localStorage.getItem('isMuted') === 'true');

  useEffect(() => {
    localStorage.setItem('themeColor', themeColor);
    document.documentElement.style.setProperty('--theme-color-primary', themeColor);
  }, [themeColor]);

  useEffect(() => {
    localStorage.setItem('isMuted', String(isMuted));
  }, [isMuted]);

  const audioControls = useMemo(() => ({
    playCorrect: () => !isMuted && playSound('correct'),
    playIncorrect: () => !isMuted && playSound('incorrect'),
    playClick: () => !isMuted && playSound('click'),
  }), [isMuted]);

  const totalScoreableItems = useMemo(() => {
    return quizData.reduce((total, q) => {
      if (q.type === 'multiple-choice') {
        return total + 1;
      }
      return total + (q as TrueFalseQuestion).statements.length;
    }, 0);
  }, []);

  const startQuiz = () => {
    audioControls.playClick();
    const shuffled = [...quizData].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setScore(0);
    setIncorrectlyAnswered([]);
    setQuizMode('main');
    setGameState('quiz');
  };

  const handleNextQuestion = useCallback(() => {
    audioControls.playClick();
    const isLastQuestionInRound = currentQuestionIndex >= questions.length - 1;

    if (isLastQuestionInRound) {
      if (incorrectlyAnswered.length > 0) {
        // Shuffle the incorrect questions for the review round
        const shuffledReview = [...incorrectlyAnswered].sort(() => Math.random() - 0.5);
        setQuestions(shuffledReview);
        setIncorrectlyAnswered([]);
        setCurrentQuestionIndex(0);
        setQuizMode('review');
      } else {
        setGameState('results');
      }
    } else {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    }
  }, [currentQuestionIndex, questions.length, incorrectlyAnswered, audioControls]);
  
  const handleAnswer = (question: QuizQuestion, points: number) => {
      const maxPoints = question.type === 'multiple-choice' ? 1 : (question as TrueFalseQuestion).statements.length;
      
      if (points < maxPoints) {
          setIncorrectlyAnswered(prev => {
              if (prev.find(q => q.id === question.id)) {
                  return prev;
              }
              return [...prev, question];
          });
          audioControls.playIncorrect();
      } else {
          audioControls.playCorrect();
      }
      
      if (quizMode === 'main') {
        setScore(prevScore => prevScore + points);
      }
  };

  const restartQuiz = () => {
    audioControls.playClick();
    setGameState('start');
  };

  const renderContent = () => {
    switch (gameState) {
      case 'quiz':
        return (
          <QuizScreen
            key={`${quizMode}-${questions[currentQuestionIndex].id}`}
            question={questions[currentQuestionIndex]}
            onAnswer={handleAnswer}
            onNext={handleNextQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            audioControls={audioControls}
            quizMode={quizMode}
          />
        );
      case 'results':
        return (
          <ResultScreen
            score={score}
            totalQuestions={totalScoreableItems}
            onRestart={restartQuiz}
          />
        );
      case 'start':
      default:
        return (
          <StartScreen 
            onStart={startQuiz}
            themeColor={themeColor}
            setThemeColor={setThemeColor}
            isMuted={isMuted}
            toggleMute={() => setIsMuted(prev => !prev)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white flex items-center justify-center p-4 font-sans">
       <main className="w-full max-w-4xl mx-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;