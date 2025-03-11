import ProjectsHeader from "../allProjects/_projectComponents/ProjectsHeader";
import IncomeBreakdownPiechart from "../allProjects/_projectComponents/IncomeBreakdownPiechart";
import ExpenseBreakdownBarchart from "../allProjects/_projectComponents/ExpenseBreakdownBarchart";
import Areachart from "../allProjects/_projectComponents/Areachart";
import KeyMetricsChart from "../allProjects/_projectComponents/KeyMetricsChart";
import CategoricalDataCharts from "../allProjects/_projectComponents/CategoricalDataCharts";

const CEODashboard = () => {
  return(
    <div className=" w-full  bg-gray-100">
      <ProjectsHeader  title='Chief Executive Officer' />
      <div className="w-full lg:grid lg:grid-cols-2 grid grid-cols-1 space-x-4  p-6">  
      <IncomeBreakdownPiechart  />
      <ExpenseBreakdownBarchart  />
      </div>
      <KeyMetricsChart  />
      < CategoricalDataCharts  />
      <Areachart  />
      

  
      
      </div>
  ) 
};

export default CEODashboard;
