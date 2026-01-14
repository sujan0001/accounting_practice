import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api/axios';
import { Project } from '../../types';
import { useProject } from '../../context/ProjectContext';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    projectName: '',
    alias: '',
    panNo: '',
    financialYearFrom: '',
    financialYearTo: '',
    description: '',
  });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await api.put(`/projects/${editingProject._id}`, formData);
        setEditingProject(null);
      } else {
        await api.post('/projects', formData);
      }
      setShowCreateForm(false);
      setFormData({
        projectName: '',
        alias: '',
        panNo: '',
        financialYearFrom: '',
        financialYearTo: '',
        description: '',
      });
      fetchProjects();
    } catch (error: any) {
      alert(error.response?.data?.message || `Failed to ${editingProject ? 'update' : 'create'} project`);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      projectName: project.projectName,
      alias: project.alias,
      panNo: project.panNo || '',
      financialYearFrom: project.financialYearFrom,
      financialYearTo: project.financialYearTo || '',
      description: project.description || '',
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }
    try {
      await api.delete(`/projects/${projectId}`);
      fetchProjects();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete project');
    }
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setEditingProject(null);
    setFormData({
      projectName: '',
      alias: '',
      panNo: '',
      financialYearFrom: '',
      financialYearTo: '',
      description: '',
    });
  };

  const handleLoadProject = async (projectId: string) => {
    try {
      await switchProject(projectId);
      navigate('/dashboard');
    } catch (error) {
      alert('Failed to load project');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <button
          onClick={() => {
            if (showCreateForm) {
              handleCancel();
            } else {
              setShowCreateForm(true);
            }
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          {showCreateForm ? 'Cancel' : 'Create Project'}
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingProject ? 'Edit Project' : 'Create New Project'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alias *
                </label>
                <input
                  type="text"
                  required
                  value={formData.alias}
                  onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Financial Year From *
                </label>
                <input
                  type="date"
                  required
                  value={formData.financialYearFrom}
                  onChange={(e) => setFormData({ ...formData, financialYearFrom: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Financial Year To
                </label>
                <input
                  type="date"
                  value={formData.financialYearTo}
                  onChange={(e) => setFormData({ ...formData, financialYearTo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PAN No
              </label>
              <input
                type="text"
                value={formData.panNo}
                onChange={(e) => setFormData({ ...formData, panNo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                {editingProject ? 'Update Project' : 'Create Project'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alias</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.map((project) => (
              <tr key={project._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {project.projectName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {project.alias}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    project.status === 'ongoing' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleLoadProject(project._id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => handleEdit(project)}
                      className="text-green-600 hover:text-green-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

