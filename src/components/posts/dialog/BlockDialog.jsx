import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
    AlertDialogPortal,
} from "@/components/ui/alert-dialog";

export default function BlockUserDialog({
    open,
    onOpenChange,
    username,
    onConfirm,
}) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogPortal>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Chặn {username}?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn sẽ không thấy bài viết của người này nữa. Hành
                            động này không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-500 hover:bg-red-600"
                            onClick={onConfirm}
                        >
                            Chặn
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogPortal>
        </AlertDialog>
    );
}
