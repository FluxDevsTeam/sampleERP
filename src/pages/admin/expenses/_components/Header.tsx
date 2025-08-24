import Frame180 from "../../../../assets/images/Frame180.png";
import { MdArrowOutward } from "react-icons/md";
import expensesData from "@/data/admin/expenses/expenses.json";

interface ExpensesData {
  monthly_total: number;
  weekly_total: number;
  daily_total: number;
  monthly_project_expenses_total: number;
  monthly_shop_expenses_total: number;
}

const Header = () => {
  return (
    <div className="p-6">
      <p className="md:text-3xl text-black font-bold py-6">Expenses Overview</p>

      <div className="md:grid md:grid-cols-4 grid grid-cols-1 md:space-x-4 space-x-0 md:space-y-0 space-y-4">
        {[
          { label: "Monthly Total", value: expensesData.monthly_total },
          { label: "Weekly Total", value: expensesData.weekly_total },
          { label: "Shop Expenses", value: expensesData.monthly_shop_expenses_total },
          { label: "Project Expenses", value: expensesData.monthly_project_expenses_total },
        ].map((item, index) => (
          <div key={index} className="p-4 border rounded-lg shadow-md">
            <div className="flex justify-between items-center text-xl">
              <p>{item.label}</p>
              <img src={Frame180 || "/placeholder.svg"} alt="icon" />
            </div>
            <div className="flex space-x-8 text-sm">
              <span className="text-green-200">
                <MdArrowOutward />
              </span>
              <span>{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Header;