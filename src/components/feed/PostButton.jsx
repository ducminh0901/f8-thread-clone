import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/configs/path";

function CreatePostButton() {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(PATHS.CREATE)}
            className="
                fixed bottom-6 right-6 z-50
                h-16 min-w-20 px-2 rounded-2xl
                bg-white text-black
                flex items-center justify-center
                border-2 shadow-lg
                hover:scale-105 active:scale-95
                transition dark:bg-neutral-900 dark:text-white
            "
        >
            <Plus className="size-8" />
        </button>
    );
}

export default CreatePostButton;
