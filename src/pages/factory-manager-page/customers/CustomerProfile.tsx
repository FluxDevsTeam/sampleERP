import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { CustomerResponse } from "./Interfaces"

const CustomerProfile = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customer, setCustomer] = useState<CustomerResponse | null>(null);
  
  // Editable fields
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedPhone, setEditedPhone] = useState("");
  const [editedAddress, setEditedAddress] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://kidsdesigncompany.pythonanywhere.com/api/customer/${id}/?format=json`);

        if (!response.ok) {
          throw new Error("Failed to fetch customer data.");
        }

        const data: CustomerResponse = await response.json();
        console.log("Fetched customer data:", data);

        if (!data || !data.customer_details) {
          setError("Customer not found.");
          return;
        }

        setCustomer(data);
        setEditedName(data.customer_details.name);
        setEditedEmail(data.customer_details.email);
        setEditedPhone(data.customer_details.phone_number);
        setEditedAddress(data.customer_details.address)
      } catch (err) {
        console.error("Error fetching customer:", err);
        setError("Error loading customer profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  const handleUpdate = async () => {
    if (!customer) return;

    setUpdateLoading(true);
    setUpdateError(null);

    try {
      const response = await fetch(
        `https://kidsdesigncompany.pythonanywhere.com/api/customer/${customer.customer_details.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editedName,
            email: editedEmail,
            phone_number: editedPhone,
            address: editedAddress,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Update failed:", errorData);
        throw new Error(errorData?.detail || "Failed to update customer details.");
        }

      const updatedData = await response.json();
      setCustomer((prev) => prev ? { ...prev, customer_details: { ...prev.customer_details, ...updatedData } } : null);
      setIsEditing(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setUpdateError("Error updating customer details.");
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!customer) return <div className="text-red-500 text-center mt-10">Customer not found.</div>;

  return (
    <div className="mx-20 my-10">
      {/* Customer Summary */}
      <div className="flex justify-between items-center gap-4 mb-24">
        <article className="border rounded-lg p-5 shadow-md flex-1">
          <p className="font-bold text-[14px] text-[#767676] mb-2">Total Project Count</p>
          <p className="text-[#0178A3] text-[36px] font-bold">{customer.total_projects_count}</p>
        </article>

        <article className="border rounded-lg p-5 shadow-md flex-1">
          <p className="font-bold text-[14px] text-[#767676] mb-2">Active Project Count</p>
          <p className="text-[#0178A3] text-[36px] font-bold">{customer.active_projects_count}</p>
        </article>

        <article className="border rounded-lg p-5 shadow-md flex-1">
          <p className="font-bold text-[14px] text-[#767676] mb-2">Total Project Cost</p>
          <p className="text-[#0178A3] text-[36px] font-bold">{customer.total_projects_cost}</p>
        </article>

        <article className="border rounded-lg p-5 shadow-md flex-1">
          <p className="font-bold text-[14px] text-[#767676] mb-2">Total Shop-items Count</p>
          <p className="text-[#0178A3] text-[36px] font-bold">{customer.total_shop_items_count}</p>
        </article>

        <article className="border rounded-lg p-5 shadow-md flex-1">
          <p className="font-bold text-[14px] text-[#767676] mb-2">Total Shop-items Cost</p>
          <p className="text-[#0178A3] text-[36px] font-bold">{customer.total_shop_items_cost}</p>
        </article>
      </div>

      {/* Customer Profile */}
      <div className="container mx-auto mt-10 p-6 max-w-3xl bg-white shadow-lg rounded-2xl mb-12">
        <div className="flex items-center space-x-6">
          <div className="w-40 h-40 rounded-full bg-gray-200 flex justify-center items-center text-gray-500">
            <FaUser size={80} />
          </div>
          <div className="flex flex-col gap-2">
            {isEditing ? (
              <>
                <input
                  type="text"
                  className="border p-2 rounded w-full"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                />
                <input
                  type="email"
                  className="border p-2 rounded w-full"
                  value={editedEmail}
                  onChange={(e) => setEditedEmail(e.target.value)}
                />
                <input
                  type="number"
                  className="border p-2 rounded w-full"
                  value={editedPhone}
                  onChange={(e) => setEditedPhone(e.target.value)}
                />
                <input
                  type="text"
                  className="border p-2 rounded w-full"
                  value={editedAddress}
                  onChange={(e) => setEditedAddress(e.target.value)}
                />
                <div className="flex gap-3 mt-2">
                  <button
                    className="bg-green-200 text-white px-4 py-2 rounded-lg flex items-center"
                    onClick={handleUpdate}
                    disabled={updateLoading}
                  >
                    {updateLoading ? "Saving..." : <FaCheck />}
                  </button>
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center"
                    onClick={() => setIsEditing(false)}
                  >
                    <FaTimes />
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-[#0178A3] uppercase">{customer.customer_details.name}</h2>
                <p>{customer.customer_details.email}</p>
                <p>{customer.customer_details.phone_number}</p>
                <p>Address: {customer.customer_details.address || "N/A"}</p>
                <button
                  className="bg-[#FF3B30] text-white px-4 py-2 rounded-lg flex justify-center items-center mt-2"
                  onClick={() => setIsEditing(true)}
                >
                  <FaEdit className="mr-2" /> Edit
                </button>
              </>
            )}
            {updateError && <p className="text-red-500 mt-2">{updateError}</p>}
          </div>
        </div>

        {/* Centering the Link */}
      </div>

      <div className="flex justify-center">
        <Link to="/dashboard/customers" className="bg-blue-200 text-white px-4 py-2 rounded-lg">
          Back to Customers
        </Link>
      </div>
      
      <h3 className="mb-6 mt-14 font-bold text-[24px] text-[#0178A3]">Projects</h3>
      <table className="table-auto border-collapse border border-gray-300 w-full bg-white mb-14">
        <thead>
          <tr className="bg-[#F4F6F9] font-black text-left">
            <th className="py-4 px-2 border border-gray-300">Name</th>
            <th className="py-4 px-2 border border-gray-300">Total Paid</th>
            <th className="py-4 px-2 border border-gray-300">Total Balance</th>
          </tr>
        </thead>
        <tbody>
          {customer.customer_details.project && customer.customer_details.project.length > 0 ? (
            customer.customer_details.project.map((proj) => (
            <tr key={proj.id}>
              <td className="py-4 px-2 border border-gray-300 capitalize">{proj.name}</td>
              <td className="py-4 px-2 border border-gray-300 capitalize">{proj.paid}</td>
              <td className="py-4 px-2 border border-gray-300 capitalize">{proj.balance}</td>
            </tr>
              ))
            ) : (
              <p>No projects available.</p>
            )
          }
        </tbody>
      </table>
      
      <h3 className="mb-6 mt-14 font-bold text-[24px] text-[#0178A3]">Shop Items</h3>
      <table className="table-auto border-collapse border border-gray-300 w-full bg-white">
        <thead>
          <tr className="bg-[#F4F6F9] font-black text-left">
            <th className="py-4 px-2 border border-gray-300">Quantity</th>
            <th className="py-4 px-2 border border-gray-300">Cost Price</th>
            <th className="py-4 px-2 border border-gray-300">Selling Price</th>
            <th className="py-4 px-2 border border-gray-300">Total Price</th>
          </tr>
        </thead>
        <tbody>
          {customer.customer_details.shop_item && customer.customer_details.shop_item.length > 0 ? (
            customer.customer_details.shop_item.map((proj) => (
            <tr key={proj.id}>
              <td className="py-4 px-2 border border-gray-300 capitalize">{proj.quantity}</td>
              <td className="py-4 px-2 border border-gray-300">{proj.cost_price}</td>
              <td className="py-4 px-2 border border-gray-300">{proj.selling_price}</td>
              <td className="py-4 px-2 border border-gray-300">{proj.total_price}</td>
            </tr>
              ))
            ) : (
              <p className="capitalize">No item available.</p>
            )
          }
        </tbody>
      </table>
    </div>
  );
};

export default CustomerProfile;
