import PieCharts from "./_charts/PieCharts"
import AreaCharts from "./_charts/AreaCharts"
import OverheadCost from "./_components/OverheadCost"
import Header from "./_components/Header"
import MonthlyTrendsChart from "./_charts/BarCharts"
const CEODashboard = () => {
  return (
    <div className="bg-white">

      <div className="flex flex-col md:flex-row justify-around items-center p-8">
        <p className="md:text-4xl text-black font-bold py-6">CEO Dashboard</p>
        <OverheadCost />
      </div>
      <Header /> 
      <PieCharts />
      <MonthlyTrendsChart/>
      <AreaCharts />
    </div>
  )
}

export default CEODashboard