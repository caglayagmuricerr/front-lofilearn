import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Brain, Music, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

import SuggestionCard from "./SuggestionCard";

import FeatureCard from "../components/FeatureCard";

const Hero: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-heroImg bg-cover bg-center relative overflow-hidden min-h-screen">
      <div className="relative z-10 container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-screen">
        <motion.div
          className="flex items-center mb-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="bg-white/10 backdrop-blur-md p-4 rounded-full mr-4"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Music size={40} className="text-chestnut-300" />
          </motion.div>
          <h1 className="font-baskerville italic text-5xl md:text-7xl font-bold text-transparent bg-clip-text animate-gradient-text p-4">
            Lofi Learn
          </h1>
        </motion.div>

        <motion.h2
          className="text-xl md:text-2xl text-center max-w-2xl mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Master new skills with the perfect blend of relaxing beats and
          engaging quizzes
        </motion.h2>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 mb-16"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <motion.button
            className="px-8 py-4 bg-green-500 rounded-full font-bold text-lg shadow-lg hover:shadow-brown-500/30 transition-shadow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/login")} // i was using window.location.href = "/login" but that was stopping the music
            // because it was reloading the page so i switched to useNavigate
          >
            Start Learning
          </motion.button>
        </motion.div>

        {/* Features Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <FeatureCard
            icon={<Brain className="" />}
            title="Brain-Friendly"
            description="Scientifically designed quizzes that enhance memory retention"
            delay={0.2}
          />
          <FeatureCard
            icon={<Music className="" />}
            title="Lofi Atmosphere"
            description="Curated beats to keep you in the perfect learning flow state"
            delay={0.4}
          />
          <FeatureCard
            icon={<BookOpen className="" />}
            title="Diverse Topics"
            description="From coding to history, we've got quizzes for every interest"
            delay={0.6}
          />
          <div className="mt-10 flex justify-center">
            <SuggestionCard />
          </div>
        </motion.div>

        {/* Floating elements */}
        <motion.div
          className="absolute top-20 right-10 hidden lg:block"
          animate={{
            y: [0, 15, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Sparkles size={40} className="text-brown-500 opacity-70" />
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
