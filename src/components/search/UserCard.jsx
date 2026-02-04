import { useState, memo, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { followUser } from "@/features/search/searchSlice";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const UserCard = ({ user }) => {
    const dispatch = useDispatch();
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { followings } = useSelector((state) => state.profile);

    const isActuallyFollowing = useMemo(() => {
        return (
            followings.some((f) => String(f.id) === String(user.id)) ||
            user.is_following
        );
    }, [followings, user.id, user.is_following]);

    const executeToggle = async () => {
        setIsActionLoading(true);
        try {
            const result = await dispatch(followUser(user.id)).unwrap();
            toast.success(result.nextState ? "Đã theo dõi" : "Đã hủy theo dõi");
            setShowConfirm(false);
        } catch (error) {
            toast.error("Thao tác thất bại!");
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleButtonClick = (e) => {
        e.preventDefault();
        if (isActuallyFollowing) {
            setShowConfirm(true);
        } else {
            executeToggle();
        }
    };

    return (
        <>
            <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-neutral-800 transition-all">
                <div className="flex items-center flex-1">
                    <Avatar className="size-10 border">
                        <AvatarImage
                            src={
                                user.avatar ||
                                user.avatar_url ||
                                "/avatar-placeholder.png"
                            }
                            className="object-cover"
                        />
                        <AvatarFallback>
                            {user.username?.[0].toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 mx-4">
                        <p className="font-bold text-[15px]">{user.username}</p>
                        <p className="text-gray-500 text-[14px]">
                            {user.name || user.fullName}
                        </p>
                    </div>
                </div>

                <Button
                    onClick={handleButtonClick}
                    disabled={isActionLoading}
                    variant={isActuallyFollowing ? "secondary" : "default"}
                    className="rounded-full font-bold h-9 px-6"
                >
                    {isActionLoading
                        ? "..."
                        : isActuallyFollowing
                          ? "Đang theo dõi"
                          : "Theo dõi"}
                </Button>
            </div>

            {/* Shadcn AlertDialog */}
            <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
                <AlertDialogContent className="max-w-85 rounded-2xl dark:bg-neutral-900">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-center">
                            Hủy theo dõi?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-neutral-500">
                            Bạn sẽ không còn thấy bài viết của @{user.username}{" "}
                            trên bảng tin của mình nữa.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col sm:flex-col gap-2 mt-4">
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault(); // Ngăn tự đóng để đợi API
                                executeToggle();
                            }}
                            disabled={isActionLoading}
                            className="bg-transparent text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 border-none font-bold shadow-none"
                        >
                            {isActionLoading ? "Đang xử lý..." : "Hủy theo dõi"}
                        </AlertDialogAction>
                        <AlertDialogCancel
                            disabled={isActionLoading}
                            className="border-none shadow-none font-medium"
                        >
                            Hủy
                        </AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default memo(UserCard);
