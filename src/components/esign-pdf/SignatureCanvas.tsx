import React from "react";
import type { Position } from "./esign-pdf-types";

type SignatureCanvasProps = {
  signature: File;
  positions: Position[];
  width?: number;
  height?: number;
  onPositionsChange?: (positions: Position[]) => void;
  className?: string;
};

function SignatureCanvas({
  signature,
  positions,
  width: pageWidth,
  height: pageHeight,
  onPositionsChange,
  className = "",
  ...props
}: SignatureCanvasProps) {
  return (
    <div
      className={`${className}`}
      style={{ position: "relative", width: pageWidth, height: pageHeight }}
      {...props}
    >
      {positions?.map(({ x, y, width, height }, index) => (
        <img
          key={"sign_" + index}
          src={URL.createObjectURL(signature)}
          alt=""
          width={width}
          height={height}
          style={{
            position: "absolute",
            left: x,
            bottom: y,
          }}
        />
      ))}
    </div>
  );
}

export default SignatureCanvas;
