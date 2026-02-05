import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import PostComposer from "../../feed/PostComposer";
import ModalFooter from "../../feed/ModalFooter";
import HeaderModal from "../../feed/ModalHeader";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "@/features/post/postSlice";

function CreatePostModal() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isPosting } = useSelector((state) => state.posts);
    const { currentUser } = useSelector((state) => state.auth);
    const [content, setContent] = useState("");
    const [topic, setTopic] = useState("");

    const canPost = content.trim().length > 0;

    const handleSubmit = async () => {
        if (!content.trim() || isPosting) return;

        try {
            // unwrap() sẽ trả về dữ liệu nếu thành công, hoặc quăng lỗi nếu thất bại
            await dispatch(addPost({ content, topic })).unwrap();
            navigate(-1);
        } catch (error) {
            // Xử lý lỗi ở đây (vd: hiện toast)
            console.error("Lỗi đăng bài:", error);
        }
    };
    return (
        <Dialog open onOpenChange={() => navigate(-1)}>
            <DialogContent className="max-w-xl p-0 gap-0 rounded-2xl dark:bg-neutral-900">
                <HeaderModal
                    title="Thread mới"
                    onCancel={() => navigate(-1)}
                    description="Tạo thread mới"
                    showSchedule
                />

                <div className="px-4 py-4">
                    <PostComposer
                        currentUser={currentUser}
                        topic={topic}
                        onTopicChange={setTopic}
                        content={content}
                        onContentChange={setContent}
                        placeholder="Có gì mới?"
                        showTopic
                    />
                </div>

                <ModalFooter disabled={!canPost} onSubmit={handleSubmit} />
            </DialogContent>
        </Dialog>
    );
}

export default CreatePostModal;
