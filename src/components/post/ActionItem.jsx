import * as React from "react";
import { cn } from "@/lib/utils";

const ActionItem = React.forwardRef(
    ({ children, onClick, className, ...props }, ref) => {
        return (
            <button
                ref={ref}
                type="button"
                onClick={onClick}
                className={cn(
                    "flex items-center gap-1 rounded-2xl p-2 text-gray-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer active:scale-95",
                    className,
                )}
                {...props}
            >
                {children}
            </button>
        );
    },
);

ActionItem.displayName = "ActionItem";

export default ActionItem;
