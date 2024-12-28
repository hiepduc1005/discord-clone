import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname, // Cần thiết để xác định thư mục gốc
});

const eslintConfig = [
  // Kế thừa các quy tắc từ Next.js và TypeScript
  ...compat.extends("next", "next/core-web-vitals", "plugin:@typescript-eslint/recommended"),
  
  // Các quy tắc tùy chỉnh thêm
  {
    files: ["**/*.ts", "**/*.tsx"], // Áp dụng cho file TypeScript
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }], // Cho phép biến không dùng bắt đầu bằng _
      "@typescript-eslint/no-explicit-any": "off", // Tắt cảnh báo khi dùng `any`
      "react-hooks/exhaustive-deps": "warn", // Cảnh báo thiếu dependencies trong `useEffect`
      "react/jsx-key": "error", // Bắt buộc thêm key trong các phần tử lặp
    },
  },
];

export default eslintConfig;
