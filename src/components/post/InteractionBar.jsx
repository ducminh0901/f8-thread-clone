import {
    Images,
    ChevronsLeftRightEllipsis,
    Heart,
    MessageCircle,
    MessageSquareQuote,
    Repeat2,
    Send,
    Link2,
} from "lucide-react";
import { useState } from "react";

import ActionItem from "./ActionItem";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";

import handleCopyLink from "./SharePost/CopyLink";
import handleCopyAsImage from "./SharePost/CopyAsImage";
import { useRequireAuth } from "@/hooks/useRequireAuth";

function InteractionBar({
    post,
    isLiked,
    isReposted,
    likeCount,
    commentCount,
    repostCount,
    shareCount,
    onLike,
    onRepost,
    onQuote,
    onReply,
    onEmbed,
}) {
    const requireAuth = useRequireAuth();

    const [repostOpen, setRepostOpen] = useState(false);
    const [shareOpen, setShareOpen] = useState(false);

    return (
        <div className="flex items-center gap-4 text-sm text-gray-500">
            {/* Like */}
            <ActionItem onClick={() => requireAuth(onLike, "like")}>
                <Heart
                    className={`size-5 transition ${
                        isLiked ? "fill-red-500 text-red-500" : ""
                    }`}
                />
                <span>{likeCount}</span>
            </ActionItem>

            {/* Comment */}
            <ActionItem onClick={() => requireAuth(onReply, "comment")}>
                <MessageCircle className="size-5" />
                <span>{commentCount}</span>
            </ActionItem>

            {/* Repost */}
            <DropdownMenu
                open={repostOpen}
                onOpenChange={(open) => {
                    if (!open) return setRepostOpen(false);
                    requireAuth(() => setRepostOpen(true), "repost");
                }}
            >
                <DropdownMenuTrigger asChild>
                    <ActionItem>
                        <Repeat2
                            className={`size-5 transition ${
                                isReposted ? "text-green-500" : ""
                            }`}
                        />
                        <span>{repostCount}</span>
                    </ActionItem>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-58 rounded-xl p-2 text-[15px] font-medium">
                    <DropdownMenuItem
                        className="h-10"
                        onClick={() => requireAuth(onRepost, "repost")}
                    >
                        {isReposted ? "Hủy đăng lại" : "Đăng lại"}
                        <DropdownMenuShortcut>
                            <Repeat2 className="size-5" />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        className="h-10"
                        onClick={() => requireAuth(onQuote, "repost")}
                    >
                        Trích dẫn
                        <DropdownMenuShortcut>
                            <MessageSquareQuote className="size-5" />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Share */}
            <DropdownMenu
                open={shareOpen}
                onOpenChange={(open) => {
                    if (!open) return setShareOpen(false);
                    requireAuth(() => setShareOpen(true));
                }}
            >
                <DropdownMenuTrigger asChild>
                    <ActionItem>
                        <Send className="size-5" />
                        <span>{shareCount}</span>
                    </ActionItem>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-68 rounded-xl p-2 text-[15px] font-medium">
                    <DropdownMenuItem
                        className="h-10"
                        onClick={() => handleCopyLink(post)}
                    >
                        Sao chép liên kết
                        <DropdownMenuShortcut>
                            <Link2 className="size-5" />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        className="h-10"
                        onClick={() => handleCopyAsImage(post)}
                    >
                        Sao chép dưới dạng hình ảnh
                        <DropdownMenuShortcut>
                            <Images className="size-5" />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        className="h-10"
                        onClick={() => requireAuth(onEmbed)}
                    >
                        Lấy mã nhúng
                        <DropdownMenuShortcut>
                            <ChevronsLeftRightEllipsis className="size-5" />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

export default InteractionBar;
