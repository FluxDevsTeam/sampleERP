import axios from "axios";

export const fetchCeoDashboard = async () => {
  const { data } = await axios.get(
    "https://kidsdesigncompany.pythonanywhere.com/api/ceo-dashboard/"
  );
  console.log("Fetched Data:", data);
  return data;
};

export const fetchCeoProjects = async () => {
  const { data } = await axios.get(
    "https://kidsdesigncompany.pythonanywhere.com/api/project/"
  );
  console.log("Fetched Data:", data);
  return data;
};