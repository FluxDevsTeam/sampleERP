import { projectSummary} from "../_projectUtils/header-json";
import { MdArrowOutward } from "react-icons/md";
import Frame180 from "../../../../assets/images/Frame180.png";

interface HeaderProps {
  title?: string; 
}




const ProjectsHeader :  React.FC<HeaderProps> = ({ title = "Manage Projects" }) =>  {


  
    return (
      <div className="p-6 ">
        <p className="text-3xl text-black font-bold py-6 ">{title}</p>
        <div className="lg:grid lg:grid-cols-4 lg:space-x-4 space-x-0 grid grid-cols-1 lg:space-y-0 space-y-4">
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
               <span className='text-green-200'><MdArrowOutward /> </span> 
                <span>{project.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default ProjectsHeader;
  
