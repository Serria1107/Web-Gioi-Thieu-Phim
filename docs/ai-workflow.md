# Sử dụng AI trong lần triển khai này

Tài liệu này ghi lại công việc trong phiên hiện tại; không đại diện cho lịch sử phát triển trước đó.

## Prompt và mục tiêu

- Người dùng cung cấp prompt yêu cầu xây dựng website khám phá phim và rubric UI/UX, JavaScript, dữ liệu, Agile/Git, Vibe Coding và pitching.
- Trước khi sửa code, đã đọc `.skill/skill.md`, kiểm tra README, cấu trúc thư mục, nhánh `main` và lịch sử hiện có.
- Theo yêu cầu trong Skill và prompt, kế hoạch triển khai được trình bày và người dùng xác nhận trước khi bắt đầu.

## AI đã hỗ trợ

- Xây dựng semantic HTML, CSS responsive/dark glass UI và JavaScript thuần.
- Tách 24 bản ghi phim khỏi logic giao diện; tạo pipeline tìm kiếm, lọc, sắp xếp, phân trang và lưu favorites.
- Tạo flip card, modal chi tiết, điều khiển carousel và tài liệu bàn giao.
- Kiểm tra UI và thao tác trong browser tích hợp.

## Đánh giá của con người và sửa lỗi

- Không sửa `.skill/skill.md` và không tạo commit.
- Điểm Rotten Tomatoes được đối chiếu với trang phim tương ứng và ghi ngày kiểm tra; dữ liệu không có nguồn sẽ không được tự suy đoán.
- Kiểm tra browser ban đầu phát hiện nút đóng dialog chưa được nối với hành động đóng. Đã thêm hành động đóng và thử lại bằng nút lẫn Escape.
- Rà soát Skill phát hiện dải card khám phá ban đầu tạo thêm một danh sách phim song song với catalog. Đã thay bằng lối tắt lọc/sắp xếp để catalog là danh sách phim duy nhất có đầy đủ controls.
- Tương tác tìm kiếm, lọc, phân trang, modal, yêu thích, poster và kích thước mobile đã được kiểm tra thủ công; chi tiết nằm trong [testing.md](./testing.md).

## Giới hạn

Không có lịch sử prompt/lỗi trước phiên này để ghi nhận, và không tạo giả lịch sử Agile/Git. Chưa có API cập nhật dữ liệu, backdrop riêng, trailer, test runner, CI hoặc kết quả Lighthouse. Mọi hạn chế chưa kiểm chứng đều được nêu trong README và tài liệu kiểm tra.
