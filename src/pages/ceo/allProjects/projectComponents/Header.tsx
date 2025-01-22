import userpic  from "../../../../assets/images/16.png";



export default function Header () {

    return (
    <div className="w-full h-[200px] bg-white  p-6 ">
        <div className=" space-y-3 ">
        <h1 className="font-bold text-black text-2xl">Manage Artisans</h1>
      <div className="flex">
        <img src={userpic}  alt="image"  className="w-[50px] h-[50px] border-none rounded full"  />
        <img src={userpic}  alt="image"  className="w-[50px] h-[50px] border-none rounded full"  />
        <img src={userpic}  alt="image"  className="w-[50px] h-[50px] border-none rounded full"  />
        <img src={userpic}  alt="image"  className="w-[50px] h-[50px] border-none rounded full"  />
        <img src={userpic}  alt="image"  className="w-[50px] h-[50px] border-none rounded full"  />
        <img src={userpic}  alt="image"  className="w-[50px] h-[50px] border-none rounded full"  />
        <img src={userpic}  alt="image"  className="w-[50px] h-[50px] border-none rounded full"  />
        <img src={userpic}  alt="image"  className="w-[50px] h-[50px] border-none rounded full"  />
      </div>


        </div>
        

    </div>
    )
}