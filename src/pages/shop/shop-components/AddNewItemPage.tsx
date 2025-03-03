import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Whisper, Tooltip } from "rsuite";
import "rsuite/dist/rsuite.min.css";

const AddItemPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    stock: "",
    description: "",
    dimensions: "",
    cost_price: "",
    selling_price: "",
    archived: "",
    image: null as File | null,
  });

  async function skFn() {
    try {
      const response = await fetch(
        "https://kidsdesigncompany.pythonanywhere.com/api/inventory-item-category/"
      );

      if (!response.ok) {
        throw new Error("Iyegs man, rest bro");
      }

      const logData = await response.json();
      console.log(logData);

      setCategories(logData.results);
    } catch (error) {}
  }

  useEffect(() => {
    skFn();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("stock", formData.stock);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("dimensions", formData.dimensions);
      formDataToSend.append("cost_price", formData.cost_price);
      formDataToSend.append("archived", formData.archived);
      formDataToSend.append("selling_price", formData.selling_price);

      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await fetch(
        "https://kidsdesigncompany.pythonanywhere.com/api/inventory-item/",
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      console.log(response);

      if (!response.ok) {
        throw new Error("Failed to add item");
      }

      alert("Item added successfully!");
      navigate(`/shop/dashboard`);
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  const checkCheck = ()=> {
    console.log("it is clicked");
    
  }

  //   console.log(handleSubmit);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/shop/dashboard")}
            className="mr-4 text-gray-20 hover:text-gray-600"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h1 className="text-2xl font-bold text-gray-20">Add New Item</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* item name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            {/* category */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <Whisper
              followCursor
              speaker={<Tooltip className="text-red-500">Can't find the category you are looking for? Click to add new category</Tooltip>}>
                <button
                className=" text-gray-20 border-2 border-gray-500 rounded-md mt-2 p-2"
                onClick={() => navigate("/shop/add-new-category")}
              >
                New category
              </button>
              </Whisper>
            </div>

            {/* stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Stock
              </label>
              <input
                type="number"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
              />
            </div>

            {/* dimensions */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Dimensions
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                value={formData.dimensions}
                onChange={(e) =>
                  setFormData({ ...formData, dimensions: e.target.value })
                }
              />
            </div>

            {/* cost price */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cost Price
              </label>
              <input
                type="number"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                value={formData.cost_price}
                onChange={(e) =>
                  setFormData({ ...formData, cost_price: e.target.value })
                }
              />
            </div>

            {/* selling price */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Selling Price
              </label>
              <input
                type="number"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                value={formData.selling_price}
                onChange={(e) =>
                  setFormData({ ...formData, selling_price: e.target.value })
                }
              />
            </div>

          </div>

          {/* description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          {/* archived */}
          <div>
            <label>Archived</label>
            <input className="ml-4" type="checkbox" onClick={checkCheck}/>
          </div>

          {/* image */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files) {
                  setFormData({ ...formData, image: e.target.files[0] });
                }
              }}
              className="mt-1 block w-full"
            />
          </div>

          {/* add button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-600"
            >
              {loading ? "Adding..." : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemPage;
