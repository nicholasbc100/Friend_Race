import React, { useState, useCallback } from 'react';
import type { ImageFile, Player } from './types';
import { extractFace } from './services/geminiService';
import PlayerCard from './components/PlayerCard';
import RaceTrack from './components/RaceTrack';
import WinnerModal from './components/WinnerModal';

type GameState = 'setup' | 'racing' | 'finished';

const initialPlayerState: Player = {
    name: '',
    originalImage: null,
    faceImage: null,
    isLoading: false,
};

const App: React.FC = () => {
    const [player1, setPlayer1] = useState<Player>({ ...initialPlayerState });
    const [player2, setPlayer2] = useState<Player>({ ...initialPlayerState });
    const [gameState, setGameState] = useState<GameState>('setup');
    const [winner, setWinner] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    const handleImageUpload = useCallback(async (playerNumber: 1 | 2, imageFile: ImageFile) => {
        const setPlayer = playerNumber === 1 ? setPlayer1 : setPlayer2;
        setError(null);

        setPlayer(p => ({ ...p, isLoading: true, originalImage: imageFile, faceImage: null }));

        try {
            const faceData = await extractFace(imageFile.base64, imageFile.mimeType);
            setPlayer(p => ({ ...p, faceImage: faceData, isLoading: false }));
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
            setError(`Player ${playerNumber}: ${errorMessage}`);
            setPlayer(p => ({ ...p, isLoading: false, originalImage: null }));
        }
    }, []);

    const handleStartRace = () => {
        if (!player1.faceImage || !player2.faceImage) {
            setError("Both players need a face to race!");
            return;
        }
        setGameState('racing');
        setError(null);
        setWinner(null);
    };
    
    const handleRaceFinish = (winnerName: string) => {
        setWinner(winnerName);
        setGameState('finished');
    };

    const handlePlayAgain = () => {
        setPlayer1({ ...initialPlayerState, name: player1.name }); // Keep name
        setPlayer2({ ...initialPlayerState, name: player2.name }); // Keep name
        setGameState('setup');
        setWinner(null);
        setError(null);
    };

    const isSetupComplete = player1.faceImage && player2.faceImage;

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8 flex flex-col items-center">
            <div className="w-full max-w-4xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-game text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                        Friend Face Race
                    </h1>
                    <p className="mt-4 text-lg text-gray-400">
                        Who will win the ultimate showdown?
                    </p>
                </header>

                <main>
                    {gameState === 'setup' && (
                        <div className="flex flex-col items-center space-y-8">
                             {error && (
                                <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-md w-full" role="alert">
                                    <strong className="font-bold">Error: </strong>
                                    <span className="block sm:inline">{error}</span>
                                </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                                <PlayerCard
                                    playerNumber={1}
                                    playerName={player1.name}
                                    onNameChange={(name) => setPlayer1(p => ({ ...p, name }))}
                                    onImageUpload={(file) => handleImageUpload(1, file)}
                                    faceImage={player1.faceImage}
                                    isLoading={player1.isLoading}
                                    disabled={gameState !== 'setup'}
                                />
                                <PlayerCard
                                    playerNumber={2}
                                    playerName={player2.name}
                                    onNameChange={(name) => setPlayer2(p => ({ ...p, name }))}
                                    onImageUpload={(file) => handleImageUpload(2, file)}
                                    faceImage={player2.faceImage}
                                    isLoading={player2.isLoading}
                                    disabled={gameState !== 'setup'}
                                />
                            </div>
                            <button
                                onClick={handleStartRace}
                                disabled={!isSetupComplete || gameState !== 'setup'}
                                className="w-full max-w-md px-8 py-4 text-2xl font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all transform active:scale-95 shadow-lg disabled:shadow-none"
                            >
                                Start Race!
                            </button>
                        </div>
                    )}

                    {(gameState === 'racing' || gameState === 'finished') && player1.faceImage && player2.faceImage && (
                        <RaceTrack 
                            player1={{ name: player1.name || 'Player 1', faceImage: player1.faceImage }}
                            player2={{ name: player2.name || 'Player 2', faceImage: player2.faceImage }}
                            onRaceFinish={handleRaceFinish}
                        />
                    )}

                    {gameState === 'finished' && winner && (
                        <WinnerModal winnerName={winner} onPlayAgain={handlePlayAgain} />
                    )}
                </main>
            </div>
        </div>
    );
};

export default App;
