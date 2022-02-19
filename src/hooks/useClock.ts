import {useState} from 'react';
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
  return {beat, setBeat: clock.setBeat, setTempo: clock.setTempo};
};
