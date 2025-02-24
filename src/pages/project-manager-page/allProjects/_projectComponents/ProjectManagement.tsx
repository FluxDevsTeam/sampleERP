import { useState, useEffect } from "react";
import ProjectsHeader from "./ProjectsHeader";
import UserTable from "./UserTable";
import { useQuery } from "@tanstack/react-query";
import { fetchCeoProjects } from "@/pages/ceo/allProjects/projectApi/fetchCeoDashboard";

export default function ProjectManagement() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["ProjectManagement"],
    queryFn: fetchCeoProjects,
  });

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [activeFilter, setActiveFilter] = useState("Total Projects");

  // Update state when data is available
  useEffect(() => {
    if (data?.results) {
      setFilteredUsers(data.results);
    }
  }, [data]);

 
  const handleFilterClick = (filterType: string) => {
    setActiveFilter(filterType);
    if (!data?.results) return;
  
    let status = "";
    if (filterType === "Active Projects") status = "in progress";
    else if (filterType === "Completed") status = "completed";
    else if (filterType === "Archived") status = "archived";
  
    if (filterType === "Total Projects") {
      setFilteredUsers(data.results);
    } else {
      const filtered = data.results.filter((project) => project.status.toLowerCase() === status);
      setFilteredUsers(filtered);
    }
  };
  
  if (isLoading) return <p>Loading projects...</p>;
  if (error) return <p>Error loading projects.</p>;

  return (
    <div>
      <ProjectsHeader onFilterClick={handleFilterClick} activeFilter={activeFilter}   projectStatistics={data?.project_statistics}/>
      <UserTable data={filteredUsers} title={activeFilter} />
    </div>
  );
}
