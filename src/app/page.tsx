'use client'
import { useEffect, useState } from 'react';
import { useSecurityContext } from '../../context/SecurityContext';
import Header from '../../components/Navbar';
import VideoPlayer from '../../components/VideoPlayer';
import IncidentsSidebar from '../../components/IncidentSideBar';
import Timeline from '../../components/Timeline';
import LoadingSpinner from '../../components/LoadingSpinner';

const SecurityDashboard = () => {
  const {
    incidents,
    selectedIncident,
    resolvingIncidents,
    // assuming this exists in your context
    loading,
    error,
    setSelectedIncident,
    resolveIncident,
  } = useSecurityContext();
  const [countResolved, setCountResolved] = useState(0);

  // Fetch count of resolved incidents only once when component mounts
  useEffect(() => {
    const fetchResolvedCount = async () => {
      try {
        const res = await fetch('/api/incidents?resolved=true');
        const data = await res.json();
        console.log('data', data);
        if (res.ok && data?.resolvedCount !== undefined) {
          setCountResolved(data.resolvedCount);
        }
      } catch (err) {
        console.error("Failed to fetch resolved count", err);
      }
    };

    fetchResolvedCount();
  }, [setCountResolved]); 

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-slate-900 text-white">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header />
      
      <div className="flex h-screen" style={{ height: 'calc(100vh - 80px)' }}>
        <div className="flex-1 flex flex-col p-4 lg:p-1 min-w-0">
          <div className="h-full bg-slate-800 rounded-lg border border-slate-700 relative">
            <VideoPlayer 
              selectedIncident={selectedIncident} 
              incidents={incidents}
              onSelectIncident={setSelectedIncident} 
            />
          </div>
        </div>
        
        <div className="w-80 lg:w-96 xl:w-[400px] flex-shrink-0 border-l border-slate-700">
          <div className="h-full overflow-hidden">
            <IncidentsSidebar
              incidents={incidents}
              selectedIncident={selectedIncident}
              resolvingIncidents={resolvingIncidents}
              onSelectIncident={setSelectedIncident}
              onResolveIncident={resolveIncident}
              countresolved={countResolved}
            />
          </div>
        </div>
      </div>
      
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
