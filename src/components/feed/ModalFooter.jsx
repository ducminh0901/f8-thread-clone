import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { ChartCandlestick, Check, Loader2 } from "lucide-react";
import { Switch } from "../ui/switch";
import { cn } from "@/lib/utils";

function ModalFooter({ disabled, onSubmit, isLoading }) {
    const [reviewEnabled, setReviewEnabled] = useState(false);
    const [selectedReply, setSelectedReply] = useState("anyone");

    return (
        <div className="flex items-center justify-between px-4 py-3">
            {/* Left: dropdown / options */}
            <div className="flex items-center gap-3">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            className={cn(
                                "flex items-center gap-2 rounded-full text-sm font-medium transition",
                                reviewEnabled
                                    ? "text-black dark:text-neutral-200"
                                    : "text-neutral-500",
                            )}
                        >
                            <ChartCandlestick className="size-5 shrink-0" />
                            <span>Các lựa chọn để kiểm soát câu trả lời</span>
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="start"
                        className="w-78 rounded-xl font-medium "
                    >
                        <DropdownMenuLabel className="text-sm text-neutral-400">
                            Ai có thể trả lời và trích dẫn
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                            onSelect={() => setSelectedReply("anyone")}
                            className="px-3 py-3.5"
                        >
                            Bất kì ai
                            {selectedReply === "anyone" && (
                                <DropdownMenuShortcut>
                                    <Check className="size-5" strokeWidth={3} />
                                </DropdownMenuShortcut>
                            )}
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onSelect={() => setSelectedReply("followers")}
                            className="px-3 py-3.5"
                        >
                            Người theo dõi của bạn
                            {selectedReply === "followers" && (
                                <DropdownMenuShortcut>
                                    <Check className="size-5" strokeWidth={3} />
                                </DropdownMenuShortcut>
                            )}
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onSelect={() => setSelectedReply("following")}
                            className="px-3 py-3.5"
                        >
                            Trang cá nhân mà bạn theo dõi
                            {selectedReply === "following" && (
                                <DropdownMenuShortcut>
                                    <Check className="size-5" strokeWidth={3} />
                                </DropdownMenuShortcut>
                            )}
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onSelect={() => setSelectedReply("mentioned")}
                            className="px-3 py-3.5"
                        >
                            Trang cá nhân mà bạn nhắc đến
                            {selectedReply === "mentioned" && (
                                <DropdownMenuShortcut>
                                    <Check className="size-5" strokeWidth={3} />
                                </DropdownMenuShortcut>
                            )}
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="flex items-center justify-between px-3 py-3.5"
                        >
                            <span>Xem xét và phê duyệt câu trả lời</span>

                            <Switch
                                checked={reviewEnabled}
                                onCheckedChange={setReviewEnabled}
                            />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <Button
                size="sm"
                className="rounded-full px-4 font-semibold min-w-20"
                disabled={disabled || isLoading}
                onClick={onSubmit}
                variant="outline"
            >
                {isLoading ? (
                    <Loader2 className="size-5 animate-spin" />
                ) : (
                    "Đăng"
                )}
            </Button>
        </div>
    );
}

export default ModalFooter;
