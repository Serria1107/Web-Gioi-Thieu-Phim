# Trình bày ngắn: tài khoản và Watchlist cá nhân

## Bản nâng cấp trang hồ sơ riêng — 23/10/2026

“Hồ sơ của tôi” hiện mở trang riêng với danh tính, giới thiệu và bốn thống kê từ dữ liệu thật. Các tab Tổng quan, Watchlist và Đánh giá giúp người xem trở lại các phim đang quan tâm và cảm nhận đã viết. Từ hồ sơ có thể mở đúng phim, sửa bài trong form trang chi tiết hoặc xóa có xác nhận.

Kịch bản bổ sung: mở hồ sơ từ menu → xem số phim/số review/trung bình sao/số phim duy nhất → vào Chỉnh sửa → chọn avatar và nhập tên hiển thị, username, email, bio → thử Hủy để thấy dữ liệu chưa đổi → Lưu để thấy header/profile/tác giả review đồng bộ. Đổi mật khẩu cần mật khẩu hiện tại và mật khẩu mới khác mật khẩu cũ; thành công yêu cầu đăng nhập lại. Đăng xuất chỉ kết thúc phiên, dữ liệu vẫn được khôi phục khi đăng nhập lại.

Avatar được kiểm tra và thu nhỏ tại trình duyệt rồi lưu cùng hồ sơ; không có server upload. Account ID là khóa liên kết, không đổi khi sửa username/email. Các trường mới được bổ sung tương thích với account v1, không đổi storage key. profileVersion ngăn ghi đè hồ sơ mới; credentialVersion vô hiệu hóa token cũ sau đổi mật khẩu. Các version là logic demo phía client, không phải xác thực máy chủ.

## Vấn đề

Người xem cần lưu những phim muốn xem và xem lại cảm nhận của mình, thay vì tìm lại phim mỗi lần quay lại website. Khung Hình bổ sung các thao tác này vào thư viện và trang chi tiết đang có.

## Các chức năng chính

- Đăng ký, đăng nhập bằng username/email, ghi nhớ phiên, sửa tên hiển thị, đổi mật khẩu và đăng xuất.
- Watchlist riêng cho từng tài khoản: thêm/xóa từ trang chi tiết, mở lại đúng phim từ poster hoặc tên phim.
- Tìm theo tiêu đề, lọc thể loại/năm/điểm, sáu kiểu sắp xếp, phân trang 10/20/50/Tất cả; giữ điều kiện khi quay lại trong cùng tab.
- Review 0,5–5 sao gắn tài khoản; chủ tài khoản được sửa/xóa. Điểm được quy đổi sang thang 10 trước khi dùng công thức tổng hợp hiện có.
- Hồ sơ có số phim, số review và danh sách đánh giá cá nhân với tìm kiếm, lọc mức điểm, A–Z/Z–A và phân trang.

## Cấu trúc dữ liệu

Danh mục `KH.movies` giữ dữ liệu phim gốc, poster và nguồn điểm. Mỗi phim có ID ổn định đang được dùng trong `movie.html?id=...`; dự án chưa có TMDb ID nên không tự đổi ID hoặc nhập lại danh mục.

Tài khoản lưu `id`, `username`, `email`, `salt`, `passwordHash`, `avatar`, `createdAt` và `watchlist`; hồ sơ bổ sung `displayName`, `bio`, `avatarImage`, `profileVersion`, `credentialVersion`. Mỗi mục Watchlist chứa `movieId` và `addedAt`; tài khoản chứa mục đó xác định chủ sở hữu. Không nhân bản tên phim hoặc poster vào Watchlist.

Review lưu ID riêng, `ownerId`, `movieId`, tên tác giả dự phòng, tiêu đề, nội dung, điểm thang 10, ngày tạo và ngày cập nhật. Tên/avatar hiện tại được tra qua tài khoản. Review cũ thiếu `ownerId` được giữ để đọc và tính điểm, không tự gán cho tài khoản mới.

## Kịch bản demo khoảng ba phút

1. Mở thư viện, lật poster và vào A Quiet Place.
2. Nhấn `+ Watchlist` khi đang là khách. Đăng ký hoặc đăng nhập; bộ phim được thêm sau khi đăng nhập thành công.
3. Mở Watchlist từ menu tài khoản. Tìm `quiet`, lọc theo năm 2018, rồi nhấn poster để trở lại đúng A Quiet Place. Nút lưu thể hiện trạng thái đã thêm.
4. Viết review 4,5 sao, sửa xuống 3,5 sao và quan sát điểm nội bộ/tổng hợp được tính lại. Mở hồ sơ để tìm lại bài viết.
5. Đăng xuất, đăng nhập tài khoản B. Watchlist của B riêng biệt và không có quyền sửa/xóa review của A.
6. Đăng nhập lại A để thấy dữ liệu còn nguyên. Minh họa xóa phim và trạng thái nút lưu được cập nhật.

## Phạm vi và hướng phát triển

Đây là demo HTML/CSS/JavaScript thuần trong một origin trình duyệt. Web Crypto PBKDF2 với salt riêng tránh lưu mật khẩu rõ, nhưng dữ liệu client có thể bị sửa; đây không phải hệ thống xác thực production. Không có xác minh email, gửi email khôi phục hoặc đồng bộ giữa thiết bị. Avatar mặc định dùng chữ cái; có thể thay bằng ảnh đã kiểm tra từ thiết bị và lưu cục bộ.

Phiên tab có thời hạn 12 giờ; phiên ghi nhớ 30 ngày. Đăng xuất vô hiệu hóa phiên cũ ở các tab cùng origin. Web Locks phối hợp thao tác ghi tài khoản, Watchlist và review giữa các trang; trình duyệt thiếu API này dùng hàng đợi trong từng trang, không có bảo đảm khóa giữa nhiều tab.

Hướng phát triển cần được phê duyệt riêng: backend quản lý tài khoản và quyền sở hữu, phiên do máy chủ xác thực, xác minh email, token khôi phục có thời hạn và cơ sở dữ liệu đồng bộ. Không coi mã hash phía trình duyệt là thay thế cho các thành phần đó.

## Đối chiếu rubric

UI/UX: tái sử dụng màu, typography, Glass Morphism, hai theme và bố cục điện ảnh. JavaScript/DOM: module, validation, async/await, Web Crypto, Web Locks, DOM an toàn và pipeline danh sách dùng chung. Logic dữ liệu: quan hệ account–movie–watchlist–review qua ID. Quy trình: phạm vi được duyệt, kế hoạch và bảng công việc đề xuất trong `project-plan.md`. AI và kiểm thử: nhật ký thực tế trong `ai-workflow.md`, kết quả chạy trong `testing.md`. Nội dung này hỗ trợ trình bày, không phải kết luận đã đạt một mức điểm cụ thể.
