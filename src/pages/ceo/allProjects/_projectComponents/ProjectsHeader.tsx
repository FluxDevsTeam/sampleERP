import { MdArrowOutward } from "react-icons/md";
import Frame180 from "../../../../assets/images/Frame180.png";
import { nanoid } from "nanoid";

// Define the type for project statistics
interface ProjectStatistics {
  total_projects: number;
  completed: number;
  in_progress: number;
  archived: number;
}

// Define the props for ProjectsHeader
interface HeaderProps {
  title?: string;
  onFilterClick?: (filterType: string) => void;
  activeFilter?: string;
  projectStatistics?: ProjectStatistics; // ✅ Ensures correct typing
}

// Define the project summary structure with a type-safe key
const projectSummary: { id: string; type: string; key: keyof ProjectStatistics; description: string }[] = [
  {
    id: nanoid(),
    type: "Total Projects",
    key: "total_projects", // ✅ Ensures the key matches ProjectStatistics
    description: "This is the total number of projects tracked in the system.",
  },
  {
    id: nanoid(),
    type: "Active Projects",
    key: "in_progress",
    description: "These are the projects currently in progress.",
  },
  {
    id: nanoid(),
    type: "Completed",
    key: "completed",
    description: "Projects that have been successfully completed.",
  },
  {
    id: nanoid(),
    type: "Archived",
    key: "archived",
    description: "These projects were archived.",
  },
];

const ProjectsHeader: React.FC<HeaderProps> = ({ 
  title = "Manage Projects", 
  onFilterClick, 
  activeFilter, 
  projectStatistics 
}) => {
  return (
    <div className="p-6">
      <p className="md:text-3xl text-black font-bold py-6">{title}</p>

      <div className="md:grid grid-cols-4 grid grid-cols-1 md:space-x-4 space-x-0 md:space-y-0 space-y-4">
        {projectSummary.map((project) => (
          <div
            key={project.id}
            onClick={() => onFilterClick?.(project.type)}
            className={`border rounded-lg p-4 cursor-pointer transition-all duration-300 ${
              activeFilter === project.type ? "bg-blue-100" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-center text-2xl">
              <p>{project.type}</p>
              <img src={Frame180 || "/placeholder.svg"} alt="header logo" />
            </div>
            <p className="text-black text-3xl font-bold">
              {projectStatistics ? projectStatistics[project.key] : 0} {/* ✅ Type-safe */}
            </p>
            <div className="flex space-x-8 text-sm">
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
