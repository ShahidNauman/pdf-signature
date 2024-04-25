import React from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { Position } from "./esignpdf-types";

type SignatureProps = {
  signature: File;
  position: Position;
  onPositionChange?: (position: Position) => void;
};

function Signature({ signature, position, onPositionChange }: SignatureProps) {
  function handleMove(_e: DraggableEvent, data: DraggableData): false | void {
    onPositionChange?.({
      ...position,
      translateX: data.lastX,
      translateY: data.lastY,
    });
  }

  return (
    <Draggable onStop={handleMove}>
      <div style={{ ...position, position: "absolute" }}>
        <img
          src={URL.createObjectURL(signature)}
          alt=""
          width={"100%"}
          height={"100%"}
        />
      </div>
    </Draggable>
  );
}

export default Signature;
