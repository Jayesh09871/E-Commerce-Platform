import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
import axios from 'axios';

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Try to get token from URL first
        const params = new URLSearchParams(window.location.search);
        let token = params.get('token');

        // If not in URL, check sessionStorage (our fallback mechanism)
        if (!token) {
          token = sessionStorage.getItem('temp_auth_token');
          sessionStorage.removeItem('temp_auth_token'); // Clear after use
        }

        if (!token) {
          console.error('No authentication token found in URL or sessionStorage');
          toast.error('Authentication failed - No token received');
          navigate('/login');
          return;
        }

        console.log('Authentication token found, proceeding with login');

        // Store token in localStorage first so axios interceptors can use it
        localStorage.setItem('token', token);
        
        // Fetch user info using the token with axios
        const { data } = await axios.get('/api/auth/me');

        if (!data || !data.success) {
          throw new Error('Failed to get user information');
        }

        // Store user info and token in Redux
        dispatch(
          setCredentials({
            user: data.data,
            token,
          })
        );

        // Store user info in localStorage
        localStorage.setItem('userInfo', JSON.stringify(data.data));

        toast.success('Successfully logged in!');
        navigate('/');
      } catch (error) {
        console.error('Auth callback error:', error);
        // More detailed error message
        toast.error(`Authentication failed: ${error.message}. Please try again.`);
        // Wait a moment before redirecting to ensure toast is visible
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    };

    handleCallback();
  }, [dispatch, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          Processing Authentication
        </h2>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <p className="mt-4 text-center text-gray-600">
          Please wait while we complete your authentication...
        </p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
