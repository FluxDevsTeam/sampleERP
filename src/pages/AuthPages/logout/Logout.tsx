
import { useAuth } from "../AuthContext"


const Logout = () => {

     const { logout } = useAuth();
  return (
    <p className='p-2 hover:bg-red-600 bg-red-700 text-2 text-white border rounded-lg cursor-pointer' onClick={logout}>Logout</p>
  )
}

export default Logout