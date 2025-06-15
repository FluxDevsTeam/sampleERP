import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Frame180 from "../../../../assets/images/Frame180.png";
import { MdArrowOutward } from "react-icons/md";

interface PaidData {
  monthly_total: number;
  weekly_total: number;
}

const fetchPaidData = async (): Promise<PaidData> => {
  const { data } = await axios.get<PaidData>(
    "https://backend.kidsdesigncompany.com/api/paid/"
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

      <div className="md:grid md:grid-cols-2 grid grid-cols-1 md:space-x-4 space-x-0 md:space-y-0 space-y-4">
        {[
          { label: "Monthly Total Paid", value: data?.monthly_total ?? 0 },
          { label: "Weekly Total Paid", value: data?.weekly_total ?? 0 },
        ].map((item, index) => (
          <div key={index} className="p-4 border rounded-lg shadow-md">
            <div className="flex justify-between items-center text-2xl">
              <p>{item.label}</p>
              <img src={Frame180 || "/placeholder.svg"} alt="icon" className="w-12 h-12" />
            </div>
            <div className="flex space-x-8 text-sm">
              <span className="text-green-200">
                <MdArrowOutward />
              </span>
              <span>NGN {item.value.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Header;
