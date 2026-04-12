import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import InputField from '../components/InputField';
import GradientButton from '../components/GradientButton';
import Card from '../components/Card';
import { motion } from 'framer-motion';
import { useApp } from '../store/AppContext';
import { authAPI } from '../api/apiService';
import { showToast } from '../utils/toastHelper';


const Login = () => {
  const { token, setToken, setUser, navigate } = useApp()
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.identifier || !formData.password) {
      setError('Please fill in all fields');
      return;
    }



    try {
      const response = await authAPI.login(formData);

      if (response.success) {
        // Store token
        setToken(response.token);
        localStorage.setItem('token', response.token);

        // Save user data
        const userData = response.user || {
          name: response.name || 'User',
          username: response.username,
          email: response.email,
        };
        setUser(userData);
        localStorage.setItem('wisemind_user', JSON.stringify(userData));

        showToast({ message: response.message || 'Login Successful', status: "success" })
        navigate('/dashboard');
      } else {
        setError(response.message || 'Login failed');
        showToast({ message: response.message || 'Login failed', status: 'error'})
      }

    } catch (error) {

      console.error('Login error:', error);
      setError('An error occurred. Please try again.');
      showToast({ message: error.message || 'Error Occured', status: "error" })
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token])

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-20"
        animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <motion.div
        className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-500 rounded-full blur-3xl opacity-20"
        animate={{ x: [0, -40, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/">
            <motion.h1 className="text-4xl young-serif-regular font-bold text-white mb-2"
              animate={{
                textShadow: [
                  "0px 0px 0px rgba(99,102,241,0)",        // no glow
                  "0px 0px 20px rgba(99,102,241,0.8)",     // glow
                  "0px 0px 0px rgba(99,102,241,0)"         // back to normal
                ]
              }}

              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}>
              Wise<span className="bg-gradient-to-r from-indigo-500 to-purple-600 baloo-2-700 md:text-5xl bg-clip-text text-transparent">Mind</span>OS
            </motion.h1>
          </Link>
          <p className="text-gray-400">Welcome back! Login to continue</p>
        </div>

        <Card className="
bg-white/5 backdrop-blur-xl 
border border-white/10 
rounded-2xl p-8
shadow-[0_0_40px_rgba(99,102,241,0.2)]
">
          <h2 className="text-2xl font-bold young-serif-regular text-center text-gray-200 mb-6">Login</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Email / Username"
              type="text"
              value={formData.identifier}
              onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
              placeholder="Email or Username"
              required
            />

            <InputField
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter your password"
              required
            />

            <GradientButton type="submit" className="w-full mt-6" data-testid="login-submit-btn">
              Login
            </GradientButton>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-semibold">
                Sign up
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;