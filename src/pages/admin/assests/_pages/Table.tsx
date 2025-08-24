// src/pages/admin/assets/_components/AssetsTableSimple.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import assetsData from "@/data/admin/assets/assets.json";

interface Asset {
  id: number;
  name: string;
  value: number;
  expected_lifespan: string;
  is_still_available: boolean;
}

const AssetsTable = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isLoading) return <p>Loading assets...</p>;
  if (error) return <p>Error fetching assets: {error}</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Assets List</h2>
        <Link
          to="/admin/add-asset"
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
          {assetsData.results.assets.map((asset: Asset) => (
            <tr key={asset.id} className="border">
              <td className="border p-2">{asset.name}</td>
              <td className="border p-2">₦ {asset.value.toLocaleString("en-NG")}</td>
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