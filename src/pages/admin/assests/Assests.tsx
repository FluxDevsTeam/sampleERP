import AssetsTable from "./_components/AssetsTable"
import Header from "./_components/AssetsHeader"

const Assets = () => {
  return (
    <div className="flex flex-col min-h-0">
      <Header />
      <div className="flex-1 min-h-0 overflow-auto">
        <AssetsTable />
      </div>
    </div>
  )
}

export default Assets