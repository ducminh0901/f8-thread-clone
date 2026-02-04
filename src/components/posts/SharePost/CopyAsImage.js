import * as htmlToImage from "html-to-image";
import { toast } from "sonner";

const handleCopyAsImage = async (post) => {
    const node = document.getElementById(`post-${post.id}`);

    if (!node) {
        toast.error("Không tìm thấy bài viết");
        return;
    }

    try {
        await document.fonts.ready;

        const dataUrl = await htmlToImage.toPng(node, {
            cacheBust: true,
            pixelRatio: 2,
            useCORS: true,
        });

        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `post-${post.id}.png`;
        link.click();
        toast.success("Đã lưu ảnh bài viết");
    } catch (err) {
        console.error(err);
        toast.error("Copy ảnh thất bại");
    }
};
export default handleCopyAsImage;
