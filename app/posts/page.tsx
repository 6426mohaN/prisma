import prisma from "@/lib/db";
import Link from "next/link";
import { createPost } from "../actions/actions";

export default async function PostsPage(){
    const posts = await prisma.posts.findMany({
        // where: {
        //     title: {
        //         endsWith: "post"
        //     },
        // },
        // orderBy: {
        //     createdAt: "desc"
        // }
    });
    
    return (
        <main className=" flex flex-col items-center gap-y-5 pt-24 text-center">
        <h1 className=" text-3xl  font-semibold">All Posts {posts.length}</h1>

        <ul className=" border-t border-b border-black/10 py-5 leading-8">
        {posts.map((post) => (
            <li key={post.id} className=" flex items-center justify-between px-5">
                {/* <Link href={`/posts/${post.slug}`}>
                    {post.title}
                </Link> */}
            </li>
        ))}
        </ul>
        <form action={createPost}className="flex flex-col gap-y-2 w-[300px]">
            <input type="text"
                    name="title"
                    placeholder="Title"
                    className=" px-2 py-1 rounded-sm"
                     />
                     <textarea name="content"
                     rows={5}
                     placeholder="Content"
                     className=" px-2 py-1 rounded-sm"
                     />
                     <button type="submit" className=" bg-blue-500 text-white rounded-sm">
                        Create post
                     </button>
        </form>

        </main>

    )
}