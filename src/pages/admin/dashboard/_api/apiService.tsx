import axios from "axios";



export const DashboardHeaders = async () => {
  const access_token = localStorage.getItem("access_token");
    const { data } = await axios.get(
      "https://backend.kidsdesigncompany.com/api/admin-dashboard/",
       {
          headers: {
            Authorization: `JWT ${access_token}`
          }
        }
    );
    return data;
  };
  