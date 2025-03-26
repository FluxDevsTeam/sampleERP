import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const Modal = ({
  isOpen,
  onClose,
  type,
}: {
  isOpen: boolean;
  onClose: () => void;
  type: "success" | "error";
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4 border-t-4 ${
          type === "success" ? "border-green-500" : "border-red-500"
        }`}
      >
        <h2
          className={`text-2xl font-bold mb-4 ${
            type === "success" ? "text-blue-600" : "text-red-600"
          }`}
        >
          {type === "success" ? "Success!" : "Error"}
        </h2>
        <p className="mb-6">
          {type === "success"
            ? "Product Added Successfully."
            : "There was an error adding product. Please try again."}
        </p>
        <button
          onClick={onClose}
          className={`w-full py-2 px-4 text-white rounded ${
            type === "success"
              ? "bg-blue-600 hover:bg-blue-20"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {type === "success" ? "Continue" : "Close"}
        </button>
      </div>
    </div>
  );
};

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [productDetails, setProductDetails] = useState<any>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
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
          `https://kidsdesigncompany.pythonanywhere.com/api/product/${id}/`
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
          "https://kidsdesigncompany.pythonanywhere.com/api/project/"
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
        `https://kidsdesigncompany.pythonanywhere.com/api/product/${id}/`,
        {
          method: "PATCH",
          body: formDataToSubmit,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update product details");
      }

      setShowSuccessModal(true);
      navigate("/product/dashboard");
    } catch (error) {
      console.error("Error updating product details:", error);
      setShowErrorModal(true);
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
          onClick={() => navigate("/product/dashboard")}
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

      <Modal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigate("/product/dashboard");
        }}
        type="success"
      />

      <Modal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        type="error"
      />
    </div>
  );
};

export default EditProduct;
