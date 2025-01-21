import { projectSummary } from "../projectUtils/header-json";
import { MdArrowOutward } from "react-icons/md";
import Frame180 from "../../../../assets/images/Frame180.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

interface HeaderProps {
  title?: string;
}

const ProjectsHeader: React.FC<HeaderProps> = ({ title = "Manage Projects" }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route
  const [activeProject, setActiveProject] = useState<string | null>(null); // Track active project

  const handleNavigate = (path?: string, id?: string) => {
    if (path) {
      setActiveProject(id || null); // Set active project ID
      navigate(path); // Navigate to the path
    } else {
      console.warn("Path is undefined.");
    }
  };

  useEffect(() => {
    // Synchronize active project with the current path
    const matchedProject = projectSummary.find((project) => project.path === location.pathname);
    if (matchedProject) {
      setActiveProject(matchedProject.id);
    }
  }, [location.pathname]); // Run whenever the route changes

  return (
    <div className="p-6">
      <p className="text-3xl text-black font-bold py-6">{title}</p>
      <div className="lg:grid lg:grid-cols-4 lg:space-x-4 space-x-0 grid grid-cols-1 lg:space-y-0 space-y-4">
        {projectSummary.map((project, index) => (
          <div
            className={`border rounded-lg space-y-4 p-4 cursor-pointer ${
              activeProject === project.id ? "bg-blue-100 text-blue-500" : "bg-white"
            }`}
            key={index}
            onClick={() => handleNavigate(project.path, project.id)} // Pass the path and ID
          >
            <div className="flex justify-between items-center text-2xl">
              <p className={activeProject === project.id ? "text-blue-600" : "text-blue-500"}>
                {project.type}
              </p>
              <p>
                <img src={Frame180} alt="header logo" />
              </p>
            </div>
            <p className="text-black text-3xl font-bold">{project.number}</p>
            <div className="flex space-x-2 text-sm">
              <span className="text-green-200">
                <MdArrowOutward />
              </span>
              <span>{project.description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsHeader;
