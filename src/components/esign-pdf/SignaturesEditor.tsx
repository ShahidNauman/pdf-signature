import React from "react";
import type { Position } from "./esign-pdf-types";
import Signature from "./Signature";

type SignaturesEditorProps = {
  signature: File;
  positions: Position[];
  width?: number;
  height?: number;
  onPositionsChange?: (positions: Position[]) => void;
  className?: string;
};

function SignaturesEditor({
  signature,
  positions,
  width: pageWidth,
  height: pageHeight,
  onPositionsChange,
  className = "",
  ...props
}: SignaturesEditorProps) {
  return (
    <div
      className={`${className}`}
      style={{ position: "relative", width: pageWidth, height: pageHeight }}
      {...props}
    >
      {positions?.map((aPosition, index) => (
        <Signature
          key={"sign_" + index}
          signature={signature}
          position={aPosition}
        />
      ))}
    </div>
  );
}

export default SignaturesEditor;
