import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PostCard from "@/components/post/PostCard";
import { fetchInitialPosts } from "@/features/post/postSlice";
import PostSkeletonList from "@/components/post/Skeleton/PostSkeletonList";

export default function Activity() {
    const dispatch = useDispatch();

    const { posts, isInitialLoading } = useSelector((state) => state.posts);

    useEffect(() => {
        dispatch(fetchInitialPosts());
    }, [dispatch]);

    return (
        <section className="mx-auto">
            <div className="flex flex-col">
                {isInitialLoading ? (
                    <PostSkeletonList />
                ) : posts && posts.length > 0 ? (
                    posts.map((post) => (
                        <div key={post.id}>
                            {/* Render PostCard cho từng bài post */}
                            <PostCard post={post} showSuggest={true} />
                        </div>
                    ))
                ) : (
                    // Trường hợp feed rỗng
                    <div className="flex flex-col items-center justify-center pt-20 text-gray-500">
                        <p>No activity yet.</p>
                    </div>
                )}
            </div>
        </section>
    );
}
