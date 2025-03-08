import { useQuery } from "@tanstack/react-query";
import { AssetsData } from "../_api/apiService";
import Frame180 from "../../../../assets/images/Frame180.png";

interface AssetsSummary {
  count: number;
  next: string | null;
  previous: string | null;
  total_value: number;
  results: {
    total_assets_count: number;
    good_assets_count: number;
    good_assets_value: number;
    depreciated_assets_count: number;
  };
}

const Header = () => {
  const { data, isLoading, error } = useQuery<AssetsSummary>({
    queryKey: ["AssetsSummary"],
    queryFn: AssetsData,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {(error as Error).message}</p>;

  return (
    <div className="p-6">
      <p className="md:text-3xl text-black font-bold py-6">Asset Overview</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Assets", value: data?.results.total_assets_count },
          { label: "Good Assets", value: data?.results.good_assets_count },
          { label: "Good Assets Value", value: `$${data?.results.good_assets_value}` },
          { label: "Depreciated Assets", value: data?.results.depreciated_assets_count }
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between"
          >
            <div>
              <p className="text-lg font-semibold">{item.label}</p>
              <p className="text-2xl font-bold">{item.value}</p>
            </div>
            <img src={Frame180 || "/placeholder.svg"} alt="icon" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Header;
