import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import { CustomerResponse } from "./Interfaces";
import customerProfilesInitial from "@/data/factory-manager-page/customers/customer-profiles.json"; // Import initial JSON

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
  const [editedCreatedAt, setEditedCreatedAt] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const navigate = useNavigate();
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("user_role");
    setUserRole(role);
    try {
      setLoading(true);
      // Load from local storage if available, else use initial JSON
      const storedProfiles = localStorage.getItem("customerProfiles");
      const customerProfiles = storedProfiles ? JSON.parse(storedProfiles) : customerProfilesInitial;
      const data: CustomerResponse = customerProfiles[id as keyof typeof customerProfiles];

      if (!data || !data.customer_details) {
        setError("Customer not found.");
        return;
      }

      setCustomer(data);
      setEditedName(data.customer_details.name);
      setEditedEmail(data.customer_details.email);
      setEditedPhone(data.customer_details.phone_number);
      setEditedAddress(data.customer_details.address);
      setEditedCreatedAt(data.customer_details.created_at);
    } catch (err) {
      console.error("Error loading customer:", err);
      setError("Error loading customer profile.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleUpdate = async () => {
    if (!customer) return;

    setUpdateLoading(true);
    setUpdateError(null);

    try {
      // Load current profiles from local storage or initial JSON
      const storedProfiles = localStorage.getItem("customerProfiles");
      const customerProfiles = storedProfiles ? JSON.parse(storedProfiles) : customerProfilesInitial;

      // Update customer details
      const updatedData = {
        ...customer.customer_details,
        name: editedName,
        email: editedEmail,
        phone_number: editedPhone,
        address: editedAddress,
        created_at: editedCreatedAt,
      };

      // Update profiles object
      customerProfiles[customer.customer_details.id] = {
        ...customer,
        customer_details: updatedData,
      };

      // Save to local storage
      localStorage.setItem("customerProfiles", JSON.stringify(customerProfiles));

      // Update customers.json in local storage
      const storedCustomers = localStorage.getItem("customersData");
      const customersData = storedCustomers ? JSON.parse(storedCustomers) : (await import("@/data/factory-manager-page/customers/customers.json")).default;
      const updatedCustomers = {
        ...customersData,
        results: {
          ...customersData.results,
          all_customers: customersData.results.all_customers.map((cust: any) =>
            cust.id === customer.customer_details.id
              ? { ...cust, name: editedName, email: editedEmail, phone_number: editedPhone, address: editedAddress, created_at: editedCreatedAt }
              : cust
          ),
        },
      };
      localStorage.setItem("customersData", JSON.stringify(updatedCustomers));

      setCustomer((prev) => prev ? { ...prev, customer_details: updatedData } : null);
      setIsEditing(false);
    } catch (err) {
      setUpdateError("Error updating customer details.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!customer) return;

    if (!window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(true);
    setDeleteError(null);

    try {
      // Load current profiles from local storage or initial JSON
      const storedProfiles = localStorage.getItem("customerProfiles");
      const customerProfiles = storedProfiles ? JSON.parse(storedProfiles) : customerProfilesInitial;

      // Remove customer from profiles
      delete customerProfiles[customer.customer_details.id];

      // Save updated profiles to local storage
      localStorage.setItem("customerProfiles", JSON.stringify(customerProfiles));

      // Update customers.json in local storage
      const storedCustomers = localStorage.getItem("customersData");
      const customersData = storedCustomers ? JSON.parse(storedCustomers) : (await import("@/data/factory-manager-page/customers/customers.json")).default;
      const updatedCustomers = {
        ...customersData,
        results: {
          ...customersData.results,
          all_customers: customersData.results.all_customers.filter((cust: any) => cust.id !== customer.customer_details.id),
          all_customers_count: customersData.results.all_customers_count - 1,
          active_customers: customersData.results.active_customers - (customer.active_projects_count > 0 ? 1 : 0),
          owing_customers: customersData.results.owing_customers - (customer.customer_details.project.some((proj: any) => Number(proj.balance) > 0) ? 1 : 0),
        },
      };
      localStorage.setItem("customersData", JSON.stringify(updatedCustomers));

      navigate('/factory-manager/customers');
    } catch (err) {
      setDeleteError("Error deleting customer.");
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!customer) return <div className="text-red-500 text-center mt-10">Customer not found.</div>;

  const formatNumberWithCommas = (number: number) => {
    return new Intl.NumberFormat('en-US').format(number);
  };

  let totalCostPrice = 0, totalSellingPrice = 0, totalTotalPrice = 0;
  if (customer.customer_details.shop_item && customer.customer_details.shop_item.length > 0) {
    customer.customer_details.shop_item.forEach((proj) => {
      totalCostPrice += Number(proj.cost_price) || 0;
      totalSellingPrice += Number(proj.selling_price) || 0;
      totalTotalPrice += Number(proj.total_price) || 0;
    });
  }

  let totalPaid = 0, totalBalance = 0;
  if (customer.customer_details.project && customer.customer_details.project.length > 0) {
    customer.customer_details.project.forEach((proj) => {
      totalPaid += Number(proj.paid) || 0;
      totalBalance += Number(proj.balance) || 0;
    });
  }

  return (
    <div className="mx-1 sm:mx-6 my-4 sm:my-10">
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-2 sm:mb-4">
        <article className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
          <h3 className="font-semibold text-xs sm:text-lg text-black-600 mb-1 sm:mb-2">Total Projects</h3>
          <p className="text-base sm:text-xl font-bold text-blue-600">{customer.total_projects_count}</p>
        </article>
        <article className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
          <h3 className="font-semibold text-xs sm:text-lg text-black-600 mb-1 sm:mb-2">Active Projects</h3>
          <p className="text-base sm:text-xl font-bold text-black-900">{customer.active_projects_count}</p>
        </article>
        <article className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
          <h3 className="font-semibold text-xs sm:text-lg text-black-600 mb-1 sm:mb-2">Shop Items</h3>
          <p className="text-base sm:text-xl font-bold text-blue-600">{customer.total_shop_items_count}</p>
        </article>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-8">
        <article className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
          <h3 className="font-semibold text-xs sm:text-lg text-black-600 mb-1 sm:mb-2">Total Project Cost</h3>
          <p className="text-base sm:text-xl font-bold text-purple-600">₦{formatNumberWithCommas(customer.total_projects_cost)}</p>
        </article>
        <article className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
          <h3 className="font-semibold text-xs sm:text-lg text-black-600 mb-1 sm:mb-2">Shop Items Cost</h3>
          <p className="text-base sm:text-xl font-bold text-red-600">₦{formatNumberWithCommas(customer.total_shop_items_cost)}</p>
        </article>
      </div>

      <div className="container mx-auto mt-4 p-2 sm:p-4 max-w-3xl bg-white shadow-lg rounded-2xl mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="flex flex-col gap-2 w-full">
            {isEditing ? (
              <>
                <input
                  type="text"
                  className="border p-2 rounded w-full"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                />
                <label className="text-sm font-medium text-gray-700">Email (optional)</label>
                <input
                  type="email"
                  className="border p-2 rounded w-full"
                  placeholder="Email (optional)"
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
                <label className="text-sm font-medium text-gray-700">Created Date:</label>
                <input
                  type="date"
                  className="border p-2 rounded w-full"
                  value={editedCreatedAt ? new Date(editedCreatedAt).toISOString().split('T')[0] : ""}
                  onChange={(e) => setEditedCreatedAt(e.target.value)}
                />
                <div className="grid grid-cols-3 gap-2 mt-2 w-full">
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
                <p>{customer.customer_details.email || '-'}</p>
                <p>{customer.customer_details.phone_number}</p>
                <p>Address: {customer.customer_details.address || "N/A"}</p>
                <p>Created: {new Date(customer.customer_details.created_at).toLocaleDateString()}</p>
                <div className="grid grid-cols-3 gap-2 mt-2 w-full">

                    <>
                      <button
                        className="bg-white border border-[#30ff6be3] text-[#1f9733] hover:bg-[#e6fbe9] px-3 py-1.5 rounded flex justify-center items-center text-xs sm:text-sm w-full sm:w-auto"
                        onClick={() => setIsEditing(true)}
                      >
                        <FaEdit className="mr-1" /> Edit
                      </button>
                      <button
                        className="bg-white border border-red-700 text-red-700 hover:bg-red-50 px-3 py-1.5 rounded flex justify-center items-center text-xs sm:text-sm w-full sm:w-auto"
                        onClick={handleDelete}
                        disabled={deleteLoading}
                      >
                        {deleteLoading ? 'Deleting...' : <><FaTrash className="mr-1" /> Delete</>}
                      </button>
                    </>
                  <div className="flex justify-center w-full">
                    <Link to="/factory-manager/customers" className="bg-white border border-blue-400 text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:no-underline px-3 py-1.5 rounded text-xs sm:text-sm w-full sm:w-auto text-center">
                      Back to Customers
                    </Link>
                  </div>
                </div>
                {updateError && <p className="text-red-500 mt-2">{updateError}</p>}
                {deleteError && <p className="text-red-500 mt-2">{deleteError}</p>}
              </>
            )}
          </div>
        </div>
      </div>

      <h3 className="mb-6 mt-14 font-bold text-[24px] text-[#0178A3]">Projects</h3>
      <div className="overflow-x-auto mb-14">
        <table className="table-auto border-collapse border border-gray-300 w-full bg-white text-[10px] sm:text-xs md:text-sm">
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
                  <td className="py-4 px-2 border border-gray-300 capitalize">₦{formatNumberWithCommas(Number(proj.paid))}</td>
                  <td className={`py-4 px-2 border border-gray-300 capitalize ${Number(proj.balance) <= 0 ? 'text-red-600' : ''}`}>₦{formatNumberWithCommas(Number(proj.balance))}</td>
                </tr>
              ))
            ) : (
              <p>No projects available.</p>
            )}
            {customer.customer_details.project && customer.customer_details.project.length > 0 && (
              <tr className="bg-gray-100 font-bold">
                <td className="py-4 px-2 border border-gray-300 text-left">Total</td>
                <td className="py-4 px-2 border border-gray-300">₦{formatNumberWithCommas(totalPaid)}</td>
                <td className="py-4 px-2 border border-gray-300">₦{formatNumberWithCommas(totalBalance)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <h3 className="mb-6 mt-14 font-bold text-[24px] text-[#0178A3]">Shop Items</h3>
      <div className="overflow-x-auto mb-20 md:mb-4">
        <table className="table-auto border-collapse border border-gray-300 w-full bg-white text-[10px] sm:text-xs md:text-sm">
          <thead>
            <tr className="bg-[#F4F6F9] font-black text-left">
              <th className="py-4 px-2 border border-gray-300">Name</th>
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
                  <td className="py-4 px-2 border border-gray-300 capitalize">{proj.name || '-'}</td>
                  <td className="py-4 px-2 border border-gray-300 capitalize">{formatNumberWithCommas(Number(proj.quantity))}</td>
                  <td className="py-4 px-2 border border-gray-300">₦{formatNumberWithCommas(Number(proj.cost_price))}</td>
                  <td className="py-4 px-2 border border-gray-300">₦{formatNumberWithCommas(Number(proj.selling_price))}</td>
                  <td className="py-4 px-2 border border-gray-300">₦{formatNumberWithCommas(Number(proj.total_price))}</td>
                </tr>
              ))
            ) : (
              <tr><td className="capitalize text-center py-4 px-2 border border-gray-300" colSpan={5}>No item available.</td></tr>
            )}
            {customer.customer_details.shop_item && customer.customer_details.shop_item.length > 0 && (
              <tr className="bg-gray-100 font-bold">
                <td className="py-4 px-2 border border-gray-300 text-left">Total</td>
                <td className="py-4 px-2 border border-gray-300"></td>
                <td className="py-4 px-2 border border-gray-300">₦{formatNumberWithCommas(totalCostPrice)}</td>
                <td className="py-4 px-2 border border-gray-300">₦{formatNumberWithCommas(totalSellingPrice)}</td>
                <td className="py-4 px-2 border border-gray-300">₦{formatNumberWithCommas(totalTotalPrice)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerProfile;