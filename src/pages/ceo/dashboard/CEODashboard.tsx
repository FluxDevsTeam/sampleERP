import PieCharts from "./_charts/PieCharts"
import AreaCharts from "./_charts/AreaCharts"
// import OverheadCost from "./_components/OverheadCost" // Removed
import Header from "./_components/Header"
import MonthlyTrendsChart from "./_charts/BarCharts"
const CEODashboard = () => {
  return (
    <div className="bg-white">
      <Header />
      <PieCharts />
      <MonthlyTrendsChart/>
      <AreaCharts />
    </div>
  )
}

export default CEODashboard