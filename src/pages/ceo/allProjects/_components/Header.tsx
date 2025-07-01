import { MdArrowOutward } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import Frame180 from "../../../../assets/images/Frame180.png";

interface ProjectsSummary {
  all_time_projects_count: number;
  all_projects_count: number;
  completed_projects_count: number;
  ongoing_projects_count: number;
  average_progress: number;
}

const Header = () => {
  const fetchProjectsData = async (): Promise<ProjectsSummary> => {
    const accessToken = localStorage.getItem("accessToken");
    const response = await fetch(
      "https://backend.kidsdesigncompany.com/api/project/",
      {
        headers: {
          Authorization: `JWT ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const { data, isLoading, error } = useQuery<ProjectsSummary, Error>({
    queryKey: ["ProjectsSummary"],
    queryFn: fetchProjectsData,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Ensure data is available
  if (!data) return <p>No data available</p>;

  const summaryItems = [
    { label: "All Time Projects", value: data.all_time_projects_count },
    { label: "All Active Projects", value: data.all_projects_count },
    { label: "Completed Projects", value: data.completed_projects_count },
    { label: "Ongoing Projects", value: data.ongoing_projects_count },
    { label: "Average Progress", value: `${data.average_progress}%` },
  ];

  return (
    <div className="p-6">
      <p className="md:text-3xl text-black font-bold py-6">Project Overview</p>

      <div className="md:grid md:grid-cols-5 grid grid-cols-1 md:space-x-4 space-x-0 md:space-y-0 space-y-4">
        {summaryItems.map((item, index) => (
          <div key={index} className="bg-white rounded pl-4 py-5 shadow grid items-center h-full">
            <p
              style={{ fontSize: "clamp(10px, 3vw, 20px)" }}
              className="text-blue-400 font-bold"
            >
              {item.label}
            </p>
            <p
              style={{ fontSize: "clamp(10px, 3vw, 24px)" }}
              className="font-medium"
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Header;
