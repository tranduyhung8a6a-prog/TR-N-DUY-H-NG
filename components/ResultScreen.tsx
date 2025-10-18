import React from 'react';

interface ResultScreenProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ score, totalQuestions, onRestart }) => {
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  const getFeedback = () => {
    if (percentage >= 90) return { message: "Xuất sắc!", color: "text-green-400" };
    if (percentage >= 70) return { message: "Làm tốt lắm!", color: "text-blue-400" };
    if (percentage >= 50) return { message: "Khá tốt!", color: "text-yellow-400" };
    return { message: "Cần cố gắng hơn!", color: "text-red-400" };
  };

  const feedback = getFeedback();

  return (
    <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl text-center animate-fade-in">
      <h2 
        className="text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[var(--theme-color-primary)] to-purple-500"
      >
        Kết quả
      </h2>
      <p className={`text-2xl font-bold mb-4 ${feedback.color}`}>{feedback.message}</p>
      
      <div className="my-8">
        <p className="text-xl text-gray-300">Bạn đã trả lời đúng</p>
        <p className="text-6xl font-bold my-2">{score} / {totalQuestions}</p>
        <p className="text-3xl font-semibold text-gray-200">{percentage}%</p>
      </div>

      <button
        onClick={onRestart}
        style={{ backgroundColor: 'var(--theme-color-primary)' }}
        className="text-white font-bold py-3 px-8 rounded-full text-xl hover:opacity-90 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-gray-900 ring-white/50 shadow-lg"
      >
        Chơi lại
      </button>
    </div>
  );
};

export default ResultScreen;