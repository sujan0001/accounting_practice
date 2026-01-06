import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../lib/api/axios';
import { Project } from '../types';

interface ProjectContextType {
  activeProject: Project | null;
  loading: boolean;
  switchProject: (projectId: string) => Promise<void>;
  refreshProject: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActiveProject();
  }, []);

  const loadActiveProject = async () => {
    try {
      const response = await api.get('/projects/active');
      if (response.data.project) {
        setActiveProject(response.data.project);
      }
    } catch (error) {
      console.error('No active project');
    } finally {
      setLoading(false);
    }
  };

  const switchProject = async (projectId: string) => {
    await api.post(`/projects/${projectId}/load`);
    const response = await api.get(`/projects/${projectId}`);
    setActiveProject(response.data.project);
  };

  const refreshProject = async () => {
    await loadActiveProject();
  };

  return (
    <ProjectContext.Provider
      value={{
        activeProject,
        loading,
        switchProject,
        refreshProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}

