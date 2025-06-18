
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>403 - Unauthorized Access</h1>
      <p>You don't have permission to view this page.</p>
      <button onClick={() => navigate(-1)}>Go Back</button>
      <button onClick={() => navigate('/')} style={{ marginLeft: '10px' }}>
        Go to Home
      </button>
    </div>
  );
};

export default Unauthorized;