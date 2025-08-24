import { useQuery } from "@tanstack/react-query";
import projectsData from "@/data/ceo/project/projects.json";

interface ProjectsSummary {
  all_time_projects_count: number;
  all_projects_count: number;
  completed_projects_count: number;
  ongoing_projects_count: number;
  average_progress: number;
}

const Header = () => {
  const fetchProjectsData = async (): Promise<ProjectsSummary> => {
    return {
      all_time_projects_count: projectsData.all_projects.length,
      all_projects_count: projectsData.all_projects.filter(p => !p.archived).length,
      completed_projects_count: projectsData.all_projects.filter(p => p.status === "completed").length,
      ongoing_projects_count: projectsData.all_projects.filter(p => p.status === "in progress").length,
      average_progress: Math.round(
        projectsData.all_projects.reduce((acc, p) => acc + (p.products?.progress || 0), 0) /
        projectsData.all_projects.length
      ),
    };
  };

  const { data, isLoading, error } = useQuery<ProjectsSummary, Error>({
    queryKey: ["ProjectsSummary"],
    queryFn: fetchProjectsData,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (!data) return <p>No data available</p>;

  const summaryItems = [
    { label: "All Time Projects", value: data.all_time_projects_count },
    { label: "All Active Projects", value: data.all_projects_count },
    { label: "Completed Projects", value: data.completed_projects_count },
    { label: "Average Progress", value: `${data.average_progress}%` },
  ];

  return (
    <div className="">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-1 md:gap-4">
        {summaryItems.map((item, index) => (
          <div key={index} className="p-2 sm:p-4 border rounded-lg shadow-md flex flex-col items-center justify-center py-4">
            <div className="text-xs sm:text-sm lg:text-base font-medium text-center mb-2 leading-tight">{item.label}</div>
            <div className="text-sm sm:text-base lg:text-lg font-semibold text-blue-400 text-center">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Header;