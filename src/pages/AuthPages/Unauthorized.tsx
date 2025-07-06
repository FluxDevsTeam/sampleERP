
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center mt-8 sm:mt-12 md:mt-16 px-4 sm:px-6">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">403 - Unauthorized Access</h1>
      <p className="text-sm sm:text-base mb-4 sm:mb-6">You don't have permission to view this page.</p>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
        <button 
          onClick={() => navigate(-1)}
          className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs sm:text-sm"
        >
          Go Back
        </button>
        <button 
          onClick={() => navigate('/')}
          className="px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-xs sm:text-sm"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;