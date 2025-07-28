import { MdArrowOutward } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { DashboardHeaders } from "../_api/apiService";
import Frame180 from "../../../../assets/images/Frame180.png";

const Header = () => {
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["Header"],
    queryFn: DashboardHeaders,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {(error as Error).message}</p>;

  const financialHealth = data?.financial_health;

  return (
    <div className="p-6">
      <p className="md:text-3xl text-black font-bold py-6">Financial Health</p>

      <div className="md:grid md:grid-cols-3 grid grid-cols-1 md:space-x-4 space-x-0 md:space-y-0 space-y-4">
        {financialHealth && (
          <>
            {Object.entries(financialHealth).map(([key, value]) => (
              <div key={key} className="p-4 border rounded-lg shadow-md">
                <div className="flex justify-between items-center text-2xl">
                  <p className="capitalize">{key.replace(/_/g, " ")}</p>
                  <img src={Frame180 || "/placeholder.svg"} alt="header logo" />
                </div>
                <div className="flex space-x-8 text-sm">
                  <span className="text-green-200">
                    <MdArrowOutward />
                  </span>
                  <span>NGN{Number(value).toLocaleString()}</span>
                </div>
              </div>
            ))}
            {data?.current_month_product_total !== undefined && (
              <div className="p-4 border rounded-lg shadow-md">
                <div className="flex justify-between items-center text-2xl">
                  <p className="capitalize">Current Month Product Total</p>
                  <img src={Frame180 || "/placeholder.svg"} alt="header logo" />
                </div>
                <div className="flex space-x-8 text-sm">
                  <span className="text-green-200">
                    <MdArrowOutward />
                  </span>
                  <span>NGN{Number(data.current_month_product_total).toLocaleString()}</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
