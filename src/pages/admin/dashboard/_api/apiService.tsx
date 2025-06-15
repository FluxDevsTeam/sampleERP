import axios from "axios";



export const DashboardHeaders = async () => {
    const { data } = await axios.get(
      "https://backend.kidsdesigncompany.com/api/admin-dashboard/"
    );
    return data;
  };
  