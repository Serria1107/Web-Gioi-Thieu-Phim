# Kế hoạch và trạng thái triển khai

Tài liệu này mô tả phạm vi đã được duyệt và trạng thái tại lần bàn giao. Đây không phải lịch sử GitHub Projects hay nhật ký sprint hồi tố.

## Phạm vi

Giữ nguyên HTML/CSS/JavaScript thuần theo `.skill/skill.md`; không thêm dependency, không đổi nhánh và không sửa Skill. Tập trung tạo một thư viện phim dùng chung có tìm kiếm, bộ lọc, sắp xếp và phân trang, thay vì tạo nhiều danh sách phim nhỏ không có cùng công cụ xử lý.

## Hạng mục và tiêu chí hoàn thành

| Hạng mục | Trạng thái | Tiêu chí hoàn thành |
|---|---|---|
| Trang semantic và hệ thống giao diện | Hoàn tất | Header, hero, thư viện, dialog và footer hoạt động; có responsive và trạng thái focus |
| Dữ liệu phim | Hoàn tất với giới hạn | Có 24 phim, ID ổn định, poster và đường dẫn nguồn điểm; dữ liệu điểm có ngày kiểm tra |
| Khám phá danh mục | Hoàn tất | Tìm kiếm không dấu, lọc kết hợp, sắp xếp và phân trang dùng chung một pipeline |
| Flip card và chi tiết | Hoàn tất | Lật bằng button, modal có thể đóng bằng nút/Escape/overlay và khôi phục focus |
| Trailer modal | Hoàn tất phần giao diện | Một dialog dùng chung, iframe chỉ tạo khi mở; dữ liệu phim hiện chưa có trailer đã xác minh nên báo trạng thái chưa có |
| Điểm cộng đồng và tổng hợp | Hoàn tất chế độ demo | Điểm 1–10 lưu cục bộ, mỗi trình duyệt một điểm/phim; tính trung bình 50/50 khi đủ nguồn |
| Bình luận phim | Hoàn tất chế độ demo | Lưu theo ID phim tại localStorage; có spoiler, sửa/xóa, sắp xếp, thích/báo cáo cục bộ |
| Giới thiệu chính thức | Chưa có nội dung đã xác minh | Modal không giả định tóm tắt biên soạn là lời giới thiệu của hãng |
| Danh sách yêu thích | Hoàn tất | Thêm/xóa, bộ đếm, lưu `localStorage`, đồng bộ sự kiện storage |
| Kiểm tra trình duyệt | Đã kiểm tra thủ công trong phiên này | Flip, trailer fallback, modal, giới thiệu chưa xác minh, đánh giá/công thức, bình luận an toàn, spoiler, sửa/xóa, mobile và luồng danh mục |
| Backend dùng chung và xác thực | Chưa thực hiện | Cần chọn dịch vụ, thiết lập Auth/kiểm soát truy cập và cấu hình phía máy chủ trước khi nhận dữ liệu người dùng thật |
| Trailer chính thức, giới thiệu phim, backdrop riêng | Chưa có dữ liệu đã xác minh | Chỉ bổ sung sau khi xác minh nguồn phát hành/nội dung và quyền nhúng/sử dụng |
| Kiểm thử tự động và CI | Chưa thực hiện | Cần chọn runner phù hợp sau khi có môi trường Node/toolchain |
| Quy trình GitHub Issues/Projects/PR | Chưa thực hiện | Chỉ tạo khi chủ dự án yêu cầu; không tạo lịch sử giả |

## Kiến trúc đã triển khai

- `index.html`: cấu trúc semantic, controls, trạng thái ban đầu và dialog.
- `css/style.css`: tokens màu/kiểu chữ, glass panels, flip 3D, responsive, reduced motion.
- `js/movies.js`: dữ liệu tĩnh, tách khỏi DOM.
- `js/app.js`: trạng thái ứng dụng và pipeline tìm kiếm → lọc → sắp xếp → phân trang → render.
- `js/community.js`: validation, localStorage demo và phép tính điểm nội bộ/tổng hợp.
- `docs/`: hướng dẫn kiểm thử, AI và thuyết trình.

## Kanban đề xuất

| Cột | Công việc |
|---|---|
| Done trong lần triển khai này | Giao diện; dữ liệu tĩnh; bộ lọc và pagination; flip/modal; favorites; trailer fallback; dashboard điểm; community demo; kiểm tra browser |
| To Do | Xác minh và nhập nguồn trailer/giới thiệu/backdrop; chọn backend/Auth nếu cần dữ liệu người dùng thật; bổ sung test tự động khi có runner |
| Review | Chủ dự án rà soát chính xác dữ liệu, chính sách ảnh và mức độ phù hợp rubric |
| Backlog | Tích hợp API có xác thực phía server nếu cần cập nhật dữ liệu định kỳ; triển khai CI khi repository có quy trình |

Không có commit mới hoặc bản ghi board nào được tạo trong lần triển khai này.
