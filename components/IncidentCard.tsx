import { AlertTriangle, Clock, MapPin, Shield } from "lucide-react";
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

const IncidentCard = ({ 
  incident, 
  isSelected, 
  isResolving, 
  onSelect, 
  onResolve 
}: { 
  incident: Incident;
  isSelected: boolean;
  isResolving: boolean;
  onSelect: () => void;
  onResolve: () => void;
}) => {
  const getIncidentTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'gun threat':
        return <Shield className="w-4 h-4 text-red-500" />;
      case 'unauthorised access':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getIncidentTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'gun threat':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'unauthorised access':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-GB');
  };

  return (
    <div
      className={`bg-slate-700 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
        isSelected ? 'ring-2 ring-blue-500 bg-slate-600' : 'hover:bg-slate-600'
      } ${isResolving ? 'opacity-50 pointer-events-none' : ''}`}
      onClick={onSelect}
    >
      <div className="flex items-start space-x-3">
        <img
          src={incident.thumbnailUrl}
          alt="Incident thumbnail"
          className="w-16 h-12 object-cover rounded bg-slate-600"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNDgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzQ3NTU2OSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iOCIgZmlsbD0iIzk0YTNiOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg==';
          }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            {getIncidentTypeIcon(incident.type)}
            <span className={`px-2 py-1 text-xs rounded border ${getIncidentTypeColor(incident.type)}`}>
              {incident.type}
            </span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-slate-300 mb-1">
            <MapPin className="w-3 h-3" />
            <span className="text-xs text-slate-400 ml-2">
                        Camera {String(parseInt(incident.camera.id.replace(/\D/g, ''))).padStart(2, '0')}
                     </span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-slate-400">
            <Clock className="w-3 h-3" />
            <span>
              {formatTime(incident.tsStart)} - {formatTime(incident.tsEnd)} on {formatDate(incident.tsStart)}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onResolve();
          }}
          disabled={isResolving}
          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isResolving ? 'Resolving...' : 'Resolve'}
        </button>
      </div>
    </div>
  );
};

export default IncidentCard