// src/pages/admin/assets/_components/Header.tsx
import assetsData from "@/data/admin/assets/assets.json";

interface AssetsSummary {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    total_assets_count: number;
    good_assets_count: number;
    good_assets_value: number;
    depreciated_assets_count: number;
  };
}

const Header = () => {
  const summaryItems = [
    { label: "Total Assets", value: assetsData.results.total_assets_count },
    { label: "Good Assets", value: assetsData.results.good_assets_count },
    { label: "Good Assets Value", value: `NGN ${assetsData.results.good_assets_value.toLocaleString("en-NG")}` },
    { label: "Depreciated Assets", value: assetsData.results.depreciated_assets_count },
  ];

  return (
    <div className="p-6">
      <p className="md:text-3xl text-black font-bold py-6">Asset Overview</p>
      <div className="md:grid md:grid-cols-4 grid grid-cols-1 md:space-x-4 space-x-0 md:space-y-0 space-y-4">
        {summaryItems.map((item, index) => (
          <div key={index} className="p-4 border rounded-lg shadow-md">
            <div className="flex justify-between items-center text-xl">
              <p>{item.label}</p>
            </div>
            <div className="flex space-x-8 text-sm">
              <span>{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Header;