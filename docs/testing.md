# Kiểm tra

## Kiểm tra thủ công đã chạy

Mở `index.html` trong browser tích hợp VS Code ở chế độ `file://` và thử các thao tác sau:

| Kiểm tra | Kết quả |
|---|---|
| Render danh mục | 24 phim hiển thị, mặc định 10 phim/trang |
| Cấu trúc dữ liệu | 24 ID duy nhất; trường bắt buộc có mặt; điểm nằm trong 0–100 |
| Chọn “Tất cả” | Hiển thị đủ 24 phim |
| Tìm kiếm “shAwShank” | Lọc còn đúng 1 phim |
| Lọc thể loại Sci-Fi | Có 6 kết quả trong bộ dữ liệu hiện tại |
| Phân trang 10 phim | 3 trang; nút Next chuyển tới trang 2 |
| Sắp xếp A–Z | Phim đầu danh sách là *Arrival* |
| Điểm chuyên gia ≥90 và khán giả ≥90 | Chỉ các phim đạt cả hai ngưỡng còn lại |
| Từ khóa không có kết quả | Hiện empty state |
| Flip card | Click lật sang mặt sau; control “Quay lại” có trong mặt sau |
| Modal | Mở/đóng được; nút, Escape và click ngoài modal đóng đúng; focus trả về nút mở |
| Yêu thích | Bộ đếm và bộ lọc yêu thích phản ánh thay đổi; dữ liệu thử đã được dọn khỏi browser |
| JavaScript runtime | Không ghi nhận `pageerror` trong các lượt thao tác trên |
| Hình ảnh | 25 phần tử ảnh tải thành công trong lượt kiểm tra danh mục đầy đủ; không có ảnh lỗi |
| Responsive 320/390/768/1280px | Không có tràn ngang; lưới lần lượt chuyển sang bố cục 2/3/5 cột theo breakpoint |
| Card flip | Mặt không hiển thị được gắn `inert` và `aria-hidden`; không có mặt card tràn nội dung ở desktop/mobile |
| Dialog trên mobile | Chiều rộng nằm trong viewport; body được khóa khi modal mở |

Đây là kiểm tra thủ công trong browser, không phải bộ test hồi quy có thể chạy tự động.

## Đồng bộ trailer trong lần cập nhật này

- Mở trang sau khi thêm manifest trailer trống: danh mục vẫn render đủ 24 phim; nút trailer mở dialog trạng thái `needs_review`, không tạo iframe.
- Nhấn Escape đóng dialog và gỡ nội dung iframe khỏi DOM.
- Tìm “shawshank” với cỡ trang “Tất cả” vẫn trả về đúng một phim; không thấy lỗi JavaScript trong lượt browser này.
- Chưa chạy `scripts/sync-trailers.js`: Node.js/npm và API credentials không có trong môi trường hiện tại. Vì vậy chưa truy vấn TMDB/YouTube, chưa ghi nhận trailer nào là đã xác minh, và chưa tạo báo cáo kết quả theo từng phim. `js/trailer-data.js` hiện rỗng có chủ ý; các phim hiện tại không được giả định là đã tìm kiếm hoặc xác minh.

## Kiểm tra thủ công bổ sung trong phiên cập nhật

- Đánh giá demo: chọn điểm, cập nhật cùng một bản ghi, xác nhận không tạo đánh giá trùng; ví dụ 90% bên ngoài và 8/10 nội bộ cho 8.5/10. Dữ liệu thiếu không tạo điểm tổng hợp.
- Bình luận demo: gửi, sửa, xóa, tìm kiếm, lọc spoiler, sắp xếp, phân trang 10 mục, thích/báo cáo; xác nhận nội dung HTML hiển thị dạng văn bản và spoiler được che mặc định.
- Tải lại cùng trình duyệt để xác nhận dữ liệu localStorage còn; xác nhận bình luận chỉ xuất hiện đúng phim. Dữ liệu thử đã được khôi phục sau kiểm tra.
- Trailer: card và Movie Detail dùng chung dialog; Escape đóng được. Vì không có URL trailer đã xác minh nên giao diện báo chưa có và không tạo iframe.
- Movie Detail: khi thiếu lời giới thiệu/nguồn đã xác minh, giao diện không gắn nhãn nội dung biên soạn là giới thiệu chính thức.
- Responsive: không phát hiện tràn ngang ở 320, 390, 600, 768 và 1280 px; browser không ghi nhận lỗi JavaScript runtime trong lượt kiểm tra.

## Giới hạn môi trường

Không có `python`, `node` hoặc `npm` trên PATH nên không thể chạy `python -m http.server`, `node --check`, npm scripts hoặc test runner. Vì vậy browser được mở trực tiếp từ file; chưa xác minh bằng Live Server trên máy này. Dự án chưa khai báo dependency hoặc test runner; `package.json` chỉ cung cấp lệnh chạy script đồng bộ.

Chưa chạy Lighthouse, kiểm thử screen reader thực tế, audit accessibility tự động, GitHub Actions hoặc kiểm thử ở nhiều trình duyệt vật lý. Screenshot chỉ được dùng để xem UI trong phiên, không lưu làm deliverable.

## Cần kiểm tra lại khi cập nhật

- Mở bằng Live Server ở desktop, tablet và mobile.
- Xác minh lại URL poster, nội dung dữ liệu và điểm Rotten Tomatoes theo link tại [js/movies.js](../js/movies.js); điểm là snapshot và có thể thay đổi.
- Kiểm tra chính sách quyền sử dụng poster trước khi public/commercial.
- Bổ sung test tự động cho accent-insensitive search, kết hợp filters, sorting null-last, pagination và storage lỗi khi dự án có toolchain phù hợp.
