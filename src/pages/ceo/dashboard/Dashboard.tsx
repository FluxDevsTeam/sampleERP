import ProjectsHeader from "../allProjects/_projectComponents/ProjectsHeader";
import Piechart from "../allProjects/_projectComponents/Piechart";
import Barchart from "../allProjects/_projectComponents/Barchart";
import Areachart from "../allProjects/_projectComponents/Areachart";
import Transactions from "../allProjects/_projectComponents/Transactions";

const Dashboard = () => {
  return(
    <div className=" w-full  bg-gray-100">
      <ProjectsHeader  title='Chief Executive Officer' />
      <div className="w-full lg:grid lg:grid-cols-3 grid grid-cols-1 space-x-4  p-6">  
      <Piechart  />
      <Transactions  />
      <Barchart  />
      </div>

      <Areachart  />
      

  
      
      </div>
  ) 
};

export default Dashboard;
