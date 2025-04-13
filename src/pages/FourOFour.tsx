import { motion } from "framer-motion";
import { Home, AlertCircle } from "lucide-react";

function FourOFour() {
  return (
    <div className="min-h-screen bg-brown-500 flex items-center justify-center p-4">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <AlertCircle className="w-32 h-32 text-coffeeCream-500" />
        </motion.div>

        <motion.h1
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-7xl font-bold text-white mb-4"
        >
          404
        </motion.h1>

        <motion.p
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-gray-300 mb-8"
        >
          Oops! The page you're looking for doesn't exist.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.a
            href="/"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-6 py-3 mb-24 bg-coffeeCream-500 text-white rounded-lg font-medium hover:bg-chestnut-500 transition-colors"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </motion.a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 0.5 }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute left-1/4 top-1/4 w-2 h-2 bg-chestnut-500 rounded-full" />
        <div className="absolute left-3/4 top-1/2 w-3 h-3 bg-chestnut-400 rounded-full" />
        <div className="absolute left-1/2 top-3/4 w-2 h-2 bg-chestnut-300 rounded-full" />
      </motion.div>
    </div>
  );
}

export default FourOFour;
