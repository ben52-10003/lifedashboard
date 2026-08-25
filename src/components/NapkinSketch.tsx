import { useEffect, useRef } from "react";

interface NapkinSketchProps {
  value: string;
  onChange: (dataUrl: string) => void;
}

const WIDTH = 640;
const HEIGHT = 240;

export function NapkinSketch({ value, onChange }: NapkinSketchProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    context.fillStyle = "#faf6f0";
    context.fillRect(0, 0, WIDTH, HEIGHT);

    if (!value) return;
    const image = new Image();
    image.onload = () => {
      context.drawImage(image, 0, 0, WIDTH, HEIGHT);
    };
    image.src = value;
  }, [value]);

  function position(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * WIDTH,
      y: ((event.clientY - rect.top) / rect.height) * HEIGHT,
    };
  }

  function strokeStyle(context: CanvasRenderingContext2D) {
    context.strokeStyle = "#2c2416";
    context.lineWidth = 2.2;
    context.lineCap = "round";
    context.lineJoin = "round";
  }

  function handlePointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    drawing.current = true;
    canvas.setPointerCapture(event.pointerId);
    const point = position(event);
    context.beginPath();
    context.moveTo(point.x, point.y);
    strokeStyle(context);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const context = canvasRef.current?.getContext("2d");
    if (!context) return;
    const point = position(event);
    context.lineTo(point.x, point.y);
    strokeStyle(context);
    context.stroke();
  }

  function handlePointerUp() {
    if (!drawing.current) return;
    drawing.current = false;
    const canvas = canvasRef.current;
    if (canvas) onChange(canvas.toDataURL("image/png"));
  }

  function handleClear() {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    context.fillStyle = "#faf6f0";
    context.fillRect(0, 0, WIDTH, HEIGHT);
    onChange("");
  }

  return (
    <div className="napkin-sketch">
      <canvas
        ref={canvasRef}
        className="napkin-canvas"
        width={WIDTH}
        height={HEIGHT}
        aria-label="Napkin sketch"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />
      <button type="button" className="activity-remove" onClick={handleClear}>
        Clear sketch
      </button>
    </div>
  );
}
