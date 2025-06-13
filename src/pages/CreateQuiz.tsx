import React, { useState } from "react";
import { Plus, Image, Trash2, X, Upload } from "lucide-react";
import { generate8DigitCode } from "../utils/Generate8DigitCode";

interface QuestionForm {
  type: string;
  text: string;
  options: { text: string; isCorrect: boolean }[];
  correctAnswer: string;
  explanation?: string;
  image?: string;
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
    type: "multiple_choice",
    text: "",
    options: [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
    correctAnswer: "",
    explanation: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const cookie = document.cookie;
      const token = cookie.split("%20")[1].trim();

      const response = await fetch("/api/quizzes/upload-image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      console.log("Token:", token);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to upload image");
      }

      setCurrentQuestion({
        ...currentQuestion,
        image: data.imageUrl,
      });
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setCurrentQuestion({
      ...currentQuestion,
      image: "",
    });
  };

  const handleAddQuestion = () => {
    if (!currentQuestion.text.trim()) {
      setError("Question text is required");
      return;
    }

    const hasValidOptions = currentQuestion.options.some(
      (option) => option.text.trim() && option.isCorrect
    );

    if (!hasValidOptions) {
      setError("At least one option must be filled and marked as correct");
      return;
    }

    setQuizData({
      ...quizData,
      questions: [...quizData.questions, currentQuestion],
    });

    setCurrentQuestion({
      type: "multiple_choice",
      text: "",
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
      correctAnswer: "",
      explanation: "",
      image: "",
    });

    setError("");
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!quizData.title.trim()) {
      setError("Quiz title is required");
      setLoading(false);
      return;
    }

    if (quizData.questions.length === 0) {
      setError("At least one question is required");
      setLoading(false);
      return;
    }

    try {
      const cookie = document.cookie;
      const token = cookie.split("%20")[1].trim();

      if (!token) {
        setError("You must be logged in to create a quiz");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/quizzes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: quizData.title,
          description: quizData.description,
          questions: quizData.questions,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create quiz");
      }

      setSuccess(
        `Quiz created successfully! Invite code: ${data.quiz.inviteCode}`
      );

      setQuizData({
        code: generate8DigitCode(),
        title: "",
        description: "",
        questions: [],
      });
    } catch (err: any) {
      setError(err.message || "Failed to create quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (index: number, text: string) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = { ...newOptions[index], text };
    setCurrentQuestion({
      ...currentQuestion,
      options: newOptions,
    });
  };

  const handleCorrectAnswerChange = (index: number) => {
    const newOptions = currentQuestion.options.map((option, i) => ({
      ...option,
      isCorrect: i === index,
    }));

    setCurrentQuestion({
      ...currentQuestion,
      options: newOptions,
      correctAnswer: currentQuestion.options[index].text,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Create a New Quiz
      </h1>

      {error && (
        <div className="bg-chestnut-300 border border-chestnut-400 text-chestnut-500 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Quiz Title and Description */}
        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Quiz Title *
            </label>
            <input
              type="text"
              id="title"
              value={quizData.title}
              onChange={(e) =>
                setQuizData({ ...quizData, title: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-chestnut-400 focus:ring-chestnut-400"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-chestnut-400 focus:ring-chestnut-400"
            />
          </div>
        </div>

        {/* Add Question Button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="bg-white border-2 border-chestnut-400 rounded-xl p-8 hover:bg-chestnut-300 transition-colors duration-200 shadow-lg"
          >
            <Plus className="h-16 w-16 text-chestnut-400 mx-auto" />
            <span className="block mt-2 text-lg font-medium text-chestnut-400">
              Add Question
            </span>
          </button>
        </div>

        {/* Questions List */}
        {quizData.questions.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Questions ({quizData.questions.length})
            </h2>
            <div className="space-y-4">
              {quizData.questions.map((question, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-start space-x-3">
                      {question.image && (
                        <img
                          src={question.image}
                          alt="Question"
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div>
                        <span className="font-medium">{question.text}</span>
                        <div className="text-sm text-gray-600 mt-1">
                          Correct:{" "}
                          {question.options.find((opt) => opt.isCorrect)?.text}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newQuestions = quizData.questions.filter(
                        (_, i) => i !== index
                      );
                      setQuizData({ ...quizData, questions: newQuestions });
                    }}
                    className="text-red-600 hover:text-red-800 ml-4"
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
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-chestnut-400 hover:bg-chestnut-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-chestnut-400 disabled:opacity-50"
        >
          {loading ? "Creating Quiz..." : "Create Quiz"}
        </button>
      </form>

      {/* Modal for Adding Questions */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  Add Question
                </h2>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div>
                <label
                  htmlFor="questionText"
                  className="block text-sm font-medium text-gray-700"
                >
                  Question Text *
                </label>
                <input
                  type="text"
                  id="questionText"
                  value={currentQuestion.text}
                  onChange={(e) =>
                    setCurrentQuestion({
                      ...currentQuestion,
                      text: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-chestnut-400 focus:ring-chestnut-400"
                  required
                />
              </div>

              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Image (Optional)
                </label>
                {currentQuestion.image ? (
                  <div className="relative inline-block">
                    <img
                      src={currentQuestion.image}
                      alt="Question"
                      className="max-w-xs max-h-48 object-contain rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {uploadingImage ? (
                          <Upload className="w-8 h-8 mb-4 text-gray-500 animate-pulse" />
                        ) : (
                          <Image className="w-8 h-8 mb-4 text-gray-500" />
                        )}
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">
                            {uploadingImage
                              ? "Uploading..."
                              : "Click to upload"}
                          </span>{" "}
                          an image
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG or GIF (Max 5MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Options *
                </label>
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-chestnut-400 focus:ring-chestnut-400"
                      placeholder={`Option ${index + 1}`}
                    />
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={option.isCorrect}
                      onChange={() => handleCorrectAnswerChange(index)}
                      className="ml-2 h-4 w-4 text-chestnut-400 focus:ring-chestnut-400 border-gray-300"
                    />
                    <label className="ml-1 text-sm text-gray-600">
                      Correct
                    </label>
                  </div>
                ))}
              </div>

              <div>
                <label
                  htmlFor="explanation"
                  className="block text-sm font-medium text-gray-700"
                >
                  Explanation (Optional)
                </label>
                <textarea
                  id="explanation"
                  value={currentQuestion.explanation || ""}
                  onChange={(e) =>
                    setCurrentQuestion({
                      ...currentQuestion,
                      explanation: e.target.value,
                    })
                  }
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-chestnut-400 focus:ring-chestnut-400"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-chestnut-400 hover:bg-chestnut-400"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Question
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateQuiz;
