import { selectIsAuth } from "@/features/auth/authSlice";
import { useSelector } from "react-redux";

export default function ProtectedView({ children }) {
    const isLoggedIn = useSelector(selectIsAuth);
    if (!isLoggedIn) return null;
    return children;
}
