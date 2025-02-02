import React from 'react';
import prisma from '@/lib/db';

const TestPage = async () => {
  const postts = await prisma.posts.findMany();

  return (
    <main className="flex flex-col items-center gap-y-5 pt-24 text-center">
      <h1 className="text-3xl font-semibold">All Posts {postts.length}</h1>

      <ul className="grid grid-cols-1 gap-y-4">
        {postts.map((post) => (
          <li key={post.id} className="flex flex-col items-start p-4 border rounded-lg shadow">
            <h2 className="text-xl font-bold">{post?.title}</h2>
            <p className="text-base text-gray-700">{post?.content}</p>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default TestPage;
