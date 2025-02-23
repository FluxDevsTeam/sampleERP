import { projectSummary } from "../_projectUtils/header-json"
import { MdArrowOutward } from "react-icons/md"
import Frame180 from "../../../../assets/images/Frame180.png"

interface HeaderProps {
  title?: string
  onFilterClick?: (filterType: string) => void
  activeFilter?: string
}

const ProjectsHeader: React.FC<HeaderProps> = ({ title = "Manage Projects", onFilterClick, activeFilter }) => {
  return (
    <div className="p-6">
      <p className="md:text-3xl text-black font-bold py-6">{title}</p>
      
      {/* Added a wrapping div */}
      <div className="md:grid md:grid-cols-4 grid grid-cols-1 md:space-x-4 space-x-0 md:space-y-0 space-y-4">
        {projectSummary.map((project, index) => (
          <div
            key={index}
            onClick={() => onFilterClick?.(project.type)}
            className={`border rounded-lg p-4 cursor-pointer transition-all duration-300 ${
              activeFilter === project.type ? "bg-blue-100" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-center text-2xl">
              <p>{project.type}</p>
              <img src={Frame180 || "/placeholder.svg"} alt="header logo" />
            </div>
            <p className="text-black text-3xl font-bold">{project.number}</p>
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
  )
}

export default ProjectsHeader
