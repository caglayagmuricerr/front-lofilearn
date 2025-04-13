import { useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

const SuggestPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    title: "",
    suggestion: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", title: "", suggestion: "" });

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-yellow-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 flex flex-col items-center justify-center px-4 py-12"
    >
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold mb-4">🌱 Suggest a Feature</h1>
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
          Got a cool idea to make Lofi Learn better? Let us know below!
        </p>

        {submitted ? (
          <div className="text-green-600 dark:text-green-400 font-medium text-center">
            Thanks for your suggestion! 🌟
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-red-600 dark:text-red-400 text-sm font-medium">
                {error}
              </div>
            )}

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name (optional)"
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 text-sm"
            />
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your email (optional)"
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 text-sm"
            />
            <input
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="Short title of your idea"
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 text-sm"
            />
            <textarea
              name="suggestion"
              value={formData.suggestion}
              onChange={handleChange}
              placeholder="Detailed suggestion"
              rows={5}
              required
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-4 text-sm"
            />
            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-xl transition-all"
            >
              Submit
            </button>
          </form>
        )}
      </div>
    </motion.div>
  );
};

export default SuggestPage;
