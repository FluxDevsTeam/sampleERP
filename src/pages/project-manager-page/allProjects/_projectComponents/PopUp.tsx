




const PopUp = () =>{
    return (

        <div className="absolute bg-white border rounded-md shadow-md flex flex-col justify-center items-center  w-[150px] h-[100px] z-10 top-full right-0  mt-2">
      <p className="text-sm cursor-pointer hover:text-blue-500">Restore</p>
      <p className="text-sm mt-2 cursor-pointer hover:text-red-500">Delete</p>
    </div>
    )
}

export default PopUp