import React, { useRef, useState, useEffect } from 'react';
import { Palette, Square, Download, RotateCcw, Minus, Plus } from 'lucide-react';

const DrawingPad: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [color, setColor] = useState<string>('#000000');
  const [brushSize, setBrushSize] = useState<number>(5);
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');

  const colors: string[] = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
    '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB'
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error('Canvas reference is null');
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Failed to get 2D context');
      return;
    }
   
    canvas.width = 800;
    canvas.height = 600;
   
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
   
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
   
    // Test drawing
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.lineTo(200, 200);
    ctx.stroke();
   
    console.log('Canvas initialized successfully');
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    console.log('Start drawing', e);
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
   
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    console.log('Drawing', e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
   
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
   
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
    }
   
    ctx.lineWidth = brushSize;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    console.log('Stop drawing');
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    console.log('Touch start', e);
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    canvasRef.current?.dispatchEvent(mouseEvent);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    console.log('Touch move', e);
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    canvasRef.current?.dispatchEvent(mouseEvent);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    console.log('Touch end');
    const mouseEvent = new MouseEvent('mouseup', {});
    canvasRef.current?.dispatchEvent(mouseEvent);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>Drawing Pad</h1>
     
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setTool('brush')}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', borderRadius: '0.375rem',
              backgroundColor: tool === 'brush' ? '#3b82f6' : '#e5e7eb', color: tool === 'brush' ? 'white' : '#374151'
            }}
          >
            <Palette size={16} />
            Brush
          </button>
          <button
            onClick={() => setTool('eraser')}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', borderRadius: '0.375rem',
              backgroundColor: tool === 'eraser' ? '#3b82f6' : '#e5e7eb', color: tool === 'eraser' ? 'white' : '#374151'
            }}
          >
            <Square size={16} />
            Eraser
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.25rem' }}>
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              style={{
                width: '2rem', height: '2rem', borderRadius: '9999px', border: `2px solid ${color === c ? '#1f2937' : '#d1d5db'}`,
                backgroundColor: c
              }}
            />
          ))}
          <input
            type="color"
            value={color}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setColor(e.target.value)}
            style={{ width: '2rem', height: '2rem', borderRadius: '9999px', border: '2px solid #d1d5db', cursor: 'pointer' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setBrushSize(Math.max(1, brushSize - 1))}
            style={{ padding: '0.25rem', backgroundColor: '#e5e7eb', borderRadius: '0.25rem' }}
          >
            <Minus size={16} />
          </button>
          <span style={{ fontSize: '0.875rem', fontWeight: '500', width: '2rem', textAlign: 'center' }}>{brushSize}</span>
          <button
            onClick={() => setBrushSize(Math.min(50, brushSize + 1))}
            style={{ padding: '0.25rem', backgroundColor: '#e5e7eb', borderRadius: '0.25rem' }}
          >
            <Plus size={16} />
          </button>
          <div style={{ marginLeft: '0.5rem' }}>
            <div style={{ width: brushSize, height: brushSize, borderRadius: '9999px', backgroundColor: 'black' }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={clearCanvas}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', backgroundColor: '#ef4444', color: 'white', borderRadius: '0.375rem' }}
          >
            <RotateCcw size={16} />
            Clear
          </button>
          <button
            onClick={downloadDrawing}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', backgroundColor: '#22c55e', color: 'white', borderRadius: '0.375rem' }}
          >
            <Download size={16} />
            Download
          </button>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', padding: '1rem' }}>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ touchAction: 'none', width: '800px', height: '600px', backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '0.25rem', cursor: 'crosshair' }}
        />
      </div>

      <p style={{ color: '#4b5563', fontSize: '0.875rem', marginTop: '1rem', textAlign: 'center' }}>
        Click and drag to draw • Use the toolbar to change colors, brush size, or switch to eraser
      </p>
    </div>
  );
};

export default DrawingPad;