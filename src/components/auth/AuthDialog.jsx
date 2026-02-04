import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { closeAuthDialog } from "@/features/ui/uiSlice";
import { Heart, MessageCircle, Repeat2, SquarePen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const AUTH_CONTENT = {
    like: {
        icon: <Heart size={58} strokeWidth={2.5} />,
        title: "Bạn thích nội dung này ư? Bạn sẽ thích mê Threads.",
        description: "Hãy đăng ký để thích, trả lời và hơn thế nữa.",
    },
    comment: {
        icon: <MessageCircle size={58} strokeWidth={2.5} />,
        title: "Đăng ký để trả lời",
        description:
            "Chỉ còn một bước nữa là bạn có thể tham gia cuộc trò chuyện rồi.",
    },
    repost: {
        icon: <Repeat2 size={58} strokeWidth={2.5} />,
        title: "Đăng ký để đăng lại",
        description:
            "Bạn đã tiến thêm được một bước trong hành trình khơi mào cuộc trò chuyện.",
    },
    post: {
        icon: <SquarePen size={58} strokeWidth={2.5} />,
        title: "Đăng kí để đăng",
        description:
            "Tham gia Threads để chia sẻ ý tưởng, đặt câu hỏi, đăng những suy nghĩ bất chợt và hơn thế nữa.",
    },
    default: {
        title: "Bày tỏ nhiều hơn qua Threads",
        description:
            "Tham gia Threads để chia sẻ suy nghĩ, nắm bắt những gì đang diễn ra, theo dõi những người bạn yêu mến và hơn thế nữa.",
    },
};

export default function AuthDialog() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { open, type } = useSelector((state) => state.ui.authDialog);

    const content = AUTH_CONTENT[type] ?? AUTH_CONTENT.default;

    const handleAuthRedirect = () => {
        dispatch(closeAuthDialog());
        navigate("/login");
    };

    return (
        <Dialog open={open} onOpenChange={() => dispatch(closeAuthDialog())}>
            <DialogContent className="max-w-sm gap-4 text-center py-12 px-14">
                {content.icon && (
                    <div className="mx-auto text-3xl">{content.icon}</div>
                )}

                <DialogTitle className="text-3xl font-extrabold leading-snug">
                    {content.title}
                </DialogTitle>

                <DialogDescription className="text-md">
                    {content.description}
                </DialogDescription>

                <div className="flex justify-center">
                    <Button
                        onClick={handleAuthRedirect}
                        className="px-8 py-6 rounded-md text-lg"
                        variant="outline"
                    >
                        Đăng nhập
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
