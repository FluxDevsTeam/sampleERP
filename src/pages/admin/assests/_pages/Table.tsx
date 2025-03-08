import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";

const fetchAssets = async () => {
  const { data } = await axios.get("https://kidsdesigncompany.pythonanywhere.com/api/assets/");
  return data.assets;
};

const AssetsTable = () => {
  const { data: assets, isLoading, isError } = useQuery({
    queryKey: ["assets"],
    queryFn: fetchAssets,
  });

  if (isLoading) return <p>Loading assets...</p>;
  if (isError) return <p>Error fetching assets.</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Assets List</h2>
        <Link
          to="/admin/dashboard/add-asset"
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Add New Asset
        </Link>
      </div>

      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Value</th>
            <th className="border p-2">Lifespan</th>
            <th className="border p-2">Available</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset: any, index: number) => (
            <tr key={index} className="border">
              <td className="border p-2">{asset.name}</td>
              <td className="border p-2">${asset.value}</td>
              <td className="border p-2">{asset.expected_lifespan}</td>
              <td className="border p-2">
                {asset.is_still_available ? "✅ Yes" : "❌ No"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssetsTable;
