// drawingUtils.js
export const drawRectangle = (
  rectangle,
  context,
  viewport,
  borderColor,
  lineWidth
) => {
  const rect = viewport.convertToViewportRectangle(rectangle);
  context.strokeStyle = borderColor;
  context.lineWidth = lineWidth;
  context.strokeRect(rect[0], rect[1], rect[2] - rect[0], rect[3] - rect[1]);
};

// export const drawSignatureImage = (image, canvas, rect, viewport, context) => {
//   const rectViewport = viewport.convertToViewportRectangle(rect);
//   const imageObj = new Image();
//   imageObj.src = image;
//   imageObj.onload = () => {
//     const scaleFactorX = (rectViewport[2] - rectViewport[0]) / imageObj.width;
//     const scaleFactorY = (rectViewport[3] - rectViewport[1]) / imageObj.height;
//     const scaledImageWidth = imageObj.width * scaleFactorX;
//     const scaledImageHeight = imageObj.height * scaleFactorY;
//     const offsetX = rectViewport[0];
//     const offsetY = rectViewport[1] - 80;
//     context.drawImage(
//       imageObj,
//       offsetX,
//       offsetY,
//       scaledImageWidth,
//       scaledImageHeight
//     );
//   };
// };
/**
 * 
   // Draw a rectangle on the canvas
  const drawRectangle = (
    rectangle,
    context,
    viewport,
    borderColor,
    lineWidth
  ) => {
    const rect = viewport.convertToViewportRectangle(rectangle);
    context.strokeStyle = borderColor;
    context.lineWidth = lineWidth;
    context.strokeRect(rect[0], rect[1], rect[2] - rect[0], rect[3] - rect[1]);
  };
 */
// drawSignatureImage
export const drawSignatureImage = (
  signatureImage,
  canvas,
  ractangle,
  viewport,
  context
) => {
  const rect = viewport.convertToViewportRectangle(ractangle);
  const image = new Image();
  image.width = 100;
  image.height = 100;
  image.src = signatureImage;
  image.onload = () => {
    context.drawImage(
      image,
      rect[0],
      rect[1],
      rect[2] - rect[0], // height
      rect[3] - rect[1] // width
    );
    //   containerRef.current.appendChild(canvas);

    // const imageWidth = image.width;
    // const imageHeight = image.height;
    // const scaleFactorX = (rect[2] - rect[0]) / imageWidth;
    // const scaleFactorY = (rect[3] - rect[1]) / imageHeight;
    // const scaledImageWidth = imageWidth * scaleFactorX;
    // const scaledImageHeight = imageHeight * scaleFactorY;
    // const offsetX = rect[0];
    // const offsetY = rect[1] - 80;
    // context.drawImage(
    //   image,
    //   offsetX,
    //   offsetY,
    //   100,
    //   100
    //   // scaledImageWidth,
    //   // scaledImageHeight
    // );
    // containerRef.current.appendChild(canvas);
  };
};
