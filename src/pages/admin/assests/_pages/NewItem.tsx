import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const CreateAsset = () => {
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [lifespan, setLifespan] = useState("");
  const [available, setAvailable] = useState(true);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newAsset = {
      name,
      value,
      expected_lifespan: lifespan,
      is_still_available: available,
    };

    await axios.post("https://kidsdesigncompany.pythonanywhere.com/api/assets/crud", newAsset);
    queryClient.invalidateQueries(["assets"]); // Refresh assets data
    navigate("/admin/dashboard/assets");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Create New Asset</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Asset Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="block w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="block w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Expected Lifespan"
          value={lifespan}
          onChange={(e) => setLifespan(e.target.value)}
          className="block w-full p-2 border rounded"
        />
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={available}
            onChange={() => setAvailable(!available)}
          />
          <span className="ml-2">Available</span>
        </label>
        <button
          type="submit"
          className="bg-neutral-900 text-white px-4 py-2 rounded-md"
        >
          Add Asset
        </button>
      </form>
    </div>
  );
};

export default CreateAsset;
