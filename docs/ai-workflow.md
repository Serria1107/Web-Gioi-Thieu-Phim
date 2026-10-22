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
