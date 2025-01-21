import ProjectsHeader from "../allProjects/projectComponents/ProjectsHeader";
import Piechart from "../allProjects/projectComponents/Piechart";
import Barchart from "../allProjects/projectComponents/Barchart";
import Areachart from "../allProjects/projectComponents/Areachart";
import Transactions from "../allProjects/projectComponents/Transactions";

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
