import ProjectCard from "../allProjects/_projectComponents/ProjectCard";
import Areachart from "../allProjects/_projectComponents/Areachart";
import Barchart from "../allProjects/_projectComponents/Barchart";
import Transactions from "../allProjects/_projectComponents/Transactions";
import ProjectsHeader from "../allProjects/_projectComponents/ProjectsHeader";
import Piechart from "../allProjects/_projectComponents/Piechart";


function ProjectDashboard() {
  return (
    <div className="bg-gray-10">
      <ProjectsHeader />
      <ProjectCard />
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
