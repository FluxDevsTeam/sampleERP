import { projectSummary} from "../projectUtils/header-json";
import { MdArrowOutward } from "react-icons/md";
import Frame180 from "../../../../assets/images/Frame180.png";

const ProjectsHeader = () => {
    return (
      <div className="p-6 ">
        <p className="text-3xl text-black font-bold py-6">Manage Projects</p>
        <div className="flex justify-center items-center space-x-4">
          {projectSummary.map((project, index) => (
            <div className="bg-white border rounded-lg space-y-4 p-4" key={index}>
              <div className="flex justify-between items-center text-2xl">
                <p className="text-blue-500">{project.type}</p>
                <p>
                  <img src={Frame180} alt="header logo" />
                </p>
              </div>
              <p className="text-black text-3xl font-bold">{project.number}</p>
              <div className="flex space-x-2 text-sm">
                <MdArrowOutward />
                <span>{project.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default ProjectsHeader;
  