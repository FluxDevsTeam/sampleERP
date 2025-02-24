import { MdArrowOutward } from "react-icons/md";
import userpic from "../../../../assets/images/16.png";
import { useQuery } from "@tanstack/react-query";
import { fetchCeoProjects } from "@/pages/ceo/allProjects/projectApi/fetchCeoDashboard";

export default function ProjectCard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["ProjectCard"],
    queryFn: fetchCeoProjects,
  });

  if (isLoading) return <p>Loading projects...</p>;
  if (error) return <p>Error loading projects.</p>;

  const filteredProjects = Array.isArray(data?.results)
    ? data.results.filter((project) => project.archived === false)
    : [];

  return (
    <div className="w-full">
      <div className="p-6 space-y-3">
        {filteredProjects.length > 0 ? (
          <>
            <h1 className="font-bold text-black text-2xl">
              Current projects ({filteredProjects.length})
            </h1>
            <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-4">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="w-auto h-auto p-5 border rounded-lg bg-white flex flex-col space-y-3"
                >
                  <img
                    src={userpic}
                    alt="image"
                    className="w-[70px] h-[70px] border-4 border-blue-600 rounded-full"
                  />
                  <h1 className="text-sm text-gray-700">{project.name}</h1>
                  <h1 className="text-2xl font-bold text-black">
                    ${project.total_project_selling_price}
                  </h1>
                  <div className="flex justify-between items-center">
                    <MdArrowOutward />
                    <p className="text-sm">
                      <span>
                        {project.products?.progress || "0%"} progress to
                        completion
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p>No active projects available.</p>
        )}
      </div>
    </div>
  );
}
