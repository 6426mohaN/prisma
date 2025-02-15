"use client";

import { useState, useEffect } from "react";
import { saveQuiz, fetchQuizzes, deleteAllQuizzes } from "../actions/quizActions";

// Define the interface for a quiz
interface Quiz {
  question: string;
  options: string[];
  correctIndex: number | null;
}

export default function QuizCreator() {
  const [questions, setQuestions] = useState<Quiz[]>([]);

  // Fetch quizzes on initial render
  useEffect(() => {
    async function loadQuizzes() {
      try {
        const storedQuizzes = await fetchQuizzes();
  
        const quizzesWithParsedOptions = storedQuizzes.map((quiz) => ({
          question: quiz.question,
          options: Array.isArray(quiz.options) ? quiz.options as string[] : ["", "", "", ""], // Ensure options is a string[]
          correctIndex: quiz.correctIndex ?? null,  // Handle null values for correctIndex
        }));
  
        setQuestions(quizzesWithParsedOptions);
      } catch (error) {
        console.error("Error loading quizzes:", error);
      }
    }
  
    loadQuizzes();
  }, []);
  

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correctIndex: null },
    ]);
  };

  const updateQuestion = (index: number, newQuestion: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].question = newQuestion;
    setQuestions(updatedQuestions);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setQuestions(updatedQuestions);
  };

  const setCorrectAnswer = (qIndex: number, oIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].correctIndex = oIndex;
    setQuestions(updatedQuestions);
  };

  const saveAllQuizzes = async () => {
    try {
      for (const q of questions) {
        if (q.question.trim() && q.correctIndex !== null) {
          await saveQuiz(q.question, q.options, q.correctIndex);
        }
      }
      alert("Quizzes saved!");
    } catch (error) {
      console.error("Error saving quizzes:", error);
      alert("Failed to save quizzes.");
    }
  };

  const resetQuiz = async () => {
    try {
      if (confirm("Are you sure you want to delete all quizzes?")) {
        await deleteAllQuizzes();
        setQuestions([{ question: "", options: ["", "", "", ""], correctIndex: null }]);
        alert("All quizzes deleted and reset!");
      }
    } catch (error) {
      console.error("Error resetting quiz:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Create a Quiz</h2>

      {questions.map((q, qIndex) => (
        <div key={qIndex} className="mb-6 p-4 border rounded-md">
          <input
            type="text"
            placeholder="Enter your question..."
            value={q.question}
            onChange={(e) => updateQuestion(qIndex, e.target.value)}
            className="w-full p-2 border rounded-md mb-4"
          />

          <div className="space-y-2">
            {q.options.map((option, oIndex) => (
              <div key={oIndex} className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder={`Option ${oIndex + 1}`}
                  value={option}
                  onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
                <button
                  className={`px-4 py-2 rounded-md border 
                    ${q.correctIndex === oIndex ? "bg-blue-500 text-white" : "bg-gray-100"}
                  `}
                  onClick={() => setCorrectAnswer(qIndex, oIndex)}
                >
                  ✓
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={addQuestion}
        className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
      >
        Add Another Question
      </button>

      <button
        onClick={saveAllQuizzes}
        className="bg-green-500 text-white px-4 py-2 rounded-md w-full mt-4"
      >
        Save Quiz
      </button>

      <button
        onClick={resetQuiz}
        className="bg-red-500 text-white px-4 py-2 rounded-md w-full mt-4"
      >
        Reset Quiz
      </button>
    </div>
  );
}
