import { useSelector, useDispatch } from "react-redux";
import { selectIsAuth } from "@/features/auth/authSlice";
import { openAuthDialog } from "@/features/ui/uiSlice";

export const useRequireAuth = () => {
    const isLoggedIn = useSelector(selectIsAuth);
    const dispatch = useDispatch();

    const requireAuth = (callback, type = "default") => {
        if (!isLoggedIn) {
            dispatch(openAuthDialog({ type }));
            return;
        }
        callback();
    };

    return requireAuth;
};
