import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Frame180 from "../../../../assets/images/Frame180.png";

interface PaidData {
  monthly_total: number;
  weekly_total: number;
}

const fetchPaidData = async (): Promise<PaidData> => {
  const { data } = await axios.get<PaidData>(
    "https://kidsdesigncompany.pythonanywhere.com/api/paid/"
  );
  return data;
};

const Header = () => {
  const { data, isLoading, error } = useQuery<PaidData>({
    queryKey: ["HeaderPaid"],
    queryFn: fetchPaidData,
  });

  if (isLoading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500">Error: {(error as Error).message}</p>;

  return (
    <div className="p-6">
      <p className="md:text-3xl text-black font-bold py-6">Payments Overview</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: "Monthly Total Paid", value: data?.monthly_total ?? 0 },
          { label: "Weekly Total Paid", value: data?.weekly_total ?? 0 },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between"
          >
            <div>
              <p className="text-lg font-semibold">{item.label}</p>
              <p className="text-2xl font-bold text-neutral-900">{item.value.toLocaleString()}</p>
            </div>
            <img
              src={Frame180}
              alt="icon"
              className="w-12 h-12 object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Header;
