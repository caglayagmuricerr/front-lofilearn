import { useState, useEffect } from "react";

interface Class {
  id: number;
  name: string;
  teacher: string;
}

interface Quiz {
  id: number;
  title: string;
  dueDate?: string;
  score?: string;
}

function StudentDashboard() {
  const [studentName, setStudentName] = useState<string>("Student");
  const [classes, setClasses] = useState<Class[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [quizInvites, setQuizInvites] = useState<Quiz[]>([]);
  const [quizHistory, setQuizHistory] = useState<Quiz[]>([]);

  useEffect(() => {
    // fetch student info and classes (WILL BE REPLACED with actual API calls)
    setStudentName("Alex");
    setClasses([
      { id: 1, name: "Math 101", teacher: "Mr. Smith" },
      { id: 2, name: "History 202", teacher: "Ms. Johnson" },
    ]);
    setQuizzes([
      { id: 1, title: "Algebra Quiz", dueDate: "March 30" },
      { id: 2, title: "World War II Quiz", dueDate: "April 2" },
    ]);
    setQuizInvites([{ id: 1, title: "Trigonometry Challenge" }]);
    setQuizHistory([
      { id: 1, title: "Calculus Quiz", score: "85%" },
      { id: 2, title: "Geography Quiz", score: "92%" },
    ]);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome, {studentName}!</h1>

      <h2 className="text-xl font-semibold mb-3">Your Classes</h2>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {classes.map((classItem) => (
          <div key={classItem.id} className="p-4 shadow-md rounded-lg border">
            <h3 className="text-lg font-bold">{classItem.name}</h3>
            <p className="text-sm text-gray-500">
              Instructor: {classItem.teacher}
            </p>
            <button className="mt-2 w-full bg-blue-500 text-white py-1 rounded">
              Enter Class
            </button>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-3">Upcoming Quizzes</h2>
      <ul>
        {quizzes.map((quiz) => (
          <li key={quiz.id} className="p-2 border-b">
            {quiz.title} - Due: {quiz.dueDate}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-3">Quiz Invitations</h2>
      <ul>
        {quizInvites.length > 0 ? (
          quizInvites.map((invite) => (
            <li key={invite.id} className="p-2 border-b">
              {invite.title}{" "}
              <button className="ml-2 text-blue-500">Accept</button>
            </li>
          ))
        ) : (
          <p>No new invites</p>
        )}
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-3">Quiz History</h2>
      <ul>
        {quizHistory.map((quiz) => (
          <li key={quiz.id} className="p-2 border-b">
            {quiz.title} - Score: {quiz.score}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StudentDashboard;
