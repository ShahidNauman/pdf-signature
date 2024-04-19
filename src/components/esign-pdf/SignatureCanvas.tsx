import React, { useEffect, useRef } from "react";
import type { SignaturePosition } from "./esign-pdf-types";

type SignatureCanvasProps = {
  signature: File;
  positions: SignaturePosition[];
  width?: number;
  height?: number;
  className?: string;
};

function SignatureCanvas({
  signature,
  positions,
  width,
  height,
  className = "",
  ...props
}: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        const signImage = new Image();
        signImage.src = URL.createObjectURL(signature);
        signImage.onload = () => {
          positions.forEach(
            ({ x, y, width: thisWidth, height: thisHeight }) => {
              const { width: signWidth, height: signHeight } = signImage;

              thisHeight = thisHeight || (thisWidth / signWidth) * signHeight;
              thisHeight = thisHeight < 50 ? 50 : thisHeight;

              const thisScale = thisWidth / thisHeight;
              const scaledWidth = signHeight / thisScale;
              const thisX = x + (thisWidth - scaledWidth) / 2;
              const thisY = canvas.height - y - thisHeight;

              ctx.drawImage(signImage, thisX, thisY, scaledWidth, thisHeight);
            }
          );
        };
      }
    }
  }, [signature, positions]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`${className}`}
      {...props}
    />
  );
}

export default SignatureCanvas;
