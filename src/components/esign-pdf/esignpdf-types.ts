export type Position = {
  left: number;
  top: number;
  width: number;
  height: number;
  translateX?: number;
  translateY?: number;
};

export type SignatureField = Omit<Position, "translateX" | "translateY"> & {
  page: number;
};

export type SignaturePosition = Position & {
  page: number;
};
