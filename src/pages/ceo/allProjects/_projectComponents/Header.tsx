import userpic  from "../../../../assets/images/16.png";



export default function Header () {

    return (
    <div className="w-full h-[200px] bg-white  p-6 ">
        <div className=" space-y-3 ">
        <h1 className="font-bold text-black text-2xl">Manage Artisans</h1>
      <div className="flex">
        <img src={userpic}  alt="image"  className="w-[70px] h-[70px] border-4 border-blue-600 rounded-full"  />
        <img src={userpic}  alt="image"  className="w-[70px] h-[70px] border-4 border-blue-600 rounded-full"  />
        <img src={userpic}  alt="image"  className="w-[70px] h-[70px] border-4 border-blue-600 rounded-full"  />
        <img src={userpic}  alt="image"  className="w-[70px] h-[70px] border-4 border-blue-600 rounded-full"  />
        <img src={userpic}  alt="image"  className="w-[70px] h-[70px] border-4 border-blue-600 rounded-full"  />
        <img src={userpic}  alt="image"  className="w-[70px] h-[70px] border-4 border-blue-600 rounded-full"  />
        <img src={userpic}  alt="image"  className="w-[70px] h-[70px] border-4 border-blue-600 rounded-full"  />
        <img src={userpic}  alt="image"  className="w-[70px] h-[70px] border-4 border-blue-600 rounded-full"  />
      </div>


        </div>
        

    </div>
    )
}