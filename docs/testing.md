# Báo cáo kiểm thử

## Nghiệm thu lần thực hiện lại toàn bộ đoạn chat

Kết quả bên dưới được chạy mới trên worktree `Dev_Dat` sau khi áp dụng lại tính năng từ `a19235c` và bổ sung email trong hồ sơ riêng. Các báo cáo phía sau phần này là lịch sử những lượt trước, không thay thế kết quả mới.

| Nhóm kiểm tra | Kết quả mới |
| --- | --- |
| Suite HTML/JS thật qua HTTP localhost | **112 đạt, 0 lỗi**; gồm tài khoản, phiên, Watchlist, review, profile/edit, validation, lỗi lưu trữ và responsive |
| Email hồ sơ | Hiển thị đúng tài khoản; nội dung email bị xóa khỏi DOM khi đăng xuất |
| Chuột CDP trên menu | **15/15**: ba route từ mỗi trang index/movie/watchlist/profile/profile-edit đều mở đúng URL và giữ phiên |
| Chạm mô phỏng 360px | **3/3** route Hồ sơ, Watchlist, Chỉnh sửa từ trang phim |
| Hai mục hành động còn lại | Chuột mở form Đổi mật khẩu; Đăng xuất trả về khách và ẩn hồ sơ riêng |
| Avatar và bàn phím | Upload PNG từ đĩa có preview; Enter lưu hồ sơ và đăng nhập bằng mật khẩu mới; ArrowRight đổi tab hồ sơ |
| Hai tab Chrome thật | Khôi phục avatar/hồ sơ, đồng bộ thay đổi, đổi mật khẩu xóa nội dung riêng ở tab kia, từ chối token cũ |
| Ảnh và bố cục | 11 ảnh mới ở 360/768/1440px, hai theme; ảnh giải mã được và không tràn ngang; suite còn kiểm tra 1024px |
| Runtime/Log | **0 lỗi** ở lượt kiểm tra đầy đủ và lượt chuột/chạm |
| Kiểm tra tĩnh HTML | **0 đường dẫn cục bộ thiếu**, **0 file có script/style/handler inline** |

Đã xem ảnh `profile-mobile.png` và `edit-desktop.png` của lượt mới. Các kiểm tra CDP ngoài suite không cộng vào 112 bài. Chưa xác minh trên điện thoại vật lý, Firefox/Safari hoặc screen reader.

Bằng chứng mới ở `%TEMP%\khung-hinh-reapply-qa\`: `full-results.txt`, `pointer-results.txt`, `http-test-dom.html`, hai script QA và 11 ảnh chụp. Profile QA tách riêng; dữ liệu mẫu không được đưa vào danh mục/source hoặc vùng lưu trữ đang dùng của người dùng.

File quy tắc hiện tại là `skill.md` tại gốc. SHA-256 trước/sau vẫn là `AEF6555299A2D5E316F28A1A578223ECD56ABF7C95E66276769DF0E0C07F970E`. Các hash/đường dẫn `.skill/skill.md` phía dưới mô tả bản ở các lượt trước. Đối chiếu Git xác nhận không sửa `skill.md`, `PROMPT_LOG.md`, dữ liệu phim/ảnh, `js/app.js`, thuật toán điểm, theme và sổ nguồn. Không thêm thư viện/backend hoặc xuất bản website. Đây vẫn là tài khoản demo cục bộ, không có xác minh email, khôi phục bằng email hoặc đồng bộ nhiều thiết bị.

## Sửa menu tài khoản không nhận cú bấm — 23/10/2026

Tái hiện bằng chuột qua Chrome CDP: từ trang phim, cả ba liên kết Hồ sơ, Watchlist và Chỉnh sửa đều giữ nguyên URL. Trace cho thấy `focusout` có `relatedTarget` là liên kết trong menu, nhưng `document.activeElement` tạm là `body`. Microtask cũ ẩn menu trước `mouseup`, nên cú bấm rơi xuống nội dung phía dưới. Sửa bằng kiểm tra `event.relatedTarget` để chỉ đóng menu khi focus ra ngoài.

Kết quả sau sửa:

- Suite đạt **112/112**, gồm ca hồi quy mô phỏng khoảng chuyển focus trước khi liên kết nhận focus và khi ra ngoài menu.
- **15/15** lượt bấm chuột CDP mở đúng Hồ sơ/Watchlist/Chỉnh sửa từ cả năm trang: Trang chủ, chi tiết phim, Watchlist, Hồ sơ và Chỉnh sửa.
- **3/3** lượt chạm mô phỏng ở 360px mở đúng ba trang từ trang phim.
- Bấm chuột mở được form Đổi mật khẩu; Đăng xuất trả header về Đăng nhập và ẩn nội dung hồ sơ riêng.
- Lượt tương tác CDP ghi nhận **0 lỗi Runtime/Log**. Các lượt CDP không cộng vào 112 bài suite; cảm ứng là mô phỏng, chưa thử trên điện thoại thật.

Bằng chứng tạm: `%TEMP%\khung-hinh-menu-qa\suite-results.html` và các script `repro.ps1`, `pointer-only.ps1`. Báo cáo 111 bài phía dưới là kết quả trước bản sửa; thao tác `.click()` trong suite cũ chưa kiểm tra chuỗi focus của cú bấm chuột thật.

## Nghiệm thu trang hồ sơ và quản lý tài khoản — 23/10/2026

Đây là kết quả hiện tại cho yêu cầu mới về năm mục menu tài khoản, sau khi người dùng chọn **“1”**. Hai báo cáo giai đoạn trước được giữ phía dưới và không thay thế bằng chứng của lượt này.

```text
HTTP TESTS: Hoàn tất: 111 đạt, 0 lỗi.
PASS: Avatar file from disk produces a preview before saving
PASS: Native Enter saves profile and avatar and updates header
PASS: Profile statistics use saved movies and real account reviews
PASS: Native ArrowRight selects the Watchlist tab with focus
PASS: Second real tab restores profile and avatar
PASS: Profile changes in second real tab update the first tab
PASS: Password form completes and requests login again
PASS: Changing password clears private content in other real tab
PASS: Restoring a previous token does not reopen the profile after password change
PASS: Native Enter logs in with new password and restores all profile data
BROWSER ERRORS: 0
```

111 bài là suite `tests/run-tests.js` chạy qua HTML thật/iframe trong Chrome headless, HTTP localhost và profile QA riêng. Các kiểm tra CDP bên ngoài suite không được cộng vào số 111. Lượt đầy đủ kiểm tra cả Runtime/Log và network; không ghi nhận lỗi ở lượt cuối.

### 28 tình huống trong prompt mới

| # | Tình huống | Phương pháp đã chạy | Kết quả |
| --- | --- | --- | --- |
| 1 | Hồ sơ của tôi mở đúng trang | Nhấn liên kết menu thật, chờ URL profile.html và đúng account | Đạt |
| 2 | Đúng tên/avatar | Kiểm tra avatar chữ cái, ảnh đã lưu, tên hiển thị và username; ảnh file được chọn bằng DOM/CDP | Đạt |
| 3 | Thống kê Watchlist | Tài khoản A 2 phim, B 1 phim trong suite; account QA 4 phim ở lượt tương tác | Đạt |
| 4 | Thống kê review | 3 review/2 movie ID khác nhau, trung bình 3,7; xóa cập nhật số lượng/điểm | Đạt |
| 5 | Menu Watchlist mở đúng trang | Liên kết watchlist.html, trang thật và các ca Watchlist hồi quy | Đạt |
| 6 | Đúng phim đã lưu | A Quiet Place/Interstellar của A; Arrival của B; profile tab dùng cùng nguồn | Đạt |
| 7 | Nhấn poster mở đúng phim | Điều hướng thật tới A Quiet Place, đúng h1/poster và trạng thái đã lưu | Đạt |
| 8 | Xóa cập nhật dữ liệu/bộ đếm | Xóa từ profile/Watchlist, thống kê và nút chi tiết phản ánh cùng dữ liệu | Đạt |
| 9 | Không trùng phim | Lặp cùng ID, hai trang thêm đồng thời, một bản ghi duy nhất | Đạt |
| 10 | Tìm/lọc/sort/page kết hợp | Watchlist với 20 phim; review hồ sơ với 24 bài; 10/20/50/all, trang sau, query + mức điểm, Xóa bộ lọc | Đạt |
| 11 | Sửa tên hiển thị | Lưu form thật; Enter thật qua CDP; header/profile/review nhận tên mới | Đạt |
| 12 | Sửa username hợp lệ | Đổi sang cineRenamedA, đăng nhập lại và giữ account ID | Đạt |
| 13 | Từ chối username/email trùng | Nhập tài khoản B vào form A, kiểm tra lỗi dưới trường và bản lưu không đổi | Đạt |
| 14 | Avatar cập nhật header/profile | File PNG từ đĩa qua file input; xử lý thành ảnh nhỏ và lưu; kiểm tra header/profile/review có ảnh đúng account | Đạt |
| 15 | Hủy không lưu | Sửa tên + chọn ảnh xem trước rồi Hủy; account JSON giữ nguyên, về profile | Đạt |
| 16 | Đổi mật khẩu đúng quy trình | Xác minh, hash/salt mới, tăng version; form thành công mở đăng nhập lại; hai tab thật | Đạt |
| 17 | Sai mật khẩu hiện tại bị từ chối | Hàm xác thực thực tế từ chối và không đổi bản lưu | Đạt |
| 18 | Mật khẩu mới sai bị từ chối | Mật khẩu yếu, xác nhận không hợp lệ; thêm ca dùng lại mật khẩu hiện tại bị từ chối | Đạt |
| 19 | Mật khẩu cũ không đăng nhập được | Thử mật khẩu cũ sau đổi; thử khôi phục token cũ cũng không mở lại profile | Đạt |
| 20 | Đăng xuất cập nhật header | UI logout và dịch vụ hồi quy; header về nút Đăng nhập | Đạt |
| 21 | Đăng xuất không mất Watchlist | So sánh account JSON; đăng nhập lại còn đủ phim | Đạt |
| 22 | Đăng nhập lại khôi phục profile | Đúng tên mới, ảnh, bio, ID và Watchlist sau logout/login | Đạt |
| 23 | A/B không lẫn dữ liệu | B không có ảnh/review của A; thống kê rỗng đúng; quay lại A vẫn còn ảnh/dữ liệu | Đạt |
| 24 | Không xem nội dung riêng sau logout qua UI | Profile xóa tên/list/avatar khỏi DOM; truy cập trực tiếp Edit/Profile/Watchlist có trạng thái yêu cầu đăng nhập và không điền dữ liệu cũ | Đạt |
| 25 | Chi tiết/review vẫn hoạt động | Bộ hồi quy CRUD/điểm/nguồn/route/flip; nút Sửa từ profile đi tới đúng review trong form chi tiết cũ | Đạt |
| 26 | Không lỗi JS nghiêm trọng | Runtime/Log CDP: 0 lỗi trong lượt đầy đủ | Đạt |
| 27 | Desktop/tablet/mobile | DOM 360/768/1024/1440px cho trang cá nhân có dữ liệu; ảnh xem ở desktop, tablet, mobile, hai theme | Đạt trong Chrome mô phỏng |
| 28 | Skill nguyên vẹn | SHA-256 đối chiếu trước/sau và không có thao tác ghi skill | Đạt |

### Kiểm tra dữ liệu, ảnh và trạng thái bổ sung

- Migration tương thích: xóa các trường profile mới khỏi bản sao account cũ trong vùng QA, đọc lại thấy tên bằng username, bio/ảnh rỗng, ID/Watchlist giữ nguyên; thao tác đọc không rewrite bản lưu.
- Thống kê số phim review dùng Set movieId, không lấy số review thay thế. Thang điểm hồ sơ là 5 sao; công thức điểm phim trong scores.js không đổi.
- Avatar: từ chối SVG, MIME không cho phép, file giả JPEG không giải mã được, file lớn hơn 2 MB và ảnh rộng 4097px. Ảnh hợp lệ 480×320 được thu nhỏ tối đa 256px và chuỗi không quá 100.000 ký tự. Thử quota khi lưu hồ sơ giữ nguyên JSON/ảnh đã lưu và báo chưa lưu.
- Lưu form hai lần liên tiếp chỉ tăng profileVersion một lần. Form cũ bị từ chối khi trang khác đã lưu bản mới. Hủy khi preview chưa lưu không thay dữ liệu.
- Bio chứa chuỗi script hiển thị như văn bản, không thực thi. Tên/avatar review lấy từ account ID, không rewrite hoặc đổi ownerId bài viết.
- Credential version giữ mặc định 0 cho dữ liệu cũ; sau đổi mật khẩu, token có version trước bị từ chối ở cả tab đang thao tác lẫn tab khác. Không gọi đây là bảo mật máy chủ.
- Tổng quan phản ánh tối đa 10 hoạt động mới nhất còn trong dữ liệu hiện tại; danh sách vẫn có tìm title/lọc loại/sort/page theo skill. Không tạo lịch sử xóa hoặc timestamp giả cho tài khoản thật.

### Giao diện và bằng chứng

Đã chụp và xem các ảnh profile desktop/mobile/tablet, tab review và Watchlist trong profile, form Edit desktop/mobile, Watchlist dạng grid và modal mật khẩu mobile. Tên ở 360px được giữ đủ rộng, nút chỉnh sửa xuống hàng; tab không tràn. Poster dùng object-fit contain trong khung 2:3. Nút Hủy mật khẩu hiện riêng và modal cuộn được ở viewport thấp.

Các file tạm tại `%TEMP%\khung-hinh-profile-qa\`:

- `http-test-dom.html`: kết quả suite cuối 111/111.
- `profile-qa.ps1`: runner suite, dùng với `-TestsOnly`.
- `profile-final-qa.ps1`: runner suite + CDP hai tab/upload/keyboard/capture.
- `browser-errors.txt`: rỗng ở lượt cuối.
- `profile-desktop.png`, `profile-mobile.png`, `profile-tablet.png`, `profile-reviews.png`, `profile-watchlist.png`.
- `edit-desktop.png`, `edit-mobile.png`, `watchlist-desktop.png`, `watchlist-mobile.png`, `detail-mobile.png`, `password-mobile.png`.
- `avatar-fixture.png`: tệp ảnh thử trong QA, không phải ảnh của người dùng hoặc tài nguyên sản phẩm.

Profile QA và dữ liệu fixture tách khỏi trình duyệt thường của người dùng. Server là HTTP tĩnh loopback, không phải backend ứng dụng. Các file tạm có thể bị hệ điều hành dọn.

### Phạm vi và giới hạn

Tạo: `profile.html`, `profile-edit.html`, `js/profile.js`, `js/profile-edit.js`, `js/avatar.js`, `css/account.css`.

Sửa: `index.html`, `movie.html`, `watchlist.html`, `js/auth.js`, `js/reviews.js`, `js/movie-detail.js`, `js/watchlist.js`, `css/style.css`, `tests/index.html`, `tests/run-tests.js`, `README.md`, `docs/project-plan.md`, `docs/testing.md`, `docs/ai-workflow.md`, `docs/pitch.md`. Giữ nguyên các thay đổi có sẵn khác trong worktree.

Giữ nguyên skill với SHA-256 `FA0735D3EA32B86B431ECEFE2369ED1ABB12378567C8A11779648FA8B530CB4F`, danh mục phim/poster/nguồn và công thức điểm. Không thêm dependency, backend, cơ sở dữ liệu hoặc API ngoài; không commit/push/merge/xuất bản.

Chưa kiểm thử trên điện thoại vật lý, bàn phím ảo thật, Safari/Firefox hoặc screen reader. Thống kê/phiên/quyền sở hữu là logic demo client; localStorage không tạo ranh giới bảo mật production và không đồng bộ thiết bị. Thiếu Web Locks chỉ có hàng đợi trong từng trang. Không tự chấm mức điểm rubric.

## Nghiệm thu Authentication và Personal Watchlist — 23/10/2026

Phần này lưu kết quả giai đoạn trước khi hồ sơ được chuyển sang trang riêng. Báo cáo website nền ngày 22/10/2026 được giữ bên dưới để phân biệt các lượt kiểm thử.

Môi trường: Windows, Chrome headless qua HTTP localhost, hồ sơ trình duyệt QA riêng. Không thêm dependency hoặc backend vào sản phẩm. Suite chạy các hàm thật và HTML thật qua iframe; kiểm tra tương tác bổ sung dùng Chrome DevTools Protocol (CDP), có hai tab trình duyệt riêng.

```text
HTTP TESTS: Hoàn tất: 87 đạt, 0 lỗi.
PASS: Real second tab restores remembered account and A Quiet Place
PASS: Real tabs preserve both concurrent Watchlist additions
PASS: Real second tab updates Watchlist and header from storage events
PASS: Logout invalidates non-remembered sessions in a separate tab
PASS: Native Tab moves from identity to password in login modal
PASS: Native Enter submits login and restores account header
PASS: Modal retains focus after Tab 0 ... Tab 11
PASS: Native Escape closes dialog and restores login trigger focus
PASS: Registration submit stays reachable with a 430px viewport
BROWSER ERRORS: 0
```

Các dòng CDP không được cộng vào số 87 bài trong suite. Lượt kiểm tra riêng tiếp theo xác nhận thêm hover bằng chuột, điều hướng từ mặt sau poster và Shift+Tab thật; không ghi nhận lỗi browser ở lượt đó. Sau các điều chỉnh cuối về khoảng trống nút hiện mật khẩu và xử lý chuyển form khi đang chờ, suite chạy lại vẫn đạt **87/87**.

### Đối chiếu 28 tình huống bắt buộc

“Đạt” dưới đây chỉ áp dụng cho môi trường và phương pháp đã nêu, không suy rộng sang mọi trình duyệt/thiết bị.

| # | Tình huống | Bằng chứng đã chạy | Kết quả |
| --- | --- | --- | --- |
| 1 | Đăng ký tài khoản mới | Form thật tạo tài khoản và cập nhật header; dịch vụ tạo A/B | Đạt |
| 2 | Không trùng email | Dịch vụ từ chối trùng, gồm email hoa/thường và khoảng trắng | Đạt |
| 3 | Không trùng username | Dịch vụ từ chối khác hoa/thường; hai đăng ký đồng thời chỉ một thành công | Đạt |
| 4 | Không đăng nhập bằng mật khẩu sai | Từ chối mật khẩu sai; mật khẩu cũ không dùng được sau khi đổi | Đạt |
| 5 | Đăng nhập cập nhật header | Form login thực tế và Enter thật qua CDP | Đạt |
| 6 | Refresh giữ đúng phiên | Login ghi nhớ rồi reload; phiên hết hạn chuyển thành khách | Đạt |
| 7 | Chuyển trang giữ phiên | Trang chủ/chi tiết/Watchlist dùng cùng account; tab thứ hai khôi phục phiên ghi nhớ | Đạt |
| 8 | Đăng xuất về khách | Header và form riêng cập nhật; đăng xuất vô hiệu hóa phiên tab khác | Đạt |
| 9 | A lưu A Quiet Place | Thêm bằng ID `a-quiet-place` | Đạt |
| 10 | Watchlist hiển thị đúng phim | DOM kiểm tra tiêu đề/poster và số phim của A | Đạt |
| 11 | Nhấn poster mở đúng A Quiet Place | Nhấn liên kết thật, chờ trang chi tiết có đúng h1 và account | Đạt |
| 12 | Nút chi tiết hiện trạng thái đã lưu | `aria-pressed=true` ở A Quiet Place và Interstellar | Đạt |
| 13 | Toggle lần nữa xóa phim | A Quiet Place và Interstellar đổi từ đã lưu sang chưa lưu rồi thêm lại | Đạt |
| 14 | Không lưu trùng | Thêm cùng ID nhiều lần; hai trang đồng thời thêm cùng phim chỉ một bản ghi | Đạt |
| 15 | Refresh không mất Watchlist | Mở lại Watchlist và trang chi tiết; dữ liệu và trạng thái vẫn đúng | Đạt |
| 16 | B không thấy Watchlist A | B chỉ có Arrival; điều kiện tra cứu của A không chuyển sang B | Đạt |
| 17 | A đăng nhập lại còn dữ liệu | Khôi phục đúng A Quiet Place/Interstellar và bộ lọc của A | Đạt |
| 18 | Tìm kiếm Watchlist | Chuỗi con, hoa/thường/khoảng trắng; truy vấn không khớp có trạng thái rỗng | Đạt |
| 19 | Lọc và sắp xếp | Tìm + thể loại + năm + khoảng điểm kết hợp; sort title/ngày/điểm; Xóa bộ lọc giữ query/sort/size | Đạt |
| 20 | 10/20/50/All | 20 phim thật tạm thêm vào account; kiểm tra số thẻ, trang 2 và khôi phục sau tải lại; pipeline 37 bản ghi thử riêng | Đạt |
| 21 | Review CRUD đúng quyền | A thêm/sửa/xóa; đăng nhập B thật không có nút sửa/xóa và bị chặn khi gọi hàm với cả ID A lẫn B | Đạt |
| 22 | Tính lại điểm nội bộ/tổng hợp | Thêm 4,5 sao, sửa 3,5 sao, xóa và so sánh số liệu/dashboard theo công thức cũ | Đạt |
| 23 | Poster, hover, flip | Tất cả 29 ảnh tải/giải mã; DOM flip; Enter/Space/cảm ứng mô phỏng; chuột thật làm poster nâng và hiện nhãn | Đạt |
| 24 | Xem chi tiết điều hướng đúng | Liên kết từ mặt sau poster được nhấn thật, h1 khớp phim đã chọn; URL sai có trạng thái không tìm thấy | Đạt |
| 25 | Modal/dropdown desktop/mobile | DOM ở 360/1440px; nhãn/lỗi/toggle; Arrow/Home/End/Escape; Tab/Shift+Tab thật; ảnh và viewport thấp 430px | Đạt trong Chrome mô phỏng |
| 26 | Không lỗi JS nghiêm trọng | Runtime/Log CDP trong lượt đầy đủ và lượt kiểm tra riêng: 0 lỗi ghi nhận | Đạt |
| 27 | Tài nguyên quan trọng hợp lệ | 20 poster/9 backdrop; đường dẫn CSS/JS/HTML cục bộ; lượt cuối không có lỗi network ghi nhận | Đạt |
| 28 | Không thay dữ liệu phim gốc | So sánh JSON trước/sau các thao tác tài khoản/Watchlist; danh mục đóng băng sâu | Đạt |

### Kiểm tra bổ sung

- Phiên có `issuedAt`/`expiresAt`; phiên ghi nhớ đúng 30 ngày. Dịch vụ kiểm tra hết hạn ngay trước ghi, không phụ thuộc việc nút còn hiển thị.
- Hai trang ghi đồng thời hai review không làm mất bản ghi; bản sửa cũ bị từ chối khi mốc cập nhật đã đổi.
- Hồ sơ có đủ tìm title/lọc mức điểm/sort/size/phân trang và liên kết về review trong phim.
- Đổi username cập nhật tác giả và avatar trên review; kiểm tra nội dung img/script không tạo node hoặc thực thi.
- Account JSON hỏng được giữ nguyên; sự kiện storage với `key=null` không làm trang lỗi. Quota và SecurityError account được mô phỏng bằng phương thức Storage ném lỗi trong trang thật, sau đó khôi phục.
- Review lỗi/quota/bị chặn tiếp tục kiểm tra với provider độc lập; dữ liệu lỗi trên đĩa được giữ, thay đổi trong bộ nhớ có thông báo giới hạn.
- Bộ kiểm thử khôi phục account/session/logout/theme/review và trạng thái tra cứu đã chụp trong `finally`. Nên chạy trong profile QA riêng và không dùng ứng dụng đồng thời trong lúc suite đang chạy.
- Kiểm tra HTML trang chủ/chi tiết/Watchlist/test: không có CSS/JS/event inline, mọi đường dẫn cục bộ tồn tại. `git diff --check` không báo lỗi whitespace.
- Hash skill vẫn là `FA0735D3EA32B86B431ECEFE2369ED1ABB12378567C8A11779648FA8B530CB4F`.

### Ảnh và công cụ QA

Minh chứng tạm trong `%TEMP%\khung-hinh-auth-qa\`:

- `http-test-dom.html`: kết quả suite 87 bài của mã cuối.
- `auth-final-qa.ps1`: runner HTTP/CDP, hai tab, keyboard và capture. Dùng `-TestsOnly` nếu chỉ chạy suite.
- `auth-targeted-qa.ps1`: kiểm tra chuột hover, liên kết detail và Shift+Tab.
- `browser-errors.txt`: không có lỗi ở lượt ghi cuối.
- `watchlist-desktop.png`, `watchlist-mobile.png`, `profile-mobile.png`, `password-mobile.png`, `login-desktop.png`, `register-mobile.png`, `register-keyboard.png`; các ảnh trang chủ/chi tiết light/dark.

Đã xem ảnh Watchlist desktop/mobile, hồ sơ mobile, đăng nhập desktop, đăng ký mobile và đổi mật khẩu mobile. Việc xem ảnh phát hiện checkbox ghi nhớ chịu ảnh hưởng của rule input chung; đã tăng specificity để checkbox có kích thước 16px và nằm cạnh nhãn. Kiểm tra CDP phát hiện Tab thoát lên thanh trình duyệt; đã bổ sung vòng focus và chạy lại với 12 lần Tab, Shift+Tab và Escape.

Một lượt capture trước gặp favicon 404 từ môi trường kiểm thử; lượt nghiệm thu dùng cổng/profile riêng xác nhận không có lỗi network ghi nhận. Một lượt sandbox không kết nối được debugger; công cụ QA được chạy lại qua cơ chế phê duyệt. Server chỉ phục vụ file tĩnh trên loopback, không phải backend của website. Các tiến trình QA đã kết thúc; file tạm có thể bị hệ điều hành dọn.

### Phạm vi file và giới hạn

Trong lượt hoàn thiện này sửa `js/auth.js`, `js/watchlist.js`, `js/movie-detail.js`, `js/storage.js`, `js/reviews.js`, `css/style.css`, `tests/run-tests.js`, `README.md`, `docs/project-plan.md`, `docs/ai-workflow.md`, `docs/testing.md`; thêm `docs/pitch.md`. HTML hiện có đã nạp đúng các mô-đun nên không cần sửa. Các thay đổi khác đang có trong worktree được giữ nguyên.

Đây vẫn là demo frontend trong một origin, không phải authentication production. Chưa kiểm tra điện thoại vật lý, bàn phím ảo thật, Firefox/Safari hoặc screen reader. Viewport 430px là mô phỏng chiều cao bị thu hẹp; không gọi đó là kiểm thử bàn phím điện thoại thật. Trình duyệt không có Web Locks chỉ được xếp hàng ghi trong từng trang, chưa có bảo đảm khóa nhiều tab. Không có bảng chấm riêng ngoài rubric trong prompt, không tự kết luận mức điểm 90–100%.

## Báo cáo website nền — lưu từ 22/10/2026

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
