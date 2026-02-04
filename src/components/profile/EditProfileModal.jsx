import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "@/features/profile/profileSlice";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { toast } from "sonner";

export default function EditProfileModal({ isOpen, onOpenChange, user }) {
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);
    const { isUpdating } = useSelector((state) => state.profile);

    const [formData, setFormData] = useState({
        name: "",
        username: "",
        bio: "",
        is_private: false,
    });

    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState("");

    useEffect(() => {
        if (isOpen && user) {
            setFormData({
                name: user.fullName || user.username || "",
                username: user.username || "",
                bio: user.bio || "",
                is_private: user.is_private || false,
            });
            setAvatarPreview(user.avatar_url || "");
            setAvatarFile(null);
        }
    }, [isOpen, user]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        try {
            let currentAvatarUrl = user?.avatar_url;

            const finalPayload = {
                name: formData.name,
                username: formData.username,
                bio: formData.bio,
                is_private: formData.is_private,
                avatar_url: currentAvatarUrl,
            };

            await dispatch(updateProfile(finalPayload)).unwrap();
            toast.success("Cập nhật thông tin thành công!");
            onOpenChange(false);
        } catch (error) {
            toast.error("Cập nhật thông tin thất bại!");
        }
    };
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-106.25 rounded-3xl dark:bg-neutral-900">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl font-bold">
                        Chỉnh sửa trang cá nhân
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        Cập nhật thông tin cá nhân
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Phần Avatar với chức năng chọn ảnh */}
                    <div
                        className="flex justify-between items-center border rounded-2xl p-4 cursor-pointer"
                        onClick={() => fileInputRef.current.click()}
                    >
                        <div className="space-y-1">
                            <span className="text-sm font-bold block">
                                Ảnh đại diện
                            </span>
                            <span className="text-xs text-blue-500 font-medium">
                                Thay đổi ảnh
                            </span>
                        </div>
                        <div className="relative">
                            <Avatar className="size-16 border">
                                <AvatarImage
                                    src={
                                        avatarPreview ||
                                        "/avatar-placeholder.png"
                                    }
                                    className="object-cover"
                                />
                                <AvatarFallback>
                                    {user?.username?.[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute bottom-0 right-0 bg-white dark:bg-black border rounded-full p-1">
                                <Camera size={12} />
                            </div>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                        />
                    </div>

                    {/* Các Input khác */}
                    <div className="flex flex-col gap-1 border rounded-2xl p-4">
                        <label className="text-xs font-bold text-neutral-500">
                            Tên
                        </label>
                        <Input
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                            className="border-none p-0 h-auto focus-visible:ring-0 text-[15px]"
                        />
                    </div>

                    <div className="flex flex-col gap-1 border rounded-2xl p-4">
                        <label className="text-xs font-bold text-neutral-500">
                            Tên người dùng
                        </label>
                        <Input
                            value={formData.username}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    username: e.target.value,
                                })
                            }
                            className="border-none p-0 h-auto focus-visible:ring-0 text-[15px]"
                        />
                    </div>

                    <div className="flex flex-col gap-1 border rounded-2xl p-4">
                        <label className="text-xs font-bold text-neutral-500">
                            Tiểu sử
                        </label>
                        <Textarea
                            value={formData.bio}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    bio: e.target.value,
                                })
                            }
                            className="resize-none p-1 border-none p-0 focus-visible:ring-0 min-h-[60px] text-[15px]"
                        />
                    </div>

                    <div className="flex justify-between items-center border rounded-2xl p-4">
                        <span className="text-sm font-bold">
                            Trang cá nhân riêng tư
                        </span>
                        <Switch
                            checked={formData.is_private}
                            onCheckedChange={(checked) =>
                                setFormData({
                                    ...formData,
                                    is_private: checked,
                                })
                            }
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        onClick={handleSave}
                        disabled={isUpdating}
                        className="w-full h-12 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-bold"
                    >
                        {isUpdating ? "Đang lưu..." : "Hoàn tất"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
