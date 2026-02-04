import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { closeQuoteModal } from "@/features/quote/quoteSlice";
import { quotePost } from "@/features/post/postSlice";

// Các component UI giữ nguyên
import PostPreview from "@/components/posts/PostPreview";
import ModalFooter from "@/components/feed/ModalFooter";
import HeaderModal from "@/components/feed/ModalHeader";
import PostComposer from "@/components/feed/PostComposer";
import { toast } from "sonner";

const QuoteModal = () => {
    const dispatch = useDispatch();

    const { isOpen, targetPost } = useSelector((state) => state.quote);
    const { isPosting } = useSelector((state) => state.posts);
    const { currentUser } = useSelector((state) => state.auth);

    const [content, setContent] = useState("");
    const [topic, setTopic] = useState("");

    const handleClose = () => {
        dispatch(closeQuoteModal());
        setContent("");
        setTopic("");
    };

    const handleSubmit = async () => {
        if (!content.trim() || !targetPost) return;

        try {
            await dispatch(
                quotePost({
                    postId: targetPost.id,
                    content: content,
                }),
            ).unwrap();

            toast.success("Đã trích dẫn bài viết!");
            handleClose();
        } catch (error) {
            // Error lúc này sẽ chứa message từ rejectWithValue của Thunk
            console.error("Lỗi trích dẫn:", error);
            toast.error(error?.message || "Không thể gửi trích dẫn");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-xl p-0 dark:bg-neutral-900">
                <HeaderModal
                    title="Trích dẫn"
                    onCancel={handleClose}
                    description="Trích dẫn bài viết này"
                />

                <div className="px-4 py-4 space-y-3">
                    <PostComposer
                        content={content}
                        currentUser={currentUser}
                        onContentChange={setContent}
                        topic={topic}
                        onTopicChange={setTopic}
                        placeholder="Thêm nhận xét của bạn..."
                        showTopic
                    />

                    {/* Hiển thị bài viết gốc từ Redux */}
                    {targetPost && (
                        <div className="ml-12 mt-3">
                            <PostPreview post={targetPost} />
                        </div>
                    )}
                </div>

                <ModalFooter
                    disabled={!content.trim() || !targetPost}
                    onSubmit={handleSubmit}
                    isLoading={isPosting}
                />
            </DialogContent>
        </Dialog>
    );
};

export default QuoteModal;
