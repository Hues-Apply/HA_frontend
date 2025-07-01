import { Plus, Trash2 } from 'lucide-react';

interface Project {
  id: string;
  projectTitle: string;
  startDate: string;
  endDate: string;
  isCurrentlyWorking: boolean;
  projectLink: string;
  description: string;
}

interface ProjectsTabProps {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  addProject: () => void;
  deleteProjectEntry: (id: string, index: number) => void;
}

export default function ProjectsTab({ 
  projects, 
  setProjects, 
  addProject, 
  deleteProjectEntry 
}: ProjectsTabProps) {
  return (
    <div className="space-y-6">
      {projects.map((project, index) => (
        <div key={project.id} className="border border-gray-200 rounded-lg p-4 relative">
          {projects.length > 1 && (
            <button
              onClick={() => deleteProjectEntry(project.id, index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              title="Delete project entry"
            >
              <Trash2 size={16} />
            </button>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
            <input
              type="text"
              value={project.projectTitle}
              onChange={(e) => {
                const updated = [...projects];
                updated[index].projectTitle = e.target.value;
                setProjects(updated);
              }}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={project.startDate}
                onChange={(e) => {
                  const updated = [...projects];
                  updated[index].startDate = e.target.value;
                  setProjects(updated);
                }}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={project.endDate}
                onChange={(e) => {
                  const updated = [...projects];
                  updated[index].endDate = e.target.value;
                  setProjects(updated);
                }}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={project.isCurrentlyWorking}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={project.isCurrentlyWorking}
                onChange={(e) => {
                  const updated = [...projects];
                  updated[index].isCurrentlyWorking = e.target.checked;
                  setProjects(updated);
                }}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">I am still working on this project</span>
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Link</label>
            <input
              type="url"
              value={project.projectLink}
              onChange={(e) => {
                const updated = [...projects];
                updated[index].projectLink = e.target.value;
                setProjects(updated);
              }}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Describe your project</label>
            <textarea
              value={project.description}
              onChange={(e) => {
                const updated = [...projects];
                updated[index].description = e.target.value;
                setProjects(updated);
              }}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      ))}
      <button
        onClick={addProject}
        className="flex items-center text-blue-600 hover:text-blue-800"
      >
        <Plus size={16} className="mr-1" />
        Add More Projects
      </button>
    </div>
  );
}
