export type CellT = {
  active: boolean;
};

export type RowT = {
  cells: CellT[];
  note: number;
};

export type Sequencer = {
  rows: RowT[];
};
