import { MdArrowOutward } from "react-icons/md";
import userpic  from "../../../../assets/images/16.png";



export default function ProjectCard() {

    return (
    <div className="w-full    ">
        <div className="p-6 space-y-3 ">
        <h1 className="font-bold text-black text-2xl">Current projects (4)</h1>
      <div className="flex flex-col md:flex md:flex-row  space-y-6 md:space-y-0 md:space-x-4">
        <div className="w-auto h-auto p-5 border rounded-lg bg-white flex flex-col space-y-3">
        <img src={userpic}  alt="image"   className="w-[70px] h-[70px] border-4 border-blue-600 rounded-full"  />
        <h1 className='text-sm text-gray-700'>Mike Ballack</h1>
        <h1 className="text-2xl font-bold text-black">$3000,000</h1>
        <p className="text-sm text-black">Here we are</p>
        <div className="flex justify-between items-center">< MdArrowOutward  /> <p className="text-sm">50% progress to completion</p></div>
        </div>

        <div className="w-auto h-auto p-5 border rounded-lg bg-white flex flex-col space-y-3">
        <img src={userpic}  alt="image"   className="w-[70px] h-[70px] border-4 border-blue-600 rounded-full"  />
        <h1 className='text-sm text-gray-700'>Mike Ballack</h1>
        <h1 className="text-2xl font-bold text-black">$3000,000</h1>
        <p className="text-sm text-black">Here we are</p>
        <div className="flex justify-between items-center">< MdArrowOutward  /> <p className="text-sm">50% progress to completion</p></div>
        </div>

        <div className="w-auto h-auto p-5 border rounded-lg bg-white flex flex-col space-y-3">
        <img src={userpic}  alt="image"   className="w-[70px] h-[70px] border-4 border-blue-600 rounded-full"  />
        <h1 className='text-sm text-gray-700'>Mike Ballack</h1>
        <h1 className="text-2xl font-bold text-black">$3000,000</h1>
        <p className="text-sm text-black">Here we are</p>
        <div className="flex justify-between items-center">< MdArrowOutward  /> <p className="text-sm">50% progress to completion</p></div>
        </div>

        <div className="w-auto h-auto p-5 border rounded-lg bg-white flex flex-col space-y-3">
        <img src={userpic}  alt="image"   className="w-[70px] h-[70px] border-4 border-blue-600 rounded-full" />
        <h1 className='text-sm text-gray-700'>Mike Ballack</h1>
        <h1 className="text-2xl font-bold text-black">$3000,000</h1>
        <p className="text-sm text-black">Here we are</p>
        <div className="flex justify-between items-center">< MdArrowOutward  /> <p className="text-sm">50% progress to completion</p></div>
        </div>


      </div>


        </div>
        

    </div>
    )
}