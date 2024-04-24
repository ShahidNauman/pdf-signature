import React from "react";
import Draggable from "react-draggable";
import { Position } from "./esign-pdf-types";

type SignatureProps = {
  signature: File;
  position: Position;
};

function Signature({ signature, position }: SignatureProps) {
  return (
    <Draggable>
      <div
        style={{
          position: "absolute",
          left: position.x,
          bottom: position.y,
          width: position.width,
          height: position.height,
        }}
      >
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
