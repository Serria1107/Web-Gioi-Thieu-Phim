# Kế hoạch được duyệt — phương án 1

## Thực hiện lại bản đầy đủ theo đoạn chat

Yêu cầu hiện tại là áp dụng lại toàn bộ phạm vi đã được duyệt ở các lượt “phương án 1” và “1”, gồm cả sửa lỗi bấm menu. Khi khảo sát, nhánh `Dev_Dat` đang có website nền, nút Đăng nhập tĩnh và chưa có module tài khoản/trang cá nhân. Bản triển khai đầy đủ còn trong lịch sử Git tại `a19235c`; chỉ lấy các file tính năng, tích hợp, kiểm thử và tài liệu tương ứng, không đổi nhánh hoặc khôi phục toàn bộ cây Git.

Phạm vi: thêm `js/auth.js`, `js/avatar.js`, `js/watchlist.js`, `js/profile.js`, `js/profile-edit.js`, `css/account.css`, `watchlist.html`, `profile.html`, `profile-edit.html`, `docs/pitch.md`; cập nhật `index.html`, `movie.html`, `css/style.css`, `js/list.js`, `js/storage.js`, `js/movie-detail.js`, `js/reviews.js`, hai file trong `tests/`, README và tài liệu kế hoạch/kiểm thử/AI. Bổ sung email vào hồ sơ riêng theo prompt ban đầu, xóa khỏi DOM khi đăng xuất.

Quy tắc hiện ở `skill.md` tại gốc; giữ nguyên nội dung và vị trí. Giữ nguyên `PROMPT_LOG.md`, dữ liệu phim, ảnh, công thức điểm và theme. Không thêm dependency/backend, không commit/push/merge hoặc triển khai.

Trình tự: đối chiếu hai prompt → áp dụng lại phần đã duyệt → kiểm tra dữ liệu và các liên kết → chạy suite trình duyệt → kiểm tra chuột/chạm, upload, Enter, hai tab và bố cục → báo cáo bằng chứng mới. Các mục bên dưới ghi lại kế hoạch của những lượt trước.

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

## Phần mở rộng Authentication và Watchlist — được duyệt 23/10/2026

Sau khi khảo sát dự án hiện có, người dùng duyệt triển khai đầy đủ phiên bản demo frontend-only và chọn giữ review cũ không có chủ tài khoản ở chế độ chỉ đọc. Không thêm backend/framework/dependency, không sửa `.skill/skill.md`, không commit/push/merge. Các thay đổi đang được tích hợp trên worktree hiện có; không ghi đè những chỉnh sửa trước đó.

### Cấu trúc và quyết định dữ liệu

- Tái sử dụng danh mục 20 phim và ID ổn định; chi tiết vẫn dùng `movie.html?id=<movieId>`.
- `js/auth.js` quản lý tài khoản demo, hash PBKDF2 qua Web Crypto, phiên nhớ/phiên tab, hồ sơ, Watchlist theo ID và menu/modal chung.
- `watchlist.html`/`js/watchlist.js` cung cấp tìm title, lọc thể loại/năm/điểm hợp lệ, sắp xếp theo title/ngày/điểm, phân trang và xóa.
- Review mới có `ownerId`; chỉ chủ tài khoản được sửa/xóa. Review cũ giữ nguyên, không tự gán chủ sở hữu. Điểm người dùng nhập 0,5–5 sao được nhân 2 để giữ schema 1–10 và công thức điểm hiện hành.
- Không giả mạo email khôi phục: modal giải thích rằng quên mật khẩu demo không thể khôi phục nếu không có backend/token xác minh.
- Profile dùng avatar chữ cái, không upload ảnh, tránh dữ liệu ảnh không giới hạn.

### Phạm vi file

Sửa `index.html`, `movie.html`, `css/style.css`, `js/list.js`, `js/storage.js`, `js/app.js` (tích hợp header giữ nguyên cơ chế danh mục), `js/movie-detail.js`, `js/reviews.js`, `tests/index.html`, `tests/run-tests.js`, `README.md`, tài liệu kế hoạch/kiểm thử/AI. Thêm `js/auth.js`, `js/watchlist.js`, `watchlist.html`.

### Giai đoạn

1. Hoàn thành account/session/hash và UI dùng chung trên các trang.
2. Kết nối Watchlist với account, route phim hiện tại và thao tác ở trang chi tiết.
3. Gắn owner ID vào review mới, bảo vệ thao tác UI và giữ review legacy.
4. Kiểm thử nhiều tài khoản, persistence, CRUD, route, lọc/sort/page, responsive và lỗi storage.
5. Cập nhật tài liệu theo kết quả đã thực chạy; không tự tuyên bố điểm rubric.

Commit message đề xuất nếu người dùng yêu cầu commit về sau: `feat: add demo accounts and personal watchlists`. Không có commit nào được tạo trong phần việc này.

## Hoàn thiện theo xác nhận “phương án 1” — 23/10/2026

Trong lượt làm việc này, người dùng gửi lại yêu cầu nâng cấp tài khoản/Watchlist. Khảo sát trên đĩa xác nhận các mô-đun đã tồn tại; AI trình bày các thiếu sót và phạm vi hoàn thiện, sau đó người dùng trả lời **“phương án 1”**. Tiếp tục trên nhánh `main`, giữ nguyên các chỉnh sửa có sẵn, `.skill/skill.md`, danh mục và công thức điểm. Không phục hồi `docs/presentation.md` đang bị xóa.

### Phạm vi triển khai thực tế

- `js/auth.js`: validation tại dịch vụ, chuẩn hóa email/username, phiên có hạn 12 giờ hoặc 30 ngày, đăng xuất liên tab, Web Locks cho ghi tài khoản/Watchlist, xử lý dữ liệu lỗi/quota, nhãn/focus modal và phím điều hướng dropdown. Danh sách review trong hồ sơ có tìm title, lọc mức điểm thực tế, A–Z/Z–A, 10/20/50/all và liên kết về phim.
- `js/watchlist.js`: lưu điều kiện tra cứu theo account trong sessionStorage, khôi phục khi quay lại, phản hồi đang xóa và quản lý focus. `js/movie-detail.js`: toggle bất đồng bộ, khóa thao tác trong lúc lưu và cập nhật trạng thái.
- `js/storage.js` và `js/reviews.js`: kiểm tra actor thực tế khi ghi/xóa, phối hợp ghi review giữa trang bằng Web Locks, từ chối ghi đè bản sửa mới từ form cũ, cập nhật tên/avatar từ account và xóa bản nháp khi đổi tài khoản.
- `css/style.css`: modal cuộn trong màn hình thấp, hàng mật khẩu có nút hiện/ẩn không chồng lỗi, công cụ danh sách hồ sơ và khung poster dự phòng.
- `tests/run-tests.js`: mở rộng kiểm thử thực tế, chờ trạng thái bất đồng bộ, khôi phục các khóa lưu trữ trong `finally`.
- `README.md`, tài liệu kế hoạch/kiểm thử/AI; thêm `docs/pitch.md`. Các HTML hiện có đã nạp đúng module nên không cần sửa chỉ để tạo diff.

Không thêm dependency, API ngoài hoặc dữ liệu phim mới. Quên mật khẩu tiếp tục giải thích giới hạn demo; không gửi email hoặc mở khóa tài khoản qua email tùy ý.

### Bảng công việc đề xuất

Không có board GitHub Projects được cung cấp trong phiên này. Dùng cấu trúc **To Do → In Progress → Review → Done** nếu đưa các hạng mục sau lên Kanban. Bảng này ghi công việc cục bộ, không tuyên bố đã tạo board/commit trên GitHub.

| Giai đoạn | Công việc | Commit message đề xuất |
| --- | --- | --- |
| Phân tích | Đọc skill, khảo sát file/dữ liệu/route, chốt phương án | `docs: plan account and watchlist completion` |
| Authentication | Validation, TTL, đồng bộ, modal/menu/hồ sơ | `feat: harden demo account sessions and profile` |
| Watchlist | Ghi theo account, loading, điều hướng, giữ bộ lọc | `feat: preserve personal watchlist state` |
| Review | Quyền sở hữu, khóa ghi, chống ghi đè form cũ | `fix: enforce review ownership and concurrent updates` |
| UI/UX | Focus, keyboard, modal thấp và bố cục responsive | `fix: improve account dialog accessibility` |
| Kiểm thử/tài liệu | Suite trình duyệt, hai tab, báo cáo và pitch | `test: cover personal account and watchlist flows` |

Tiêu chí chuyển Done: có bằng chứng kiểm thử tương ứng trong `testing.md`, không thay danh mục/skill/công thức và không phát sinh lỗi JavaScript ở lượt nghiệm thu. Không tự commit, push, merge hoặc xuất bản.

## Trang hồ sơ và quản lý thông tin — phương án 1, 23/10/2026

Người dùng cung cấp prompt mới về năm mục trong menu tài khoản. Sau khảo sát, AI trình bày phương án chuyển hồ sơ sang trang riêng, bổ sung avatar/tên hiển thị/email/bio, quản lý review và chính sách mật khẩu. Người dùng trả lời **“1”**, phê duyệt toàn bộ phạm vi trước khi triển khai. Phần này kế thừa bản đã hoạt động; không dựng lại website, đổi nhánh, sửa skill hoặc thêm dependency/backend.

### Thiết kế và dữ liệu

- `profile.html`: banner CSS dùng palette hiện có, avatar/username/tên hiển thị/ngày tham gia/bio; bốn thống kê tính từ account, Watchlist và review sở hữu. Trung bình quy về thang 5; số phim là tập movie ID duy nhất. Không có review thì trung bình là “—”.
- Các tab Tổng quan, Watchlist, Đánh giá của tôi đều dùng pipeline tìm title/lọc/so sánh tiếng Việt/phân trang 10/20/50/all. Tổng quan là snapshot tối đa 10 mục mới nhất từ các phim đang lưu và review hiện còn; không dựng lịch sử thêm/xóa giả. Mặc định A–Z theo skill, có lựa chọn thời gian.
- Watchlist dùng cùng hàm lấy dữ liệu/dựng thẻ ở `js/watchlist.js`; không có kho Watchlist mới. Grid poster 2:3 theo thư viện. Profile liên kết Xem tất cả tới trang Watchlist đang có.
- Review trong hồ sơ có poster, phim, điểm, tiêu đề/nội dung, ngày tạo/sửa, link chi tiết, sửa và xóa có xác nhận. Sửa mở form thật trên trang phim bằng tham số review ID, có kiểm tra owner. Review của phim không còn trong danh mục được thông báo rõ, không bịa poster hoặc link sai.
- `profile-edit.html`: tên hiển thị, username, email, bio, ảnh. MIME/dung lượng/kích thước được kiểm tra; ảnh thu nhỏ bằng Canvas/Web APIs và lưu bản nhỏ trong account localStorage. Lỗi xử lý/quota không thay avatar hoặc hồ sơ đã lưu. Hủy không ghi bản nháp. Không dùng IndexedDB, cơ sở dữ liệu hoặc dịch vụ bên ngoài.
- Schema account v1 tương thích: các trường mới tùy chọn, đọc dữ liệu cũ bằng giá trị mặc định; giữ key/ID/quan hệ. Phiên cũ thiếu credentialVersion được hiểu là 0. profileVersion chống form cũ ghi đè hồ sơ mới. Đổi mật khẩu tăng credentialVersion và yêu cầu đăng nhập lại ở mọi tab của tài khoản.

### Phạm vi thực tế

Tạo `profile.html`, `profile-edit.html`, `js/profile.js`, `js/profile-edit.js`, `js/avatar.js`, `css/account.css`.

Sửa `index.html`, `movie.html`, `watchlist.html`, `js/auth.js`, `js/reviews.js`, `js/movie-detail.js`, `js/watchlist.js`, `css/style.css`, `tests/index.html`, `tests/run-tests.js`, `README.md`, `docs/project-plan.md`, `docs/testing.md`, `docs/ai-workflow.md`, `docs/pitch.md`.

### Giai đoạn và Kanban cục bộ

Dùng cột **To Do → In Progress → Review → Done** đã đề xuất; không có board từ xa được cung cấp và không tạo board giả. Hạng mục đi qua Review khi có kết quả suite/CDP/ảnh tương ứng, chuyển Done khi báo cáo nghiệm thu được cập nhật.

| Giai đoạn | Nội dung | Commit message đề xuất |
| --- | --- | --- |
| Phân tích | So khớp prompt/skill, phân biệt phần đã có và phần cần thêm | `docs: plan dedicated personal profile pages` |
| Dữ liệu | Trường tùy chọn, avatar, version hồ sơ và thông tin xác thực | `feat: extend compatible demo account profiles` |
| Hồ sơ | Trang riêng, thống kê, tab và quản lý review | `feat: add personal profile and review management` |
| Chỉnh sửa | Form đầy đủ, validation, preview ảnh và Lưu/Hủy | `feat: add editable profile and local avatar uploads` |
| Đồng bộ | Header/review/Watchlist, phiên sau đổi mật khẩu | `fix: synchronize account identity and session changes` |
| Nghiệm thu | Regression, 28 tình huống mới, responsive và tài liệu | `test: verify dedicated profile and account flows` |

Không có commit, push, merge hoặc xuất bản nào được thực hiện trong giai đoạn này.
