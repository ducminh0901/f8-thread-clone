import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/configs/path";
import { useSelector } from "react-redux";

function CreatePostCard() {
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.auth.currentUser);
    return (
        <Card
            onClick={() => navigate(PATHS.CREATE)}
            className="hidden md:block cursor-pointer rounded-none border-0 border-b px-4 py-4 shadow-none last:border-b-0"
        >
            <div className="flex items-center gap-3">
                <Avatar className="size-9">
                    <AvatarImage
                        src={
                            currentUser?.avatar_url || "/avatar-placeholder.png"
                        }
                        alt={currentUser?.username}
                        className="object-cover"
                    />
                    <AvatarFallback>
                        {currentUser?.username
                            ? currentUser.username[0].toUpperCase()
                            : "?"}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 text-sm">Có gì mới ?</div>

                <Button size="sm" variant="outline">
                    Đăng
                </Button>
            </div>
        </Card>
    );
}

export default CreatePostCard;
