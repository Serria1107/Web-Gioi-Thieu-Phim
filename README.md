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
- Danh sách yêu thích lưu trong `localStorage` và đồng bộ giữa các tab.
- Gợi ý lối tắt tới phim được chuyên gia/khán giả đánh giá cao, phim kinh điển và phim phát hành gần đây.
- Responsive, trạng thái rỗng, skeleton ban đầu và placeholder khi poster không tải được.
## Chạy dự án

Mở `index.html` trực tiếp bằng Chrome. Trang đăng nhập, tạo tài khoản và trang phim dùng chung một tệp HTML; khách chưa đăng nhập sẽ thấy màn hình đăng nhập. Các script cũng hỗ trợ chạy từ `file://`.

Để chạy qua máy chủ HTTP cục bộ (khuyến nghị khi phát triển):

1. Mở thư mục dự án trong Visual Studio Code.
2. Cài và bật extension **Live Server** nếu chưa có.
3. Nhấn chuột phải vào `index.html` → **Open with Live Server**.

Không cần `npm install`, API key hoặc bước build.

## Cấu trúc

```text
.
├── .skill/skill.md       # Quy tắc dự án hiện có; không chỉnh sửa
├── css/style.css         # Giao diện, responsive, hiệu ứng và reduced motion
├── js/app.js             # Render, tìm kiếm/lọc/sắp xếp/phân trang và tương tác
├── js/movies.js          # Dữ liệu phim và nguồn đánh giá/poster
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
- Poster được tham chiếu từ ảnh Rotten Tomatoes/Flixster. Ảnh không được tải xuống hoặc lưu trong repository; hãy kiểm tra điều khoản sử dụng và quyền sử dụng hình ảnh trước khi xuất bản hoặc sử dụng thương mại. Rotten Tomatoes/Flixster và các chủ sở hữu phim giữ quyền đối với hình ảnh.
- Website hiện dùng poster phim làm ảnh nền xử lý cho hero/modal khi không có backdrop riêng đã xác minh; chưa tích hợp trailer. Đây là giới hạn đã biết, không được coi là backdrop/trailer độc lập.
- Khi không có điểm hợp lệ trong dữ liệu, giao diện hiển thị “Chưa có dữ liệu”; không suy diễn hoặc tự tạo điểm.

## Kiến trúc

`js/movies.js` là dữ liệu độc lập với giao diện. `js/app.js` áp dụng chuỗi xử lý **dữ liệu gốc → tìm kiếm → lọc → sắp xếp → phân trang → render**, dùng event delegation cho card được render động. Yêu thích dùng khóa `khung-hinh:favorites` trong `localStorage`.

## Kiểm tra và giới hạn

Các kiểm tra thủ công đã thực hiện và giới hạn môi trường được ghi trong [docs/testing.md](./docs/testing.md). Kế hoạch và các hạng mục còn lại nằm trong [docs/project-plan.md](./docs/project-plan.md). Ghi nhận sử dụng AI trong phiên này: [docs/ai-workflow.md](./docs/ai-workflow.md). Nội dung demo/pitch: [docs/presentation.md](./docs/presentation.md).

Không có commit mới trong lần bàn giao này. Không khẳng định đã tạo GitHub Project, CI pipeline, Lighthouse report hoặc kiểm thử tự động.
