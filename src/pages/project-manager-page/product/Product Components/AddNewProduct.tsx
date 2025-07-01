import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import SearchablePaginatedProjectDropdown from '../SearchablePaginatedProjectDropdown';

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

const AddNewProductPage = () => {
  const navigate = useNavigate();
  const [project, setProject] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    project: "",
    name: "",
    images: "",
    sketch: "",
    dimensions: "",
    colour: "",
    design: "",
    production_note: "",
    progress: "",
    selling_price: "",
    overhead_cost: "",
    quantity: "",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectResponse] = await Promise.all([
          fetch("https://backend.kidsdesigncompany.com/api/project/", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${localStorage.getItem("accessToken")}`,
            },
          }),
        ]);

        if (!projectResponse.ok) throw new Error("Failed to fetch data");
        const projectData = await projectResponse.json();

        console.log(projectData);

        setProject(projectData.all_projects);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setFormData({
      project: "",
      name: "",
      images: "",
      sketch: "",
      dimensions: "",
      colour: "",
      design: "",
      production_note: "",
      progress: "",
      selling_price: "",
      overhead_cost: "",
      quantity: "",
    });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData((prevFormData) => ({
        ...prevFormData,
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
      formDataToSubmit.append("images", formData.images);
      formDataToSubmit.append("sketch", formData.sketch);
      formDataToSubmit.append("dimensions", formData.dimensions);
      formDataToSubmit.append("colour", formData.colour);
      formDataToSubmit.append("design", formData.design);
      formDataToSubmit.append("production_note", formData.production_note);
      formDataToSubmit.append("progress", formData.progress);
      formDataToSubmit.append("selling_price", formData.selling_price);
      formDataToSubmit.append("overhead_cost", formData.overhead_cost);
      formDataToSubmit.append("quantity", formData.quantity);

      console.log("Submitting data:", formDataToSubmit);

      const response = await fetch(
        "https://backend.kidsdesigncompany.com/api/product/",
        {
          method: "POST",
          headers: {
            Authorization: `JWT ${localStorage.getItem("accessToken")}`,
          },
          body: formDataToSubmit,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error("Failed to submit");
      }

      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error:", error);
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div
        className={`max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-10 ${
          showSuccessModal || showErrorModal ? "hidden" : ""
        }`}
      >
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/project-manager/main")}
            className="mr-4 text-gray-20 hover:text-gray-800"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h1 className="text-2xl font-bold text-gray-20">Add Product</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          encType="multipart/form-data"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Project
            </label>
            <SearchablePaginatedProjectDropdown
              endpoint="https://backend.kidsdesigncompany.com/api/project/?ordering=-start_date"
              onChange={(value) => setFormData((prev) => ({ ...prev, project: value }))}
              selectedValue={formData.project}
              selectedName={project && project.find((p: any) => String(p.id) === formData.project)?.name}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Dimensions
            </label>
            <input
              name="dimensions"
              value={formData.dimensions}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Colour
            </label>
            <input
              name="colour"
              value={formData.colour}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Production Note (optional)
            </label>
            <textarea
              name="production_note"
              value={formData.production_note}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Design (optional)
            </label>
            <input
              name="design"
              value={formData.design}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Selling Price
            </label>
            <input
              type="number"
              name="selling_price"
              value={formData.selling_price}
              onChange={handleChange}
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
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quantity (optional)
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Image
            </label>
            <input
              type="file"
              name="images"
              onChange={handleFileChange}
              className="mt-1 block w-full"
              accept="image/*"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sketch
            </label>
            <input
              type="file"
              name="sketch"
              onChange={handleFileChange}
              className="mt-1 block w-full"
              accept="image/*"
            />
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-lg font-semibold shadow ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Adding Product..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>

      <Modal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigate("/project-manager/main");
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

export default AddNewProductPage;
