export type ClockT = {
  beat: number;
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
  }

  init() {
    const loop = () => {
      const now = new Date().getTime();
      this.setBeat(this.beat + 1);
      const wait = (this.beat * 1000 * 15) / this.tempo + this.initTs - now;
      this.timeout = setTimeout(loop, wait);
      // const absT = now - this.initTs - (this.beat * (this.tempo / 60)) / 1000;
      // const diff = (now - this.lastTickTs) / 1000;
      this.lastTickTs = now;
    };
    const wait =
      (this.beat * 1000 * 15) / this.tempo + this.initTs - new Date().getTime();
    this.initTs = new Date().getTime();
    this.timeout = setTimeout(loop, wait);
  }

  // init2() {
  //   if (this.interval !== undefined) {
  //     clearInterval(this.interval);
  //   }
  //   this.initTs = new Date().getTime();
  //   this.interval = setInterval(() => {
  //     this.lastTickTs = t;
  //     this.setBeat(this.beat + this.beatSpeed);
  //     console.log(`tick ${this.beat}`);
  //   }, 1000 / (this.tempo / 60));
  // }

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

export const clock = new Clock(140, 0, 1);
