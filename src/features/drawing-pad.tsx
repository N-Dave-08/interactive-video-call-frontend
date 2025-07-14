import { Download, Eraser, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

interface Point {
	x: number;
	y: number;
}

const colors = [
	"#000000",
	"#FF0000",
	"#00FF00",
	"#0000FF",
	"#FFFF00",
	"#FF00FF",
	"#00FFFF",
	"#FFA500",
	"#800080",
	"#FFC0CB",
];

export default function DrawingPad() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [isDrawing, setIsDrawing] = useState(false);
	const [currentColor, setCurrentColor] = useState("#000000");
	const [brushSize, setBrushSize] = useState([5]);
	const [isEraser, setIsEraser] = useState(false);
	const [lastPoint, setLastPoint] = useState<Point | null>(null);

	const startDrawing = useCallback(
		(
			e:
				| React.MouseEvent<HTMLCanvasElement>
				| React.TouchEvent<HTMLCanvasElement>,
		) => {
			const canvas = canvasRef.current;
			if (!canvas) return;

			const rect = canvas.getBoundingClientRect();
			const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
			const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

			const point = {
				x: clientX - rect.left,
				y: clientY - rect.top,
			};

			setIsDrawing(true);
			setLastPoint(point);
		},
		[],
	);

	const draw = useCallback(
		(
			e:
				| React.MouseEvent<HTMLCanvasElement>
				| React.TouchEvent<HTMLCanvasElement>,
		) => {
			if (!isDrawing) return;

			const canvas = canvasRef.current;
			const ctx = canvas?.getContext("2d");
			if (!canvas || !ctx || !lastPoint) return;

			const rect = canvas.getBoundingClientRect();
			const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
			const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

			const currentPoint = {
				x: clientX - rect.left,
				y: clientY - rect.top,
			};

			ctx.beginPath();
			ctx.moveTo(lastPoint.x, lastPoint.y);
			ctx.lineTo(currentPoint.x, currentPoint.y);
			ctx.strokeStyle = isEraser ? "#FFFFFF" : currentColor;
			ctx.lineWidth = brushSize[0];
			ctx.lineCap = "round";
			ctx.lineJoin = "round";
			ctx.stroke();

			setLastPoint(currentPoint);
		},
		[isDrawing, lastPoint, currentColor, brushSize, isEraser],
	);

	const stopDrawing = useCallback(() => {
		setIsDrawing(false);
		setLastPoint(null);
	}, []);

	const clearCanvas = useCallback(() => {
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");
		if (!canvas || !ctx) return;

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		// Set white background
		ctx.fillStyle = "#FFFFFF";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}, []);

	const downloadDrawing = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const link = document.createElement("a");
		link.download = "drawing.png";
		link.href = canvas.toDataURL();
		link.click();
	}, []);

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");
		if (!canvas || !ctx) return;

		// Set canvas size
		canvas.width = 800;
		canvas.height = 600;

		// Set white background
		ctx.fillStyle = "#FFFFFF";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// Prevent scrolling when touching the canvas
		const preventDefault = (e: Event) => e.preventDefault();
		canvas.addEventListener("touchstart", preventDefault, { passive: false });
		canvas.addEventListener("touchend", preventDefault, { passive: false });
		canvas.addEventListener("touchmove", preventDefault, { passive: false });

		return () => {
			canvas.removeEventListener("touchstart", preventDefault);
			canvas.removeEventListener("touchend", preventDefault);
			canvas.removeEventListener("touchmove", preventDefault);
		};
	}, []);

	return (
		<div className="w-full max-w-6xl mx-auto p-4 space-y-4">
			<Card>
				<CardContent className="space-y-4">
					{/* Drawing Tools */}
					<div className="flex flex-wrap items-center gap-4 p-4 bg-muted/50 rounded-lg border">
						{/* Color Palette */}
						<div className="flex items-center gap-2">
							<span className="text-sm font-medium">Colors:</span>
							<div className="flex gap-1">
								{colors.map((color) => (
									<Button
										key={color}
										variant={
											currentColor === color && !isEraser
												? "default"
												: "outline"
										}
										size="sm"
										className={`w-8 h-8 p-0 rounded-full border-2 transition-all ${
											currentColor === color && !isEraser
												? "border-primary scale-110"
												: "hover:scale-105"
										}`}
										style={{
											backgroundColor:
												currentColor === color && !isEraser ? color : color,
										}}
										onClick={() => {
											setCurrentColor(color);
											setIsEraser(false);
										}}
										aria-label={`Select ${color} color`}
									/>
								))}
							</div>
						</div>

						{/* Brush Size */}
						<div className="flex items-center gap-2">
							<span className="text-sm font-medium">Size:</span>
							<div className="w-24">
								<Slider
									value={brushSize}
									onValueChange={setBrushSize}
									max={50}
									min={1}
									step={1}
								/>
							</div>
							<span className="text-sm text-gray-600 w-8">
								{brushSize[0]}px
							</span>
						</div>

						{/* Tools */}
						<div className="flex gap-2">
							<Button
								variant={isEraser ? "default" : "outline"}
								size="sm"
								onClick={() => setIsEraser(!isEraser)}
								className="flex items-center gap-1"
							>
								<Eraser className="h-4 w-4" />
								Eraser
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={clearCanvas}
								className="flex items-center gap-1 bg-transparent"
							>
								<RotateCcw className="h-4 w-4" />
								Clear
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={downloadDrawing}
								className="flex items-center gap-1 bg-transparent"
							>
								<Download className="h-4 w-4" />
								Download
							</Button>
						</div>
					</div>

					{/* Canvas */}
					<div className="flex justify-center">
						<canvas
							ref={canvasRef}
							className="border-2 border-gray-300 rounded-lg cursor-crosshair touch-none"
							onMouseDown={startDrawing}
							onMouseMove={draw}
							onMouseUp={stopDrawing}
							onMouseLeave={stopDrawing}
							onTouchStart={startDrawing}
							onTouchMove={draw}
							onTouchEnd={stopDrawing}
							style={{ maxWidth: "100%", height: "auto" }}
						/>
					</div>

					{/* Instructions */}
					<div className="text-center space-y-1">
						<p className="text-sm text-muted-foreground">
							Click and drag to draw • Use the eraser tool to remove parts •
							Clear to start over
						</p>
						<p className="text-xs text-muted-foreground">
							Touch and drag on mobile devices
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
