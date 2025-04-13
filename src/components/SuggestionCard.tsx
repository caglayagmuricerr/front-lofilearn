import { Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const SuggestionCard = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate("/suggest")}
      className="cursor-pointer max-w-xs rounded-2xl bg-yellow-100 dark:bg-yellow-900 p-5 shadow-lg transition-all"
    >
      <div className="flex items-center gap-4">
        <Lightbulb className="h-8 w-8 text-yellow-600 dark:text-yellow-300" />
        <div>
          <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-100">
            Got a feature idea?
          </h3>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            Send us your suggestion!
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default SuggestionCard;
