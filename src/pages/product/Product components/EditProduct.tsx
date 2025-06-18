import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Modal from "../../shop/shop-components/Modal";

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
    image: null,
    sketch: null,
  });

  useEffect(() => {
    // Fetch product details
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(
          `https://backend.kidsdesigncompany.com/api/product/${id}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.getItem("accessToken")}`,
          },
        });
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
          "https://backend.kidsdesigncompany.com/api/project/", {
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
    }
  };

  const handleCloseModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
    if (modalConfig.type === "success") {
      // Fetch updated product data before navigating
      const fetchUpdatedProduct = async () => {
        try {
          const response = await fetch(
            `https://backend.kidsdesigncompany.com/api/product/${id}/`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `JWT ${localStorage.getItem("accessToken")}`,
              },
            }
          );
          if (!response.ok) throw new Error("Failed to fetch updated product");
          const updatedProduct = await response.json();

          navigate("/product/main", {
            state: {
              from: "editProduct",
              productData: updatedProduct, // Pass updated product data
            },
          });
        } catch (error) {
          console.error("Error fetching updated product:", error);
          navigate("/product/main");
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
    <div className="max-w-2xl mt-6 mx-auto p-4">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/product/main")}
          className="mr-4 text-gray-20 hover:text-gray-600"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h1 className="text-2xl font-bold text-gray-20">Edit Product</h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        encType="multipart/form-data"
      >
        <div>
          <label className="block mb-1">Project</label>
          <select
            name="project"
            value={formData.project}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="">Choose a project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Dimensions</label>
          <input
            type="text"
            name="dimensions"
            value={formData.dimensions}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1">Colour</label>
          <input
            type="text"
            name="colour"
            value={formData.colour}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1">Design</label>
          <input
            type="text"
            name="design"
            value={formData.design}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1">Production Note</label>
          <textarea
            name="production_note"
            value={formData.production_note}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1">Progress</label>
          <input
            type="number"
            name="progress"
            value={formData.progress}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
            min="0"
            max="100"
            step="1"
          />
        </div>
        <div>
          <label className="block mb-1">Selling Price</label>
          <input
            type="text"
            name="selling_price"
            value={formData.selling_price}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1">Overhead Cost</label>
          <input
            type="text"
            name="overhead_cost"
            value={formData.overhead_cost}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1">Image</label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1">Sketch</label>
          <input
            type="file"
            name="sketch"
            onChange={handleFileChange}
            className="w-full border rounded p-2"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save Changes
        </button>
      </form>

      {/* Success/Error Modal */}
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
