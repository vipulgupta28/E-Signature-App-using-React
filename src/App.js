import React, { useRef, useState } from "react";
import "./styles.css";

function ESignatureApp() {
  const canvasRef = useRef(null);
  const [brushThickness, setBrushThickness] = useState(2);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    canvas.isDrawing = true;
  };

  const draw = (e) => {
    if (!canvasRef.current.isDrawing) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.strokeStyle = "black";
    ctx.lineWidth = brushThickness;
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!canvasRef.current.isDrawing) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.closePath();
    canvasRef.current.isDrawing = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const downloadSignature = (format) => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");

    if (format === "png") {
      link.download = "signature.png";
      link.href = canvas.toDataURL("image/png");
    } else if (format === "pdf") {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 10, 10, 190, 80); // Adjust positioning and size as needed
      link.download = "signature.pdf";
      link.href = pdf.output("dataurlstring");
    }

    link.click();
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>E-Signature App</h1>
      <canvas
        ref={canvasRef}
        width={900}
        height={500}
        style={{ border: "1px solid black", cursor: "crosshair" }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      <div style={{ marginTop: "20px" }}>
        <label style={{ marginRight: "10px" }}>
          Brush Thickness:
          <input
            type="range"
            min="1"
            max="10"
            value={brushThickness}
            onChange={(e) => setBrushThickness(e.target.value)}
            style={{ marginLeft: "10px" }}
          />
        </label>
        <button onClick={clearCanvas} style={{ marginRight: "10px" }}>
          Clear
        </button>
        <button
          onClick={() => downloadSignature("png")}
          style={{ marginRight: "10px" }}
        >
          Download as PNG
        </button>
        <button onClick={() => downloadSignature("pdf")}>
          Download as PDF
        </button>
      </div>
    </div>
  );
}

export default ESignatureApp;
