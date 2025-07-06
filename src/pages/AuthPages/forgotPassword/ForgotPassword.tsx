import { useState } from 'react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simulate an API call to send a password reset email
    try {
      // Replace this with your actual API call
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('Password reset email sent. Please check your inbox.');
      } else {
        setMessage('Failed to send password reset email. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="max-w-[300px] sm:max-w-md mx-auto mt-10 sm:mt-16 md:mt-20 p-4 sm:p-6 border border-gray-300 rounded-lg shadow-lg">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">Forgot Password</h2>
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div>
          <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700">
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-xs sm:text-sm"
        >
          Send Reset Link
        </button>
      </form>
      {message && (
        <p className="mt-3 sm:mt-4 text-center text-green-600 text-xs sm:text-sm">{message}</p>
      )}
    </div>
  );
};

export default ForgotPassword;