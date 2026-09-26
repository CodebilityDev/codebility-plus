import React from "react";

export interface ProjectInfo {
  project_id: string;
  name: string;
  main_image: string | null;
}

interface ProjectListProps {
  projects: ProjectInfo[];
}

const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  if (!projects || projects.length === 0) {
    return <p>No projects found.</p>;
  }

  return (
    <div>
      {/* Title on top */}
      <h3 className="text-md mb-2 font-semibold lg:text-2xl text-center">
        Projects
      </h3>

      {/* Projects grid */}
      <div className="flex flex-wrap justify-center gap-4">
        {projects.map((project) => (
          <div
            key={project.project_id}
            className="w-40 rounded-lg p-4 text-center bg-black-100"
          >
            {project.main_image ? (
              <img
                src={project.main_image}
                alt={project.name}
                className="w-full h-32 object-cover rounded"
              />
            ) : (
              <div className="w-full h-32 bg-gray-200 flex items-center justify-center rounded">
                No Image
              </div>
            )}
            <h3 className="mt-2 text-lg">{project.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
