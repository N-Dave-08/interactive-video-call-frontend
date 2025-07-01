import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';

// Define interface for body part
interface BodyPart {
  id: string;
  name: string;
  cx?: number;
  cy?: number;
  r?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

// Define interface for selected parts state
interface SelectedParts {
  [key: string]: { pain: boolean; touch: boolean };
}

const BodyMap: React.FC = () => {
  const [frontSelectedParts, setFrontSelectedParts] = useState<SelectedParts>({});
  const [backSelectedParts, setBackSelectedParts] = useState<SelectedParts>({});
  const [mode, setMode] = useState<'pain' | 'touch'>('pain');

  // Define body parts for front and back views
  const frontBodyParts: BodyPart[] = [
    { id: 'leftEye', name: 'Left Eye', cx: 95, cy: 57, r: 5 },
    { id: 'rightEye', name: 'Right Eye', cx: 105, cy: 57, r: 5 },
    { id: 'leftEar', name: 'Left Ear', cx: 80, cy: 60, r: 7 },
    { id: 'rightEar', name: 'Right Ear', cx: 120, cy: 60, r: 7 },
    { id: 'neck', name: 'Neck', x: 90, y: 85, width: 20, height: 30 },
    { id: 'leftShoulder', name: 'Left Shoulder', cx: 70, cy: 110, r: 15 },
    { id: 'rightShoulder', name: 'Right Shoulder', cx: 130, cy: 110, r: 15 },
    { id: 'chest', name: 'Chest', x: 75, y: 120, width: 50, height: 40 },
    { id: 'leftArm', name: 'Left Arm', x: 45, y: 115, width: 15, height: 50 },
    { id: 'rightArm', name: 'Right Arm', x: 140, y: 115, width: 15, height: 50 },
    { id: 'leftHand', name: 'Left Hand', cx: 52, cy: 175, r: 12 },
    { id: 'rightHand', name: 'Right Hand', cx: 148, cy: 175, r: 12 },
    { id: 'stomach', name: 'Stomach', x: 80, y: 160, width: 40, height: 30 },
    { id: 'private', name: 'Private Area', x: 90, y: 190, width: 20, height: 15 },
    { id: 'leftHip', name: 'Left Hip', cx: 85, cy: 205, r: 12 },
    { id: 'rightHip', name: 'Right Hip', cx: 115, cy: 205, r: 12 },
    { id: 'leftThigh', name: 'Left Thigh', x: 75, y: 220, width: 20, height: 45 },
    { id: 'rightThigh', name: 'Right Thigh', x: 105, y: 220, width: 20, height: 45 },
    { id: 'leftKnee', name: 'Left Knee', cx: 85, cy: 275, r: 10 },
    { id: 'rightKnee', name: 'Right Knee', cx: 115, cy: 275, r: 10 },
    { id: 'leftShin', name: 'Left Shin', x: 80, y: 285, width: 15, height: 40 },
    { id: 'rightShin', name: 'Right Shin', x: 110, y: 285, width: 15, height: 40 },
    { id: 'leftFoot', name: 'Left Foot', x: 75, y: 325, width: 20, height: 15 },
    { id: 'rightFoot', name: 'Right Foot', x: 105, y: 325, width: 20, height: 15 },
  ];

  const backBodyParts: BodyPart[] = [
    { id: 'leftEar', name: 'Left Ear', cx: 80, cy: 60, r: 7 },
    { id: 'rightEar', name: 'Right Ear', cx: 120, cy: 60, r: 7 },
    { id: 'neck', name: 'Neck', x: 90, y: 85, width: 20, height: 30 },
    { id: 'leftShoulder', name: 'Left Shoulder', cx: 70, cy: 110, r: 15 },
    { id: 'rightShoulder', name: 'Right Shoulder', cx: 130, cy: 110, r: 15 },
    { id: 'upperBack', name: 'Upper Back', x: 75, y: 120, width: 50, height: 40 },
    { id: 'leftArm', name: 'Left Arm', x: 45, y: 115, width: 15, height: 50 },
    { id: 'rightArm', name: 'Right Arm', x: 140, y: 115, width: 15, height: 50 },
    { id: 'leftHand', name: 'Left Hand', cx: 52, cy: 175, r: 12 },
    { id: 'rightHand', name: 'Right Hand', cx: 148, cy: 175, r: 12 },
    { id: 'lowerBack', name: 'Lower Back', x: 80, y: 160, width: 40, height: 30 },
    { id: 'private', name: 'Private Area', x: 90, y: 190, width: 20, height: 15 },
    { id: 'leftHip', name: 'Left Hip', cx: 85, cy: 205, r: 12 },
    { id: 'rightHip', name: 'Right Hip', cx: 115, cy: 205, r: 12 },
    { id: 'leftThigh', name: 'Left Thigh', x: 75, y: 220, width: 20, height: 45 },
    { id: 'rightThigh', name: 'Right Thigh', x: 105, y: 220, width: 20, height: 45 },
    { id: 'leftKnee', name: 'Left Knee', cx: 85, cy: 275, r: 10 },
    { id: 'rightKnee', name: 'Right Knee', cx: 115, cy: 275, r: 10 },
    { id: 'leftShin', name: 'Left Shin', x: 80, y: 285, width: 15, height: 40 },
    { id: 'rightShin', name: 'Right Shin', x: 110, y: 285, width: 15, height: 40 },
    { id: 'leftFoot', name: 'Left Foot', x: 75, y: 325, width: 20, height: 15 },
    { id: 'rightFoot', name: 'Right Foot', x: 105, y: 325, width: 20, height: 15 },
  ];

  const handlePartClick = (partId: string, view: 'front' | 'back'): void => {
    const setSelected = view === 'front' ? setFrontSelectedParts : setBackSelectedParts;
    setSelected(prev => {
      const current = prev[partId] || { pain: false, touch: false };
      return {
        ...prev,
        [partId]: {
          pain: mode === 'pain' ? !current.pain : current.pain,
          touch: mode === 'touch' ? !current.touch : current.touch,
        },
      };
    });
  };

  const clearAll = (): void => {
    setFrontSelectedParts({});
    setBackSelectedParts({});
  };

  const getPartFill = (partId: string, view: 'front' | 'back'): string => {
    const selection = view === 'front' ? frontSelectedParts[partId] : backSelectedParts[partId];
    if (!selection || (!selection.pain && !selection.touch)) return '#e2e8f0';
    if (selection.pain && selection.touch) {
      return 'url(#dualGradient)';
    }
    return selection.pain ? '#ef4444' : '#10b981';
  };

  const getPartStroke = (partId: string, view: 'front' | 'back'): string => {
    const selection = view === 'front' ? frontSelectedParts[partId] : backSelectedParts[partId];
    if (!selection || (!selection.pain && !selection.touch)) return '#94a3b8';
    if (selection.pain && selection.touch) {
      return '#374151'; // Neutral stroke for dual selection
    }
    return selection.pain ? '#dc2626' : '#059669';
  };

  const selectedCount: number =
    Object.entries(frontSelectedParts).reduce((count, [_, sel]) => count + (sel.pain ? 1 : 0) + (sel.touch ? 1 : 0), 0) +
    Object.entries(backSelectedParts).reduce((count, [_, sel]) => count + (sel.pain ? 1 : 0) + (sel.touch ? 1 : 0), 0);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Body Map</h2>
        <p className="text-gray-600">Tap on body parts to show where you feel something</p>
      </div>

      {/* Mode Selection */}
      <div className="flex gap-2 mb-4 justify-center">
        <button
          onClick={() => setMode('pain')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            mode === 'pain'
              ? 'bg-red-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          😢 Pain/Hurt
        </button>
        <button
          onClick={() => setMode('touch')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            mode === 'touch'
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          ✋ Touch
        </button>
      </div>

      {/* Body SVGs (Front and Back Side by Side) */}
      <div className="flex justify-center gap-8 mb-4">
        {/* Front View */}
        <div>
          <h3 className="text-center font-semibold text-gray-800 mb-2">Front View</h3>
          <svg width="200" height="360" viewBox="0 0 200 360" className="border rounded-lg bg-blue-50">
            <defs>
              <linearGradient id="dualGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="50%" stopColor="#ef4444" />
                <stop offset="50%" stopColor="#10b981" />
              </linearGradient>
            </defs>
            {frontBodyParts.map(part => (
              <g key={part.id}>
                {part.cx ? (
                  <circle
                    cx={part.cx}
                    cy={part.cy}
                    r={part.r}
                    fill={getPartFill(part.id, 'front')}
                    stroke={getPartStroke(part.id, 'front')}
                    strokeWidth="2"
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => handlePartClick(part.id, 'front')}
                  />
                ) : (
                  <rect
                    x={part.x}
                    y={part.y}
                    width={part.width}
                    height={part.height}
                    rx="5"
                    fill={getPartFill(part.id, 'front')}
                    stroke={getPartStroke(part.id, 'front')}
                    strokeWidth="2"
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => handlePartClick(part.id, 'front')}
                  />
                )}
              </g>
            ))}
            {/* Simple head outline for context */}
            <circle cx="100" cy="60" r="25" fill="none" stroke="#374151" strokeWidth="1" />
          </svg>
        </div>

        {/* Back View */}
        <div>
          <h3 className="text-center font-semibold text-gray-800 mb-2">Back View</h3>
          <svg width="200" height="360" viewBox="0 0 200 360" className="border rounded-lg bg-blue-50">
            <defs>
              <linearGradient id="dualGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="50%" stopColor="#ef4444" />
                <stop offset="50%" stopColor="#10b981" />
              </linearGradient>
            </defs>
            {backBodyParts.map(part => (
              <g key={part.id}>
                {part.cx ? (
                  <circle
                    cx={part.cx}
                    cy={part.cy}
                    r={part.r}
                    fill={getPartFill(part.id, 'back')}
                    stroke={getPartStroke(part.id, 'back')}
                    strokeWidth="2"
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => handlePartClick(part.id, 'back')}
                  />
                ) : (
                  <rect
                    x={part.x}
                    y={part.y}
                    width={part.width}
                    height={part.height}
                    rx="5"
                    fill={getPartFill(part.id, 'back')}
                    stroke={getPartStroke(part.id, 'back')}
                    strokeWidth="2"
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => handlePartClick(part.id, 'back')}
                  />
                )}
              </g>
            ))}
            {/* Simple head outline for context */}
            <circle cx="100" cy="60" r="25" fill="none" stroke="#374151" strokeWidth="1" />
          </svg>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={clearAll}
          className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          <RotateCcw size={16} />
          Clear All
        </button>
        <div className="text-sm text-gray-600">
          Selected: {selectedCount} sensation{selectedCount !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">How to use:</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-400 rounded border"></div>
            <span>Red = Pain or hurt</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-400 rounded border"></div>
            <span>Green = Touch or contact</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-r from-red-400 to-green-400 rounded border"></div>
            <span>Red/Green = Both Pain and Touch</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded border"></div>
            <span>Gray = No selection</span>
          </div>
        </div>
      </div>

      {/* Selected Parts Summary */}
      {selectedCount > 0 && (
        <div className="mt-4 bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Selected Areas:</h3>
          <div className="space-y-1">
            {[
              ...Object.entries(frontSelectedParts)
                .filter(([_, sel]) => sel.pain || sel.touch)
                .flatMap(([partId, sel]) => {
                  const part = frontBodyParts.find(p => p.id === partId);
                  const entries: { partId: string; type: string; view: string }[] = [];
                  if (sel.pain) entries.push({ partId, type: 'pain', view: 'Front' });
                  if (sel.touch) entries.push({ partId, type: 'touch', view: 'Front' });
                  return entries.map(entry => ({ ...entry, name: part?.name }));
                }),
              ...Object.entries(backSelectedParts)
                .filter(([_, sel]) => sel.pain || sel.touch)
                .flatMap(([partId, sel]) => {
                  const part = backBodyParts.find(p => p.id === partId);
                  const entries: { partId: string; type: string; view: string }[] = [];
                  if (sel.pain) entries.push({ partId, type: 'pain', view: 'Back' });
                  if (sel.touch) entries.push({ partId, type: 'touch', view: 'Back' });
                  return entries.map(entry => ({ ...entry, name: part?.name }));
                }),
            ].map(({ partId, type, view, name }) => (
              <div key={`${view}-${partId}-${type}`} className="flex items-center gap-2 text-sm">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    type === 'pain' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}
                >
                  {type === 'pain' ? '😢' : '✋'}
                </span>
                <span>
                  {name} ({view})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BodyMap;