import React from 'react';
import { Camera, AlertCircle, CheckCircle } from 'lucide-react';

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

interface CameraThumbnailsProps {
  incidents: Incident[];
  selectedIncident: Incident | null;
  onSelectIncident: (incident: Incident) => void;
}

const CameraThumbnails: React.FC<CameraThumbnailsProps> = ({
  incidents,
  selectedIncident,
  onSelectIncident
}) => {
  // Get unique cameras with their latest incidents
  const getCameraData = () => {
    const cameraMap = new Map();
    
    incidents.forEach(incident => {
      const cameraId = incident.cameraId;
      if (!cameraMap.has(cameraId) || 
          new Date(incident.tsStart) > new Date(cameraMap.get(cameraId).tsStart)) {
        cameraMap.set(cameraId, incident);
      }
    });
    
    return Array.from(cameraMap.values());
  };

  const cameraData = getCameraData().slice(-2);

  const getIncidentTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'unauthorised access':
        return 'bg-orange-500';
      case 'gun threat':
        return 'bg-red-500';
      case 'face recognised':
        return 'bg-blue-500';
      case 'traffic congestion':
        return 'bg-green-500';
      case 'multiple events':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 backdrop-blur-3xl">
     

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-3">
        {cameraData.map((incident) => (
          <div
            key={incident.cameraId}
            onClick={() => onSelectIncident(incident)}
            className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 hover:border-blue-400 ${
              selectedIncident?.cameraId === incident.cameraId
                ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50'
                : 'border-slate-600'
            }`}
          >
            {/* Camera Thumbnail */}
            <div className="aspect-video bg-slate-900 relative overflow-hidden">
              <img
                src={incident.thumbnailUrl}
                alt={`${incident.camera.name} feed`}
                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                
              />
              
              {/* Live indicator */}
              <div className="absolute top-2 left-2 bg-black bg-opacity-60 backdrop-blur-sm px-2 py-1 rounded text-xs">
                <div className="flex items-center text-white">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5 animate-pulse"></span>
                  LIVE
                </div>
              </div>

              {/* Incident type badge */}
              <div className={`absolute top-2 right-2 ${getIncidentTypeColor(incident.type)} bg-opacity-90 backdrop-blur-sm px-2 py-1 rounded text-xs`}>
                <div className="text-white font-medium">
                  {incident.type === 'unauthorised access' ? 'UNAUTHORISED' : 
                   incident.type === 'gun threat' ? 'GUN THREAT' :
                   incident.type.toUpperCase()}
                </div>
              </div>

              {/* Time overlay */}
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 backdrop-blur-sm px-2 py-1 rounded text-xs">
                <div className="text-white font-mono">
                  {formatTime(incident.tsStart)}
                </div>
              </div>

              {/* Alert icon */}
              <div className="absolute bottom-2 right-2">
                <div className="bg-red-500 bg-opacity-90 backdrop-blur-sm p-1 rounded-full">
                  <AlertCircle className="w-3 h-3 text-white" />
                </div>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-2">
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Camera Info */}
            <div className="p-3 bg-slate-700">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-semibold text-white truncate">
                    {incident.camera.id}
                  </h4>
                  <p className="text-xs text-slate-300 truncate">
                    {incident.camera.location}
                  </p>
                </div>
                <div className="ml-2 flex-shrink-0">
                  <div className={`w-2 h-2 ${getIncidentTypeColor(incident.type)} rounded-full`}></div>
                </div>
              </div>
            </div>

            {/* Selected indicator */}
            {selectedIncident?.cameraId === incident.cameraId && (
              <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none">
                <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {cameraData.length === 0 && (
        <div className="text-center py-8">
          <Camera className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <p className="text-slate-400">No active camera incidents</p>
        </div>
      )}
    </div>
  );
};

export default CameraThumbnails;