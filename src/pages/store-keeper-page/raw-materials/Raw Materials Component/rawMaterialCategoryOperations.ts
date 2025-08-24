interface ModalConfig {
  isOpen: boolean;
  title: string;
  message: string;
  type: "success" | "error";
}

export const deleteRawMaterialCategory = async (
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
    return;
  }

  try {
    setLoading(true);
    setTimeout(() => {
      setModalConfig({
        isOpen: true,
        title: "Success",
        message: "Item category deleted successfully!",
        type: "success",
      });
      if (onSuccess) {
        onSuccess();
      }
      setLoading(false);
    }, 1000);
  } catch (error) {
    setModalConfig({
      isOpen: true,
      title: "Error",
      message: "Failed to delete category",
      type: "error",
    });
    setLoading(false);
  }
};