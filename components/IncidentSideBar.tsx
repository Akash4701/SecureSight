'use client'
import { AlertTriangle, CheckCircle, Filter, Search } from "lucide-react";
import IncidentCard from "./IncidentCard";
import { useEffect, useRef } from "react";

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

const IncidentsSidebar = ({
  incidents,
  selectedIncident,
  resolvingIncidents,
  onSelectIncident,
  onResolveIncident,
  countresolved
}: {
  incidents: Incident[];
  selectedIncident: Incident | null;
  resolvingIncidents: Set<string>;
  onSelectIncident: (incident: Incident) => void;
  onResolveIncident: (id: string) => void;
  countresolved: number;
}) => {
  const unresolvedCount = incidents.filter(incident => !incident.resolved).length;
  const resolvedCount = incidents.filter(incident => incident.resolved).length;
  const selectedRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedIncident]);
  console.log('incidents', incidents);
  return (
    <div className="h-full lg:h-screen bg-gradient-to-b from-slate-800 to-slate-900 border-l border-slate-700 shadow-2xl flex flex-col">
      {/* Header Section */}
      <div className="p-4 lg:p-6 border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Security Incidents
              </h2>
              <p className="text-xs text-slate-400">
                {unresolvedCount} unresolved • {resolvedCount} resolved
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
              <Search className="w-4 h-4" />
            </button>
            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-400 font-medium text-sm">Active</span>
            </div>
            <div className="text-white font-bold text-lg mt-1">
              {unresolvedCount}
            </div>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-3 h-3 text-green-400" />
              <span className="text-green-400 font-medium text-sm">Resolved</span>
            </div>
            <div className="text-white font-bold text-lg mt-1">
              {countresolved}
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Incidents List */}
     <div className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth">
  <div className="p-4 lg:p-6 space-y-3">
    {incidents.length > 0 ? (
      [...(selectedIncident ? [selectedIncident] : []), ...incidents.filter(i => i.id !== selectedIncident?.id)].map((incident) => (
        <div
  key={incident.id}
  ref={selectedIncident?.id === incident.id ? selectedRef : null}
  className={`transform transition-all duration-200 hover:scale-[1.02] ${
    selectedIncident?.id === incident.id
      ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/20'
      : ''
  }`}
>

          <IncidentCard
            incident={incident}
            isSelected={selectedIncident?.id === incident.id}
            isResolving={resolvingIncidents.has(incident.id)}
            onSelect={() => onSelectIncident(incident)}
            onResolve={() => onResolveIncident(incident.id)}
          />
        </div>
      ))
    ) : (
      <div className="text-center text-gray-500 text-sm py-12">
  No incidents to display.
</div>

    )}
  </div>
</div>


      {/* Footer with Live Status */}
      <div className="p-4 lg:p-6 border-t border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-400 font-medium">System Online</span>
          </div>
          
        </div>
        <div className="mt-2 w-full bg-slate-700 rounded-full h-1">
          <div className="bg-gradient-to-r from-blue-500 to-green-500 h-1 rounded-full w-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default IncidentsSidebar;
