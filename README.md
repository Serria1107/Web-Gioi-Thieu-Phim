# Khung Hình — Một không gian điện ảnh

Website tiếng Việt để khám phá 20 bộ phim đã phát hành, đối chiếu điểm chuyên gia/khán giả và lưu cảm nhận cá nhân. Giao diện điện ảnh có Glass Morphism, hai chế độ sáng/tối, poster lật 3D và trang chi tiết có URL riêng.

## Chạy dự án

1. Mở đúng thư mục `D:\Web-Gioi-Thieu-Phim` trong Visual Studio Code.
2. Dùng extension **Live Server**: chuột phải `index.html` → **Open with Live Server**.
3. Duyệt website qua URL HTTP mà Live Server mở. Giữ nguyên host và cổng để dùng cùng vùng localStorage.

Không cần npm, framework, API key, backend hoặc bước build. Có thể mở HTML trực tiếp để xem giao diện, nhưng nên dùng HTTP để các trang có cùng origin lưu trữ và hoạt động nhất quán giữa trình duyệt. Thư mục này khác đường dẫn bản sao trong Downloads đang mở ở IDE.

## Sử dụng

- Khám phá thư viện: tìm theo tiêu đề (không phân biệt dấu/hoa thường), lọc thể loại/năm/quốc gia, sắp xếp A–Z hoặc Z–A.
- Mọi danh sách dữ liệu dùng các kích thước 10/20/50/Tất cả. Thay điều kiện đưa về trang 1; Xóa bộ lọc giữ tìm kiếm, sắp xếp và kích thước trang.
- Nhấn poster để lật; chọn **Xem chi tiết** để mở `movie.html?id=...`; dùng nút lật lại để về poster. Các nút dùng được với bàn phím.
- Trang chi tiết có thông tin phim, nguồn điểm gốc/ngày kiểm tra và form review. Review có thể sửa, xóa với xác nhận; điểm cập nhật ngay.
- Nút sáng/tối ở bên phải header; lựa chọn lưu với khóa `theme`. Nút **Đăng nhập** hiện là nút tĩnh dành cho tương lai.

## Công nghệ và cấu trúc

HTML5, CSS thuần, JavaScript thuần; toàn bộ CSS/JS external. Icon là ký hiệu hoặc SVG tự viết. Font hệ thống; toàn bộ ảnh phim lưu cục bộ.

```text
index.html                 Trang chủ và danh mục
movie.html                 Trang chi tiết theo ID
css/style.css              Bố cục, responsive, thành phần, flip
css/themes.css             Biến màu light/dark
js/movies.js               Snapshot dữ liệu và nguồn, đóng băng sâu
js/list.js                 Pipeline danh sách và các tiện ích DOM nhỏ
js/scores.js               Chuẩn hóa và tính điểm độc lập
js/storage.js              Review có schema, validation, dự phòng bộ nhớ
js/theme.js                Khởi tạo sớm và chuyển theme
js/app.js                  Trang chủ, bộ lọc và flip card
js/movie-detail.js         Chi tiết, điểm và tra cứu nguồn
js/reviews.js              Form và danh sách review
images/posters/            20 poster thật
images/backdrops/          9 ảnh quảng bá ngang có nguồn
tests/index.html           Bộ kiểm thử trên trình duyệt
tests/run-tests.js         Kiểm thử logic và DOM thực tế
docs/                      Kế hoạch, nguồn, kiểm thử, quy trình AI
.skill/skill.md            Quy tắc dự án, giữ nguyên
```

## Công thức điểm

1. Điểm chất lượng đã xác minh: `giá trị / thang đo × 10`.
2. `C` = trung bình điểm chuyên gia; `A` = trung bình điểm khán giả bên ngoài.
3. `E` = trung bình các nhóm hợp lệ đang có trong `C`, `A`.
4. `W` = trung bình review hợp lệ trong trình duyệt (1–10).
5. Tổng hợp = `(E + W) / 2` khi cả hai có dữ liệu; chỉ có một thì dùng nhóm đó, không có thì “Chưa có đánh giá”.

Giữ độ chính xác trong tính toán, làm tròn một số thập phân khi hiển thị. Dữ liệu thiếu là `null`, không phải 0. Tỷ lệ đánh giá tích cực không được trộn vào điểm chất lượng. Các điểm nguồn là snapshot, không cập nhật trực tiếp. Xem [sổ nguồn](docs/sources.md) và khác biệt thời lượng giữa các nguồn.

## Lưu trữ và giới hạn

Review dùng khóa `khung-hinh:reviews:v1`, gồm phiên bản dữ liệu, ID review, ID phim, tên, tiêu đề, nội dung, điểm và thời gian tạo/cập nhật. Review thuộc trình duyệt và origin hiện tại; không phải điểm của toàn thể người dùng Internet. Đổi thiết bị, origin, xóa dữ liệu trình duyệt hoặc chế độ riêng tư có thể làm mất khả năng truy cập review cũ.

Khi lưu trữ bị chặn hoặc đầy, thay đổi giữ trong bộ nhớ và giao diện báo rõ. Dữ liệu lưu không hợp lệ được giữ nguyên, không ghi đè; review mới chỉ tồn tại trong phiên đó. Không tự nhập lại tài khoản hoặc dữ liệu từ các khóa cũ của bản Git.

Chưa có tài khoản, đồng bộ máy chủ, trailer hoặc cập nhật dữ liệu tự động. Chỉ có backdrop cho phim có nguồn ảnh ngang được xác minh. Tài nguyên ảnh vẫn thuộc hãng/chủ sở hữu; chưa có giấy phép tái phân phối/thương mại riêng. Website không được tự xuất bản trong phiên này.

## Kiểm thử và tài liệu

Mở `tests/index.html` bằng Live Server để chạy kiểm thử logic, dữ liệu, tài nguyên và DOM qua iframe. Nên dùng hồ sơ trình duyệt kiểm thử riêng; bộ kiểm thử tạo review tạm và khôi phục bản lưu trước đó khi chạy xong. Không dùng dữ liệu tạm làm dữ liệu phim thật.

- [Kế hoạch được duyệt](docs/project-plan.md)
- [Kết quả kiểm thử và giới hạn xác minh](docs/testing.md)
- [Nguồn phim, ảnh và điểm](docs/sources.md)
- [Nhật ký phối hợp AI có thật](docs/ai-workflow.md)

Các kiểm tra gồm chuẩn hóa tiếng Việt, lọc AND, sort ổn định/số tự nhiên, 37 bản ghi tạm, thiếu nguồn điểm, review CRUD, dữ liệu lỗi/quota, nội dung không tin cậy, URL sai và responsive. Không tự nhận mức điểm của bài tập khi chưa có bảng chấm chính thức.
