export type ClockT = {
  beat: number;
  absBeat: number;
  lastBeats: number[];
  beatSpeed: number;
  tempo: number;
};

class Clock {
  private timeout?: ReturnType<typeof setTimeout> = undefined;
  tempo: number;
  beat: number;
  beatSpeed: number;
  beatCallback?: (beat: number) => any;
  lastTickTs: number;
  initTs: number;
  absBeat: number;

  constructor(
    tempo: number,
    beat: number,
    beatSpeed: number,
    beatCallback?: (beat: number) => any,
  ) {
    this.tempo = tempo;
    this.beat = beat;
    this.beatSpeed = beatSpeed;
    this.beatCallback = beatCallback;
    this.lastTickTs = 0;
    this.initTs = 0;
    this.absBeat = beat;
  }

  init() {
    const loop = () => {
      const now = new Date().getTime();
      this.setBeat(this.beat + this.beatSpeed);
      this.absBeat += 1;
      const wait = (this.absBeat * 1000 * 15) / this.tempo + this.initTs - now;
      this.timeout = setTimeout(loop, wait);
      this.lastTickTs = now;
    };
    const wait =
      (this.beat * 1000 * 15) / this.tempo + this.initTs - new Date().getTime();
    this.initTs = new Date().getTime();
    this.timeout = setTimeout(loop, wait);
  }

  setBeat(beat: number) {
    this.beat = beat;
    if (this.beatCallback) {
      this.beatCallback(this.beat);
    }
  }

  setTempo(tempo: number) {
    this.tempo = tempo;
    this.init();
  }

  setBeatSpeed(beatSpeed: number) {
    this.beatSpeed = beatSpeed;
    this.init();
  }

  setBeatCallback(callback: (beat: number) => any) {
    this.beatCallback = callback;
  }

  destructor() {
    if (this.timeout !== undefined) {
      clearTimeout(this.timeout);
    }
  }
}

export const clock = new Clock(120, 0, -1);
