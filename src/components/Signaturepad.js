import React, { useRef, useState } from 'react';

function SignaturePad() {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const startDrawing = (event) => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        setIsDrawing(true);
        context.beginPath();
        context.moveTo(x, y);
    };

    const draw = (event) => {
        if (isDrawing) {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            context.lineTo(x, y);
            context.stroke();
        }
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearSignature = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
    };

    const saveSignature = () => {
        const canvas = canvasRef.current;
        const dataUrl = canvas.toDataURL();
        console.log(dataUrl);
        // You can do something with the dataUrl, like send it to a server or display it on the page
    };

    return (
        <div>
            <canvas
                ref={canvasRef}
                width={400}
                height={200}
                style={{ border: '2px solid #000', backgroundColor: '#fff', cursor: 'crosshair' }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
            ></canvas>
            <br />
            <button onClick={clearSignature}>Clear</button>
            <button onClick={saveSignature}>Save</button>
        </div>
    );
}

export default SignaturePad;
