import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Modal from "@/pages/shop/Modal";
import SearchablePaginatedProjectDropdown from '../SearchablePaginatedProjectDropdown';

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });

  const [productDetails, setProductDetails] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    project: "",
    name: "",
    dimensions: "",
    colour: "",
    design: "",
    production_note: "",
    progress: 0,
    selling_price: "",
    overhead_cost: "",
    quantity: "",
    image: null,
    sketch: null,
  });

  useEffect(() => {
    // Fetch product details
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(
          `https://backend.kidsdesigncompany.com/api/product/${id}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }
        const data = await response.json();
        setProductDetails(data);

        // Pre-fill form data with fetched product details
        setFormData({
          project: data.linked_project?.id || "",
          name: data.name || "",
          dimensions: data.dimensions || "",
          colour: data.colour || "",
          design: data.design || "",
          production_note: data.production_note || "",
          progress: data.progress || 0,
          selling_price: data.selling_price || "",
          overhead_cost: data.overhead_cost || "",
          quantity: data.quantity || "",
          image: null,
          sketch: null,
        });
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch projects for the dropdown
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          "https://backend.kidsdesigncompany.com/api/project/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        setProjects(data.all_projects || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProductDetails();
    fetchProjects();
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("project", formData.project);
      formDataToSubmit.append("name", formData.name);
      formDataToSubmit.append("dimensions", formData.dimensions);
      formDataToSubmit.append("colour", formData.colour);
      formDataToSubmit.append("design", formData.design);
      formDataToSubmit.append("production_note", formData.production_note);
      formDataToSubmit.append("progress", formData.progress.toString());
      formDataToSubmit.append("selling_price", formData.selling_price);
      formDataToSubmit.append("overhead_cost", formData.overhead_cost);
      formDataToSubmit.append("quantity", formData.quantity);
      if (formData.image) {
        formDataToSubmit.append("images", formData.image);
      }
      if (formData.sketch) {
        formDataToSubmit.append("sketch", formData.sketch);
      }

      const response = await fetch(
        `https://backend.kidsdesigncompany.com/api/product/${id}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `JWT ${localStorage.getItem("accessToken")}`,
          },
          body: formDataToSubmit,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update product details");
      }

      setModalConfig({
        isOpen: true,
        title: "Success",
        message: "Updated successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error updating product details:", error);
      setModalConfig({
        isOpen: true,
        title: "Error",
        message: "Failed to update item",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
    if (modalConfig.type === "success") {
      // Fetch updated product data before navigating
      const fetchUpdatedProduct = async () => {
        try {
          const response = await fetch(
            `https://backend.kidsdesigncompany.com/api/product/${id}/`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `JWT ${localStorage.getItem("accessToken")}`,
              },
            }
          );
          if (!response.ok) throw new Error("Failed to fetch updated product");
          const updatedProduct = await response.json();

          navigate("/project-manager/main", {
            state: {
              from: "editProduct",
              productData: updatedProduct, // Pass updated product data
            },
          });
        } catch (error) {
          console.error("Error fetching updated product:", error);
          navigate("/project-manager/main");
        }
      };

      fetchUpdatedProduct();
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center w-1/5 mx-auto">
        <ThreeDots
          visible={true}
          height="80"
          width="80"
          color="#60A5FA"
          radius="9"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div
        className={`max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-10 ${
          modalConfig.isOpen ? "hidden" : ""
        }`}
      >
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/project-manager/main")}
            className="mr-4 text-gray-20 hover:text-gray-800"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h1 className="text-2xl font-bold text-gray-20">Edit Product</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${modalConfig.isOpen ? "hidden" : ""}`}
          encType="multipart/form-data"
        >
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Project
            </label>
            <SearchablePaginatedProjectDropdown
              endpoint="https://backend.kidsdesigncompany.com/api/project/?ordering=-start_date"
              onChange={(value) => setFormData((prev) => ({ ...prev, project: value }))}
              selectedValue={formData.project}
              selectedName={projects && projects.find((p: any) => String(p.id) === formData.project)?.name}
            />
          </div>

          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
                min="1"
              />
            </div>
          </div>

          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Dimensions
              </label>
              <input
                type="text"
                name="dimensions"
                value={formData.dimensions}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Colour
              </label>
              <input
                type="text"
                name="colour"
                value={formData.colour}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Production Note
            </label>
            <textarea
              name="production_note"
              value={formData.production_note}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              rows={4}
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Design
            </label>
            <input
              type="text"
              name="design"
              value={formData.design}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Selling Price
              </label>
              <input
                type="number"
                name="selling_price"
                value={formData.selling_price}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Overhead Cost
              </label>
              <input
                type="number"
                name="overhead_cost"
                value={formData.overhead_cost}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>
          </div>

          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Image (optional)
              </label>
              <input
                type="file"
                name="image"
                onChange={handleFileChange}
                className="mt-1 block w-full"
                accept="image/*"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Sketch (optional)
              </label>
              <input
                type="file"
                name="sketch"
                onChange={handleFileChange}
                className="mt-1 block w-full"
                accept="image/*"
              />
            </div>
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 md:py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 md:text-lg text-md font-semibold shadow ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Updating Product..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>

      <Modal
        isOpen={modalConfig.isOpen}
        onClose={handleCloseModal}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
      />
    </div>
  );
};

export default EditProduct;
