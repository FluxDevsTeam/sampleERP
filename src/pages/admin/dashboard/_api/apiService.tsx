import axios from "axios";



export const DashboardHeaders = async () => {
    const { data } = await axios.get(
      "https://kidsdesigncompany.pythonanywhere.com/api/admin-dashboard/"
    );
    return data;
  };
  