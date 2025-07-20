/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchData } from "./api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import img from "./ìmg/hi.jpg"; // Ensure the correct file path
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faAnglesLeft, faAnglesRight } from "@fortawesome/free-solid-svg-icons";

const FactoryManagerCustomers = () => {
  const [customers, setCustomers] = useState<unknown[]>([]);
  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const [activeCustomers, setActiveCustomers] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [previousPage, setPreviousPage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone_number: "",
    address: "",
    created_at: new Date().toISOString().split('T')[0],
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);

  const [userRole, setUserRole] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const { name, email, phone_number, address } = newCustomer;
    setIsFormValid(name.trim() !== '' && email.trim() !== '' && phone_number.trim() !== '' && address.trim() !== '');
  }, [newCustomer]);

  useEffect(() => {
    setUserRole(localStorage.getItem('user_role'));
  }, []);

  const addCustomer = async () => {
    setSaving(true);
    setSaveError(null);

    try {
      const response = await fetch("https://backend.kidsdesigncompany.com/api/customer/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `JWT ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(newCustomer),
      });

      if (!response.ok) {
        throw new Error("Failed to add customer.");
      }

      const addedCustomer = await response.json();
      setCustomers([...customers, addedCustomer]); // Update UI
      setTotalCustomers((prev) => prev + 1); // Update Count
      setShowModal(false); // Close Modal
      setNewCustomer({ name: "", email: "", phone_number: "", address: "", created_at: new Date().toISOString().split('T')[0] }); // Reset Form
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setSaveError("Error adding customer.");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    }).replace(" ", ", ");
  };

  const fetchCustomers = async (url: string) => {
    try {
      setLoading(true);
      const response = await fetch(url, {
        headers: {
          'Authorization': `JWT ${localStorage.getItem('accessToken')}`
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      console.log("Fetched data:", data); // Debugging log

      if (data && data.results) {
        setCustomers(Array.isArray(data.results.all_customers) ? data.results.all_customers : []);
        setTotalCustomers(data.results.all_customers_count || 0);
        setActiveCustomers(data.results.active_customers || 0);
        setNextPage(data.next);
        setPreviousPage(data.previous);
      } else {
        setError("Invalid data received.");
      }
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError("Failed to load customers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialUrl = `https://backend.kidsdesigncompany.com/api/customer/`;
    fetchCustomers(initialUrl);
  }, []);

  const handleSearch = () => {
    const searchUrl = `https://backend.kidsdesigncompany.com/api/customer/?search=${searchTerm}`;
    fetchCustomers(searchUrl);
    setCurrentPage(1); 
  };

  const clearSearch = () => {
    setSearchTerm("");
    const initialUrl = `https://backend.kidsdesigncompany.com/api/customer/`;
    fetchCustomers(initialUrl);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const itemsPerPage = 10;

  return (
    <div className="px-0 md:px-10 pt-3 mb-20 md:mb-10 text-[#0A0A0A]">

      <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-8 w-full">
        <article className="border rounded-lg p-2 sm:p-4 shadow-md flex flex-col items-center justify-center">
          <p className="font-bold text-[11px] sm:text-[14px] text-[#767676] mb-1 sm:mb-2">Total Customers</p>
          <p className="text-[#0178A3] text-[20px] sm:text-[36px] font-bold">{totalCustomers}</p>
        </article>
        <article className="border rounded-lg p-2 sm:p-4 shadow-md flex flex-col items-center justify-center">
          <p className="font-bold text-[11px] sm:text-[14px] text-[#767676] mb-1 sm:mb-2">Active Customers</p>
          <p className="text-[#0178A3] text-[20px] sm:text-[36px] font-bold">{activeCustomers}</p>
        </article>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 items-center">
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-3 py-1.5 rounded text-xs sm:text-sm w-full sm:w-auto justify-center border border-blue-400 text-blue-400 bg-transparent hover:bg-blue-50 transition-colors">
          <span className="font-extrabold text-lg sm:text-2xl">+</span>
          <span className="text-xs sm:text-sm">Create Customer</span>
        </button>
        <div className="flex flex-row gap-2 w-full sm:w-auto">
          <input 
            type="text" 
            placeholder="Search customers..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded-lg border-blue-400 text-xs
             sm:text-sm flex-1 min-w-0"
          />
          <button onClick={handleSearch} className="bg-blue-400 hover:bg-blue-500 text-white px-3 py-1.5 rounded text-xs sm:text-sm whitespace-nowrap">Search</button>
          <button onClick={clearSearch} className="bg-gray-500 text-white px-3 py-1.5 rounded text-xs sm:text-sm whitespace-nowrap">Clear</button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg max-w-xs sm:max-w-sm w-full mx-auto">
            <h2 className="text-xl font-bold mb-4">Add New Customer</h2>
            <input type="text" name="name" placeholder="Name" value={newCustomer.name} onChange={handleInputChange} className="border p-2 w-full mb-2" />
            <input type="email" name="email" placeholder="Email" value={newCustomer.email} onChange={handleInputChange} className="border p-2 w-full mb-2" />
            <input type="tel" name="phone_number" placeholder="Phone Number" value={newCustomer.phone_number} onChange={handleInputChange} className="border p-2 w-full mb-2" />
            <input type="text" name="address" placeholder="Address" value={newCustomer.address} onChange={handleInputChange} className="border p-2 w-full mb-2" />
            {userRole === 'ceo' && (
              <>
                <label className="text-sm font-medium text-gray-700">Created Date:</label>
                <input 
                  type="date" 
                  name="created_at" 
                  value={newCustomer.created_at} 
                  onChange={handleInputChange} 
                  className="border p-2 w-full mb-2" 
                />
              </>
            )}
            {saveError && <p className="text-red-500">{saveError}</p>}

            <div className="flex justify-between mt-4">
              <button onClick={addCustomer} disabled={saving || !isFormValid} className={`${isFormValid ? 'bg-blue-600' : 'bg-gray-400'} text-white px-4 py-2 rounded-lg`}>
                {saving ? "Saving..." : "Save"}
              </button>
              <button onClick={() => setShowModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto pb-6">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden text-xs sm:text-sm">
          <thead>
            <tr className="bg-blue-400 text-white">
              <th className="py-2 px-2 sm:py-4 sm:px-4 text-left font-semibold">Name</th>
              <th className="py-2 px-2 sm:py-4 sm:px-4 text-left font-semibold hidden sm:table-cell">Email</th>
              <th className="py-2 px-2 sm:py-4 sm:px-4 text-left font-semibold">Phone</th>
              <th className="py-2 px-2 sm:py-4 sm:px-4 text-left font-semibold hidden md:table-cell">Location</th>
              <th className="py-2 px-2 sm:py-4 sm:px-4 text-left font-semibold w-32 hidden md:table-cell">Year Joined</th>
              <th className="py-2 px-2 sm:py-4 sm:px-4 text-left font-semibold">Details</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer: any) => (
              <tr key={customer.id} className="hover:bg-gray-100">
                <td className="py-2 px-2 sm:py-5 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-gray-700 capitalize border-r border-gray-200">{customer.name}</td>
                <td className="py-2 px-2 sm:py-5 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-gray-700 border-r border-gray-200 hidden sm:table-cell">{customer.email}</td>
                <td className="py-2 px-2 sm:py-5 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-gray-700 border-r border-gray-200">{customer.phone_number}</td>
                <td className="py-2 px-2 sm:py-5 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-gray-700 border-r border-gray-200 hidden md:table-cell">{customer.address}</td>
                <td className="py-2 px-2 sm:py-5 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-gray-700 w-32 border-r border-gray-200 hidden md:table-cell">{formatDate(customer.created_at)}</td>
                <td className="py-2 px-2 sm:py-5 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-gray-700 text-center">
                  <button
                    onClick={() => navigate(`/factory-manager/customers/${customer.id}`)}
                    className="px-3 py-1 text-blue-400 border-2 border-blue-400 rounded hover:bg-blue-50 transition-colors"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center gap-2">
        <button
          onClick={() => {
            if (currentPage > 1 && previousPage) {
              fetchCustomers(`https://backend.kidsdesigncompany.com/api/customer/?page=1`);
              setCurrentPage(1);
            }
          }}
          disabled={!previousPage || currentPage === 1 || loading}
          className="px-3 py-1 rounded bg-blue-400 text-white disabled:bg-gray-300"
        >
          <FontAwesomeIcon icon={faAnglesLeft} />
        </button>
        <button
          onClick={() => {
            if (previousPage && currentPage > 1) {
              fetchCustomers(previousPage);
              setCurrentPage(currentPage - 1);
            }
          }}
          disabled={!previousPage || currentPage === 1 || loading}
          className="px-3 py-1 rounded bg-blue-400 text-white disabled:bg-gray-300"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <span className="mx-4 text-md ">Page {currentPage} of {Math.max(1, Math.ceil(totalCustomers / itemsPerPage))}</span>
        <button
          onClick={() => {
            if (nextPage) {
              fetchCustomers(nextPage);
              setCurrentPage(currentPage + 1);
            }
          }}
          disabled={!nextPage || loading}
          className="px-3 py-1 rounded bg-blue-400 text-white disabled:bg-gray-300"
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
        <button
          onClick={async () => {
            if (nextPage) {
              // Find the last page number by fetching until nextPage is null
              let lastPage = currentPage;
              let url: string | null = nextPage;
              while (url) {
                const response: Response = await fetch(url, {
                  headers: { 'Authorization': `JWT ${localStorage.getItem('accessToken')}` }
                });
                if (!response.ok) break;
                const data: any = await response.json();
                if (data.next) {
                  url = data.next;
                  lastPage++;
                } else {
                  url = null;
                  lastPage++;
                }
              }
              fetchCustomers(`https://backend.kidsdesigncompany.com/api/customer/?page=${lastPage}`);
              setCurrentPage(lastPage);
            }
          }}
          disabled={!nextPage || loading}
          className="px-3 py-1 rounded bg-blue-400 text-white disabled:bg-gray-300"
        >
          <FontAwesomeIcon icon={faAnglesRight} />
        </button>
      </div>
    </div>
  );
};

export default FactoryManagerCustomers;
