import { PDFField } from "pdf-lib";

export type Position = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type SignatureField = Position & {
  page: number;
  field: PDFField;
};

export type SignaturePosition = Position & {
  page: number;
  height?: number;
};
