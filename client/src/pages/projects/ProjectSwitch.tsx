import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api/axios';
import { Project } from '../../types';
import { useProject } from '../../context/ProjectContext';

export default function ProjectSwitch() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { switchProject } = useProject();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data.projects);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProject = async (projectId: string) => {
    try {
      await switchProject(projectId);
      navigate('/dashboard');
    } catch (error) {
      alert('Failed to load project');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-8">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Select Project</h1>
      <p className="text-gray-600 mb-6">Please select a project to continue.</p>
      
      {projects.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No projects found. Create a project first.</p>
          <button
            onClick={() => navigate('/projects')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Go to Projects
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div
              key={project._id}
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors"
              onClick={() => handleSelectProject(project._id)}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.projectName}</h3>
              <p className="text-sm text-gray-500 mb-2">Alias: {project.alias}</p>
              <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                project.status === 'ongoing' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {project.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

