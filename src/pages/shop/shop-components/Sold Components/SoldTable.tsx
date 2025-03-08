import { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

interface SoldEntry {
  id: number;
  quantity: string;
  date: string;
  sold_to: { id: number; name: string } | null;
  linked_project: { id: number; name: string } | null;
  name: string;
  logistics: string;
  cost_price: string;
  selling_price: string;
  total_price: number;
  profit: number;
}

interface DailyData {
  date: string;
  entries: SoldEntry[];
  daily_total: number;
}

interface ApiResponse {
  daily_data: DailyData[];
  monthly_total: number;
}

const SoldTable: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [soldData, setSoldData] = useState<DailyData[]>([]);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [openDates, setOpenDates] = useState<{ [key: string]: boolean }>({});

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://kidsdesigncompany.pythonanywhere.com/api/sold/"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data: ApiResponse = await response.json();
      console.log(data);

      setSoldData(data.daily_data);
      setMonthlyTotal(data.monthly_total);
    } catch (error) {
      console.error("Error fetching sold items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const toggleDate = (date: string) => {
    setOpenDates((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="relative">
      <div className="overflow-x-auto pb-8">
        {loading ? (
          <div className="w-1/5 mx-auto">
            <ThreeDots
              visible={true}
              height="80"
              width="80"
              color="black"
              radius="9"
              ariaLabel="three-dots-loading"
            />
          </div>
        ) : (
          <div className="space-y-6">
            <button
              onClick={() => navigate("/shop/add-new-sold-item")}
              className="mb-4 px-4 py-2 bg-blue-400 text-white rounded mr-2 hover:bg-blue-500 transition-colors"
            >
              <FontAwesomeIcon className="pr-2" icon={faPlus} />
              Record Sale
            </button>
            <div className="bg-blue-50 px-2 py-3 rounded-lg">
              <h2
                className="text-xl font-bold text-blue-900"
                style={{ fontSize: "clamp(13.5px, 3vw, 17px)" }}
              >
                Monthly Total: ₦{monthlyTotal.toLocaleString()}
              </h2>
            </div>

            {soldData.map((dayData) => (
              <div
                key={dayData.date}
                className="bg-white shadow-md rounded-lg overflow-auto"
              >
                <div
                  className="bg-blue-20 text-slate-200 px-4 py-2 border-b flex justify-between items-center cursor-pointer hover:bg-slate-200 hover:text-blue-20 w-full"
                  onClick={() => toggleDate(dayData.date)}
                >
                  <div className="flex items-center space-x-2">
                    {/* <FontAwesomeIcon
                      icon={
                        openDates[dayData.date] ? faChevronUp : faChevronDown
                      }
                      className= font-bold"text-white"
                    /> */}
                    <h3
                      className="text-lg font-semibold"
                      style={{ fontSize: "clamp(13.5px, 3vw, 15px)" }}
                    >
                      {formatDate(dayData.date)}
                    </h3>
                  </div>
                  <p
                    className="font-bold"
                    style={{ fontSize: "clamp(13.5px, 3vw, 15px)" }}
                  >
                    Total: ₦{dayData.daily_total.toLocaleString()}
                  </p>
                </div>

                {openDates[dayData.date] && (
                  <table className="min-w-full overflow-auto">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-blue-400">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-blue-400">
                          Quantity
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-blue-400">
                          Sold To
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-blue-400">
                          Project
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-blue-400">
                          Logistics
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-blue-400">
                          Cost Price
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-blue-400">
                          Selling Price
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-blue-400">
                          Total
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-blue-400">
                          Profit
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {dayData.entries.map((entry) => (
                        <tr key={entry.id} className="hover:bg-gray-50">
                          {/* <td className="px-4 py-3 text-sm">{entry.id}</td> */}
                          <td className="px-4 py-3 text-sm">{entry.name}</td>
                          <td className="px-4 py-3 text-sm">
                            {entry.quantity.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {entry.sold_to?.name || "-"}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {entry.linked_project?.name || "-"}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {entry.logistics || "-"}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            ₦{entry.cost_price.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            ₦{entry.selling_price.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-blue-600">
                            ₦{entry.total_price.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-blue-400">
                            ₦{entry.profit.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SoldTable;
