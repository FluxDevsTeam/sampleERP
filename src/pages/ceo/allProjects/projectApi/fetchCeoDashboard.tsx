import { useMutation, useQueryClient } from "@tanstack/react-query";
import projectsData from "@/data/ceo/project/projects.json";

interface Project {
  id: string;
  name: string;
  is_delivered: boolean;
  deadline: string;
  start_date: string;
  status: string;
}

export const fetchCeoDashboard = async () => {
  // Simulate dashboard data from projects
  const allProjects = projectsData;
  return {
    all_time_projects_count: allProjects.length,
    all_projects_count: allProjects.filter(p => !p.archived).length,
    completed_projects_count: allProjects.filter(p => p.status === "completed").length,
    ongoing_projects_count: allProjects.filter(p => p.status === "in progress").length,
    average_progress: Math.round(
      allProjects.reduce((acc, p) => acc + (p.products?.progress || 0), 0) / allProjects.length
    ),
  };
};

export const fetchCeoProjects = async () => {
  return projectsData;
};

const saveProjectsToJson = async (updatedProjects: Project[]) => {
  // In a real app, you'd write to the JSON file here.
  // For simplicity, we'll just return the updated data.
  // In a production environment, consider using a proper backend or local storage mechanism.
  return updatedProjects;
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updatedData }: { id: string; updatedData: Partial<Project> }) => {
      const projects = await fetchCeoProjects();
      const updatedProjects = projects.map((project: Project) =>
        project.id === id ? { ...project, ...updatedData } : project
      );
      await saveProjectsToJson(updatedProjects);
      return updatedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const projects = await fetchCeoProjects();
      const updatedProjects = projects.filter((project: Project) => project.id !== id);
      await saveProjectsToJson(updatedProjects);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};