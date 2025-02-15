"use client";

import { useState, useEffect } from "react";
import { fetchQuizzes } from "../actions/quizActions";

interface Quiz {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
}

export default function TestPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    async function loadQuizzes() {
      try {
        const fetchedQuizzes = await fetchQuizzes();

        // Parse quizzes to ensure options are strings
        const parsedQuizzes = fetchedQuizzes.map((quiz) => ({
          id: quiz.id,
          question: quiz.question,
          options: Array.isArray(quiz.options) ? quiz.options as string[] : ["", "", "", ""],
          correctIndex: quiz.correctIndex,
        }));

        setQuizzes(parsedQuizzes);

        // Initialize answers state with -1 (indicating no answer selected)
        setAnswers(new Array(parsedQuizzes.length).fill(-1));
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    }

    loadQuizzes();
  }, []);

  const handleOptionChange = (quizIndex: number, optionIndex: number) => {
    const updatedAnswers = [...answers];
    updatedAnswers[quizIndex] = optionIndex;
    setAnswers(updatedAnswers);
  };

  const calculateScore = () => {
    let calculatedScore = 0;

    quizzes.forEach((quiz, index) => {
      if (answers[index] === quiz.correctIndex) {
        calculatedScore += 1;
      }
    });

    setScore(calculatedScore);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Take the Test</h2>

      {quizzes.length === 0 ? (
        <p>Loading quizzes...</p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            calculateScore();
          }}
        >
          {quizzes.map((quiz, quizIndex) => (
            <div key={quiz.id} className="mb-6 p-4 border rounded-md">
              <h3 className="font-medium mb-2">{quiz.question}</h3>
              <div className="space-y-2">
                {quiz.options.map((option, optionIndex) => (
                  <label
                    key={optionIndex}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={`question-${quizIndex}`}
                      value={optionIndex}
                      checked={answers[quizIndex] === optionIndex}
                      onChange={() => handleOptionChange(quizIndex, optionIndex)}
                      className="cursor-pointer"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          {score === null ? (
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-md w-full"
            >
              Submit Test
            </button>
          ) : (
            <div className="mt-4 text-center">
              <p className="text-lg font-medium">
                You scored {score} out of {quizzes.length}!
              </p>
              <button
                type="button"
                onClick={() => {
                  setScore(null);
                  setAnswers(new Array(quizzes.length).fill(-1));
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
              >
                Retake Test
              </button>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
