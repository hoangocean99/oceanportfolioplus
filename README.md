# 🌊 Ocean Portfolio Plus

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

Một dự án Portfolio cá nhân đỉnh cao, kết hợp giữa trải nghiệm **3D sống động** và các tính năng tương tác cộng đồng thời gian thực. Được thiết kế với tâm huyết để mang lại ấn tượng mạnh mẽ ngay từ cái nhìn đầu tiên.

---

## ✨ Tính năng nổi bật

- **🎨 Thiết kế Premium**: Giao diện hiện đại với hiệu ứng Glassmorphism, màu sắc hài hòa và hỗ trợ hoàn hảo cả Chế độ Sáng/Tối (Light/Dark Mode).
- **🌐 Trải nghiệm 3D Hoành tráng**: Tích hợp các mô hình 3D tương tác sử dụng `@react-three/fiber` và `three.js`, tạo không gian sống động.
- **💬 Community Hub**: Phòng chat cộng đồng thời gian thực được hỗ trợ bởi Firebase, cho phép mọi người kết nối.
- **🤖 AI Chatbot**: Chatbot hỗ trợ thông minh luôn sẵn sàng trả lời các câu hỏi của khách truy cập.
- **🌀 Hiệu ứng mượt mà**: Sử dụng Framer Motion, GSAP và Lenis cho trải nghiệm cuộn và chuyển cảnh mượt mà, không giật lag.
- **📊 Biểu đồ trực quan**: Hiển thị kỹ năng và thông tin bằng Recharts một cách chuyên nghiệp.

## 🛠️ Công nghệ sử dụng

### Frontend
- **Thư viện chính**: React 18
- **Tạo kiểu (Styling)**: Tailwind CSS + `tailwindcss-animate`
- **Chuyển động (Animations)**: Framer Motion + GSAP
- **Xử lý 3D**: Three.js + React Three Fiber + Drei
- **Thành phần UI**: Radix UI (Đảm bảo tính tiếp cận và linh hoạt)
- **Icons**: Lucide React + FontAwesome

### Dịch vụ & Công cụ khác
- **Backend as a Service**: Firebase (Authentication & Firestore cho Chat Hub)
- **Quản lý trạng thái & Form**: React Hook Form + Zod
- **Cuộn mượt (Smooth Scroll)**: Lenis
- **Thư viện Toasts**: Sonner

---

## 🚀 Cài đặt và Chạy thử

Để chạy dự án này trên máy của bạn, hãy làm theo các bước sau:

### 📋 Yêu cầu hệ thống
- Node.js (Phiên bản 16 trở lên)
- npm hoặc yarn

### 🔧 Các bước thực hiện

1. **Clone repository:**
   ```bash
   git clone https://github.com/HoangOcean99/OceanPortfolioPlus.git
   cd OceanPortfolioPlus
   ```

2. **Cài đặt các thư viện phụ thuộc:**
   ```bash
   npm install
   # Hoặc nếu bạn dùng yarn
   yarn install
   ```

3. **Cấu hình biến môi trường:**
   Tạo tệp `.env` ở thư mục gốc (nếu chưa có) và điền các thông tin cấu hình Firebase của bạn (tham khảo tệp `.env` hiện tại).

4. **Chạy ứng dụng ở chế độ phát triển:**
   ```bash
   npm start
   # Hoặc
   yarn start
   ```
   Ứng dụng sẽ chạy tại [http://localhost:3000](http://localhost:3000).

5. **Xây dựng bản production:**
   ```bash
   npm run build
   # Hoặc
   yarn build
   ```

---

## 📸 Ảnh chụp màn hình

> [!TIP]
> Hãy thay thế các đường link dưới đây bằng ảnh chụp màn hình thực tế từ dự án của bạn để tăng tính thuyết phục!

| Giao diện chính (Hero Section) | Phòng Chat Cộng Đồng (Community Chat) |
| :---: | :---: |
| ![Hero](https://via.placeholder.com/600x350?text=Hero+Section+Screenshot) | ![Chat](https://via.placeholder.com/600x350?text=Community+Chat+Screenshot) |

---

## 📄 Giấy phép

Dự án này được tạo bởi **Hoang Ocean**. Bạn có thể tự do sử dụng và tùy chỉnh cho mục đích cá nhân.

---
Thực hiện với ❤️ bởi [Hoang Ocean](https://github.com/HoangOcean99)
