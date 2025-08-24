import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import dashboardDataJson from "@/data/store-keeper-page/dashboard/storekeeper-dashboard.json";

const AddRMCategory: React.FC = () => {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Simulate adding category by updating local state
      const newCategory = {
        id: Math.max(...dashboardDataJson.rawMaterialsCategories.map((c) => c.id)) + 1,
        name,
      };
      // For demo purposes, we'll just navigate back without modifying JSON
      setTimeout(() => {
        navigate("/store-keeper/dashboard");
        setIsLoading(false);
      }, 1000); // Simulate network delay
    } catch (err) {
      setError("Failed to add category. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-500 mb-6">Add New Category</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 mb-2">Category Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-400"
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
            >
              {isLoading ? "Adding..." : "Add Category"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/store-keeper/dashboard")}
              className="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRMCategory;