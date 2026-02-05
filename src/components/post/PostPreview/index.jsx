import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function PostPreview({ post }) {
    if (!post?.author) return null;

    return (
        <div className="rounded-xl border p-3 text-sm">
            <div className="flex items-center gap-2">
                <Avatar className="size-5">
                    <AvatarImage
                        src={post.user?.avatar_url || "/avatar-placeholder.png"}
                        crossOrigin="anonymous"
                    />
                    <AvatarFallback>{post.author.username?.[0]}</AvatarFallback>
                </Avatar>

                <span className="font-medium">{post.author.username}</span>
                <span className="text-xs text-muted-foreground">· 5 giờ</span>
            </div>

            <p className="mt-1 text-muted-foreground">{post.content}</p>
        </div>
    );
}
