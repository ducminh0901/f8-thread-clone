import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Image,
    Smile,
    AlignLeft,
    FileText,
    MapPin,
    Paperclip,
} from "lucide-react";

export default function PostComposer({
    currentUser,
    content,
    onContentChange,
    topic,
    onTopicChange,
    placeholder = "Viết gì đó...",
    showTopic = false,
}) {
    return (
        <div className="flex gap-3">
            <Avatar className="size-9 border ">
                <AvatarImage
                    src={currentUser?.avatarUrl || "/avatar-placeholder.png"}
                    alt={currentUser?.username}
                    className="object-cover "
                />
                <AvatarFallback className="bg-neutral-200 dark:bg-neutral-900">
                    {currentUser?.username
                        ? currentUser.username[0].toUpperCase()
                        : "U"}
                </AvatarFallback>
            </Avatar>

            <div className="flex-1 ">
                {showTopic && (
                    <Input
                        value={topic}
                        onChange={(e) => onTopicChange?.(e.target.value)}
                        placeholder="Thêm chủ đề"
                        className="border-0 px-0 text-sm shadow-none focus-visible:ring-0 dark:bg-neutral-900"
                    />
                )}

                <Textarea
                    value={content}
                    onChange={(e) => onContentChange(e.target.value)}
                    placeholder={placeholder}
                    className="
                        w-full
                        resize-none
                        border-0
                        px-0
                        text-sm
                        shadow-none
                        focus-visible:ring-0
                        whitespace-pre-wrap
                        break-all
                        dark:bg-neutral-900
                    "
                />

                {/* Toolbar */}

                <div className="flex gap-3 text-muted-foreground">
                    <Image className="size-5 cursor-pointer" />
                    <Paperclip className="size-5 cursor-pointer" />
                    <Smile className="size-5 cursor-pointer" />
                    <AlignLeft className="size-5 cursor-pointer" />
                    <FileText className="size-5 cursor-pointer" />
                    <MapPin className="size-5 cursor-pointer" />
                </div>
            </div>
        </div>
    );
}
