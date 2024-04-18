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
        const sigImage = new Image();
        sigImage.src = URL.createObjectURL(signature);
        sigImage.onload = () => {
          positions.forEach(
            ({ x, y, width: thisWidth, height: thisHeight }) => {
              // Scale the sigImage to fit inside thisWidth and thisHeight
              const thisAspectRatio = thisWidth / (thisHeight || 0);
              const scaledWidth = sigImage.width / thisAspectRatio;
              const scaledHeight = sigImage.height / thisAspectRatio;
              ctx.drawImage(sigImage, x, y, scaledWidth, scaledHeight);
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
