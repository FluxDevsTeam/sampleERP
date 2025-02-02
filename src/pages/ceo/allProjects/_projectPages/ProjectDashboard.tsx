import ProjectsHeader from "../_projectComponents/ProjectsHeader";
import Header from "../_projectComponents/Header";
import ProjectCard from "../_projectComponents/ProjectCard";
import Areachart from "../_projectComponents/Areachart";
import Piechart from "../_projectComponents/Piechart";
import Barchart from "../_projectComponents/Barchart";
import Transactions from "../_projectComponents/Transactions";
import ProjectTable from "../_projectComponents/ProjectTable";

function ProjectDashboard() {
  return (
    <div className="p-6 bg-[#F0F4F8]">
      <ProjectsHeader />
      <Header  />
      <ProjectCard />
      <ProjectTable />
      <div className="w-full lg:grid lg:grid-cols-3 grid grid-cols-1 space-x-4  p-6">  
      <Piechart  />
      <Transactions  />
      <Barchart  />
      </div>

      <Areachart  />

    </div>
  );
}

export default ProjectDashboard;
