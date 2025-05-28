/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchData } from "./api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import img from "./ìmg/hi.jpg"; // Ensure the correct file path

const FactoryManagerCustomers = () => {
  const [customers, setCustomers] = useState<unknown[]>([]);
  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const [activeCustomers, setActiveCustomers] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone_number: "",
    address: "",
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value });
  };

  const addCustomer = async () => {
    setSaving(true);
    setSaveError(null);

    try {
      const response = await fetch("https://kidsdesigncompany.pythonanywhere.com/api/customer/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCustomer),
      });

      if (!response.ok) {
        throw new Error("Failed to add customer.");
      }

      const addedCustomer = await response.json();
      setCustomers([...customers, addedCustomer]); // Update UI
      setTotalCustomers((prev) => prev + 1); // Update Count
      setShowModal(false); // Close Modal
      setNewCustomer({ name: "", email: "", phone_number: "", address: "" }); // Reset Form
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

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const data = await fetchData();
        
        console.log("Fetched data:", data); // Debugging log

        if (data && data.results) {
          setCustomers(Array.isArray(data.results.all_customers) ? data.results.all_customers : []);
          setTotalCustomers(data.results.all_customers_count || 0);
          setActiveCustomers(data.results.active_customers || 0);
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

    fetchCustomers();
  }, []);

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

  return (
    <div className="px-10 py-5 text-[#0A0A0A]">
      <div className="flex justify-between pr-52 m-10">
        <h2 className="text-[#0178A3] font-semibold text-[24px]">Active Customers</h2>
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <img key={i} src={img} alt="Customer" className="w-12 h-12 rounded-full -ml-2 first:ml-0" />
          ))}
          <span className="bg-gray-500 text-white flex justify-center items-center border w-12 h-12 rounded-full -ml-2 first:ml-0">
            12+
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center gap-28 mb-8">
        <article className="border rounded-lg p-5 shadow-md flex-1">
          <p className="font-bold text-[14px] text-[#767676] mb-2">Total Customers</p>
          <p className="text-[#0178A3] text-[36px] font-bold">{totalCustomers}</p>
        </article>

        <article className="border rounded-lg p-5 shadow-md flex-1">
          <p className="font-bold text-[14px] text-[#767676] mb-2">Active Users</p>
          <p className="text-[#0178A3] text-[36px] font-bold">{activeCustomers}</p>
        </article>
      </div>

      <button onClick={() => setShowModal(true)} className="bg-[#FF3B30] text-white flex items-center gap-3 px-4 py-1 mb-6 rounded-lg">
        <span className="font-extrabold text-[30px]">+</span>
        <span className="text-[16px]"> Create Customer</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Add New Customer</h2>
            <input type="text" name="name" placeholder="Name" value={newCustomer.name} onChange={handleInputChange} className="border p-2 w-full mb-2" />
            <input type="email" name="email" placeholder="Email" value={newCustomer.email} onChange={handleInputChange} className="border p-2 w-full mb-2" />
            <input type="tel" name="phone_number" placeholder="Phone Number" value={newCustomer.phone_number} onChange={handleInputChange} className="border p-2 w-full mb-2" />
            <input type="text" name="address" placeholder="Address" value={newCustomer.address} onChange={handleInputChange} className="border p-2 w-full mb-2" />

            {saveError && <p className="text-red-500">{saveError}</p>}

            <div className="flex justify-between mt-4">
              <button onClick={addCustomer} disabled={saving} className="bg-green-600 text-white px-4 py-2 rounded-lg">
                {saving ? "Saving..." : "Save"}
              </button>
              <button onClick={() => setShowModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <table className="table-auto border-collapse border border-gray-300 w-full bg-white">
        <thead>
          <tr className="bg-[#F4F6F9] font-black text-left">
            <th className="py-4 px-2 border border-gray-300">Name</th>
            <th className="py-4 px-2 border border-gray-300">Email</th>
            <th className="py-4 px-2 border border-gray-300">Phone</th>
            <th className="py-4 px-2 border border-gray-300">Location</th>
            <th className="py-4 px-2 border border-gray-300">Year Joined</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer: any) => (
            <tr key={customer.id} onClick={() => navigate(`/dashboard/customers/${customer.id}`)} className="cursor-pointer hover:bg-gray-100">
              <td className="py-4 px-2 border border-gray-300 capitalize">{customer.name}</td>
              <td className="py-4 px-2 border border-gray-300">{customer.email}</td>
              <td className="py-4 px-2 border border-gray-300">{customer.phone_number}</td>
              <td className="py-4 px-2 border border-gray-300">{customer.address}</td>
              <td className="py-4 px-2 border border-gray-300">{formatDate(customer.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FactoryManagerCustomers;
