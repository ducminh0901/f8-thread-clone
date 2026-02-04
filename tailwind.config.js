/** @type {import('tailwindcss').Config} */
export default {
    // 1. Kích hoạt Dark Mode bằng class
    darkMode: "class",

    // 2. Chỉ định các file chứa class Tailwind để build CSS
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}", // Quét tất cả file trong thư mục src
    ],

    theme: {
        extend: {
            // Bạn có thể thêm các màu sắc tùy chỉnh ở đây nếu muốn
        },
    },
    plugins: [],
};
