import React, { useState, useEffect, useMemo } from 'react';
import { QuizQuestion, TrueFalseQuestion, TrueFalseStatement } from '../types';

interface QuizScreenProps {
  question: QuizQuestion;
  onAnswer: (question: QuizQuestion, points: number) => void;
  onNext: () => void;
  questionNumber: number;
  totalQuestions: number;
  audioControls: {
    playCorrect: () => void;
    playIncorrect: () => void;
    playClick: () => void;
  };
  quizMode: 'main' | 'review';
}

const CorrectIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const IncorrectIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);


const MultipleChoiceView: React.FC<{
    question: QuizQuestion, 
    onAnswer: (question: QuizQuestion, points: number) => void,
    onNext: () => void,
    audioControls: QuizScreenProps['audioControls']
}> = ({ question, onAnswer, onNext, audioControls }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const mcQuestion = question.type === 'multiple-choice' ? question : null;

  const shuffledOptions = useMemo(() => {
    if (!mcQuestion) return [];
    return [...mcQuestion.options].sort(() => Math.random() - 0.5);
  }, [mcQuestion]);


  useEffect(() => {
    if (isAnswered) {
      const timer = setTimeout(() => {
        onNext();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isAnswered, onNext]);

  const handleOptionClick = (option: string) => {
    if (isAnswered || !mcQuestion) return;
    
    setIsAnswered(true);
    setSelectedOption(option);
    if (option === mcQuestion.answer) {
      onAnswer(mcQuestion, 1);
    } else {
      onAnswer(mcQuestion, 0);
    }
  };
  
  if (!mcQuestion) return null;

  const getOptionClass = (option: string) => {
    if (!isAnswered) {
      return 'bg-gray-700 hover:bg-[var(--theme-color-primary)]';
    }
    if (option === mcQuestion.answer) {
      return `bg-green-600 ${option === selectedOption ? 'animate-pulse-correct' : ''}`;
    }
    if (option === selectedOption && option !== mcQuestion.answer) {
      return 'bg-red-600 animate-shake-incorrect';
    }
    return 'bg-gray-700 opacity-50';
  };

  return (
    <div>
        <h2 className="text-2xl font-bold mb-6 text-gray-100">{mcQuestion.question}</h2>
        <div className="space-y-4">
            {shuffledOptions.map((option, index) => (
            <button
                key={index}
                onClick={() => handleOptionClick(option)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex justify-between items-center ${getOptionClass(option)}`}
            >
                <span className="text-lg">{option}</span>
                {isAnswered && option === mcQuestion.answer && <CorrectIcon />}
                {isAnswered && option === selectedOption && option !== mcQuestion.answer && <IncorrectIcon />}
            </button>
            ))}
        </div>
    </div>
  );
};


const TrueFalseView: React.FC<{
    question: TrueFalseQuestion, 
    onAnswer: (question: QuizQuestion, points: number) => void,
    onNext: () => void,
    audioControls: QuizScreenProps['audioControls']
}> = ({ question, onAnswer, onNext, audioControls }) => {
  const [userAnswers, setUserAnswers] = useState<Record<string, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const shuffledStatements = useMemo(() => {
    return [...question.statements].sort(() => Math.random() - 0.5);
  }, [question]);

  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        onNext();
      }, 5000); // Longer delay for reviewing T/F answers
      return () => clearTimeout(timer);
    }
  }, [isSubmitted, onNext]);
  
  const handleSelectAnswer = (statementId: string, answer: boolean) => {
      if (isSubmitted) return;
      audioControls.playClick();
      setUserAnswers(prev => ({ ...prev, [statementId]: answer }));
  };
  
  const handleSubmit = () => {
      if (isSubmitted) return;
      setIsSubmitted(true);
      let points = 0;
      question.statements.forEach(statement => {
          if (userAnswers[statement.id] === statement.answer) {
              points++;
          }
      });
      // Play a single summary sound
      if (points === question.statements.length) {
        // Correct sound handled by onAnswer
      } else if (points === 0) {
        // Incorrect sound handled by onAnswer
      } else {
        audioControls.playClick(); // Neutral sound for mixed results
      }
      onAnswer(question, points);
  };

  const getStatementClass = (statement: TrueFalseStatement) => {
    if (!isSubmitted) return 'bg-gray-700';
    const userAnswer = userAnswers[statement.id];
    if (userAnswer === statement.answer) return 'bg-green-600/70';
    return 'bg-red-600/70';
  }

  return (
    <div>
      <p className="text-md text-gray-400 mb-4 whitespace-pre-wrap">{question.context}</p>
      <div className="space-y-4">
        {shuffledStatements.map((statement) => (
          <div key={statement.id} className={`p-4 rounded-lg transition-colors duration-300 ${getStatementClass(statement)}`}>
            <p className="text-lg mb-3">{statement.id.toUpperCase()}. {statement.text}</p>
            <div className="flex space-x-4">
              <button 
                onClick={() => handleSelectAnswer(statement.id, true)}
                disabled={isSubmitted}
                className={`px-6 py-2 rounded-md font-semibold transition-all duration-200 transform ${userAnswers[statement.id] === true ? 'bg-[var(--theme-color-primary)] ring-2 ring-white scale-105' : 'bg-gray-600 hover:bg-[var(--theme-color-primary)]/80 hover:scale-105'}`}
              >
                Đúng
              </button>
              <button 
                onClick={() => handleSelectAnswer(statement.id, false)}
                disabled={isSubmitted}
                className={`px-6 py-2 rounded-md font-semibold transition-all duration-200 transform ${userAnswers[statement.id] === false ? 'bg-orange-500 ring-2 ring-white scale-105' : 'bg-gray-600 hover:bg-orange-700 hover:scale-105'}`}
              >
                Sai
              </button>
            </div>
          </div>
        ))}
      </div>
      {!isSubmitted && (
        <div className="mt-8 text-center">
            <button
                onClick={handleSubmit}
                disabled={Object.keys(userAnswers).length !== question.statements.length}
                className="bg-purple-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-110 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100"
            >
                Kiểm tra
            </button>
        </div>
      )}
    </div>
  );
};


const QuizScreen: React.FC<QuizScreenProps> = ({ question, onAnswer, onNext, questionNumber, totalQuestions, audioControls, quizMode }) => {
  return (
    <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full animate-fade-in">
        {quizMode === 'review' && (
            <div className="mb-4 p-3 bg-yellow-500/20 text-yellow-300 rounded-lg text-center font-semibold">
                Chế độ ôn tập: Trả lời lại các câu sai
            </div>
        )}
        <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
                <p className="text-xl font-semibold text-blue-300">Câu hỏi {questionNumber} / {totalQuestions}</p>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2.5">
                <div className="bg-gradient-to-r from-[var(--theme-color-primary)] to-purple-500 h-2.5 rounded-full" style={{ width: `${(questionNumber / totalQuestions) * 100}%`, transition: 'width 0.5s ease-in-out' }}></div>
            </div>
        </div>

        {question.type === 'multiple-choice' ? (
            <MultipleChoiceView question={question} onAnswer={onAnswer} onNext={onNext} audioControls={audioControls} />
        ) : (
            <TrueFalseView question={question as TrueFalseQuestion} onAnswer={onAnswer} onNext={onNext} audioControls={audioControls} />
        )}
    </div>
  );
};

export default QuizScreen;