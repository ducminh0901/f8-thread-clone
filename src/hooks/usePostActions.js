import { postService } from "@/services/postService";
import {
    toggleLike,
    likePost,
    toggleRepost,
    repostPost,
} from "@/features/post/postSlice";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export function usePostActions({ post, onRemovePost }) {
    const dispatch = useDispatch();

    const handleLike = async () => {
        // BƯỚC 1: Cập nhật UI ngay lập tức
        dispatch(toggleLike(post.id));

        // BƯỚC 2: Gọi Thunk để xử lý API và Rollback tự động nếu lỗi

        try {
            await dispatch(likePost(post.id)).unwrap();
        } catch (error) {
            toast.error("Không thể thực hiện hành động like");
            // Không cần dispatch toggleLike lần nữa vì
            // postSlice.extraReducers (likePost.rejected) đã xử lý rollback rồi!
        }
    };

    const handleRepost = async () => {
        dispatch(toggleRepost(post.id));
        try {
            await dispatch(repostPost(post.id)).unwrap();
            toast.success("Đã đăng lại bài viết");
        } catch (error) {
            toast.error("Không thể đăng lại");
            // Rollback đã có extraReducers lo
        }
    };
    const toggleSave = async () => {
        try {
            await postService.toggleSave(post.id);
            toast.success("Đã lưu bài viết");
        } catch (error) {
            toast.error("Không thể lưu bài viết");
        }
    };

    const notInterested = async () => {
        try {
            await postService.notInterested(post.id);
            onRemovePost?.(post.id);
            toast.success("Đã ẩn bài viết");
        } catch {
            toast.error("Có lỗi xảy ra");
        }
    };

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(
                `${location.origin}/post/${post.id}`,
            );
            toast.success("Đã sao chép liên kết");
        } catch {
            toast.error("Không sao chép được");
        }
    };

    const deletePost = async () => {
        try {
            await postService.deletePost(post.id);
            toast.success("Đã xóa bài viết");
            onRemovePost?.(post.id);
        } catch {
            toast.error("Xóa bài viết thất bại");
        }
    };

    const muteUser = async () => {
        try {
            await postService.muteUser(post.user.id);
            toast.success("Đã tắt tiếng người dùng");
        } catch (error) {
            toast.error("Không thể mute");
        }
    };

    const restrictUser = async () => {
        try {
            await postService.restrictUser(post.user.id);
            toast.success("Đã hạn chế người dùng");
        } catch {
            toast.error("Không thể hạn chế");
        }
    };

    const blockUser = async () => {
        try {
            await postService.blockUser(post.user.id);
            toast.success("Đã chặn người dùng");
        } catch {
            toast.error("Không thể chặn");
        }
    };

    const reportPost = async ({ reason, description }) => {
        try {
            await postService.reportPost(post.id, {
                reason,
                description,
            });
            toast.success("Đã gửi báo cáo");
        } catch {
            toast.error("Báo cáo thất bại");
        }
    };

    return {
        handleLike,
        handleRepost,
        toggleSave,
        notInterested,
        copyLink,
        deletePost,
        muteUser,
        restrictUser,
        blockUser,
        reportPost,
    };
}
