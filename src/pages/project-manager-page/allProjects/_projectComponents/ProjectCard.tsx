
import userpic  from "../../../../assets/images/16.png";



export default function ProjectCard() {

    return (
    <div className="w-full    ">
        <div className="p-6 space-y-3 ">
        <h1 className="font-bold text-black text-2xl">Current projects (4)</h1>
      <div className="flex space-x-4">
        <div className="w-[250px] h-[250px] p-5 border rounded-lg bg-white flex flex-col space-y-2">
        <img src={userpic}  alt="image"  className="w-[50px] h-[50px] border-none rounded full"  />
        <h1 className='text-sm text-gray-700'>Mike Ballack</h1>
        <h1 className="text-2xl font-bold text-black">$3000,000</h1>
        <p className="text-sm text-black">Here we are</p>
        </div>

        <div className="w-[250px] h-[250px] p-5 border rounded-lg bg-white flex flex-col space-y-2">
        <img src={userpic}  alt="image"  className="w-[50px] h-[50px] border-none rounded full"  />
        <h1 className='text-sm text-gray-700'>Mike Ballack</h1>
        <h1 className="text-2xl font-bold text-black">$3000,000</h1>
        <p className="text-sm text-black">Here we are</p>
        </div>

        <div className="w-[250px] h-[250px] p-5 border rounded-lg bg-white flex flex-col space-y-2">
        <img src={userpic}  alt="image"  className="w-[50px] h-[50px] border-none border-blue-500 rounded full"  />
        <h1 className='text-sm text-gray-700'>Mike Ballack</h1>
        <h1 className="text-2xl font-bold text-black">$3000,000</h1>
        <p className="text-sm text-black">Here we are</p>
        </div>
      </div>


        </div>
        

    </div>
    )
}