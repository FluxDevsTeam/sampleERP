import ProjectCard from "../allProjects/_projectComponents/ProjectCard";
import Areachart from "../allProjects/_projectComponents/Areachart";
import Barchart from "../allProjects/_projectComponents/Barchart";
import Transactions from "../allProjects/_projectComponents/Transactions";
import ProjectTable from "../allProjects/_projectComponents/ProjectTable";
import ProjectsHeader from "../allProjects/_projectComponents/ProjectsHeader";
import Header from "../allProjects/_projectComponents/Header";
import Piechart from "../allProjects/_projectComponents/Piechart";


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
