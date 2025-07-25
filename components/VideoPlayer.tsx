'use client';

import {
  Pause,
  Play,
  Shield,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  CameraIcon
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import CameraThumbnails from './CameraThumbnails'; // Make sure the path is correct

interface Camera {
  id: string;
  name: string;
  location: string;
}

interface Incident {
  id: string;
  cameraId: string;
  camera: Camera;
  type: string;
  tsStart: string;
  tsEnd: string;
  thumbnailUrl: string;
  resolved: boolean;
}

interface VideoPlayerProps {
  selectedIncident: Incident | null;
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  selectedIncident,
  incidents,
  onSelectIncident
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(100);
  const [volume, setVolume] = useState(80);
  const [showSettings, setShowSettings] = useState(false);

  const progress = (currentTime / duration) * 100;

  const formatTimeDisplay = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      time: date.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      date: date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    };
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && selectedIncident) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration, selectedIncident]);

  useEffect(() => {
    if (selectedIncident) {
      setCurrentTime(0);
      setIsPlaying(true);
      const start = new Date(selectedIncident.tsStart).getTime();
      const end = new Date(selectedIncident.tsEnd).getTime();
      setDuration(Math.floor((end - start) / 1000));
    }
  }, [selectedIncident]);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * duration;
    setCurrentTime(newTime);
  };

  return (
    <div className="flex flex-col w-full h-full bg-slate-800 rounded-lg overflow-hidden">
      {/* Video Area */}
      <div className="relative flex-grow bg-slate-900 min-h-[40vh] md:min-h-[50vh]">
        {selectedIncident ? (
          <>
            <div className="w-full h-full flex items-center justify-center">
              {selectedIncident?.thumbnailUrl ? (
  <img
    src={selectedIncident.thumbnailUrl}
    alt="Incident footage"
    className="max-w-full max-h-full object-contain"
  />
) : (
  <div className="text-white">Loading image...</div>
)}


              {!isPlaying && (
                <button
                  onClick={() => setIsPlaying(true)}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40"
                >
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-6">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                </button>
              )}
            </div>

            <div className="absolute top-4 left-4 bg-black bg-opacity-60 backdrop-blur-sm px-3 py-2 rounded-lg">
              <div className="text-sm font-medium text-white flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                Camera {String(parseInt(selectedIncident.camera.id.replace(/\D/g, ''))).padStart(2, '0')}
              </div>
              <div className="text-xs text-slate-300">
                {formatDateTime(selectedIncident.tsStart).date} • {formatDateTime(selectedIncident.tsStart).time}
              </div>
            </div>

            <div className="absolute top-4 right-4 bg-red-500 bg-opacity-90 backdrop-blur-sm px-3 py-1 rounded-lg">
              <div className="text-xs font-medium text-white">
                {selectedIncident.type.toUpperCase()}
              </div>
            </div>

            <div className="absolute bottom-20 left-4 bg-black bg-opacity-60 backdrop-blur-sm px-3 py-1 rounded">
              <div className="text-sm font-mono text-white">
                {formatTimeDisplay(currentTime)} / {formatTimeDisplay(duration)}
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <div className="text-center">
              <Shield className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No incident selected</p>
              <p className="text-sm text-slate-500 mt-2">Select an incident from the sidebar to view footage</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="bg-slate-700 p-3 flex-shrink-0">
        {/* Progress */}
        <div className="mb-3">
          <div
            className="relative h-2 bg-slate-600 rounded-full cursor-pointer hover:h-3"
            onClick={handleProgressClick}
          >
            <div className="absolute top-0 left-0 h-full bg-blue-500 rounded-full" style={{ width: `${progress}%` }}></div>
            <div
              className="absolute top-1/2 w-3 h-3 bg-blue-500 rounded-full transform -translate-y-1/2"
              style={{ left: `${progress}%`, marginLeft: '-6px' }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>{formatTimeDisplay(currentTime)}</span>
            <span>{formatTimeDisplay(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-slate-600 rounded-lg" onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}>
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-3 hover:bg-slate-600 rounded-lg bg-slate-600"
              disabled={!selectedIncident}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <button className="p-2 hover:bg-slate-600 rounded-lg" onClick={() => setCurrentTime(Math.min(duration, currentTime + 10))}>
              <SkipForward className="w-5 h-5" />
            </button>

            <button className="p-2 hover:bg-slate-600 rounded-lg" onClick={() => setIsMuted(!isMuted)}>
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            <div className="w-20 h-1 bg-slate-600 rounded-full">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${isMuted ? 0 : volume}%` }}></div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              className="p-2 hover:bg-slate-600 rounded-lg"
              onClick={() => setShowSettings(prev => !prev)}
            >
              <CameraIcon className="w-5 h-5" />
            </button>
            
          </div>
        </div>
      </div>

      {/* Camera Thumbnails Toggle Area */}
      {showSettings && (
  <div className="absolute bottom-20 right-4 z-50 w-80 max-h-64 overflow-y-auto p-3 bg-slate-800 rounded-lg shadow-xl border border-slate-600">
    <CameraThumbnails
      incidents={incidents}
      selectedIncident={selectedIncident}
      onSelectIncident={onSelectIncident}
    />
  </div>
)}

    </div>
  );
};

export default VideoPlayer;
