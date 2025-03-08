import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Frame180 from "../../../../assets/images/Frame180.png";

interface ExpensesData {
    monthly_total: number;
    weekly_total: number;
    daily_total: number;
    monthly_project_expenses_total: number;
    monthly_shop_expenses_total: number;
  }

  const fetchExpenses = async (): Promise<ExpensesData> => {
    const { data } = await axios.get<ExpensesData>("https://kidsdesigncompany.pythonanywhere.com/api/expense/");
    return data;
  };
  


const Header = () => {
  const { data, isLoading, error } = useQuery<ExpensesData>({
    queryKey: ["Header"],
    queryFn: fetchExpenses,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {(error as Error).message}</p>;

  return (
    <div className="p-6">

       
      <p className="md:text-3xl text-black font-bold py-6">Expenses Overview</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Monthly Total", value: data?.monthly_total },
          { label: "Weekly Total", value: data?.weekly_total },
          { label: "Daily Total", value: `$${data?.daily_total}` },
          { label: "Total Project Expenses", value: data?.monthly_project_expenses_total }
        ].map((item, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold">{item.label}</p>
              <p className="text-2xl font-bold">{item.value}</p>
            </div>
            <img src={Frame180 || "/placeholder.svg"} alt="icon"  />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Header;
