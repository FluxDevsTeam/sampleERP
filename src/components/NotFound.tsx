import { useNavigate } from 'react-router-dom';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="text-center max-w-md bg-white p-8 rounded-xl shadow-2xl border-2 border-gray-200">
        <h1 className="text-9xl font-extrabold text-red-500 mb-4 drop-shadow-md">404</h1>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h2>
        
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700 font-medium">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={() => navigate('/')}
            className="w-full px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
          >
             Go to Homepage
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-full px-6 py-3 bg-gray-200 hover:bg-gray-300 text-neutral-800 font-bold rounded-lg transition-all duration-300 shadow"
          >
            GO BACK
          </button>
        </div>
        
       
      </div>
    </div>
  );
}

export default NotFoundPage;