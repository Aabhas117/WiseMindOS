import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import GradientButton from '../components/GradientButton';
import Card from '../components/Card';
import { validateEmail } from '../utils/helpers';
import { motion } from 'framer-motion'
import { useApp } from '../store/AppContext';
import axios from 'axios';


const Signup = () => {
  const { token, setToken, navigate, backendURL } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSignUpSubmit = async(e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {

      const response = await axios.post(backendURL + '/api/user/register', formData)
      if(response.data.success){
        console.log(response.data);
        setToken(response.data.token)
        localStorage.setItem('token', response.data.token)
      } else{
        console.log(response.data.message)
      }
      
    } catch (error) {
      console.log(error);
    }

    localStorage.setItem('wisemind_user', JSON.stringify({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    }));

    navigate('/onboarding')
  };


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
            <motion.h1
              className="text-4xl young-serif-regular font-bold text-white mb-2"

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
              }}
            >
              Wise<span className="bg-gradient-to-r from-indigo-500 to-purple-600 baloo-2-700 md:text-5xl  bg-clip-text text-transparent">Mind</span>OS
            </motion.h1>
          </Link>
          <p className="text-gray-400">Create your account and start tracking</p>
        </div>

        <Card className='bg-white/5 backdrop-blur-xl 
border border-white/10 
rounded-2xl p-8
shadow-[0_0_40px_rgba(99,102,241,0.2)]'>

          <>
            <h2 className="text-2xl young-serif-regular text-center font-bold text-gray-200 mb-6">Sign Up</h2>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4">
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              <InputField
                label="Name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your name"
                required
              />

              <InputField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
                required
              />

              <InputField
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Create a password (min 6 characters)"
                required
              />
              <p className="text-sm text-gray-500">
                Must be at least 6 characters
              </p>

              <GradientButton type="submit" className="w-full mt-5" data-testid="signup-continue-btn">
                Create Account
              </GradientButton>
            </form>
            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold">
                  Login
                </Link>
              </p>
            </div>
          </>
        </Card>
      </div>
    </div>
  );
};

export default Signup;