export const deleteCategory = async (
  categoryId: string | number,
  setLoading: (loading: boolean) => void,
  onSuccess?: () => void
) => {
  if (!categoryId) {
    alert("Please select a category to delete");
    return;
  }

  try {
    setLoading(true);
    const response = await fetch(
      `https://kidsdesigncompany.pythonanywhere.com/api/inventory-item-category/${categoryId}/`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete category");
    }

    alert("Category deleted successfully!");
    if (onSuccess) {
      onSuccess();
    }
  } catch (error) {
    console.error("Error deleting category:", error);
    alert("Failed to delete category");
  } finally {
    setLoading(false);
  }
};