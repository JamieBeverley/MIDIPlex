export type Scale = number[];

export const Scales: Record<string, Scale> = {
  major: [0, 2, 4, 5, 7, 9, 11, 12],
  minor: [0, 2, 3, 5, 7, 8, 10, 12],
  'minor pentatonic': [0, 3, 5, 7, 10, 12],
  'harmonic minor': [0, 2, 3, 5, 7, 8, 11, 12],
  'melodic minor asc.': [0, 2, 3, 5, 7, 9, 11, 12],
  empty: [],
};

export type ScaleName = keyof typeof Scales;
