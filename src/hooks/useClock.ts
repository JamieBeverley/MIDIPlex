import {useState, useEffect} from 'react';

export type Clock = {
  beat: number;
  beatSpeed: number;
  tempo: number;
  tempoLastSet: number;
};

export const useClock = (
  initialBeat?: number,
  initialBeatSpeed?: number,
  initialTempo?: number,
) => {
  const [beat, setBeat] = useState<number>(initialBeat || 0);
  const [beatSpeed, setBeatSpeed] = useState<number>(initialBeatSpeed || -1);
  const [tempo, setTempo] = useState<number>(initialTempo || 1);

  useEffect(() => {
    const int = setInterval(() => {
      setBeat(beat + beatSpeed);
    }, 1000 / tempo);

    return () => {
      clearInterval(int);
    };
  }, [tempo, beatSpeed, beat]);
  return {beat, beatSpeed, tempo, setTempo, setBeat, setBeatSpeed};
};
