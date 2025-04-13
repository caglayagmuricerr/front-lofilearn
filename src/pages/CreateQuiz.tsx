import React, { useState } from "react";
import { Plus, Image, Trash2, Copy } from "lucide-react";
import { generate8DigitCode } from "../utils/Generate8DigitCode";

interface QuestionForm {
  text: string;
  options: string[];
  correctAnswer: number;
  timeLimit: number;
  media?: {
    type: "image" | "video";
    url: string;
  };
}

function CreateQuiz() {
  const code: string = generate8DigitCode();

  const [quizData, setQuizData] = useState({
    code: code,
    title: "",
    description: "",
    questions: [] as QuestionForm[],
  });

  const [currentQuestion, setCurrentQuestion] = useState<QuestionForm>({
    text: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    timeLimit: 20,
  });

  const handleAddQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [...quizData.questions, currentQuestion],
    });
    setCurrentQuestion({
      text: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      timeLimit: 20,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Quiz data:", quizData);
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(quizData.code)
      .then(() => {
        console.log("code copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy code: ", err);
      });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Create a New Quiz
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Quiz Title
            </label>
            <input
              type="text"
              id="title"
              value={quizData.title}
              onChange={(e) =>
                setQuizData({ ...quizData, title: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              value={quizData.description}
              onChange={(e) =>
                setQuizData({ ...quizData, description: e.target.value })
              }
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Add Question</h2>

          <div>
            <label
              htmlFor="questionText"
              className="block text-sm font-medium text-gray-700"
            >
              Question Text
            </label>
            <input
              type="text"
              id="questionText"
              value={currentQuestion.text}
              onChange={(e) =>
                setCurrentQuestion({ ...currentQuestion, text: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Options
            </label>
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...currentQuestion.options];
                    newOptions[index] = e.target.value;
                    setCurrentQuestion({
                      ...currentQuestion,
                      options: newOptions,
                    });
                  }}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  placeholder={`Option ${index + 1}`}
                />
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={currentQuestion.correctAnswer === index}
                  onChange={() =>
                    setCurrentQuestion({
                      ...currentQuestion,
                      correctAnswer: index,
                    })
                  }
                  className="ml-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                />
              </div>
            ))}
          </div>

          <div>
            <label
              htmlFor="timeLimit"
              className="block text-sm font-medium text-gray-700"
            >
              Time Limit (seconds)
            </label>
            <input
              type="number"
              id="timeLimit"
              value={currentQuestion.timeLimit}
              onChange={(e) =>
                setCurrentQuestion({
                  ...currentQuestion,
                  timeLimit: parseInt(e.target.value),
                })
              }
              min="5"
              max="60"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            />
          </div>

          <div>
            <button
              type="button"
              onClick={() =>
                setCurrentQuestion({
                  ...currentQuestion,
                  media: { type: "image", url: "" },
                })
              }
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Image className="h-5 w-5 mr-2" />
              Add Media
            </button>
          </div>

          <button
            type="button"
            onClick={handleAddQuestion}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Question
          </button>
        </div>

        {quizData.questions.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Questions ({quizData.questions.length})
            </h2>
            <div className="space-y-4">
              {quizData.questions.map((question, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <span className="font-medium">{question.text}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newQuestions = quizData.questions.filter(
                        (_, i) => i !== index
                      );
                      setQuizData({ ...quizData, questions: newQuestions });
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          Create Quiz
        </button>
      </form>
      <p>Copy Quiz Code : {quizData.code} </p>
      <button type="button" onClick={handleCopy}>
        <Copy className="h-5 w-5 mr-2" />
      </button>
    </div>
  );
}

export default CreateQuiz;
