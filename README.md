# Khung Hình — Một không gian điện ảnh

Website tiếng Việt để khám phá 20 bộ phim đã phát hành, đối chiếu điểm chuyên gia/khán giả, quản lý tài khoản demo, lưu Watchlist và viết cảm nhận theo tài khoản. Giao diện điện ảnh có Glass Morphism, hai chế độ sáng/tối, poster lật 3D và trang chi tiết có URL riêng.

## Chạy dự án

1. Mở đúng thư mục `D:\Web-Gioi-Thieu-Phim` trong Visual Studio Code.
2. Dùng extension **Live Server**: chuột phải `index.html` → **Open with Live Server**.
3. Duyệt website qua URL HTTP mà Live Server mở. Giữ nguyên host và cổng để dùng cùng vùng localStorage và bật Web Crypto.

Không cần npm, framework, API key, backend hoặc bước build. Mở qua HTTP localhost để tài khoản dùng Web Crypto và các trang chia sẻ cùng vùng lưu trữ. Mở trực tiếp bằng `file://` chỉ phù hợp để xem giao diện.

## Sử dụng

- Khám phá thư viện: tìm theo tiêu đề (không phân biệt dấu/hoa thường), lọc thể loại/năm/quốc gia, sắp xếp A–Z hoặc Z–A.
- Mọi danh sách dữ liệu dùng các kích thước 10/20/50/Tất cả. Thay điều kiện đưa về trang 1; Xóa bộ lọc giữ tìm kiếm, sắp xếp và kích thước trang.
- Nhấn poster để lật; chọn **Xem chi tiết** để mở `movie.html?id=...`; dùng nút lật lại để về poster. Các nút dùng được với bàn phím.
- Tạo tài khoản demo bằng username 3–32 ký tự (không dùng `@`), email và mật khẩu 10–128 ký tự có chữ hoa, chữ thường và chữ số; đăng nhập bằng username/email. Có thể ghi nhớ phiên, cập nhật hồ sơ và avatar, đổi mật khẩu và đăng xuất. Avatar mặc định dùng chữ cái đầu của tên.
- Trang **Watchlist** có tìm kiếm title, lọc thể loại/năm/điểm, sắp xếp, phân trang và xóa phim. Mỗi tài khoản giữ danh sách riêng theo ID phim; poster và tên phim mở đúng `movie.html?id=...`. Điều kiện tra cứu được giữ theo tài khoản trong cùng tab khi quay lại trang.
- Chọn **Hồ sơ của tôi** để mở `profile.html`: avatar, username, tên hiển thị, ngày tham gia, giới thiệu và thống kê thực (Watchlist, số review, trung bình sao, số phim đã đánh giá). Các tab Tổng quan/Watchlist/Đánh giá có công cụ tìm, lọc, sắp xếp và phân trang. Tổng quan lấy tối đa 10 hoạt động mới nhất từ Watchlist hiện tại và review, sau đó sắp xếp A–Z theo mặc định của skill; có lựa chọn Mới nhất.
- **Chỉnh sửa thông tin** mở `profile-edit.html`. Có thể đổi tên hiển thị, username, email, giới thiệu và avatar. Chỉ lưu khi bấm Lưu thay đổi; Hủy bỏ bản nháp và trở về hồ sơ. Avatar nhận PNG/JPEG/WebP tối đa 2 MB, tối đa 4096 × 4096 pixel, được thu nhỏ tới 256px và giới hạn chuỗi lưu 100.000 ký tự. Ảnh chỉ lưu trong dữ liệu trình duyệt, không được tải lên máy chủ hoặc nhúng vào source code.
- Nút Chỉnh sửa review trong hồ sơ mở lại form tại `movie.html?id=...&review=...#reviews-section`. Xóa có xác nhận và cập nhật thống kê/điểm. Tên hiển thị và avatar trên review lấy từ tài khoản qua ID, không phụ thuộc username có thể đổi.
- Trang chi tiết có thông tin phim, nguồn điểm gốc/ngày kiểm tra và form review. Review mới chỉ được tạo khi đăng nhập; chủ sở hữu được sửa/xóa. Review cũ không có chủ tài khoản vẫn đọc được nhưng chỉ ở chế độ chỉ đọc.
- Điểm review nhập theo 0,5–5 sao và được quy đổi thành 1–10 trước khi tính, vì vậy công thức hiện có không đổi.
- Nút sáng/tối ở bên phải header; lựa chọn lưu với khóa `theme`.

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
js/auth.js                 Tài khoản demo, phiên cục bộ, hồ sơ và Watchlist
js/avatar.js               Kiểm tra/thu nhỏ avatar và dựng avatar dùng chung
js/profile.js              Trang hồ sơ, thống kê, tab, danh sách và xóa review
js/profile-edit.js         Form chỉnh sửa, preview ảnh, validation, Lưu/Hủy
js/watchlist.js            Tìm kiếm/lọc/sort/phân trang Watchlist
js/theme.js                Khởi tạo sớm và chuyển theme
js/app.js                  Trang chủ, bộ lọc và flip card
js/movie-detail.js         Chi tiết, điểm và tra cứu nguồn
js/reviews.js              Form và danh sách review
watchlist.html             Trang Watchlist riêng
profile.html               Hồ sơ riêng của tài khoản đang đăng nhập
profile-edit.html          Trang chỉnh sửa thông tin
css/account.css            Bố cục profile và form chỉnh sửa responsive
images/posters/            20 poster thật
images/backdrops/          9 ảnh quảng bá ngang có nguồn
tests/index.html           Bộ kiểm thử trên trình duyệt
tests/run-tests.js         Kiểm thử logic và DOM thực tế
docs/                      Kế hoạch, nguồn, kiểm thử, quy trình AI
skill.md                   Quy tắc dự án hiện tại, giữ nguyên
```

## Công thức điểm

1. Điểm chất lượng đã xác minh: `giá trị / thang đo × 10`.
2. `C` = trung bình điểm chuyên gia; `A` = trung bình điểm khán giả bên ngoài.
3. `E` = trung bình các nhóm hợp lệ đang có trong `C`, `A`.
4. `W` = trung bình review hợp lệ trong trình duyệt (1–10).
5. Tổng hợp = `(E + W) / 2` khi cả hai có dữ liệu; chỉ có một thì dùng nhóm đó, không có thì “Chưa có đánh giá”.

Giữ độ chính xác trong tính toán, làm tròn một số thập phân khi hiển thị. Dữ liệu thiếu là `null`, không phải 0. Tỷ lệ đánh giá tích cực không được trộn vào điểm chất lượng. Các điểm nguồn là snapshot, không cập nhật trực tiếp. Xem [sổ nguồn](docs/sources.md) và khác biệt thời lượng giữa các nguồn.

## Lưu trữ và giới hạn

Tài khoản dùng `khung-hinh:accounts:v1`; phiên ghi nhớ dùng `khung-hinh:session:v1` trong localStorage, còn phiên không ghi nhớ dùng sessionStorage. Mật khẩu không lưu dạng rõ: demo dùng PBKDF2 (Web Crypto API) với salt ngẫu nhiên. **Đây vẫn không phải xác thực an toàn cho production**: dữ liệu và hash ở client có thể bị đọc/sửa, không có xác minh email hay đồng bộ giữa thiết bị. Không dùng cùng mật khẩu thật của bạn.

Phiên tab có thời hạn 12 giờ; phiên ghi nhớ 30 ngày. Hết hạn chuyển về khách và thao tác ghi yêu cầu đăng nhập lại. Đăng xuất cập nhật dấu thời gian `khung-hinh:logout:v1` để vô hiệu hóa các phiên cũ cùng origin, kể cả phiên tab. Phiên cũ chưa có thời hạn cần đăng nhập lại sau nâng cấp; tài khoản, Watchlist và review được giữ nguyên.

Đổi mật khẩu phải xác minh mật khẩu hiện tại, đáp ứng chính sách, xác nhận khớp và khác mật khẩu cũ. Thành công tăng `credentialVersion` của tài khoản và yêu cầu đăng nhập lại; token trước đó bị từ chối ở các tab, kể cả khi được chép lại vào storage. Đây vẫn là kiểm soát demo phía client. Trang Profile/Edit/Watchlist không hiển thị dữ liệu riêng khi là khách và xóa các giá trị đã dựng khỏi giao diện khi phiên kết thúc.

Các khóa account/review/session hiện tại được giữ nguyên. Trường hồ sơ mới là tùy chọn trên bản lưu cũ: `displayName` mặc định bằng username, `bio`/`avatarImage` mặc định rỗng, `profileVersion`/`credentialVersion` mặc định 0. Không tự ghi lại toàn bộ bản lưu khi đọc. Sửa hồ sơ giữ ID và các quan hệ cũ; `profileVersion` ngăn form cũ ghi đè bản sửa mới từ tab khác. Email mới chỉ phục vụ đăng nhập demo, chưa được xác minh.

Watchlist lưu cặp movie ID/ngày thêm bên trong từng tài khoản; thông tin phim vẫn lấy từ danh mục gốc. Review dùng `khung-hinh:reviews:v1`, gồm ID review, ID phim, tài khoản sở hữu (nếu review mới), tên hiển thị, nội dung, điểm 1–10 và thời gian. Review chỉ lưu tại origin trình duyệt này; không phải đánh giá Internet công khai. Review cũ không có owner ID được giữ nguyên, hiển thị chỉ đọc và vẫn tham gia công thức điểm. Đổi thiết bị/origin, xóa dữ liệu trình duyệt hoặc chế độ riêng tư có thể làm mất quyền truy cập dữ liệu.

Giao diện **Quên mật khẩu** chỉ giải thích giới hạn của bản demo. Website không gửi email và không cho đặt lại mật khẩu chỉ bằng email; nếu quên mật khẩu demo, dữ liệu tài khoản cũ không thể mở khóa. Triển khai thực tế cần backend, xác minh danh tính và token khôi phục có thời hạn.

Khi lưu trữ review bị chặn hoặc đầy, thay đổi giữ trong bộ nhớ và giao diện báo rõ. Với tài khoản/Watchlist, ghi thất bại bị từ chối và báo chưa lưu; không báo thành công hoặc thay dữ liệu bằng bản rỗng. Dữ liệu lưu không hợp lệ được giữ nguyên, không ghi đè; review mới chỉ tồn tại trong phiên đó. Không tự nhập lại tài khoản hoặc dữ liệu từ các khóa cũ của bản Git.

Web Locks phối hợp chu trình đọc/sửa/ghi tài khoản, Watchlist và review giữa nhiều trang/tab trên trình duyệt hỗ trợ. Trình duyệt thiếu Web Locks dùng hàng đợi từng trang; không bảo đảm khóa ghi đồng thời giữa nhiều tab trong trường hợp này. Các sự kiện storage/pageshow/focus cập nhật phiên và giao diện. Form sửa review cũ bị từ chối khi bài đã được sửa hoặc xóa ở trang khác. Các thao tác ghi của `KH.auth` và `KH.storage` trả Promise; phần giao diện chờ kết quả và khóa nút trong khi xử lý.

Chưa có backend, xác thực production, chia sẻ review giữa thiết bị, trailer hoặc cập nhật dữ liệu tự động. Chỉ có backdrop cho phim có nguồn ảnh ngang được xác minh. Tài nguyên ảnh vẫn thuộc hãng/chủ sở hữu; chưa có giấy phép tái phân phối/thương mại riêng. Website không được tự xuất bản trong phiên này.

## Kiểm thử và tài liệu

Mở `tests/index.html` bằng Live Server để chạy kiểm thử logic, dữ liệu, tài nguyên và DOM qua iframe. Dùng hồ sơ trình duyệt kiểm thử riêng và không thao tác ứng dụng đồng thời trong lúc chạy. Bộ kiểm thử tạo tài khoản/Watchlist/review tạm, rồi khôi phục các khóa ứng dụng đã chụp trong `finally`. Không dùng dữ liệu tạm làm dữ liệu phim thật.

- [Kế hoạch được duyệt](docs/project-plan.md)
- [Kết quả kiểm thử và giới hạn xác minh](docs/testing.md)
- [Nguồn phim, ảnh và điểm](docs/sources.md)
- [Nhật ký phối hợp AI có thật](docs/ai-workflow.md)
- [Kịch bản demo và nội dung trình bày](docs/pitch.md)

Các kiểm tra gồm chuẩn hóa tiếng Việt, lọc AND, sort ổn định/số tự nhiên, 37 bản ghi tạm, thiếu nguồn điểm, review CRUD, dữ liệu lỗi/quota, nội dung không tin cậy, URL sai và responsive. Không tự nhận mức điểm của bài tập khi chưa có bảng chấm chính thức.
