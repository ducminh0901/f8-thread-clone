import UserCard from "../search/UserCard";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const FollowListModal = ({ isOpen, onClose, title, users }) => {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-md w-[95vw] h-[70vh] flex flex-col p-0 overflow-hidden rounded-2xl gap-0 outline-1 dark:bg-neutral-900">
                <DialogHeader className="p-4 border-b space-y-0">
                    {" "}
                    {/* Thêm space-y-0 */}
                    <DialogTitle className="text-center font-bold text-[17px]">
                        {title}
                    </DialogTitle>
                    {/* Thêm Description ẩn để tránh lỗi console/khoảng trắng thừa */}
                    <DialogDescription className="sr-only">
                        Danh sách người dùng
                    </DialogDescription>
                </DialogHeader>

                {/* Danh sách có thể scroll */}
                <div className="flex-1 overflow-y-auto p-2 no-scrollbar">
                    {users && users.length > 0 ? (
                        <div className="flex flex-col">
                            {users.map((user) => (
                                <UserCard key={user.id} user={user} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full py-10">
                            <p className="text-gray-500 font-medium">
                                Danh sách trống
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FollowListModal;
