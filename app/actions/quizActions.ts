"use server";

import prisma from "@/lib/db";

// Save quiz data
export async function saveQuiz(question: string, options: string[], correctIndex: number) {
  try {
    await prisma.quiz.create({
      data: { question, options, correctIndex },
    });
  } catch (error) {
    console.error("Error saving quiz:", error);
  }
}

// Fetch quiz data
export async function fetchQuizzes() {
  try {
    return await prisma.quiz.findMany();
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return [];
  }
}
export async function deleteAllQuizzes() {
  try {
    await prisma.quiz.deleteMany();
  } catch (error) {
    console.error("Error deleting quizzes:", error);
  }
}
