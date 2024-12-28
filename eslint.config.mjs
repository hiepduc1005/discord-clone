import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname, // Xác định thư mục gốc
});

const eslintConfig = [
  // Kế thừa các quy tắc từ Next.js và TypeScript
  ...compat.extends(
    "next", // Các quy tắc cơ bản của Next.js
    "next/core-web-vitals", // Quy tắc cho Web Vitals trong Next.js
    "plugin:@typescript-eslint/recommended" // Quy tắc TypeScript
  ),

  // Các quy tắc tùy chỉnh cho tệp TypeScript
  {
    files: ["**/*.ts", "**/*.tsx"], // Áp dụng cho các file TypeScript và TSX
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn", 
        { 
          argsIgnorePattern: "^_" // Bỏ qua các biến không sử dụng bắt đầu bằng dấu _
        }
      ],
      "@typescript-eslint/no-explicit-any": "off", // Tắt cảnh báo khi dùng `any`
      "@typescript-eslint/no-unused-expressions": "off", // Tắt cảnh báo về biểu thức không sử dụng
      "react-hooks/exhaustive-deps": "warn", // Cảnh báo thiếu dependencies trong useEffect
      "react/jsx-key": "off", // Tắt cảnh báo về thiếu prop `key` trong các phần tử lặp
    },
  },
];

export default eslintConfig;
