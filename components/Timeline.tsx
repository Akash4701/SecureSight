'use client'
import { Camera } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";

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

interface TimelineProps {
  incidents: Incident[];
  selectedIncident: Incident | null;
  onSelectIncident: (incident: Incident) => void;
}

const Timeline = ({ incidents, selectedIncident, onSelectIncident }: TimelineProps) => {
  const [rulerPosition, setRulerPosition] = useState(0); // start at 00:00
  const [isDragging, setIsDragging] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Convert incidents to timeline events
  const convertToTimelineEvents = (incidents: Incident[]) => {
    return incidents.map(incident => {
      const startDate = new Date(incident.tsStart);
      const endDate = new Date(incident.tsEnd);
      const duration = Math.round((endDate.getTime() - startDate.getTime()) / 1000); // duration in seconds
      
      return {
        id: incident.id,
        type: incident.type,
        cameraId: incident.cameraId,
        cameraName: incident.camera.name,
        startTime: formatTime(startDate),
        endTime: formatTime(endDate),
        duration: Math.max(duration, 60), // minimum 1 minute for visibility
        startDate: startDate,
        incident: incident
      };
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getEventColor = (type: string, isSelected: boolean = false) => {
    const baseClasses = isSelected ? 'ring-2 ring-yellow-400 ' : '';
    
    switch (type.toLowerCase()) {
      case 'gun threat':
        return baseClasses + 'bg-red-500 border-red-600 hover:bg-red-400';
      case 'unauthorised access':
      case 'unauthorized access':
        return baseClasses + 'bg-orange-500 border-orange-600 hover:bg-orange-400';
      case 'face recognised':
      case 'face recognized':
        return baseClasses + 'bg-blue-500 border-blue-600 hover:bg-blue-400';
      case 'traffic congestion':
        return baseClasses + 'bg-teal-500 border-teal-600 hover:bg-teal-400';
      case 'multiple events':
        return baseClasses + 'bg-gray-500 border-gray-600 hover:bg-gray-400';
      case 'intrusion':
        return baseClasses + 'bg-purple-500 border-purple-600 hover:bg-purple-400';
      case 'motion detected':
        return baseClasses + 'bg-green-500 border-green-600 hover:bg-green-400';
      default:
        return baseClasses + 'bg-yellow-500 border-yellow-600 hover:bg-yellow-400';
    }
  };

  // Get ruler time based on position
  const getRulerTime = (position: number) => {
    // Convert position (0-100%) to hours (0-24)
    const totalHours = (position / 100) * 24;
    const hours = Math.floor(totalHours);
    const minutes = Math.floor((totalHours - hours) * 60);
    
    // Handle edge cases
    if (hours >= 24) {
      return "24:00";
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Handle ruler drag
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - 160; // subtract camera column width
    const width = rect.width - 160;
    const newPosition = Math.max(0, Math.min(100, (x / width) * 100));
    setRulerPosition(newPosition);
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle timeline click to move ruler
  const handleTimelineClick = useCallback((e: React.MouseEvent) => {
    if (!timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - 160; // subtract camera column width
    const width = rect.width - 160;
    const newPosition = Math.max(0, Math.min(100, (x / width) * 100));
    setRulerPosition(newPosition);
  }, []);

  interface TimelineEvent {
  id: string;
  type: string;
  cameraId: string;
  cameraName: string;
  startTime: string;
  endTime: string;
  duration: number;
  startDate: Date;
  incident: Incident;
}


  
  const handleEventClick = useCallback((event: TimelineEvent, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent timeline click
    const startHour = event.startDate.getHours();
    const startMinute = event.startDate.getMinutes();
    const startPercent = ((startHour * 60 + startMinute) / (24 * 60)) * 100;
    setRulerPosition(startPercent);
    onSelectIncident(event.incident);
  }, [onSelectIncident]);

  // Add event listeners for mouse events
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const timelineEvents = convertToTimelineEvents(incidents);
  
  // Get unique cameras from incidents
  const cameras = Array.from(
    new Set(incidents.map(incident => incident.camera.id))
  ).map(cameraId => {
    const incident = incidents.find(inc => inc.camera.id === cameraId);
    return incident?.camera;
  }).filter(Boolean);

  const hours = Array.from({ length: 25 }, (_, i) => 
    i.toString().padStart(2, '0') + ':00'
  );

  // Get current time for timeline indicator
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  const currentTimePercent = ((currentHour * 60 + currentMinute) / (24 * 60)) * 100;

  return (
    <div className="bg-slate-800 border-t border-slate-700">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">
            Security Timeline ({incidents.length} active incidents)
          </h3>
          <div className="text-sm text-slate-400">
            Ruler Time: {getRulerTime(rulerPosition)}
          </div>
        </div>
        
        {/* Timeline Header */}
        <div className="flex items-center mb-4">
          <div className="w-40 text-sm font-medium text-slate-400">Camera</div>
          <div className="flex-1 relative" style={{ height: '32px' }}>
            <div className="relative text-xs text-slate-400 mb-2" style={{ height: '20px' }}>
              {hours.slice(0, 25).map((hour, index) => (
                <span key={hour} className="absolute text-center" style={{
                  left: `${(index / 24) * 100}%`,
                  transform: 'translateX(-50%)',
                  whiteSpace: 'nowrap'
                }}>{hour}</span>
              ))}
                <div 
            className="absolute top-0 w-0.5 bg-yellow-400 z-20 cursor-col-resize"
            style={{ 
              left: `calc( ${rulerPosition}%)`,
              height: `${(cameras.length * 64) + 32}px`,
              boxShadow: '0 0 8px rgba(251, 191, 36, 0.5)'
            }}
            onMouseDown={handleMouseDown}
          >
            {/* Ruler handle */}
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-yellow-400 rounded-full border-2 border-slate-800 cursor-col-resize hover:bg-yellow-300">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-slate-900 text-yellow-400 text-xs px-2 py-1 rounded whitespace-nowrap">
                {getRulerTime(rulerPosition)}
              </div>
            </div>
          </div>
            </div>
            {/* Current time indicator */}
            <div 
              className="absolute bottom-0 w-0.5 h-8 bg-yellow-100 z-10"
              style={{ left: `${currentTimePercent}%` }}
              title={`Current Time: ${formatTime(currentTime)}`}
            />
          </div>
        </div>

        {/* Timeline Container */}
        <div 
          ref={timelineRef}
          className="relative"
          onClick={handleTimelineClick}
        >
          {/* Draggable Ruler */}
        

          {/* Camera Rows */}
          <div className="space-y-4">
            {cameras.length === 0 ? (
              <div className="text-center text-slate-400 py-8">
                No camera incidents to display
              </div>
            ) : (
              cameras.map((camera) => {
                if (!camera) return null;
                
                const cameraEvents = timelineEvents.filter(event => 
                  event.cameraId === camera.id
                );
                
                return (
                  <div key={camera.id} className="flex items-center">
                    <div className="w-40 flex items-center space-x-2">
                      <Camera className="w-4 h-4 text-slate-400" />
                      <div>
                        <span className="text-xs text-slate-400 ml-2">
                          Camera {String(parseInt(camera.id.replace(/\D/g, ''))).padStart(2, '0')}
                       </span>
                        <div className="text-xs text-slate-500">{camera.location}</div>
                      </div>
                    </div>
                    <div className="flex-1 relative h-12 bg-slate-700 rounded">
                      {cameraEvents.map((event) => {
                        const startHour = event.startDate.getHours();
                        const startMinute = event.startDate.getMinutes();
                        const startPercent = ((startHour * 60 + startMinute) / (24 * 60)) * 100;
                        const widthPercent = Math.max((event.duration / 60) / (24 * 60) * 100, 1); // minimum width for visibility
                        
                        const isSelected = selectedIncident?.id === event.incident.id;
                        
                        return (
                          <div
                            key={event.id}
                            className={`absolute h-6 top-2 rounded-md text-white backdrop-blur-3xl px-2 flex items-center justify-between border cursor-pointer transition-all duration-200 overflow-hidden ${getEventColor(event.type, isSelected)}`}
                            style={{
                              left: `${startPercent}%`,
                              width: `${Math.max(widthPercent, 12)}%`, // minimum 12% width for better visibility
                              minWidth: '140px'
                            }}
                            title={`${event.type} - ${event.startTime} to ${event.endTime} (${Math.round(event.duration / 60)}m) - Click to jump ruler here`}
                            onClick={(e) => handleEventClick(event, e)}
                          >
                            <div className="flex items-center space-x-1 overflow-hidden backdrop-blur-lg">
                              <span className="font-medium text-xs overflow-hidden whitespace-nowrap" style={{ fontSize: '12px' }}>{event.type}</span>
                            </div>
                          </div>
                        );
                      })}
                      
                      {/* No events indicator */}
                      {cameraEvents.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-xs">
                          No incidents
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      
      </div>
    </div>
  );
};

export default Timeline;