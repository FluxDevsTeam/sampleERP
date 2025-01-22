import ProjectsHeader from "./ProjectsHeader";
import Header from "./Header";
import ProjectCard from "./ProjectCard";
import Areachart from "./Areachart";
import Piechart from "./Piechart";
import Barchart from "./Barchart";
import Transactions from "./Transactions";

function ProjectDashboard() {
  return (
    <div className="p-6 bg-gray-300">
      <ProjectsHeader />
      <Header  />
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
