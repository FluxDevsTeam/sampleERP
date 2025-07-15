import PieCharts from "./_charts/PieCharts"
import AreaCharts from "./_charts/AreaCharts"
// import OverheadCost from "./_components/OverheadCost" // Removed
import Header from "./_components/Header"
import MonthlyTrendsChart from "./_charts/BarCharts"
const CEODashboard = () => {
  return (
    <div className="bg-white p-2 sm:p-4 min-h-screen">
      <Header />
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mb-8">
        {/* Add CEO dashboard cards here if any */}
      </div>
      <div className="w-full min-h-[220px] sm:min-h-[350px] bg-white rounded-lg shadow p-2 sm:p-4 overflow-x-auto mb-4">
        <PieCharts />
      </div>
      <div className="w-full min-h-[220px] sm:min-h-[350px] bg-white rounded-lg shadow p-2 sm:p-4 overflow-x-auto mb-4">
        <MonthlyTrendsChart />
      </div>
      <div className="w-full min-h-[220px] sm:min-h-[350px] bg-white rounded-lg shadow p-2 sm:p-4 overflow-x-auto">
        <AreaCharts />
      </div>
    </div>
  )
}

export default CEODashboard