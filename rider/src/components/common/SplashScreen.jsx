import React from 'react';
import { motion } from 'framer-motion';
import { FaMotorcycle } from 'react-icons/fa';

const SplashScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-primary-600">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-white text-center"
      >
        <div className="flex justify-center mb-4">
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5 
            }}
            className="bg-white rounded-full p-5"
          >
            <FaMotorcycle className="text-5xl text-primary-600" />
          </motion.div>
        </div>
        
        <motion.h1 
          className="text-3xl font-bold mb-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Fan & AC
        </motion.h1>
        
        <motion.h2 
          className="text-xl font-semibold"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Rider App
        </motion.h2>
        
        <motion.div 
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className="w-12 h-1 bg-white mx-auto rounded-full animate-pulse"></div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SplashScreen;
