import { useDispatch, useSelector } from "react-redux";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { closeEmbedModal } from "@/features/embed/embedSlice"; // Đường dẫn slice của bạn
import { toast } from "sonner";
import PostPreview from "@/components/post/PostPreview";

const EmbedModal = () => {
    const dispatch = useDispatch();
    const { isOpen, targetPost } = useSelector((state) => state.embed);

    if (!targetPost) return null;

    const handleClose = () => dispatch(closeEmbedModal());

    const author = targetPost?.user?.username || "user";
    const postId = targetPost?.id;
    const embedUrl = `${window.location.origin}/${author}/post/${postId}/embed`;

    const embedCode = `<iframe src="${embedUrl}" title="Threads post by ${author}" width="100%" height="500" style="border:none; border-radius:12px; overflow:hidden;" frameborder="0" scrolling="no" allow="clipboard-write" allowfullscreen loading="lazy"></iframe>`;

    const handleCopy = async () => {
        await navigator.clipboard.writeText(embedCode);
        toast.success("Đã sao chép mã nhúng");
    };

    return (
        <Dialog open={!!isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-lg dark:bg-neutral-900">
                <DialogHeader>
                    <DialogTitle>Lấy mã nhúng</DialogTitle>
                    <DialogDescription className="sr-only">
                        Hộp thoại lấy mã nhúng
                    </DialogDescription>
                </DialogHeader>

                <PostPreview
                    post={targetPost}
                    className="border rounded-md p-3 text-sm text-gray-500"
                />

                <div className="relative overflow-hidden">
                    <pre className="bg-neutral-100 dark:bg-neutral-800 rounded-md px-3 py-5 pr-24 text-sm overflow-hidden truncate">
                        {embedCode}
                    </pre>
                    <button
                        onClick={handleCopy}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-semibold text-white px-3 py-2 rounded-md bg-black hover:bg-gray-900"
                    >
                        Sao chép
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EmbedModal;
