import {useState, useEffect} from 'react';
import {clock} from '../Clock';

export type ClockT = {
  beat: number;
  beatSpeed: number;
  tempo: number;
  tempoLastSet: number;
};

export const useClock = () => {
  const [beat, setBeat] = useState<number>(clock.beat);
  clock.setBeatCallback(setBeat);
  return {beat, setBeat: clock.setBeat};
};

export const useClock2 = (
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
