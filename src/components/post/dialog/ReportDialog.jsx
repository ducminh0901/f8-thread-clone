import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const REPORT_REASONS = [
    { value: "spam", label: "Spam" },
    { value: "hate", label: "Ngôn từ thù địch" },
    { value: "nsfw", label: "Nội dung nhạy cảm" },
    { value: "fake", label: "Thông tin sai lệch" },
];

export default function ReportPostDialog({ open, onOpenChange, onConfirm }) {
    const [reason, setReason] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = () => {
        if (!reason) return;

        onConfirm({
            reason,
            description,
        });

        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tại sao bạn báo cáo bài viết này?</DialogTitle>
                </DialogHeader>

                <DialogDescription>
                    Báo cáo của bạn sẽ được ẩn danh. Nếu ai đó đang gặp nguy
                    hiểm, đừng chần chừ mà hãy báo ngay cho dịch vụ khẩn cấp tại
                    địa phương.
                </DialogDescription>

                <RadioGroup
                    value={reason}
                    onValueChange={setReason}
                    className="space-y-2"
                >
                    {REPORT_REASONS.map((r) => (
                        <div
                            key={r.value}
                            className="flex items-center space-x-2"
                        >
                            <RadioGroupItem value={r.value} id={r.value} />
                            <Label htmlFor={r.value}>{r.label}</Label>
                        </div>
                    ))}
                </RadioGroup>

                <Textarea
                    placeholder="Mô tả thêm (không bắt buộc)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-3 resize-none"
                />

                <DialogFooter>
                    <Button
                        variant="destructive"
                        disabled={!reason}
                        onClick={handleSubmit}
                    >
                        Gửi báo cáo
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
