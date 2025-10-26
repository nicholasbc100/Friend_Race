import React, { useRef } from 'react';
import type { ImageFile } from '../types';
import Spinner from './Spinner';

interface PlayerCardProps {
  playerNumber: 1 | 2;
  playerName: string;
  onNameChange: (name: string) => void;
  onImageUpload: (imageFile: ImageFile) => void;
  faceImage: string | null;
  isLoading: boolean;
  disabled: boolean;
}

const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
);


const PlayerCard: React.FC<PlayerCardProps> = ({
  playerNumber,
  playerName,
  onNameChange,
  onImageUpload,
  faceImage,
  isLoading,
  disabled,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        onImageUpload({ base64, mimeType: file.type, name: file.name });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-gray-800 rounded-xl border-2 border-gray-700 w-full">
      <h3 className="text-2xl font-bold text-indigo-400">Player {playerNumber}</h3>
      <div 
        className="relative w-40 h-40 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden border-4 border-gray-600 cursor-pointer"
        onClick={triggerFileUpload}
      >
        {isLoading ? (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Spinner />
          </div>
        ) : faceImage ? (
          <img src={`data:image/png;base64,${faceImage}`} alt={`Player ${playerNumber} face`} className="w-full h-full object-cover" />
        ) : (
            <UserIcon className="w-24 h-24 text-gray-500" />
        )}
         <input
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
          disabled={disabled || isLoading}
        />
      </div>
       <button
        onClick={triggerFileUpload}
        disabled={disabled || isLoading}
        className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all"
       >
        {faceImage ? 'Change Photo' : 'Upload Photo'}
      </button>

      <input
        type="text"
        value={playerName}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder={`Enter Player ${playerNumber}'s Name`}
        disabled={disabled}
        className="w-full text-center p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow disabled:opacity-50"
      />
    </div>
  );
};

export default PlayerCard;
