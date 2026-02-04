import copy from "copy-to-clipboard";
import { toast } from "sonner";

const handleCopyLink = (post) => {
    const author = post?.author;
    const postId = post?.id;

    if (!author || !postId) {
        toast.error("Cannot copy link");
        return;
    }

    const baseUrl = import.meta.env.VITE_APP_URL || location.origin;
    const url = `${baseUrl}/${author}/post/${postId}`;

    copy(url);
    toast.success("Copied link");
};

export default handleCopyLink;
