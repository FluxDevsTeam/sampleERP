
import { transactions } from "../projectUtils/header-json"
import ellipse from "../../../../assets/images/Ellipse 10.png";


const Transactions=()=>{

 

    return (
        <div className="">
            <p className="text-3xl font-bold text-black lg:pt-0 pt-6">Transactions</p>

            <div className="bg-white w-full h-[350px] my-6 flex justify-center items-center">
  <div className="space-y-4">
    {transactions.map((transaction, index) => (
      <div className="grid grid-cols-3 px-4" key={index}>
        <p>
          <img
            src={ellipse}
            alt="header logo"
            className="w-[32px] h-[32px]"
          />
        </p>
        <div className="flex flex-col ">
          <p className="text-md font-bold">{transaction.text}</p>
          <p className="text-sm">{transaction.date.toLocaleDateString()}</p>
        </div>
        <p className="text-lime-500 ml-6">${transaction.price}</p>
      </div>
    ))}
  </div>
</div>
</div>
    )
}

export default Transactions