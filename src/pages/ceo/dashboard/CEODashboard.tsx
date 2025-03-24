import PieCharts from "./_charts/PieCharts"
import AreaCharts from "./_charts/AreaCharts"
import OverheadCost from "./_components/OverheadCost"

const CEODashboard = () => {
  return (
    <div>
      <OverheadCost />
      <PieCharts />
      <AreaCharts />
    </div>
  )
}

export default CEODashboard