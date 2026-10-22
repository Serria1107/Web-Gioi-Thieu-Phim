# Khung Hình — Khám phá điện ảnh

Website tĩnh giới thiệu và khám phá phim, được xây dựng bằng HTML5, CSS3 và JavaScript thuần. Giao diện tiếng Việt, ưu tiên khả năng đọc poster, khám phá dữ liệu và truy cập bằng bàn phím.

## Tính năng

- Hero carousel có điều hướng, chấm chỉ báo, tạm dừng tự động và hỗ trợ giảm chuyển động.
- Thư viện 24 phim có thật với poster, thông tin phim, mô tả ngắn và điểm Rotten Tomatoes.
- Tìm kiếm theo tên phim/tên gốc, không phân biệt hoa thường và hỗ trợ tiếng Việt không dấu.
- Lọc kết hợp theo thể loại, năm, thời kỳ, điểm chuyên gia, điểm khán giả và yêu thích.
- Sắp xếp theo tên A–Z/Z–A, năm phát hành hoặc điểm đánh giá.
- Phân trang 10/20/50/tất cả; trang tự điều chỉnh khi kết quả thay đổi.
- Movie card lật 3D bằng click hoặc bàn phím; modal chi tiết đóng bằng nút, Escape hoặc click overlay.
- Movie Detail có dashboard điểm, đánh giá 1–10, bình luận theo phim, spoiler, tìm kiếm/lọc/sắp xếp/phân trang, thích và báo cáo trong chế độ demo cục bộ.
- Nút trailer dùng một dialog duy nhất; chỉ tạo YouTube embed khi dữ liệu trailer đã được xác minh.
- Danh sách yêu thích lưu trong `localStorage` và đồng bộ giữa các tab.
- Gợi ý lối tắt tới phim được chuyên gia/khán giả đánh giá cao, phim kinh điển và phim phát hành gần đây.
- Responsive, trạng thái rỗng, skeleton ban đầu và placeholder khi poster không tải được.

## Chạy dự án

Các JavaScript module được phục vụ tốt nhất qua máy chủ HTTP cục bộ:

1. Mở thư mục dự án trong Visual Studio Code.
2. Cài và bật extension **Live Server** nếu chưa có.
3. Nhấn chuột phải vào `index.html` → **Open with Live Server**.

Không cần `npm install`, API key hoặc bước build. Dự án cũng đã được mở thử bằng browser ở URL `file://`, nhưng Live Server là cách chạy được khuyến nghị để tránh khác biệt về chính sách module giữa các trình duyệt.

## Cấu trúc

```text
.
├── .skill/skill.md       # Quy tắc dự án hiện có; không chỉnh sửa
├── css/style.css         # Giao diện, responsive, hiệu ứng và reduced motion
├── js/app.js             # Render, tìm kiếm/lọc/sắp xếp/phân trang và tương tác
├── js/movies.js          # Dữ liệu phim và nguồn đánh giá/poster
├── js/community.js       # Lưu cục bộ và tính toán đánh giá/bình luận demo
├── docs/
│   ├── project-plan.md
│   ├── testing.md
│   ├── ai-workflow.md
│   └── presentation.md
├── index.html
└── README.md
```

## Dữ liệu và nguồn

- Phim là các tác phẩm đã phát hành; mô tả, diễn viên, thể loại, thời lượng và đạo diễn được lưu cục bộ trong [js/movies.js](./js/movies.js).
- Điểm Tomatometer và Popcornmeter cùng liên kết nguồn Rotten Tomatoes được kiểm tra ngày **20/10/2026**. Đây là snapshot nhập tĩnh, không phải dữ liệu cập nhật trực tiếp; điểm có thể thay đổi theo thời gian.
- Điểm cộng đồng và bình luận dùng khóa `khung-hinh:community:v1` trong `localStorage`. Đây chỉ là bản demo trên một trình duyệt: không có tài khoản, xác minh danh tính, cơ sở dữ liệu dùng chung, kiểm duyệt từ máy chủ hoặc đảm bảo quyền sở hữu. Thích/báo cáo cũng chỉ là dữ liệu cục bộ; không được gửi cho quản trị viên. Không dùng chế độ này để nhận nội dung người dùng trên môi trường sản xuất.
- Mỗi trình duyệt chỉ lưu một điểm hiện hành cho mỗi phim. Điểm tổng hợp được tính 50/50 giữa Popcornmeter đã quy đổi từ phần trăm sang thang 10 và điểm trung bình cục bộ; không hiện điểm tổng hợp khi thiếu một trong hai phía. Đây là chỉ số riêng của website, không phải điểm chính thức của Rotten Tomatoes.
- Poster được tham chiếu từ ảnh Rotten Tomatoes/Flixster. Ảnh không được tải xuống hoặc lưu trong repository; hãy kiểm tra điều khoản sử dụng và quyền sử dụng hình ảnh trước khi xuất bản hoặc sử dụng thương mại. Rotten Tomatoes/Flixster và các chủ sở hữu phim giữ quyền đối với hình ảnh.
- Website hiện dùng poster phim làm ảnh nền xử lý cho hero/modal khi không có backdrop riêng đã xác minh. Dữ liệu hiện tại chưa có trailer chính thức hoặc lời giới thiệu của hãng đã được xác minh cho các phim; giao diện sẽ nêu rõ trạng thái chưa có thay vì dùng nguồn không rõ ràng.
- Khi không có điểm hợp lệ trong dữ liệu, giao diện hiển thị “Chưa có dữ liệu”; không suy diễn hoặc tự tạo điểm.

## Kiến trúc

`js/movies.js` là dữ liệu độc lập với giao diện. `js/app.js` áp dụng chuỗi xử lý **dữ liệu gốc → tìm kiếm → lọc → sắp xếp → phân trang → render**, dùng event delegation cho card được render động. Yêu thích dùng khóa `khung-hinh:favorites`; đánh giá/bình luận demo dùng `js/community.js`.

## Kiểm tra và giới hạn

Các kiểm tra thủ công đã thực hiện và giới hạn môi trường được ghi trong [docs/testing.md](./docs/testing.md). Kế hoạch và các hạng mục còn lại nằm trong [docs/project-plan.md](./docs/project-plan.md). Ghi nhận sử dụng AI trong phiên này: [docs/ai-workflow.md](./docs/ai-workflow.md). Nội dung demo/pitch: [docs/presentation.md](./docs/presentation.md).

Không có commit mới trong lần bàn giao này. Không khẳng định đã tạo GitHub Project, CI pipeline, Lighthouse report hoặc kiểm thử tự động.
