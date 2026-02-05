import PostSkeleton from "./PostSkeleton";
import { UserSkeleton } from "./PostSkeleton";

export default function PostSkeletonList({ count = 10, className }) {
    return (
        <div className={`dark:bg-neutral-900 select-none ${className ?? ""}`}>
            {[...Array(count)].map((_, i) => (
                <PostSkeleton key={`post-skeleton-${i}`} />
            ))}
        </div>
    );
}

export function UserSkeletonList({ count = 5, className }) {
    return (
        <div className={`dark:bg-neutral-900 select-none ${className ?? ""}`}>
            {[...Array(count)].map((_, i) => (
                <UserSkeleton key={`user-skeleton-${i}`} />
            ))}
        </div>
    );
}
