import { MdArrowOutward } from "react-icons/md"
import { useQuery } from "@tanstack/react-query"
import { DashboardHeaders } from "../_api/apiService"
import Frame180 from "../../../../assets/images/Frame180.png";

const Header = () => {

     const { data, isLoading, error } = useQuery({
          queryKey: ["Header"],
          queryFn:DashboardHeaders ,
        });

 if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {(error as Error).message}</p>;

  return (
    <div className="p-6">
         <p className="md:text-3xl text-black font-bold py-6">{data.title}</p>

<div className="md:grid grid-cols-4 grid grid-cols-1 md:space-x-4 space-x-0 md:space-y-0 space-y-4">
  {data.map((project) => (
    <div
      key={project.id}
    >
      <div className="flex justify-between items-center text-2xl">
        <p>{project.type}</p>
        <img src={Frame180 || "/placeholder.svg"} alt="header logo" />
      </div>
      <div className="flex space-x-8 text-sm">
        <span className="text-green-200">
          <MdArrowOutward />
        </span>
        <span>{project.description}</span>
      </div>
    </div>
  ))}
</div>
    </div>
  )
}

export default Header