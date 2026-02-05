import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import CreatePostCard from "@/components/post/CreatePostCard";
import PostList from "@/components/post/PostList";
import PostSkeletonList from "@/components/post/Skeleton/PostSkeletonList";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";

import {
    fetchInitialPosts,
    fetchNextPosts,
    toggleLike,
    toggleRepost,
    likePost,
    repostPost,
    createPost,
} from "@/features/post/postSlice";

import { useRequireAuth } from "@/hooks/useRequireAuth";
import ProtectedView from "@/components/auth/ProtectedView";
import { Spinner } from "@/components/ui/spinner";

export default function Home() {
    const dispatch = useDispatch();

    const { posts, hasMore, isInitialLoading, isFetchingMore } = useSelector(
        (state) => state.posts,
    );

    const requireAuth = useRequireAuth();

    useEffect(() => {
        dispatch(fetchInitialPosts());
    }, [dispatch]);

    const handleLoadMore = useCallback(() => {
        dispatch(fetchNextPosts());
    }, [dispatch]);

    const loadMoreRef = useInfiniteScroll({
        hasMore,
        isLoading: isFetchingMore,
        onLoadMore: handleLoadMore,
    });

    const handleCreatePost = (content) => {
        requireAuth(() => {
            dispatch(
                createPost({
                    id: Date.now(),
                    author: "ducminh209",
                    content,
                    likeCount: 0,
                    isLiked: false,
                    comments: 0,
                    reposts: 0,
                    shares: 0,
                }),
            );
        });
    };

    const handleLike = (id) => {
        requireAuth(() => {
            dispatch(toggleLike(id));

            dispatch(likePost(id))
                .unwrap()
                .catch(() => {
                    dispatch(toggleLike(id));
                });
        });
    };

    const handleRepost = (id) => {
        requireAuth(() => {
            dispatch(toggleRepost(id));
            dispatch(repostPost(id))
                .unwrap()
                .catch(() => {
                    dispatch(toggleRepost(id));
                });
        });
    };

    return (
        <>
            <ProtectedView>
                <CreatePostCard onSubmit={handleCreatePost} />
            </ProtectedView>

            {isInitialLoading ? (
                <PostSkeletonList />
            ) : (
                <PostList
                    posts={posts}
                    onLike={handleLike}
                    onRepost={handleRepost}
                />
            )}

            <div
                ref={loadMoreRef}
                className="h-10 dark:bg-neutral-900 flex justify-center items-center"
            >
                {isFetchingMore && <Spinner className="animate-spin size-6" />}
            </div>
        </>
    );
}
