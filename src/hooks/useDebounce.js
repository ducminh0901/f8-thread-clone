import { useState, useEffect } from "react";

function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Thiết lập một timer để cập nhật debouncedValue sau khoảng delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup function: Xóa timer nếu value thay đổi (người dùng tiếp tục gõ)
        // hoặc khi component bị unmount
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export default useDebounce;
