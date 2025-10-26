import React, { useState, useEffect, useRef } from 'react';

interface RaceTrackProps {
  player1: { name: string; faceImage: string };
  player2: { name: string; faceImage: string };
  onRaceFinish: (winnerName: string) => void;
}

const RaceTrack: React.FC<RaceTrackProps> = ({ player1, player2, onRaceFinish }) => {
  const [p1Position, setP1Position] = useState(0);
  const [p2Position, setP2Position] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const trackRef = useRef<HTMLDivElement>(null);
  // FIX: Initialize useRef with a value. 0 is a safe initial value for animation frame IDs.
  const animationFrameRef = useRef<number>(0);
  const winnerDeclaredRef = useRef(false);


  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown(c => c - 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(countdownInterval);
    }, 4000);


    return () => clearInterval(countdownInterval);
  }, []);

  useEffect(() => {
    if (countdown > 0) return;

    const race = () => {
        if(winnerDeclaredRef.current) return;

        const finishLine = (trackRef.current?.offsetWidth ?? window.innerWidth) - 80; // 80 is face width

        let p1Done = false;
        let p2Done = false;

        setP1Position(pos => {
            if (pos >= finishLine) return finishLine;
            const newPos = pos + Math.random() * 5;
            if (newPos >= finishLine) {
                p1Done = true;
                return finishLine;
            }
            return newPos;
        });

        setP2Position(pos => {
            if (pos >= finishLine) return finishLine;
            const newPos = pos + Math.random() * 5;
            if (newPos >= finishLine) {
                p2Done = true;
                return finishLine;
            }
            return newPos;
        });

        if (p1Done && !winnerDeclaredRef.current) {
            winnerDeclaredRef.current = true;
            onRaceFinish(player1.name);
            // FIX: Remove non-null assertion as ref is now initialized and guaranteed to be a number.
            cancelAnimationFrame(animationFrameRef.current);
            return;
        }

        if (p2Done && !winnerDeclaredRef.current) {
            winnerDeclaredRef.current = true;
            onRaceFinish(player2.name);
            // FIX: Remove non-null assertion as ref is now initialized and guaranteed to be a number.
            cancelAnimationFrame(animationFrameRef.current);
            return;
        }

      animationFrameRef.current = requestAnimationFrame(race);
    };

    animationFrameRef.current = requestAnimationFrame(race);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [countdown, onRaceFinish, player1.name, player2.name]);

  const FaceComponent = ({ position, image, name }: { position: number, image: string, name: string }) => (
    <div className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center" style={{ left: `${position}px`, transition: 'left 0.1s linear' }}>
        <img
            src={`data:image/png;base64,${image}`}
            alt={`${name}'s face`}
            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
        />
        <span className="mt-2 text-white bg-black bg-opacity-50 px-2 py-1 rounded text-sm font-semibold">{name}</span>
    </div>
  );

  return (
    <div className="w-full h-96 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg p-4 relative overflow-hidden border-4 border-gray-600" ref={trackRef}>
      {countdown > 0 ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
            <span className="font-game text-9xl text-yellow-400 drop-shadow-lg">{countdown}</span>
        </div>
      ) : countdown === 0 ? (
         <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20 animate-ping-once" style={{animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) 1'}}>
            <span className="font-game text-9xl text-green-400 drop-shadow-lg">GO!</span>
        </div>
      ) : null}
      
      <div className="h-1/2 border-b-4 border-dashed border-white opacity-50 relative">
        <FaceComponent position={p1Position} image={player1.faceImage} name={player1.name} />
      </div>
      <div className="h-1/2 relative">
         <FaceComponent position={p2Position} image={player2.faceImage} name={player2.name} />
      </div>

      <div className="absolute top-0 right-5 h-full w-2 bg-checkered z-10" style={{ backgroundImage: `repeating-linear-gradient(0deg, #fff, #fff 10px, #000 10px, #000 20px)`}}></div>
      <div className="absolute top-0 right-5 h-full w-12 flex items-center justify-center z-10">
        <span className="font-game text-white -rotate-90 text-2xl tracking-widest">FINISH</span>
      </div>
    </div>
  );
};

export default RaceTrack;