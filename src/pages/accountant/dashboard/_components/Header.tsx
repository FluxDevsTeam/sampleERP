import { MdArrowOutward } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import Frame180 from "../../../../assets/images/Frame180.png";
import accountantDashboardData from "@/data/accountant/dashboard/accountant-dashboard.json";

const Header = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["Header"],
    queryFn: async () => {
      // Load from local storage if available, else use JSON
      const storedData = localStorage.getItem("accountantDashboardData");
      return storedData ? JSON.parse(storedData) : accountantDashboardData;
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {(error as Error).message}</p>;

  const financialHealth = data?.financial_health;

  return (
    <div className="p-3 sm:p-6">
      <p className="text-xl sm:text-2xl md:text-3xl text-black font-bold py-3 sm:py-6">Financial Health</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {financialHealth &&
          Object.entries(financialHealth).map(([key, value]) => (
            <div key={key} className="p-3 sm:p-4 border rounded-lg shadow-md">
              <div className="flex justify-between items-center text-lg sm:text-xl md:text-2xl">
                <p className="capitalize text-sm sm:text-base md:text-lg">{key.replace(/_/g, " ")}</p>
                <img src={Frame180 || "/placeholder.svg"} alt="header logo" className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div className="flex space-x-4 sm:space-x-8 text-xs sm:text-sm mt-2">
                <span className="text-green-200">
                  <MdArrowOutward />
                </span>
                <span>NGN{Number(value).toLocaleString()}</span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Header;