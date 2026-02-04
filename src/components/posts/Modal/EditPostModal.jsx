import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editPost } from "@/features/post/postSlice";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import ModalFooter from "@/components/feed/ModalFooter";
import PostComposer from "@/components/feed/PostComposer";
import HeaderModal from "@/components/feed/ModalHeader";

export default function EditPostModal({ post, open, onOpenChange }) {
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.auth.currentUser);

    // 1. Sync content khi modal mở lên hoặc post thay đổi
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (open && post?.content) {
            setContent(post.content);
        }
    }, [open, post]);

    // 2. Logic kiểm tra nút Save
    const isUnchanged = content.trim() === post?.content;
    const isEmpty = !content.trim();
    const canSave = !isUnchanged && !isEmpty && !isLoading;

    const handleUpdate = async () => {
        if (!canSave) return;

        setIsLoading(true);
        try {
            await dispatch(
                editPost({
                    postId: post.id,
                    content: content.trim(),
                }),
            ).unwrap();

            toast.success("Đã cập nhật bài viết");
            onOpenChange(false);
        } catch (error) {
            toast.error("Cập nhật thất bại");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-150 p-0 overflow-hidden rounded-2xl dark:bg-neutral-900">
                {/* Accessibility: Cần có Title và Description dù ẩn */}
                <DialogTitle className="sr-only">
                    Chỉnh sửa bài viết
                </DialogTitle>
                <DialogDescription className="sr-only">
                    Thay đổi nội dung bài viết của bạn
                </DialogDescription>

                <HeaderModal
                    title="Chỉnh sửa bài viết"
                    onCancel={() => onOpenChange(false)}
                />

                <div className="px-6 py-4 min-h-37.5">
                    <PostComposer
                        currentUser={currentUser}
                        content={content}
                        onContentChange={setContent}
                        topic={post?.topic}
                        onTopicChange={() => {}}
                        placeholder="Bạn đang nghĩ gì?"
                        showTopic
                        autoFocus
                    />
                </div>

                <ModalFooter
                    disabled={!canSave}
                    isLoading={isLoading}
                    onSubmit={handleUpdate}
                    buttonText="Lưu thay đổi"
                />
            </DialogContent>
        </Dialog>
    );
}
