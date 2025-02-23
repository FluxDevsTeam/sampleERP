import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchCeoDashboard = async () => {
  const { data } = await axios.get(
    "https://kidsdesigncompany.pythonanywhere.com/api/ceo-dashboard/"
  );
  console.log("Fetched Data:", data);
  return data;
};

export default function Charts() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["Chart"],
    queryFn: fetchCeoDashboard,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2 className="text-xl font-bold">Fetched Data</h2>
      <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
