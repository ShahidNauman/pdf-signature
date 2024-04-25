import React, { SyntheticEvent } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { Resizable, ResizeCallbackData } from "react-resizable";
import "react-resizable/css/styles.css";
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

  function handleResize(
    _e: SyntheticEvent<Element, Event>,
    data: ResizeCallbackData
  ) {
    onPositionChange?.({
      ...position,
      width: data.size.width,
      height: data.size.height,
    });
  }

  return (
    <Draggable onStop={handleMove}>
      <Resizable
        width={position.width}
        height={position.height}
        onResize={handleResize}
      >
        <div style={{ ...position, position: "absolute" }}>
          <img
            src={URL.createObjectURL(signature)}
            alt=""
            width={"100%"}
            height={"100%"}
          />
        </div>
      </Resizable>
    </Draggable>
  );
}

export default Signature;
