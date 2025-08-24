import inventoryDataJson from "@/data/shop/inventory/inventory.json";

export interface ModalConfig {
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
      type: "error",
    });
    return inventoryDataJson.categories;
  }

  try {
    setLoading(true);
    // Simulate deletion by filtering out the category
    const updatedCategories = inventoryDataJson.categories.filter(
      (category) => category.id !== Number(categoryId)
    );
    // In a real app, update JSON or persist to backend here
    setModalConfig({
      isOpen: true,
      title: "Success",
      message: "Category deleted successfully!",
      type: "success",
    });
    if (onSuccess) {
      onSuccess();
    }
    return updatedCategories;
  } catch (error) {
    console.error("Error deleting category:", error);
    setModalConfig({
      isOpen: true,
      title: "Error",
      message: "Failed to delete category",
      type: "error",
    });
    return inventoryDataJson.categories;
  } finally {
    setLoading(false);
  }
};