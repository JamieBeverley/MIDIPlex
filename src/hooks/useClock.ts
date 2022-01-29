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
  console.log('?');
  useEffect(() => {
    const int = setInterval(() => {
      console.log(new Date().getTime());
      setBeat(beat + beatSpeed);
    }, 1000 / tempo);

    return () => {
      console.log('cleanup');
      clearInterval(int);
    };
  });
  // return {beat, beatSpeed, tempo, setTempo, setBeat, setBeatSpeed};
  return {beat};
};
