import { useQuery } from "@tanstack/react-query";
import { fetchExpenseSummary, ExpenseSummary } from "./_api/ApiService";
import ExpensesTable from "./_components/ExpensesTable";
import ExpensesData from "./_components/ExpensesData";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import AddExpenseModal from "./_components/AddExpenseModal";

const Expenses = () => {
  document.title = "Expenses - KDC Admin";
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalProjectExpenses, setTotalProjectExpenses] = useState(0);
  const [totalShopExpenses, setTotalShopExpenses] = useState(0);
  const [totalOtherExpenses, setTotalOtherExpenses] = useState(0);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data, isLoading, error } = useQuery<ExpenseSummary, Error>({
    queryKey: ["expenseSummary"],
    queryFn: fetchExpenseSummary,
  });

  useEffect(() => {
    if (data) {
      setTotalExpenses(data.monthly_total);
      setTotalProjectExpenses(data.monthly_project_expenses_total);
      setTotalShopExpenses(data.monthly_shop_expenses_total);
      // Calculate total other expenses
      setTotalOtherExpenses(
        data.monthly_total - (data.monthly_project_expenses_total + data.monthly_shop_expenses_total)
      );
    }
  }, [data]);

  if (isLoading) return <p>Loading expenses data...</p>;
  if (error) return <p>Error loading expenses: {error.message}</p>;

  return (
    <div className="wrapper w-full mx-auto my-0 pl-1 md:mb-2 mb-20 pt-2">
      <div
        className={`grid grid-cols-2 lg:grid-cols-4 gap-4 mb-2 mt-4 ${isTableModalOpen ? "blur-md" : ""}`}
      >
        <ExpensesData info="Total Expenses" digits={totalExpenses} currency="₦ " />
        <ExpensesData info="Total Project Expenses" digits={totalProjectExpenses} currency="₦ " />
        <ExpensesData info="Total Shop Expenses" digits={totalShopExpenses} currency="₦ " />
        <ExpensesData info="Total Other Expenses" digits={totalOtherExpenses} currency="₦ " />
      </div>

      <div>
        <div className="grid grid-cols-2 items-center gap-2 mt-2 mb-2">
          <h1
            style={{ fontSize: "clamp(16.5px, 3vw, 30px)" }}
            className={`font-semibold py-2 m-0 ${isTableModalOpen ? "blur-md" : ""}`}
          >
            Expense Items
          </h1>
          <button
            className="flex items-center gap-2 px-4 py-2 border border-blue-400 text-blue-400 bg-transparent rounded hover:bg-blue-50 transition-colors text-xs sm:text-sm justify-self-end ml-auto sm:ml-0"
            onClick={() => setIsAddModalOpen(true)}
          >
            <FontAwesomeIcon icon={faPlus} />
            Add Expense
          </button>
        </div>
        <AddExpenseModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

        <div
          className={`${isTableModalOpen ? "blur-md" : ""}`}
        >
          <ExpensesTable
            isTableModalOpen={isTableModalOpen}
          />
        </div>
      </div>

      
    </div>
  );
};

export default Expenses;