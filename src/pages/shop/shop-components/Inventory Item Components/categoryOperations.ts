interface ModalConfig {
  isOpen: boolean;
  title: string;
  message: string;
  type: "success" | "error";
}

export const deleteCategory = async (
  categoryId: string | number,
  setLoading: (loading: boolean) => void,
  setModalConfig: (config: ModalConfig) => void,
  onSuccess?: () => void
) => {
  if (!categoryId) {
    setModalConfig({
      isOpen: true,
      title: "Error",
      message: "Please select a category to delete",
      type: "error"
    });
    return;
  }

  try {
    setLoading(true);
    const response = await fetch(
      `https://backend.kidsdesigncompany.com/api/inventory-item-category/${categoryId}/`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.getItem("accessToken")}`
        }
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete category");
    }

    setModalConfig({
      isOpen: true,
      title: "Success",
      message: "Category deleted successfully!",
      type: "success"
    });
    
    if (onSuccess) {
      onSuccess();
    }
  } catch (error) {
    console.error("Error deleting category:", error);
    setModalConfig({
      isOpen: true,
      title: "Error",
      message: "Failed to delete category",
      type: "error"
    });
  } finally {
    setLoading(false);
  }
};