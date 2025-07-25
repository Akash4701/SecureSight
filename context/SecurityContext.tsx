// contexts/SecurityContext.tsx
'use client'
import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from 'react';

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

interface SecurityContextType {
  incidents: Incident[];
  selectedIncident: Incident | null;
  resolvingIncidents: Set<string>;
  countResolved: number;
  loading: boolean;
  error: string | null;
  // Actions
  setSelectedIncident: (incident: Incident | null) => void;
  resolveIncident: (incidentId: string) => Promise<void>;
  refreshIncidents: () => Promise<void>;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const useSecurityContext = () => {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurityContext must be used within a SecurityProvider');
  }
  return context;
};

interface SecurityProviderProps {
  children: ReactNode;
}

export const SecurityProvider = ({ children }: SecurityProviderProps) => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [resolvingIncidents, setResolvingIncidents] = useState<Set<string>>(new Set());
  const [countResolved, setCountResolved] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoized fetch function to prevent unnecessary re-renders
  const fetchIncidents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/incidents?resolved=false');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched incidents:', data);
      
      setIncidents(data);
      
      // Auto-select first incident if none selected and incidents exist
      if (data.length > 0 && !selectedIncident) {
        setSelectedIncident(data[0]);
      }
      
    } catch (err) {
      console.error('Failed to fetch incidents:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch incidents');
    } finally {
      setLoading(false);
    }
  }, [selectedIncident]);

  // Optimized resolve incident function
  const resolveIncident = useCallback(async (incidentId: string) => {
    setResolvingIncidents(prev => new Set([...prev, incidentId]));
    
    try {
      const response = await fetch(`/api/incidents/${incidentId}/resolve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to resolve incident: ${response.status}`);
      }
      
      // Optimistically update UI
      setIncidents(prev => prev.filter(incident => incident.id !== incidentId));
      setCountResolved(prev => prev + 1);
      
      // Update selected incident if it was the resolved one
      if (selectedIncident?.id === incidentId) {
        setSelectedIncident(prev => {
          const remainingIncidents = incidents.filter(incident => incident.id !== incidentId);
          return remainingIncidents.length > 0 ? remainingIncidents[0] : null;
        });
      }
      
    } catch (err) {
      console.error('Failed to resolve incident:', err);
      setError(err instanceof Error ? err.message : 'Failed to resolve incident');
    } finally {
      setResolvingIncidents(prev => {
        const newSet = new Set(prev);
        newSet.delete(incidentId);
        return newSet;
      });
    }
  }, [selectedIncident, incidents]);

  // Set up polling effect
  useEffect(() => {
    fetchIncidents();
    
    // Set up polling every 30 seconds
    const interval = setInterval(fetchIncidents, 30000);
    
    return () => clearInterval(interval);
  }, [fetchIncidents]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    incidents,
    selectedIncident,
    resolvingIncidents,
    countResolved,
    loading,
    error,
    setSelectedIncident,
    resolveIncident,
    refreshIncidents: fetchIncidents,
  }), [
    incidents,
    selectedIncident,
    resolvingIncidents,
    countResolved,
    loading,
    error,
    resolveIncident,
    fetchIncidents,
  ]);

  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
    </SecurityContext.Provider>
  );
};