# Nhật ký phối hợp với AI

Tài liệu chỉ ghi lại các yêu cầu và thao tác thật trong phiên này. Không tạo lịch sử prompt, kiểm thử hoặc tiến độ hồi tố.

## 1. Yêu cầu và phê duyệt

Người dùng gửi prompt tiếng Việt về website giới thiệu/đánh giá phim, yêu cầu đọc Skill, khảo sát và dừng trước lập trình. AI đọc `.skill/skill.md`, kiểm tra cây file và trạng thái Git, đọc bản HEAD bằng thao tác chỉ đọc, rồi trình bày kế hoạch hai phương án.

Phê duyệt thực tế tiếp theo của người dùng: **“phương án 1”**. Việc triển khai bắt đầu sau phê duyệt này. Không sửa Skill hoặc tự phục hồi file ngoài danh sách đã duyệt.

## 2. Quyết định giao diện

Yêu cầu gốc: phong cách điện ảnh, Glass Morphism, sáng/tối, poster chính thức, flip 3D và chi tiết riêng. Giải pháp: nhận diện Khung Hình, palette trung tính/xanh ngọc, một hero Top Gun: Maverick với ảnh Paramount; một thư viện có đầy đủ công cụ tra cứu. Font hệ thống, SVG tự viết; không dùng thư viện hoặc ảnh AI.

Kiểm chứng: DOM và ảnh chụp bằng Chrome được báo riêng trong testing.md. Chưa đồng nhất ảnh chụp với bằng chứng thao tác cảm ứng thực tế.

## 3. Dữ liệu và xác minh

AI mở trang nhà phát hành, Metacritic và Letterboxd. Một số tên phim trùng dẫn tới trang khác: Moonlight trên Metacritic phải dùng hậu tố `moonlight-2016`; Arrival, Gladiator, Titanic, A Quiet Place và The Farewell trên Letterboxd cũng cần hậu tố năm. Điểm và nguồn sai phim không được nhập vào danh mục.

Khác biệt thời lượng giữa Paramount và Metacritic được giữ rõ trong sources.md; không tự đoán bản dựng. Một số trang nhà phát hành bị chặn khi truy cập trực tiếp từ shell, nên URL ảnh được xác minh qua trang nguồn bằng công cụ web, sau đó tải từ CDN chính thức. Không khai báo các nguồn không đọc được là đã xác minh.

## 4. Điểm tổng hợp

Yêu cầu gốc nêu rõ chuẩn hóa điểm, tách chuyên gia/khán giả/nội bộ và trọng số nhóm. AI tách `scores.js` thành hàm độc lập, dùng null cho dữ liệu thiếu, loại tỷ lệ tích cực và điểm chưa xác minh, chỉ làm tròn khi hiển thị.

Kiểm chứng gồm nhiều nguồn trong một nhóm, thiếu nhóm, điểm 0 hợp lệ, sai thang, NaN/Infinity và không làm tròn trung gian. Các ca chạy thật được ghi trong testing.md.

## 5. Review và lưu trữ

Review được hiển thị bằng textContent/DOM API. Storage có schema phiên bản, validation, ID ổn định và bản ghi gắn ID phim. Nếu dữ liệu cũ lỗi, giữ nguyên bản lưu và chỉ dùng bộ nhớ cho thay đổi mới; nếu quota đầy, thông báo thay vì tuyên bố đã lưu bền vững.

AI dùng storage provider có thể thay thế trong kiểm thử để mô phỏng SecurityError/QuotaExceededError mà không thêm thư viện. Các dữ liệu mô phỏng chỉ tồn tại trong bộ kiểm thử.

## 6. Kiểm thử và giới hạn

Môi trường không có Node/npm trên PATH; có Chrome. Bộ kiểm thử là HTML/JS thuần chạy trong trình duyệt, kết hợp hàm độc lập và trang thật qua iframe. Hồ sơ Chrome tạm tách khỏi hồ sơ người dùng. Ảnh chụp kiểm tra giao diện lưu ở thư mục tạm, không đưa vào dữ liệu sản phẩm.

Không có prompt sửa lỗi riêng do người dùng gửi trong giai đoạn triển khai; các kiểm tra và điều chỉnh là phần AI tự thực hiện trong phạm vi đã duyệt. Không tạo commit, CI, PR, board công việc hoặc kết quả Lighthouse giả.

## 7. Phần mở rộng tài khoản và Watchlist (23/10/2026)

Người dùng cung cấp yêu cầu nâng cấp frontend-only, yêu cầu đọc Skill trước khi sửa. AI khảo sát file `.skill/skill.md`, hiện trạng HTML/CSS/JS, ID phim/route, localStorage, công thức điểm, CRUD review và trạng thái Git. Theo quy trình phê duyệt của Skill, AI trình bày kế hoạch/file dự kiến cùng giới hạn xác thực frontend; người dùng duyệt đầy đủ phạm vi và chọn giữ review cũ không có owner ở chế độ chỉ đọc.

Triển khai tái sử dụng `movie.html?id=...`, ID phim và hàm `scores.calculate` hiện có. Tài khoản demo lưu trong localStorage; mật khẩu được dẫn xuất bằng PBKDF2/Web Crypto với salt ngẫu nhiên nhưng đây không phải ranh giới bảo mật phía máy chủ. Modal quên mật khẩu chỉ nêu giới hạn, không giả gửi email. Watchlist lưu movie ID/ngày thêm theo từng account. Review mới gắn ownerId, review legacy giữ nguyên và không tự gán người sở hữu. UI review 0,5–5 sao quy đổi về 1–10 để bảo toàn công thức trước đó.

Kiểm thử được chạy qua trình duyệt trên HTTP localhost vì mở `file://` không chia sẻ vùng lưu trữ nhất quán và Web Crypto cần secure context. Python và Node không có sẵn trong PATH; một HTTP server tĩnh PowerShell tạm được dùng thay thế, không thêm file/dependency vào dự án. Kết quả cụ thể chỉ được cập nhật sau lượt suite cuối. Không tạo commit hoặc push.

## 8. Hoàn thiện sau xác nhận “phương án 1” (23/10/2026)

Prompt đầu vào là tệp đính kèm “PROMPT NÂNG CẤP WEBSITE PHIM: AUTHENTICATION & PERSONAL WATCHLIST”. AI đọc skill và khảo sát mã có sẵn; kết luận triển khai hiện tại còn thiếu TTL phiên, lưu trạng thái tra cứu Watchlist, công cụ danh sách review trong hồ sơ và một số xử lý lỗi/focus. AI trình bày phương án hoàn thiện; người dùng trả lời **“phương án 1”** trước khi sửa mã trong lượt này.

Các quyết định thực hiện: tái sử dụng ID và route phim; không đổi công thức điểm; không thêm backend, dependency hoặc ảnh mới. PBKDF2 tiếp tục dùng Web Crypto. Phiên tab 12 giờ và phiên ghi nhớ 30 ngày; dấu thời gian đăng xuất vô hiệu hóa phiên cũ giữa các tab. Web Locks bảo vệ các chu trình đọc/sửa/ghi account và review; trình duyệt thiếu Web Locks dùng hàng đợi từng trang. Form sửa review kiểm tra mốc cập nhật để không ghi đè một bản sửa mới. Tên/avatar review tra từ account; bản nháp không chuyển sang tài khoản khác.

Phản hồi từ kiểm thử có thật: lượt đầu mở rộng suite đạt 82/83 bài. Ca “ID review không được chuyển sang phim khác” phát hiện việc đọc lại provider giả lập trả về rỗng làm mất bản ghi trong kho kiểm thử. Sửa bằng cách chỉ đọc lại trước thao tác đối với kho ứng dụng có actor; các factory độc lập giữ hành vi cũ. Các lượt tiếp theo đạt 86/86 bài, bao gồm viết đồng thời từ hai trang và từ chối form sửa cũ.

Công cụ QA là Chrome headless, HTTP server tĩnh và CDP bằng PowerShell trong thư mục tạm, dùng hồ sơ riêng. Lần chạy sandbox không kết nối được cổng debugger; AI chạy lại qua cơ chế phê duyệt công cụ. Runner dùng handle tiến trình Chrome do chính nó tạo để dọn dẹp, không liệt kê hoặc dừng trình duyệt thường của người dùng. Không cài Node/Python hoặc thư viện vào dự án. Kết quả nghiệm thu cuối, ảnh chụp và phần chưa xác minh được ghi riêng trong `testing.md`; không tạo lịch sử prompt hoặc điểm rubric giả.

Kiểm tra tương tác thật phát hiện Tab có thể rời modal lên thanh trình duyệt; bổ sung vòng focus Tab/Shift+Tab và xác nhận lại bằng Input CDP. Ảnh đăng nhập phát hiện checkbox bị rule input rộng ghi đè; chỉnh specificity, thêm kiểm tra kích thước và khoảng trống nút hiện mật khẩu. Lượt cuối suite đạt **87/87**; lượt đầy đủ và lượt kiểm tra chuột/Shift+Tab riêng không ghi nhận lỗi browser. Báo cáo không gộp các kiểm tra CDP vào số bài của suite và phân biệt viewport thấp với bàn phím ảo thật.

## 9. Hồ sơ riêng và quản lý tài khoản đầy đủ (23/10/2026)

Prompt mới: “PROMPT NÂNG CẤP WEBSITE KHUNG HÌNH — HỒ SƠ CÁ NHÂN, WATCHLIST VÀ QUẢN LÝ TÀI KHOẢN”. AI đọc lại skill, khảo sát module/route/schema và trình bày kế hoạch cụ thể. Người dùng trả lời **“1”**. Việc sửa bắt đầu sau xác nhận này; các thay đổi đang có trong worktree và skill được giữ nguyên.

Thiết kế tái sử dụng màu, font, header, nút và nguồn phim. Không lấy ảnh/banner/asset từ bên ngoài. Banner hồ sơ dùng CSS; avatar từ tệp thiết bị được kiểm tra và xử lý bằng API trình duyệt. Thay modal profile bằng `profile.html`; form đầy đủ nằm ở `profile-edit.html`. Avatar dùng một module chung cho header/profile/review. Watchlist dùng lại phần dựng thẻ và dữ liệu hiện có. Sửa review từ hồ sơ mở form ở trang chi tiết cũ, không tạo hệ thống review thứ hai.

Các quyết định dữ liệu: giữ keys/schema v1 và đọc trường mới bằng mặc định; không rewrite bản lưu chỉ vì đọc. Account ID giữ nguyên sau đổi username/email. Tách displayName khỏi username đăng nhập. profileVersion phát hiện form sửa cũ; credentialVersion làm token cũ hết hiệu lực sau đổi mật khẩu. Thống kê tính trực tiếp từ review owned và Watchlist. Tổng quan chỉ phản ánh những mục đang còn trong dữ liệu, không giả lập log hoạt động đã xóa.

Lỗi phát hiện có thật: khi dùng chung hàm dựng card, `map(card)` truyền chỉ số mảng vào tham số heading mới, gây createElement với tên `0`. Chuyển sang callback truyền một record khắc phục lỗi; các ca thất bại dây chuyền biến mất. Bài kiểm thử profile được chuyển từ modal sang điều hướng trang thật. Ảnh đầu ở 360px cho thấy nút chỉnh sửa ép hẹp tên; chỉnh flex để nút xuống hàng và bổ sung kiểm tra độ rộng tên.

Suite mở rộng đạt 110/110 trước kiểm tra ảnh; kiểm tra CDP xác nhận upload từ tệp, Enter lưu hồ sơ, ArrowRight đổi tab, hai tab thật đồng bộ, form mật khẩu yêu cầu đăng nhập lại và token cũ bị từ chối. Avatar fixture và account/review mẫu chỉ tồn tại trong profile QA/thư mục tạm, không được nhập vào danh mục hoặc source dữ liệu thật. Lượt cuối bổ sung ca phân trang 24 review và kiểm tra lại bố cục; kết quả cuối ghi tại `testing.md`.

Lượt nghiệm thu cuối đạt **111/111** bài suite, các kiểm tra tương tác nêu trên đều đạt, Runtime/Log ghi nhận **0 lỗi**. Đã xem ảnh cuối sau chỉnh bố cục tên trên mobile. Các kết quả này giới hạn trong Chrome và kích thước màn hình mô phỏng; không ghi thành đã kiểm thử trên thiết bị vật lý hoặc screen reader.

## 10. Sửa cú bấm menu không chuyển trang (23/10/2026)

Người dùng phản ánh liên kết chưa hoạt động và gửi video. Tái hiện bằng chuột CDP cho thấy cả ba route đã có href nhưng menu bị ẩn trong khoảng blur/focusout, trước khi liên kết nhận focus và click. Các bài trước dùng `.click()` nên bỏ qua chuỗi sự kiện chuột gây lỗi này. Sửa trong phạm vi điều hướng tài khoản đã được duyệt: dùng `event.relatedTarget` thay vì kiểm tra `document.activeElement` trong microtask.

Bổ sung ca hồi quy mô phỏng chuyển focus trong iframe; mô phỏng rõ cả điểm đến bên trong và bên ngoài menu vì headless không luôn phát sự kiện focus cho iframe nền. Suite cuối đạt **112/112**. Kiểm tra riêng bằng chuột thật qua CDP đạt 15 chuyển trang từ năm trang nguồn, chạm mô phỏng 360px đạt ba route, Đổi mật khẩu và Đăng xuất nhận cú bấm; Runtime/Log không có lỗi. Không thay đổi dữ liệu người dùng, thêm thư viện hoặc triển khai website.

## 11. Thực hiện lại bản hoàn chỉnh theo yêu cầu người dùng

Yêu cầu: “thực hiện lại bản hoàn chỉnh của đoạn chat này cho tôi 1 lần nữa”. Khảo sát thực tế thấy nhánh `Dev_Dat` đang ở bản website nền, chưa có auth/watchlist/profile; file quy tắc ở `skill.md` tại gốc. Đã đọc quy tắc tại vị trí thực tế, đối chiếu hai prompt đính kèm và các lựa chọn đã được duyệt, rồi thông báo phạm vi trước khi sửa.

Tìm thấy bản hoàn chỉnh gồm sửa lỗi focus menu tại commit `a19235c`. Áp lại có chọn lọc 23 file tính năng/tích hợp/kiểm thử/tài liệu; không checkout/reset/merge toàn bộ nhánh, không lấy việc xóa PROMPT_LOG hoặc đổi vị trí skill từ snapshot. Giữ nguyên dữ liệu phim, ảnh và công thức điểm. Đối chiếu prompt ban đầu phát hiện thiếu email trên hồ sơ riêng: thêm trường đọc từ tài khoản hiện tại, xử lý xuống dòng, xóa nội dung khi đăng xuất và mở rộng hai ca kiểm thử hiện có. README được sửa theo đường dẫn skill và cách chạy thực tế.

Chạy mới suite trên localhost bằng profile Chrome QA riêng đạt **112/112**. Lượt đầy đủ xác nhận upload tệp, Enter lưu/đăng nhập, ArrowRight đổi tab, cập nhật hai tab và vô hiệu hóa phiên cũ sau đổi mật khẩu; tạo 11 ảnh responsive. Lượt chuột/chạm riêng xác nhận 15 đường điều hướng bằng chuột, ba đường bằng chạm mô phỏng, mở form mật khẩu và đăng xuất; cả hai lượt không có lỗi Runtime/Log. Kiểm tra HTML không có đường dẫn thiếu hoặc mã inline. Đã xem ảnh hồ sơ mobile và chỉnh sửa desktop mới.

Không sửa file skill: SHA-256 hiện tại giữ nguyên `AEF6555299A2D5E316F28A1A578223ECD56ABF7C95E66276769DF0E0C07F970E`. Bằng chứng mới nằm trong `%TEMP%\khung-hinh-reapply-qa\`; chi tiết và giới hạn nằm ở đầu `testing.md`. Không commit, push, merge hoặc triển khai.
