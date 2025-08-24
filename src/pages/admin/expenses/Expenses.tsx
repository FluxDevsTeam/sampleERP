import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import AddExpenseModal from "./_components/AddExpenseModal";
import ExpensesTable from "./_components/ExpensesTable";
import ExpensesData from "./_components/ExpensesData";
import expensesData from "@/data/admin/expenses/expenses.json";

const Expenses = () => {
  document.title = "Expenses - KDC Admin";
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalProjectExpenses, setTotalProjectExpenses] = useState(0);
  const [totalShopExpenses, setTotalShopExpenses] = useState(0);
  const [totalOtherExpenses, setTotalOtherExpenses] = useState(0);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    setTotalExpenses(expensesData.monthly_total);
    setTotalProjectExpenses(expensesData.monthly_project_expenses_total);
    setTotalShopExpenses(expensesData.monthly_shop_expenses_total);
    setTotalOtherExpenses(expensesData.current_month_product_total);
  }, []);

  return (
    <div className="wrapper w-full mx-auto my-0 md:mb-2 mb-20 md annen md:pt-2">
      <div
        className={`grid grid-cols-2 lg:grid-cols-4 gap-4 mb-2 md:mt-4 ${isTableModalOpen ? "blur-md" : ""}`}
      >
        <ExpensesData info="Total Expenses" digits={totalExpenses} currency="₦ " />
        <ExpensesData info="Total Project Expenses" digits={totalProjectExpenses} currency="₦ " />
        <ExpensesData info="Total Shop Expenses" digits={totalShopExpenses} currency="₦ " />
        <ExpensesData info="Total Product Expenses" digits={totalOtherExpenses} currency="₦ " />
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

        <div className={`${isTableModalOpen ? "blur-md" : ""}`}>
          <ExpensesTable isTableModalOpen={isTableModalOpen} />
        </div>
      </div>
    </div>
  );
};

export default Expenses;