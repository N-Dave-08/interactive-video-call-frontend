import { useState, useRef } from 'react';

const ScreenRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState('');


  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const startRecording = async () => {
    try {
      setError('');

      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: { width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: true
      });

      try {
        const micStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });

        const audioContext = new AudioContext();
        const destination = audioContext.createMediaStreamDestination();

        if (displayStream.getAudioTracks().length > 0) {
          const systemSource = audioContext.createMediaStreamSource(displayStream);
          systemSource.connect(destination);
        }

        const micSource = audioContext.createMediaStreamSource(micStream);
        micSource.connect(destination);

        const combinedStream = new MediaStream([
          ...displayStream.getVideoTracks(),
          ...destination.stream.getAudioTracks()
        ]);

        streamRef.current = combinedStream;
      } catch (micError) {
        console.warn('Could not access microphone:', micError);
        setError('Could not access microphone. Recording with system audio only.');
        streamRef.current = displayStream;
      }

      chunksRef.current = [];

      let mimeType = 'video/webm;codecs=vp9,opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm;codecs=vp8,opus';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
      }

      const mediaRecorder = new MediaRecorder(streamRef.current!, {
        mimeType,
        audioBitsPerSecond: 128000,
        videoBitsPerSecond: 2500000
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setRecordedBlob(blob);

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `screen-recording-${Date.now()}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }

        setIsRecording(false);
        setRecordingTime(0);
        if (timerRef.current) clearInterval(timerRef.current);
      };

      streamRef.current.getVideoTracks()[0].addEventListener('ended', stopRecording);

      mediaRecorder.start(100);
      setIsRecording(true);

timerRef.current = setInterval(() => {
  setRecordingTime(prev => prev + 1);
}, 1000) as unknown as number;

    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Failed to start recording. Please make sure you grant permission to share your screen.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const downloadRecording = () => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `screen-recording-${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-left mb-12">
          <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">
            Screen Recorder
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Capture your screen with crystal-clear audio. Perfect for tutorials, presentations, and demos.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left Column - Controls */}
          <div className="lg:col-span-3 space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Recording Status */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`}></div>
                  <span className="text-lg font-semibold text-gray-900">
                    {isRecording ? 'Recording in progress' : 'Ready to record'}
                  </span>
                </div>
                {isRecording && (
                  <div className="text-3xl font-mono font-bold text-gray-900">
                    {formatTime(recordingTime)}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="flex items-center space-x-3 bg-black text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <span>Start Recording</span>
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="flex items-center space-x-3 bg-red-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-red-600 transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="6" y="6" width="12" height="12" rx="2" />
                    </svg>
                    <span>Stop Recording</span>
                  </button>
                )}

                {recordedBlob && !isRecording && (
                  <button
                    onClick={downloadRecording}
                    className="flex items-center space-x-3 bg-green-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-green-700 transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Download Again</span>
                  </button>
                )}
              </div>
            </div>

            {/* Audio Settings */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Audio Configuration</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">System + Microphone</h4>
                      <p className="text-sm text-gray-600">Captures both computer audio and your voice</p>
                    </div>
                  </div>
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 h-full">
              <div className="flex flex-col items-center justify-center h-full space-y-6">
                {/* Screen Icon */}
                <div className="relative">
                  <div className="w-32 h-20 bg-gray-900 rounded-lg flex items-center justify-center">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                      <line x1="8" y1="21" x2="16" y2="21"></line>
                      <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                  </div>
                  {isRecording && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>

                {/* Status Text */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {isRecording ? 'Recording Active' : 'Ready to Capture'}
                  </h3>
                  <p className="text-gray-600">
                    {isRecording 
                      ? 'Your screen is being recorded with audio' 
                      : 'Click start to begin screen recording'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Browser Compatible</h4>
              <p className="text-sm text-gray-600">Works best with Chrome, Firefox, and Edge browsers</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Privacy First</h4>
              <p className="text-sm text-gray-600">All recording happens locally in your browser</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V3a1 1 0 011 1v11.586l2.707 2.707A1 1 0 0120 17.586V4a2 2 0 00-2-2H6a2 2 0 00-2 2v13.586a1 1 0 001.707.707L8 15.586V4z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">HD Quality</h4>
              <p className="text-sm text-gray-600">Records in high definition with clear audio</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreenRecorder;