# Kế hoạch được duyệt — phương án 1

Người dùng chọn “phương án 1” sau kế hoạch khảo sát: dựng lại các file thuộc phạm vi tại `D:\Web-Gioi-Thieu-Phim`, dùng HTML5/CSS/JavaScript thuần, dữ liệu và hình ảnh cục bộ. Không khôi phục toàn bộ bản Git, không sửa Skill, không thêm dependency/backend/build, không tự commit/push/pull hoặc xuất bản.

## Hiện trạng trước triển khai

Thư mục chỉ có `.git` và `.skill/skill.md`. Git có 9 file bị xóa chưa commit; `.skill` chưa được theo dõi. Nhánh main chậm hơn origin/main 5 commit theo trạng thái cục bộ; không fetch để thay đổi trạng thái. Bản HEAD được đọc để tham khảo, không được coi là website hiện đang chạy.

## Các bước thực hiện

1. Đối chiếu Skill và yêu cầu, tra cứu nguồn phim/ảnh/điểm.
2. Tạo lại trang chủ; thêm trang chi tiết theo ID, giao diện sáng/tối và ảnh cục bộ.
3. Xây pipeline dùng chung cho phim, review và bảng nguồn điểm; tìm theo title, lọc AND, A–Z/Z–A, 10/20/50/all.
4. Hoàn thiện flip, URL trực tiếp, trạng thái rỗng/ảnh lỗi, focus và reduced motion.
5. Tách thuật toán điểm, schema review và dự phòng lưu trữ; làm form thêm/sửa/xóa, cập nhật điểm.
6. Kiểm thử bằng trình duyệt, kiểm tra tài nguyên và viết tài liệu có bằng chứng.

## Phạm vi file

Tạo lại `index.html`, `css/style.css`, `js/app.js`, `js/movies.js`, `README.md`, `docs/project-plan.md`, `docs/testing.md`, `docs/ai-workflow.md`.

Thêm `movie.html`, `css/themes.css`, `js/list.js`, `js/scores.js`, `js/storage.js`, `js/theme.js`, `js/movie-detail.js`, `js/reviews.js`, `images/posters/`, `images/backdrops/`, `tests/index.html`, `tests/run-tests.js`, `docs/sources.md`.

`docs/presentation.md` bị xóa từ trước và nằm ngoài phạm vi, tiếp tục giữ trạng thái đó. `.skill/skill.md` giữ nguyên.

## Thiết kế và dữ liệu

Giữ nhận diện Khung Hình, nhấn xanh ngọc trầm; light nền sáng/chữ tối và dark nền tối/chữ sáng. Một hero phim, một thư viện thống nhất; trang chi tiết có form review và danh sách cảm nhận cục bộ. Nút Đăng nhập tĩnh; mọi hành động khác có xử lý thực tế.

Chọn 20 phim có poster xác minh từ Paramount/A24. Chỉ 9 phim có ảnh ngang đã thu thập; các trang còn lại dùng nền trung tính. Điểm Metacritic có thang gốc, nhóm chuyên gia/khán giả, URL và ngày kiểm tra; không dùng tỷ lệ Rotten Tomatoes trong phép tính. Chi tiết nguồn và quyền ảnh nằm ở sources.md.

## Nghiệm thu

Kiểm tra hành vi danh sách, score, CRUD, storage, DOM và responsive 360/768/1024/1440px. Chỉ ghi Đạt khi có bằng chứng; phân biệt kiểm tra tự động qua DOM, kiểm tra ảnh chụp và thao tác thủ công chưa xác minh. Không có bảng chấm điểm riêng được cung cấp; chưa tự chấm 90–100%.
