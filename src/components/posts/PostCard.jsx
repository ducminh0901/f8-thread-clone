import { Link, useNavigate } from "react-router-dom";
import { memo, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InteractionBar from "./InteractionBar";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Bookmark,
    CircleAlert,
    Ellipsis,
    EyeOff,
    Link2,
    Pencil,
    Trash2,
    UserLock,
    UserRoundMinus,
    UserX,
} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { usePostActions } from "@/hooks/usePostActions";
import BlockUserDialog from "./dialog/BlockDialog";
import { ReportPostDialog } from "./dialog";
import { selectIsAuth, selectCurrentUser } from "@/features/auth/authSlice";
import { deletePost } from "@/features/post/postSlice";
import DeletePostDialog from "@/components/posts/dialog/DeletePostModal";
import EditPostModal from "./Modal/EditPostModal";
import { toast } from "sonner";
import { openQuoteModal } from "@/features/quote/quoteSlice";
import { openReplyModal } from "@/features/reply/replySlice";
import { openEmbedModal } from "@/features/embed/embedSlice";

const PostCard = memo(({ post, onRemovePost, className, showSuggest }) => {
    if (!post) return null;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [openBlock, setOpenBlock] = useState(false);
    const [openReport, setOpenReport] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const isLoggedIn = useSelector(selectIsAuth);
    const currentUser = useSelector(selectCurrentUser);

    const isOwnPost =
        currentUser?.id === post.user?.id ||
        currentUser?.username === post.author;

    const {
        handleLike,
        handleRepost,
        toggleSave,
        notInterested,
        copyLink,
        blockUser,
        reportPost,
        muteUser,
        restrictUser,
    } = usePostActions({
        post,
        onRemovePost,
    });

    const handleDelete = useCallback(async () => {
        setIsDeleting(true);
        try {
            await dispatch(deletePost(post.id)).unwrap();
            toast.success("Đã xóa bài viết");
            setOpenDelete(false);
            if (onRemovePost) onRemovePost(post.id);
        } catch (error) {
            toast.error("Xóa thất bại");
        } finally {
            setIsDeleting(false);
        }
    }, [dispatch, post.id, onRemovePost]);

    const handleGoToDetail = (e) => {
        const isInteractive = e.target.closest('button, a, [role="menuitem"]');
        if (isInteractive) return;

        navigate(`/${post.user?.username}/post/${post.id}`);
    };
    return (
        <>
            <Card
                onClick={handleGoToDetail}
                className={`rounded-none border-0 border-b px-4 py-4 w-full cursor-pointer shadow-none transition-colors ${className}`}
            >
                <div className="flex gap-3 w-full">
                    <Avatar className="size-9 shrink-0 dark:bg-neutral-800">
                        <AvatarImage
                            src={
                                post.user?.avatar_url ||
                                "/avatar-placeholder.png"
                            }
                            crossOrigin="anonymous"
                        />
                        <AvatarFallback>
                            {post.author?.[0].toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0 flex flex-col w-full">
                        <div className="flex items-start justify-between w-full gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                                <Link
                                    to={`/profile/${post.author}`}
                                    className="font-semibold hover:underline truncate"
                                >
                                    {post.author}
                                </Link>
                                <span className="text-xs text-gray-400">
                                    · 2h
                                </span>
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="h-6 w-6 grid place-items-center rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 shrink-0">
                                        <Ellipsis className="size-4" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-64 rounded-xl p-2 font-medium dark:neutral-200"
                                >
                                    {!isLoggedIn ? (
                                        /* --- TRƯỜNG HỢP: CHƯA ĐĂNG NHẬP (GUEST) --- */
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem
                                                className="h-10"
                                                onClick={copyLink}
                                            >
                                                Sao chép liên kết
                                                <DropdownMenuShortcut>
                                                    <Link2 className="size-5" />
                                                </DropdownMenuShortcut>
                                            </DropdownMenuItem>
                                            {/* Bạn có thể thêm nút "Báo cáo" ở đây nếu muốn cho phép khách báo cáo */}
                                        </DropdownMenuGroup>
                                    ) : isOwnPost ? (
                                        /* --- TRƯỜNG HỢP: CHỦ BÀI VIẾT --- */
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem
                                                className="h-10"
                                                onSelect={() =>
                                                    setOpenEdit(true)
                                                }
                                            >
                                                Chỉnh sửa
                                                <DropdownMenuShortcut>
                                                    <Pencil className="size-5" />
                                                </DropdownMenuShortcut>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="h-10 text-red-500 focus:text-red-500"
                                                onSelect={() =>
                                                    setOpenDelete(true)
                                                }
                                            >
                                                Xóa
                                                <DropdownMenuShortcut>
                                                    <Trash2 className="size-5" />
                                                </DropdownMenuShortcut>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className="h-10"
                                                onClick={copyLink}
                                            >
                                                Sao chép liên kết
                                                <DropdownMenuShortcut>
                                                    <Link2 className="size-5" />
                                                </DropdownMenuShortcut>
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                    ) : (
                                        /* --- TRƯỜNG HỢP: NGƯỜI DÙNG KHÁC ĐÃ ĐĂNG NHẬP --- */
                                        <>
                                            <DropdownMenuGroup>
                                                <DropdownMenuSub>
                                                    <DropdownMenuSubTrigger className="h-10">
                                                        Thêm vào bảng feed
                                                    </DropdownMenuSubTrigger>
                                                    <DropdownMenuPortal>
                                                        <DropdownMenuSubContent className="w-56">
                                                            <DropdownMenuItem className="h-10 px-3">
                                                                Tạo bảng feed
                                                                mới
                                                            </DropdownMenuItem>
                                                        </DropdownMenuSubContent>
                                                    </DropdownMenuPortal>
                                                </DropdownMenuSub>
                                            </DropdownMenuGroup>

                                            <DropdownMenuSeparator />

                                            <DropdownMenuGroup>
                                                <DropdownMenuItem
                                                    className="h-10"
                                                    onClick={toggleSave}
                                                >
                                                    Lưu
                                                    <DropdownMenuShortcut>
                                                        <Bookmark className="size-5" />
                                                    </DropdownMenuShortcut>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="h-10"
                                                    onClick={notInterested}
                                                >
                                                    Không quan tâm
                                                    <DropdownMenuShortcut>
                                                        <EyeOff className="size-5" />
                                                    </DropdownMenuShortcut>
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>

                                            <DropdownMenuSeparator />

                                            <DropdownMenuGroup>
                                                <DropdownMenuItem
                                                    className="h-10"
                                                    onClick={muteUser}
                                                >
                                                    Tắt thông báo
                                                    <DropdownMenuShortcut>
                                                        <UserRoundMinus className="size-5" />
                                                    </DropdownMenuShortcut>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="h-10"
                                                    onClick={restrictUser}
                                                >
                                                    Hạn chế
                                                    <DropdownMenuShortcut>
                                                        <UserLock className="size-5" />
                                                    </DropdownMenuShortcut>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="h-10 text-red-500"
                                                    onSelect={() =>
                                                        setOpenBlock(true)
                                                    }
                                                >
                                                    Chặn
                                                    <DropdownMenuShortcut>
                                                        <UserX className="size-5" />
                                                    </DropdownMenuShortcut>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="h-10 text-red-500"
                                                    onSelect={() =>
                                                        setOpenReport(true)
                                                    }
                                                >
                                                    Báo cáo
                                                    <DropdownMenuShortcut>
                                                        <CircleAlert className="size-5" />
                                                    </DropdownMenuShortcut>
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>

                                            <DropdownMenuSeparator />

                                            <DropdownMenuItem
                                                className="h-10"
                                                onClick={copyLink}
                                            >
                                                Sao chép liên kết
                                                <DropdownMenuShortcut>
                                                    <Link2 className="size-5" />
                                                </DropdownMenuShortcut>
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {showSuggest && (
                            <p className="text-zinc-500 text-sm">
                                Thread gợi ý
                            </p>
                        )}

                        <p className="mt-1 text-sm leading-relaxed whitespace-pre-wrap break-all overflow-hidden">
                            {post.content}
                        </p>

                        {post.originalPost && (
                            <div className="mt-3 overflow-hidden rounded-xl border transition-colors p-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <Avatar className="size-5">
                                        <AvatarImage
                                            src={
                                                post.originalPost.avatar ||
                                                "/avatar-placeholder.png"
                                            }
                                        />
                                        <AvatarFallback className="text-[10px]">
                                            {post.originalPost.author?.[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-xs font-bold">
                                        {post.originalPost.author}
                                    </span>
                                </div>
                                <p className="text-sm text-neutral-600 line-clamp-3">
                                    {post.originalPost.content}
                                </p>
                                {/* Nếu bài gốc có ảnh, bạn có thể hiện thumbnail nhỏ ở đây */}
                            </div>
                        )}

                        {post.image && (
                            <div className="mt-3 overflow-hidden rounded-xl">
                                <img
                                    src={post.image}
                                    alt="post"
                                    className="w-full max-h-125 object-cover"
                                />
                            </div>
                        )}

                        <div className="interaction-bar">
                            <InteractionBar
                                post={post}
                                isLiked={post.isLiked}
                                isReposted={post.isReposted}
                                likeCount={post.likeCount}
                                commentCount={post.replies_count}
                                repostCount={post.reposts}
                                onLike={handleLike}
                                onRepost={handleRepost}
                                onQuote={() => dispatch(openQuoteModal(post))}
                                onReply={() => dispatch(openReplyModal(post))}
                                onEmbed={() => dispatch(openEmbedModal(post))}
                            />
                        </div>
                    </div>
                </div>
            </Card>

            {/* Modals & Dialogs */}
            <EditPostModal
                post={post}
                open={openEdit}
                onOpenChange={setOpenEdit}
            />

            <DeletePostDialog
                open={openDelete}
                onOpenChange={setOpenDelete}
                onConfirm={handleDelete}
                isLoading={isDeleting}
            />

            <BlockUserDialog
                open={openBlock}
                username={post.author}
                onOpenChange={setOpenBlock}
                onConfirm={blockUser}
            />
            <ReportPostDialog
                open={openReport}
                onOpenChange={setOpenReport}
                onConfirm={reportPost}
            />
        </>
    );
});

export default PostCard;
