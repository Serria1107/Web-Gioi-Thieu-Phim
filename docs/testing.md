# Báo cáo kiểm thử

Ngày kiểm tra: **22/10/2026** (Asia/Saigon). Môi trường: Windows, Chrome 155.0.8059.85 headless; HTML/CSS/JavaScript thuần. Không có Node/npm trên PATH; không cài thư viện hoặc trình duyệt mới.

## Kết quả thực tế

Lượt nghiệm thu cuối chạy qua máy chủ HTTP tĩnh tạm tại `http://127.0.0.1:8765`:

```text
HTTP TESTS: Hoàn tất: 59 đạt, 0 lỗi.
PASS: Enter flips poster and moves focus to detail link
PASS: Space returns to poster with focus restored
PASS: Touch emulation flips poster at 360px
PASS: Reduced motion disables flip transition
BROWSER ERRORS: 0
```

59 bài là bộ kiểm thử trong `tests/run-tests.js`, chạy các hàm thật và các trang ứng dụng thật qua iframe. Bốn dòng PASS tiếp theo là kiểm tra riêng bằng Chrome DevTools Protocol: gửi phím Enter/Space, sự kiện cảm ứng mô phỏng và thiết lập media giảm chuyển động. Không cộng chúng vào con số 59.

Chrome được bật Runtime/Log để thu lỗi trong lượt kiểm tra HTTP và tương tác; không ghi nhận exception JavaScript hoặc log mức error. Không suy rộng kết quả này thành bảo đảm tuyệt đối cho mọi môi trường.

Trước đó, phiên bản bộ kiểm thử 57 bài cũng chạy thành công qua `file://`; bản cuối 59 bài được nghiệm thu qua HTTP vì các trang cần cùng origin lưu trữ. Hướng dẫn sử dụng và chạy test ưu tiên Live Server.

## Phạm vi các bài kiểm thử tự động

| Nhóm | Tình huống đã thực hiện | Kết quả |
|---|---|---|
| Chuẩn hóa tìm kiếm | Hoa/thường, dấu tiếng Việt, đ, Unicode tổ hợp, khoảng trắng thừa | Đạt |
| Phạm vi tìm | Chỉ title; không tìm mô tả/tên gốc | Đạt |
| Lọc | AND giữa truy vấn/thể loại/năm; khớp thành viên mảng | Đạt |
| Sort | Tiếng Việt, Phim 2 trước Phim 10, nhóm title trùng ổn định ở cả hai chiều | Đạt |
| Phân trang | 37 bản ghi tạm; 10/20/50/all; trang cuối, trang vượt giới hạn, trạng thái rỗng | Đạt |
| Trạng thái | Đổi điều kiện về trang 1; Xóa bộ lọc giữ truy vấn/sort/size; không sửa mảng nguồn | Đạt |
| Dữ liệu lỗi | Bản ghi danh sách thiếu title phải báo lỗi | Đạt |
| Chuẩn hóa điểm | Thang 5/10/100, loại tỷ lệ tích cực/chưa xác minh/sai thang/NaN/Infinity | Đạt |
| Điểm tổng hợp | Trọng số nhóm, thiếu nhóm, 0 hợp lệ, không làm tròn trung gian | Đạt |
| Danh mục | 20 phim, ID duy nhất, nguồn điểm/ngày kiểm tra đầy đủ, đóng băng sâu | Đạt |
| Ảnh | Toàn bộ 20 poster và 9 backdrop tải được, có kích thước tự nhiên | Đạt |
| Storage schema | Dữ liệu đúng/sai, JSON lỗi, phiên bản sai, ID trùng | Đạt |
| Storage bị chặn | Provider ném SecurityError: thêm/sửa/xóa và refresh trong phiên | Đạt bằng mô phỏng provider |
| Quota | Provider ném QuotaExceededError: giữ bản lưu cũ và thay đổi trong bộ nhớ | Đạt bằng mô phỏng provider |
| Bản lưu chứa review lỗi | Giữ nguyên dữ liệu gốc, không ghi đè bằng review mới | Đạt |
| ID review | Không chuyển cùng ID review sang phim khác | Đạt |
| Theme | Ưu tiên giá trị hợp lệ, bỏ giá trị sai, dự phòng hệ điều hành/light | Đạt |
| Theme và reload | Đang ở trang 2 có bộ lọc: đổi theme giữ trạng thái; reload giữ lựa chọn | Đạt qua DOM/HTTP |
| Trang chủ | Mặc định 10 mục, A–Z, Tất cả; tìm khi nhập; rỗng; lọc và xóa lọc | Đạt qua DOM |
| Flip | Click lật/lật lại, quản lý inert/focus, không điều hướng ngoài ý muốn | Đạt qua DOM |
| URL chi tiết | Mở đúng phim; ID sai hiện thông báo và ẩn form | Đạt |
| Bảng nguồn điểm | Tìm title, lọc nhóm, sort, size 10/20/50/all, phân trang | Đạt |
| Form review | Thiếu trường hoặc điểm ngoài 1–10 bị từ chối | Đạt |
| Review CRUD | Thêm/sửa giữ ID/xóa có xác nhận, tính lại điểm tức thì | Đạt |
| Review và reload | Review tồn tại sau reload; xóa tiếp tục được giữ sau reload | Đạt |
| Đồng bộ giữa trang | Tạo review ở chi tiết rồi quay về danh mục: thẻ hiện điểm và số review mới | Đạt qua HTTP |
| Phân tách phim | Review Interstellar không xuất hiện trong Arrival | Đạt |
| Nội dung không tin cậy | Chuỗi img/script hiển thị như văn bản, không tạo node hoặc thực thi | Đạt |
| Dữ liệu lưu lỗi trong trang thật | JSON hỏng được giữ nguyên; notice hiển thị; review mới chỉ ở bộ nhớ | Đạt |
| Responsive | Trang chủ và chi tiết tên dài ở 360/768/1024/1440px | Đạt: không cuộn ngang toàn trang; Đăng nhập/theme không chồng lấn |

## Kiểm tra giao diện và thao tác bổ sung

Đã chụp và xem ảnh toàn trang: trang chủ light/dark ở desktop, trang chủ light ở 360px, chi tiết dark ở 360px và chi tiết light ở desktop. Đã xác minh theme đúng, không cuộn ngang và toàn bộ ảnh trong trang đã giải mã trước khi chụp. Poster giữ khung 2:3 và object-fit contain; header, bộ lọc, điểm và form không chồng lên nhau trong ảnh đã xem.

Ảnh chụp đầu tiên của công cụ capture-beyond-viewport có các lớp poster chưa được vẽ ngoài viewport dù tài nguyên đã tải. Công cụ chụp được điều chỉnh để mở viewport cao bằng toàn trang và chờ giải mã ảnh; ảnh cuối hiển thị poster đầy đủ. Đây là điều chỉnh công cụ QA, không thay poster hoặc thêm nội dung giả vào website.

Kiểm tra phím được gửi qua Chrome Input API, không chỉ gọi `.click()`: Enter mở mặt sau và đưa focus tới liên kết chi tiết; Space trên nút trở lại đưa focus về poster. Cảm ứng được mô phỏng ở chiều rộng 360px. Với prefers-reduced-motion, thời gian transition của flip bằng 0s.

Máy chủ kiểm thử chỉ phục vụ file tĩnh, không phải backend của sản phẩm; đã dừng sau lượt QA. Hồ sơ Chrome tạm tách khỏi hồ sơ thường của người dùng.

Minh chứng tạm nằm tại `%TEMP%\khung-hinh-browser-qa\`:

- `http-test-dom.html`: DOM kết quả 59 bài của lượt cuối.
- `browser-errors.txt`: không có lỗi ghi nhận trong lượt cuối.
- `home-light.png`, `home-dark.png`, `home-mobile.png`.
- `detail-mobile.png`, `detail-desktop.png`.

Các file tạm có thể bị hệ điều hành dọn; chúng không phải dữ liệu website.

## Kiểm tra tĩnh

- Đã kiểm tra HTML không có style/script/event handler inline; đường dẫn CSS/JS và liên kết cục bộ trong HTML tồn tại.
- `git diff --check` không báo lỗi whitespace; Git có cảnh báo chuyển LF sang CRLF theo cấu hình hiện có.
- SHA-256 của `.skill/skill.md` vẫn là `FA0735D3EA32B86B431ECEFE2369ED1ABB12378567C8A11779648FA8B530CB4F`.
- 29 file ảnh sau tối ưu có tổng 5.628.331 byte; không hotlink ảnh khi website chạy.

## Đối chiếu tiêu chí và giới hạn

| Tiêu chí trong prompt | Bằng chứng / giới hạn |
|---|---|
| UI/UX và responsive | Hai theme, Glass Morphism, ảnh chụp và kiểm tra bố cục bốn chiều rộng |
| JavaScript/DOM | Hàm độc lập, pipeline chung, delegation, DOM an toàn, CRUD và kiểm thử browser |
| Logic dữ liệu/điểm | 20 phim có nguồn; công thức và trường hợp biên được kiểm thử |
| Vibe Coding/AI | Nhật ký thực tế tại ai-workflow.md; không dựng lịch sử prompt hoặc lỗi giả |
| Tài liệu | README, kế hoạch, nguồn, kiểm thử và nhật ký AI |

Chưa có bảng chấm điểm chính thức được cung cấp, nên không tự chấm 90–100%.

Chưa xác minh trên điện thoại vật lý, Safari/Firefox, screen reader, kiểm toán WCAG đầy đủ hoặc đo Lighthouse. Cảm ứng đã kiểm tra là mô phỏng Chrome. Quota/bị chặn được thử bằng provider ném lỗi, không thay cấu hình lưu trữ thật của người dùng. Quyền tái phân phối/thương mại ảnh chưa được cấp riêng; bản này phục vụ học tập cục bộ, chưa xuất bản. Điểm là snapshot, không cập nhật trực tiếp; review chỉ nằm trong trình duyệt. Chi tiết nguồn và chênh lệch thời lượng xem sources.md.

## File đã tạo hoặc sửa

Tạo lại: `index.html`, `css/style.css`, `js/app.js`, `js/movies.js`, `README.md`, `docs/project-plan.md`, `docs/testing.md`, `docs/ai-workflow.md`.

Thêm: `movie.html`, `css/themes.css`, `js/list.js`, `js/scores.js`, `js/storage.js`, `js/theme.js`, `js/movie-detail.js`, `js/reviews.js`, `docs/sources.md`, `tests/index.html`, `tests/run-tests.js`, 20 ảnh trong `images/posters/`, 9 ảnh trong `images/backdrops/`.

Giữ nguyên Skill và cấu hình Git. `docs/presentation.md` tiếp tục ở trạng thái bị xóa từ trước; không khôi phục ngoài phạm vi. Không commit, push, pull hoặc triển khai.
