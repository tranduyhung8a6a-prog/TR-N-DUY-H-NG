import React from 'react';

interface StartScreenProps {
  onStart: () => void;
  themeColor: string;
  setThemeColor: (color: string) => void;
  isMuted: boolean;
  toggleMute: () => void;
}

const VolumeOnIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
  </svg>
);

const VolumeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
    </svg>
);

const StartScreen: React.FC<StartScreenProps> = ({ onStart, themeColor, setThemeColor, isMuted, toggleMute }) => {
  return (
    <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl text-center animate-fade-in relative">
      <div className="absolute top-4 right-4 flex items-center space-x-4">
        <div className="relative">
          <label htmlFor="theme-picker" className="cursor-pointer p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
          </label>
          <input 
            id="theme-picker"
            type="color" 
            value={themeColor} 
            onChange={(e) => setThemeColor(e.target.value)}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        <button onClick={toggleMute} className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
          {isMuted ? <VolumeOffIcon /> : <VolumeOnIcon />}
        </button>
      </div>
      <h1 
        className="text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[var(--theme-color-primary)] to-purple-500"
      >
        Chào mừng đến với Quizzi Lịch Sử
      </h1>
      <p className="text-lg text-gray-300 mb-8">
        Kiểm tra kiến thức của bạn về lịch sử Việt Nam và thế giới.
      </p>
      <button
        onClick={onStart}
        style={{ backgroundColor: themeColor }}
        className="text-white font-bold py-3 px-8 rounded-full text-xl hover:opacity-90 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-gray-900 ring-white/50 shadow-lg"
      >
        Bắt đầu
      </button>
    </div>
  );
};

export default StartScreen;