import axios from "axios";

export const DashboardHeaders = async () => {
  const accessToken = localStorage.getItem("accessToken");
  const { data } = await axios.get(
    "https://backend.kidsdesigncompany.com/api/admin-dashboard/",
    {
      headers: {
        Authorization: `JWT ${accessToken}`,
      },
    }
  );
  return data;
};
