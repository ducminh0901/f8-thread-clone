import {
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { CircleEllipsis, Clock7 } from "lucide-react";

export default function HeaderModal({
    title,
    onCancel,
    description = "Modal header",
    showSchedule = false,
}) {
    return (
        <DialogHeader className="border-b px-4 py-3">
            <div className="flex items-center justify-between">
                {/* Left */}
                <button
                    onClick={onCancel}
                    className="text-base text-muted-foreground cursor-pointer"
                >
                    Hủy
                </button>

                {/* Center */}
                <DialogTitle className="text-base">{title}</DialogTitle>

                {/* Right */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="rounded-full p-1 hover:bg-muted">
                            <CircleEllipsis />
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="end"
                        className="w-68 rounded-xl p-2 text-[15px] font-medium"
                    >
                        <DropdownMenuItem className="h-10">
                            Thêm nhãn AI
                        </DropdownMenuItem>
                        <DropdownMenuItem className="h-10">
                            Đánh dấu là mối quan hệ tài trợ
                        </DropdownMenuItem>

                        {showSchedule && (
                            <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="h-10">
                                    Lên lịch...
                                    <DropdownMenuShortcut>
                                        <Clock7 className="size-5" />
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <DialogDescription className="sr-only">
                {description}
            </DialogDescription>
        </DialogHeader>
    );
}
