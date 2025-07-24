'use client'
import { Camera } from "lucide-react";

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

  // Returns an icon (emoji) for each event type
  

  const timelineEvents = convertToTimelineEvents(incidents);
  
  // Get unique cameras from incidents
  const cameras = Array.from(
    new Set(incidents.map(incident => incident.camera.id))
  ).map(cameraId => {
    const incident = incidents.find(inc => inc.camera.id === cameraId);
    return incident?.camera;
  }).filter(Boolean);

  
  const hours = Array.from({ length: 26 }, (_, i) => 
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
         
        </div>
        
        {/* Timeline Header */}
        <div className="flex items-center mb-4">
          <div className="w-40 text-sm font-medium text-slate-400">Camera</div>
          <div className="flex-1 relative">
            <div className="flex justify-between text-xs text-slate-400 mb-2">
              {hours.filter((_, i) => i % 2 === 0).map((hour) => (
                <span key={hour} className="text-center">{hour}</span>
              ))}
            </div>
            {/* Current time indicator */}
            <div 
              className="absolute top-0 w-0.5 h-8 bg-yellow-100 z-10"
              style={{ left: `${currentTimePercent}%` }}
              title={`Current Time: ${formatTime(currentTime)}`}
            />
          </div>
        </div>

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
                          title={`${event.type} - ${event.startTime} to ${event.endTime} (${Math.round(event.duration / 60)}m)`}
                          onClick={() => onSelectIncident(event.incident)}
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

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-slate-700">
          <div className="text-sm text-slate-400 mb-2">Event Types:</div>
          <div className="flex flex-wrap gap-3 text-xs">
            {['Gun Threat', 'Unauthorised Access', 'Face Recognised', 'Traffic Congestion', 'Intrusion', 'Motion Detected'].map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded border ${getEventColor(type).split(' ').slice(1, 3).join(' ')}`}></div>
                <span className="text-slate-300">{type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;