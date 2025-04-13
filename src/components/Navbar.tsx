import { Link } from "react-router-dom";
import { Brain } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";

function Navbar() {
  const [hoveredButton, setHoveredButton] = useState("register");
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      x: hoveredButton === "login" ? -18 : 70, // <login-x> : <register-x>
      transition: { type: "spring", stiffness: 300, damping: 20 },
    });
  }, [hoveredButton, controls]);

  return (
    <nav className="bg-green-500 shadow-md">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <Brain className="h-8 w-8 text-coffeeCream-500" />
              <span className="font-baskerville italic ml-2 text-[1.2rem] sm:text-3xl text-offwhite">
                Lofi Learn
              </span>
            </Link>
          </div>
          <div className="flex items-center relative">
            <motion.div
              className={twMerge(
                "absolute top-0 w-16 ml-4 sm:ml-0 sm:w-24 h-10 bg-chestnut-400 rounded-md"
              )}
              animate={controls}
              initial={{ x: 70, y: 13 }}
            />
            <Link
              to="/login"
              className="relative z-10 px-3 py-2 rounded-md text-[0.8rem] sm:text-sm font-medium text-offwhite hover:text-offwhite"
              onMouseEnter={() => setHoveredButton("login")}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="relative z-10 ml-5 sm:ml-4 px-4 sm:px-4 py-2 rounded-md text-[0.8rem] sm:text-sm font-medium text-offwhite hover:text-offwhite"
              onMouseEnter={() => setHoveredButton("register")}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
