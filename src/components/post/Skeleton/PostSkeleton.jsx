import { Skeleton } from "@/components/ui/skeleton";

export default function PostSkeleton() {
    return (
        <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 animate-pulse">
            {/* Header */}
            <div className="flex gap-3 mb-4">
                <Skeleton className="h-10 w-10 rounded-full shrink-0 bg-neutral-200 dark:bg-neutral-800" />
                <div className="space-y-2 flex-1 pt-1">
                    <Skeleton className="h-3 w-24 bg-neutral-200 dark:bg-neutral-800" />
                    <Skeleton className="h-2 w-16 bg-neutral-200 dark:bg-neutral-800" />
                </div>
            </div>

            <div className="space-y-3 mb-6 ml-13">
                {" "}
                {/* Lệch lề để thẳng hàng với text của Threads */}
                <Skeleton className="h-3 w-full bg-neutral-200 dark:bg-neutral-800" />
                <Skeleton className="h-3 w-4/5 bg-neutral-200 dark:bg-neutral-800" />
            </div>

            <div className="flex gap-6 ml-13">
                {[...Array(4)].map((_, i) => (
                    <Skeleton
                        key={i}
                        className="h-4 w-4 rounded-md bg-neutral-200 dark:bg-neutral-800"
                    />
                ))}
            </div>
        </div>
    );
}
export const UserSkeleton = () => (
    <div className="flex items-center justify-between py-3 border-b">
        <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-40" />
            </div>
        </div>
        <Skeleton className="h-8 w-20 rounded-full" />{" "}
    </div>
);
