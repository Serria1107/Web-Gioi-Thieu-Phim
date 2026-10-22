# Nội dung trình bày

## Pitch ngắn

**Khung Hình** là một website tiếng Việt giúp người xem khám phá phim qua poster, thông tin cơ bản và hai góc nhìn đánh giá của Rotten Tomatoes. Thay vì chỉ trưng bày giao diện, danh mục hỗ trợ tìm kiếm không dấu, lọc nhiều tiêu chí, sắp xếp, phân trang và danh sách yêu thích có lưu trữ.

## Kịch bản demo

1. Giới thiệu hero và điều hướng phim nổi bật.
2. Chọn lối tắt “phim kinh điển” hoặc “được giới phê bình yêu thích” để xem catalog được lọc/sắp xếp.
3. Tìm một phim bằng tên không dấu; kết hợp thể loại, năm và ngưỡng hai loại điểm.
4. Đổi thứ tự sắp xếp và số phim/trang; chuyển qua các trang kết quả.
5. Lật một poster, xem mô tả mặt sau, mở modal và đóng bằng Escape.
6. Thêm phim vào yêu thích, bật bộ lọc yêu thích và tải lại để trình bày lưu trữ.

## Kiến trúc và quyết định

- HTML5 semantic; CSS external với dark minimalism, accent ấm, glass panels, flip 3D và media queries.
- `movies.js` giữ dữ liệu; `app.js` xử lý DOM và trạng thái.
- Thứ tự pipeline: dữ liệu gốc → tìm kiếm chuẩn hóa dấu → lọc → sort → paginate → render.
- Event delegation xử lý các controls được tạo động; `localStorage` lưu ID yêu thích.
- Poster được hiển thị `object-fit: contain` trong card để không cắt artwork; lỗi tải ảnh hiển thị tên phim thay vì poster khác.
- Rating source là Rotten Tomatoes; ảnh dùng tham chiếu Rotten Tomatoes/Flixster. Dữ liệu là snapshot tĩnh, không phải feed live.

## Đối chiếu rubric và bằng chứng

| Tiêu chí | Bằng chứng hiện tại | Giới hạn cần nói rõ |
|---|---|---|
| UI/UX | Dark responsive UI, hero carousel, card flip, modal, focus/reduced motion | Chưa có screenshot/Lighthouse; modal dùng poster làm nền thay backdrop riêng |
| JavaScript/DOM | Search/filter/sort/pagination, event delegation, favorites, related suggestion | Thử thủ công, chưa có unit/integration test |
| Logic dữ liệu | 24 phim, ID ổn định, hai nguồn điểm tách biệt và link Rotten Tomatoes | Dữ liệu tĩnh, nguồn/điểm cần rà soát định kỳ |
| Agile/Git | Có phạm vi và Kanban đề xuất trong `project-plan.md` | Chỉ có commit đầu tiên trong repository; không tạo commit, issue, board hoặc PR giả |
| Vibe Coding | Phiên này có xác nhận kế hoạch, đánh giá đầu ra và sửa lỗi dựa trên kiểm tra | Không tuyên bố là nhật ký các phiên phát triển khác |
| Pitching | Có pitch, demo flow và câu hỏi gợi ý dưới đây | Demo thực tế cần chạy Live Server trên máy trình bày |

## Câu hỏi có thể được đặt ra

**Điểm được cập nhật tự động không?**  
Không. Đây là snapshot được kiểm tra ngày 20/10/2026. Mỗi phim có link nguồn để người xem kiểm chứng; chưa tích hợp API và không lưu API key trong frontend.

**Tại sao không có backdrop hoặc trailer riêng?**  
Chưa có nguồn backdrop/trailer được xác minh và cấu hình quyền sử dụng cho dự án. Hero/modal hiện dùng cùng poster chính thức làm lớp nền đồ họa; không tuyên bố đây là backdrop riêng. Đây là hạng mục mở rộng.

**Vì sao dùng dữ liệu cục bộ?**  
Quy mô danh mục nhỏ, dữ liệu có cấu trúc ổn định và không cần khóa API. Cách này cho phép chạy tĩnh; đổi lại dữ liệu và rating cần cập nhật thủ công.

**Tìm kiếm tiếng Việt không dấu hoạt động ra sao?**  
Chuẩn hóa chữ thường, tách dấu Unicode, đổi `đ` thành `d`, rồi so sánh cả tên hiển thị và tên gốc.

**Nếu poster hoặc localStorage lỗi thì sao?**  
Ảnh lỗi chuyển sang placeholder tên phim; lỗi đọc/ghi storage được ghi ra console và thông báo cho người dùng, trong khi favorites vẫn hoạt động trong bộ nhớ của phiên.

**Đã có quy trình Agile/GitHub thật chưa?**  
Chưa có board, issue, pull request hoặc commit mới được tạo trong lần triển khai này. Tài liệu chỉ mô tả trạng thái và Kanban đề xuất, không làm giả lịch sử.
