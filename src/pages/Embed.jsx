// src/pages/Embed.jsx
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import PostCard from "@/components/posts/PostCard";
import { fetchPostDetail } from "@/features/post/postSlice";
import { useDispatch, useSelector } from "react-redux";

const Embed = () => {
    const { postId } = useParams();
    const dispatch = useDispatch();

    const { currentPost, isLoading } = useSelector((state) => state.posts);

    useEffect(() => {
        if (postId) {
            dispatch(fetchPostDetail(postId));
        }
    }, [postId, dispatch]);

    if (isLoading || !currentPost)
        return <div className="p-10 text-center font-bold">Đang tải...</div>;

    return (
        <div className="w-full bg-white border border-neutral-300 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <PostCard
                post={currentPost}
                className="border-none! shadow-none1 max-w-full!"
            />

            <div className="border-t py-3 dark:bg-neutral-900">
                <a
                    href={`/${currentPost.user?.username || currentPost.author}/post/${postId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-neutral-700 dark:text-neutral-200  hover:text-black transition-colors text-sm"
                >
                    <span className="opacity-80">View on Threads</span>
                    <svg
                        className="size-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                    </svg>
                </a>
            </div>
        </div>
    );
};

export default Embed;
