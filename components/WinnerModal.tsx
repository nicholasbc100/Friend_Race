import React from 'react';

interface WinnerModalProps {
  winnerName: string;
  onPlayAgain: () => void;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ winnerName, onPlayAgain }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl text-center border-4 border-yellow-400 w-full max-w-md">
        <h2 className="text-2xl text-gray-300 mb-2">The Winner is...</h2>
        <p className="font-game text-4xl sm:text-5xl text-yellow-400 drop-shadow-lg mb-8 break-words">{winnerName}!</p>
        <button
          onClick={onPlayAgain}
          className="w-full px-6 py-3 text-lg font-bold text-gray-900 bg-yellow-400 rounded-md hover:bg-yellow-500 transition-all transform active:scale-95"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default WinnerModal;
