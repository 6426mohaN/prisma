import prisma from "@/lib/db";

export default async function PostPage({
    params 
}){
    const post = await prisma.posts.findUnique({
        where: {
            slug: (params.slug)
        }
    });
    return (
        <main className=" flex flex-col items-center gap-y-5 pt-24 text-center">
        <h1 className=" text-3xl  font-semibold">All Posts</h1>

        <p>{post?.content}</p>
        </main>

    ) 
}