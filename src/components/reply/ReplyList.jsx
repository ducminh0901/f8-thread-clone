import { fetchReplies } from "@/features/reply/replySlice";
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import InteractionBar from "../posts/InteractionBar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import PostSkeletonList from "../posts/Skeleton/PostSkeletonList";

function ReplyList({ postId }) {
    const dispatch = useDispatch();

    const { replies, isLoading, hasMore, page } = useSelector(
        (state) => state.reply,
    );

    // Logic tải thêm bình luận
    const handleLoadMore = useCallback(() => {
        if (hasMore && !isLoading) {
            dispatch(fetchReplies({ postId, page }));
        }
    }, [dispatch, postId, page, hasMore, isLoading]);

    // Hook tự động kích hoạt loadMore khi cuộn xuống cuối
    const loadMoreRef = useInfiniteScroll({
        hasMore,
        isLoading,
        onLoadMore: handleLoadMore,
    });

    return (
        <div className="flex flex-col">
            {/* Danh sách bình luận hiện tại */}
            {replies.map((reply) => (
                <div key={reply.id} className="p-4 border-b">
                    <div className="flex gap-3">
                        <Avatar className="w-9 h-9">
                            <AvatarImage
                                src={reply.user?.avatar}
                                alt={reply.user?.username}
                                className="object-cover"
                            />
                            <AvatarFallback className="text-xs">
                                {reply.user?.username
                                    ?.charAt(0)
                                    .toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-[14px] hover:underline cursor-pointer">
                                    {reply.user?.username || "anonymous"}
                                </span>

                                {/* 3. Timestamp: Vì API không trả về nên để mặc định 5h hoặc vừa xong */}
                                <span className="text-sm">
                                    {reply.createdAt || "5h"}
                                </span>
                            </div>
                            <div className="text-[15px] mt-1">
                                {reply.content}
                            </div>
                            <div className="mt-2 -ml-2 pointer-events-none">
                                <InteractionBar post={reply} />
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Hiệu ứng Skeleton khi đang tải */}
            {isLoading && <PostSkeletonList />}

            {/* Phần tử mồi để hook nhận diện điểm cuối trang */}
            <div ref={loadMoreRef} />

            {!isLoading && replies.length === 0 && (
                <div className="p-10 text-center">
                    Chưa có bình luận nào. Hãy là người đầu tiên!
                </div>
            )}
        </div>
    );
}

export default ReplyList;
