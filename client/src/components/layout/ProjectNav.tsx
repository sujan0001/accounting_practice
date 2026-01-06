import { useProject } from '../../context/ProjectContext';
import { useNavigate } from 'react-router-dom';

export default function ProjectNav() {
  const { activeProject } = useProject();
  const navigate = useNavigate();

  if (!activeProject) {
    return null;
  }

  return (
    <div className="sticky top-16 bg-white border-b border-gray-200 px-6 py-3 z-30">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{activeProject.projectName}</h2>
          <p className="text-sm text-gray-500">{activeProject.alias}</p>
        </div>
        <button
          onClick={() => navigate('/projects/switch')}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
        >
          Switch Project
        </button>
      </div>
    </div>
  );
}

