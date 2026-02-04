import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { closeReplyModal } from "@/features/reply/replySlice";
import { createReply } from "@/features/reply/replySlice";
import { toast } from "sonner";

import PostPreview from "@/components/posts/PostPreview";
import ModalFooter from "@/components/feed/ModalFooter";
import HeaderModal from "@/components/feed/ModalHeader";
import PostComposer from "@/components/feed/PostComposer";

const ReplyModal = () => {
    const dispatch = useDispatch();

    // Lấy data từ Redux
    const { isOpen, targetPost } = useSelector((state) => state.reply);
    const { isPosting } = useSelector((state) => state.posts);
    const { currentUser } = useSelector((state) => state.auth);

    const [content, setContent] = useState("");
    const [topic, setTopic] = useState("");

    const handleClose = () => {
        dispatch(closeReplyModal());
        setContent("");
        setTopic("");
    };

    const handleSubmit = async () => {
        if (!content.trim() || !targetPost) return;

        try {
            await dispatch(
                createReply({
                    postId: targetPost.id,
                    content: content,
                }),
            ).unwrap();

            toast.success("Đã trả lời bài viết!");
            handleClose();
        } catch (error) {
            toast.error(error?.message || "Lỗi khi trả lời");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-xl p-0 dark:bg-neutral-900">
                <HeaderModal
                    title="Trả lời Thread"
                    onCancel={handleClose}
                    description={`Đang trả lời @${targetPost?.user?.username}`}
                />

                <div className="px-4 py-4 space-y-4">
                    {targetPost && (
                        <div className="ml-5 border-l-2 pl-4">
                            <PostPreview post={targetPost} />
                        </div>
                    )}

                    <PostComposer
                        topic={topic}
                        currentUser={currentUser}
                        onTopicChange={setTopic}
                        content={content}
                        onContentChange={setContent}
                        placeholder="Thread của bạn..."
                        showTopic
                    />
                </div>

                <ModalFooter
                    disabled={!content.trim() || isPosting}
                    onSubmit={handleSubmit}
                    isLoading={isPosting}
                />
            </DialogContent>
        </Dialog>
    );
};

export default ReplyModal;
