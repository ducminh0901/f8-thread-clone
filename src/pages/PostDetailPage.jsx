import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import PostCard from "@/components/posts/PostCard";
import ReplyList from "@/components/reply/ReplyList";

import {
    fetchPostDetail,
    toggleLike,
    toggleRepost,
    likePost,
    repostPost,
} from "@/features/post/postSlice";
import { fetchReplies, resetReplies } from "@/features/reply/replySlice";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function PostDetailPage() {
    const { postId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const requireAuth = useRequireAuth();

    const { posts, currentPost, isInitialLoading } = useSelector(
        (state) => state.posts,
    );

    const post =
        currentPost && String(currentPost.id) === String(postId)
            ? currentPost
            : posts?.find((p) => String(p.id) === String(postId));

    useEffect(() => {
        if (post) {
            const authorName =
                post.user?.username || post.author || "Người dùng";

            const contentSnippet = post.content
                ? `: "${post.content.substring(0, 50)}${post.content.length > 50 ? "..." : ""}"`
                : "";

            document.title = `${authorName} trên Threads${contentSnippet}`;
        }

        return () => {
            document.title = "Threads";
        };
    }, [post]);

    useEffect(() => {
        if (postId) {
            dispatch(fetchPostDetail(postId));
            dispatch(fetchReplies({ postId, page: 1 }));
        }
        return () => dispatch(resetReplies());
    }, [postId, dispatch]);

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

    if (isInitialLoading) {
        return <Spinner className="m-10 mx-auto size-6" />;
    }

    if (!post) {
        return (
            <div className="p-10 text-center ">Không tìm thấy bài viết.</div>
        );
    }

    return (
        <div className="flex flex-col min-h-full dark:bg-neutral-900">
            {/* Header: Nút trở về */}
            <div className="sticky top-0 z-10 flex items-center gap-3 px-4 py-2 backdrop-blur-md border-b">
                <Button
                    onClick={() => navigate(-1)}
                    className="rounded-full p-2"
                    title="Trở về"
                    variant="outline"
                >
                    <ArrowLeft className="size-5" />
                </Button>
                <h1 className="font-bold text-xl">Bài viết</h1>
            </div>

            <div className="border-b">
                <PostCard
                    post={post}
                    onLike={handleLike}
                    onRepost={handleRepost}
                    isDetail={true}
                />
            </div>

            <div className="flex-1">
                <div className="p-4 border-b font-bold">Mới đây</div>
                <ReplyList postId={postId} />
            </div>
        </div>
    );
}
