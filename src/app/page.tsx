'use client'
import { useEffect, useState } from "react";
import Header from "../../components/Navbar";
import VideoPlayer from "../../components/VideoPlayer";
import CameraThumbnails from "../../components/CameraThumbnails";
import IncidentsSidebar from "../../components/IncidentSideBar";
import Timeline from "../../components/Timeline";

const SecurityDashboard = () => {
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
  
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [resolvingIncidents, setResolvingIncidents] = useState<Set<string>>(new Set());
  
  // API Functions
  const fetchIncidents = async () => {
    try {
      const response = await fetch('/api/incidents?resolved=false');
      if (response.ok) {
        const data = await response.json();
        console.log('data', data);
        setIncidents(data);
        if (data.length > 0 && !selectedIncident) {
          setSelectedIncident(data[0]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch incidents:', error);
    }
  };
  
  const resolveIncident = async (incidentId: string) => {
    setResolvingIncidents(prev => new Set([...prev, incidentId]));
        
    try {
      const response = await fetch(`/api/incidents/${incidentId}/resolve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
            
      if (response.ok) {
        setIncidents(prev => prev.filter(incident => incident.id !== incidentId));
        if (selectedIncident?.id === incidentId) {
          const remainingIncidents = incidents.filter(incident => incident.id !== incidentId);
          setSelectedIncident(remainingIncidents.length > 0 ? remainingIncidents[0] : null);
        }
      }
    } catch (error) {
      console.error('Failed to resolve incident:', error);
    } finally {
      setResolvingIncidents(prev => {
        const newSet = new Set(prev);
        newSet.delete(incidentId);
        return newSet;
      });
    }
  };
  
  useEffect(() => {
    fetchIncidents();
    const interval = setInterval(fetchIncidents, 30000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <Header />
      
      {/* Main Dashboard Layout */}
      <div className="flex h-screen" style={{ height: 'calc(100vh - 80px)' }}>
        {/* Left Section: Video Player and Camera Thumbnails */}
        <div className="flex-1 flex flex-col p-4 lg:p-1 min-w-0">
          {/* Video Player Container - Takes most of the space */}
          <div className="flex-1 mb-4 min-h-0">
            <div className="h-full bg-slate-800 rounded-lg border border-slate-700 relative">
              <VideoPlayer selectedIncident={selectedIncident} incidents={incidents}
              
              onSelectIncident={setSelectedIncident} />
            </div>
          </div>
          
         
        </div>
        
        {/* Right Section: Incidents Sidebar - Fixed width, scrollable */}
        <div className="w-80 lg:w-96 xl:w-[400px] flex-shrink-0 border-l border-slate-700">
          <div className="h-full overflow-hidden">
            <IncidentsSidebar
              incidents={incidents}
              selectedIncident={selectedIncident}
              resolvingIncidents={resolvingIncidents}
              onSelectIncident={setSelectedIncident}
              onResolveIncident={resolveIncident}
            />
          </div>
        </div>
      </div>
      
      {/* Timeline Section - Fixed at bottom */}
      <div className="bg-slate-800 border-t border-slate-700 flex-shrink-0">
        <Timeline 
          incidents={incidents}
          selectedIncident={selectedIncident}
          onSelectIncident={setSelectedIncident}
        />
      </div>
    </div>
  );
};

export default SecurityDashboard;