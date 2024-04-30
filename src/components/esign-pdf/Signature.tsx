import React, { SyntheticEvent, useEffect, useRef, useState } from "react";
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
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isResizing, setIsResizing] = useState<boolean>(false);

  const signatureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        signatureRef.current &&
        !signatureRef.current.contains(e.target as Node)
      ) {
        setIsSelected(false);
      }
    }

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  function handleDragMouseDown(_e: MouseEvent): void {
    // console.log("Drag Mouse Downed! isResizing:", isResizing);
    if (!isResizing) {
      setIsSelected(true);
      setIsDragging(true);
    }
  }

  // function handleDragStart(
  //   e: DraggableEvent,
  //   data: DraggableData
  // ): false | void {
  //   console.log("Drag Started! isResizing:", isResizing);
  //   if (!isResizing) {
  //   }
  // }

  // function handleDrag(e: DraggableEvent, data: DraggableData): false | void {
  //   console.log("Dragging... isResizing:", isResizing);
  //   if (!isResizing) {
  //   }
  // }

  function handleDragStop(_e: DraggableEvent, { x, y }: DraggableData) {
    // console.log("Drag Stopped! isResizing:", isResizing);
    if (!isResizing) {
      onPositionChange?.({ ...position, left: x, top: y });
      setIsDragging(false);
    }
  }

  function handleResizeStart(
    e: SyntheticEvent<Element, Event>,
    _data: ResizeCallbackData
  ) {
    // console.warn("Resize Started! isDragging:", isDragging);
    if (!isDragging) {
      e.stopPropagation();
      setIsResizing(true);
    }
  }

  function handleResize(
    _e: SyntheticEvent<Element, Event>,
    { size }: ResizeCallbackData
  ) {
    // console.warn("Resizing... isDragging:", isDragging);
    if (!isDragging) {
      onPositionChange?.({
        ...position,
        width: size.width,
        height: size.height,
      });
    }
  }

  function handleResizeStop(
    _e: SyntheticEvent<Element, Event>,
    _data: ResizeCallbackData
  ) {
    // console.warn("Resize Stoped! isDragging:", isDragging);
    if (!isDragging) {
      setIsResizing(false);
    }
  }

  return (
    <Draggable
      position={{ x: position.left, y: position.top }}
      onMouseDown={handleDragMouseDown}
      // onStart={handleDragStart}
      // onDrag={handleDrag}
      onStop={handleDragStop}
    >
      <Resizable
        width={position.width}
        height={position.height}
        onResizeStart={handleResizeStart}
        onResize={handleResize}
        onResizeStop={handleResizeStop}
      >
        <div
          ref={signatureRef}
          style={{
            width: position.width + Number(isSelected) * 2,
            height: position.height + Number(isSelected) * 2,
            position: "absolute",
            ...(isSelected && { border: "1px dashed #000", margin: "-1px" }),
          }}
        >
          <img
            src={URL.createObjectURL(signature)}
            alt=""
            width="100%"
            height="100%"
          />
        </div>
      </Resizable>
    </Draggable>
  );
}

export default Signature;
