import { useState, useEffect } from "react";
import axios from "axios";

interface Quiz {
  _id: string;
  title: string;
  description: string;
  inviteCode?: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  createdAt: string;
}

export default function ManageQuizzes() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [open, setOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [newQuiz, setNewQuiz] = useState({
    title: "",
    description: "",
    inviteCode: "",
    category: "",
    difficulty: "Easy",
  });

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get("/api/quizzes");
      setQuizzes(res.data);
    } catch (error) {
      console.error("Error fetching quizzes", error);
    }
  };

  const handleAddOrEditQuiz = async () => {
    try {
      if (editingQuiz) {
        await axios.put(`/api/quizzes/${editingQuiz._id}`, newQuiz);
      } else {
        await axios.post("/api/quizzes", newQuiz);
      }
      fetchQuizzes();
      setOpen(false);
      setEditingQuiz(null);
      setNewQuiz({
        title: "",
        description: "",
        inviteCode: "",
        category: "",
        difficulty: "Easy",
      });
    } catch (error) {
      console.error("Error saving quiz", error);
    }
  };

  const handleDeleteQuiz = async (id: string) => {
    try {
      await axios.delete(`/api/quizzes/${id}`);
      fetchQuizzes();
    } catch (error) {
      console.error("Error deleting quiz", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Manage Quizzes</h1>
      <button
        onClick={() => setOpen(true)}
        style={{ padding: "10px", margin: "10px 0", cursor: "pointer" }}
      >
        Add Quiz
      </button>
      <div>
        {quizzes.map((quiz) => (
          <div
            key={quiz._id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              marginBottom: "10px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>
                {quiz.title}
              </h2>
              <p style={{ color: "#555" }}>{quiz.description}</p>
              <p>Category: {quiz.category}</p>
              <p>Difficulty: {quiz.difficulty}</p>
            </div>
            <div>
              <button
                onClick={() => {
                  setEditingQuiz(quiz);
                  setNewQuiz({
                    title: quiz.title,
                    description: quiz.description,
                    inviteCode: quiz.inviteCode || "",
                    category: quiz.category,
                    difficulty: quiz.difficulty,
                  });
                  setOpen(true);
                }}
                style={{ marginRight: "10px", cursor: "pointer" }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteQuiz(quiz._id)}
                style={{ cursor: "pointer", color: "red" }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            border: "1px solid #ddd",
          }}
        >
          <h2>{editingQuiz ? "Edit Quiz" : "Add Quiz"}</h2>
          <input
            type="text"
            placeholder="Quiz Title"
            value={newQuiz.title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewQuiz({ ...newQuiz, title: e.target.value })
            }
            style={{ display: "block", marginBottom: "10px", padding: "5px" }}
          />
          <input
            type="text"
            placeholder="Quiz Description"
            value={newQuiz.description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewQuiz({ ...newQuiz, description: e.target.value })
            }
            style={{ display: "block", marginBottom: "10px", padding: "5px" }}
          />
          <input
            type="text"
            placeholder="Invite Code"
            value={newQuiz.inviteCode}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewQuiz({ ...newQuiz, inviteCode: e.target.value })
            }
            style={{ display: "block", marginBottom: "10px", padding: "5px" }}
          />
          <input
            type="text"
            placeholder="Category"
            value={newQuiz.category}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewQuiz({ ...newQuiz, category: e.target.value })
            }
            style={{ display: "block", marginBottom: "10px", padding: "5px" }}
          />
          <select
            value={newQuiz.difficulty}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setNewQuiz({
                ...newQuiz,
                difficulty: e.target.value as "Easy" | "Medium" | "Hard",
              })
            }
            style={{ display: "block", marginBottom: "10px", padding: "5px" }}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <button
            onClick={handleAddOrEditQuiz}
            style={{ padding: "5px 10px", cursor: "pointer" }}
          >
            {editingQuiz ? "Update" : "Create"}
          </button>
          <button
            onClick={() => setOpen(false)}
            style={{ marginLeft: "10px", cursor: "pointer" }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
