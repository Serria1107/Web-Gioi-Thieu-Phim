# Skill: Quản lý và phát triển website

## 1. Mục tiêu và phạm vi

Skill này hướng dẫn AI trong toàn bộ quá trình phân tích, thiết kế, lập trình, nâng cấp và bảo trì dự án website. Áp dụng các quy tắc dưới đây nhất quán cho mọi yêu cầu liên quan đến dự án.

Khi dự án đã tồn tại:

- Giữ nguyên các file hiện có và chỉ tạo thư mục/file còn thiếu khi được yêu cầu.
- Không tự ý xóa, ghi đè hoặc thay đổi cấu trúc đang hoạt động nếu chưa được người dùng đồng ý.
- Không tự ý tạo thêm Skill khác.
- Không tự ý sửa nội dung Skill này, trừ khi người dùng yêu cầu.

## 2. Công nghệ bắt buộc

- Chỉ sử dụng HTML5, CSS3 và JavaScript thuần (Vanilla JavaScript).
- Không sử dụng React, Vue, Angular, Next.js hoặc framework frontend khác.
- Không sử dụng TypeScript, JSX hoặc TSX.
- Không sử dụng thư viện UI hoặc CSS framework như Bootstrap, Tailwind CSS nếu chưa được người dùng cho phép.
- Ưu tiên JavaScript ES6+.
- HTML phải sử dụng các thẻ semantic phù hợp.
- Website phải tương thích với Visual Studio Code và chạy được bằng Live Server.
- Không tự ý thay đổi công nghệ hoặc bổ sung dependency.

## 3. Quy tắc bắt buộc cho mọi danh sách dữ liệu

Bất kỳ tính năng nào hiển thị danh sách dữ liệu đều phải có tìm kiếm, lọc, sắp xếp và phân trang. Các tính năng này phải được xử lý thực tế bằng JavaScript, không chỉ dựng giao diện.

### 3.1. Tìm kiếm

- Cung cấp ô tìm kiếm rõ ràng.
- Bắt buộc tìm kiếm theo `title`.
- Tìm kiếm không phân biệt chữ hoa và chữ thường.
- Ưu tiên hỗ trợ tìm kiếm tiếng Việt không dấu.
- Cập nhật kết quả ngay khi người dùng nhập dữ liệu.

### 3.2. Lọc dữ liệu

- Cung cấp bộ lọc phù hợp với loại dữ liệu.
- Cho phép kết hợp nhiều điều kiện lọc nếu cần.
- Bộ lọc phải hoạt động đồng thời với tìm kiếm và sắp xếp.
- Không tự ý tạo bộ lọc không có ý nghĩa đối với dữ liệu.

### 3.3. Sắp xếp

- Bắt buộc sắp xếp theo `title`.
- Hỗ trợ hai chế độ A → Z và Z → A.
- Có thể bổ sung tiêu chí sắp xếp khác nếu dữ liệu phù hợp.
- Cập nhật kết quả ngay sau khi thay đổi chế độ sắp xếp.

### 3.4. Phân trang

Bắt buộc cung cấp các lựa chọn:

- 10 mục/trang.
- 20 mục/trang.
- 50 mục/trang.
- All — hiển thị tất cả.

Ngoài ra:

- Có nút Previous và Next.
- Hiển thị số trang hiện tại và tổng số trang.
- Hiển thị tổng số kết quả sau khi tìm kiếm và lọc.
- Tự động điều chỉnh trang khi số lượng kết quả thay đổi.
- Không hiển thị trang trống do bộ lọc hoặc tìm kiếm.
- Khi chọn All, không giới hạn số phần tử hiển thị.

### 3.5. Trình tự xử lý

Luôn xử lý theo trình tự:

**Dữ liệu gốc → Tìm kiếm → Lọc → Sắp xếp → Phân trang → Hiển thị**

## 4. Quy tắc thiết kế giao diện

Toàn bộ website sử dụng phong cách **Glass Morphism kết hợp Dark Minimalism**.

### 4.1. Bảng màu

- Background chủ đạo: `#121212`.
- Text chính: `#F5F5F5`.
- Background phụ: các sắc độ xám đen.
- Border: trắng hoặc xám có độ trong suốt thấp.
- Màu phụ phải hài hòa với nền tối.
- Hạn chế màu neon, màu quá sáng hoặc quá sặc sỡ.
- Định nghĩa và dùng chung CSS variables để đảm bảo tính nhất quán.

### 4.2. Glass Morphism

Áp dụng có chọn lọc:

- Nền bán trong suốt.
- Hiệu ứng `backdrop-filter: blur()`.
- Đường viền mờ.
- Đổ bóng nhẹ.
- Bo góc hiện đại.
- Hiệu ứng hover và transition mềm mại.

Không lạm dụng blur làm giảm hiệu năng hoặc khả năng đọc nội dung.

### 4.3. Trải nghiệm người dùng

- Thiết kế responsive cho desktop, tablet và mobile.
- Bố cục rõ ràng, dễ quan sát.
- Khoảng cách giữa các thành phần nhất quán.
- Chữ có độ tương phản tốt.
- Thành phần tương tác có trạng thái hover, focus và active khi phù hợp.
- Animation nhẹ nhàng, không gây rối mắt.
- Hạn chế dùng quá nhiều màu để phân biệt thành phần.
- Ưu tiên tính dễ sử dụng hơn hiệu ứng trang trí.

## 5. Quy tắc cấu trúc dự án

Tổ chức mã nguồn trong các thư mục riêng biệt theo chức năng. Cấu trúc tham khảo:

```text
project/
├── .skill/
│   └── skill.md
├── css/
│   ├── style.css
│   ├── components.css
│   └── responsive.css
├── js/
│   ├── main.js
│   ├── search.js
│   ├── filter.js
│   ├── sort.js
│   └── pagination.js
├── images/
├── videos/
├── assets/
└── index.html
```

Đây là cấu trúc tham khảo. Chỉ tạo file thực sự cần thiết; không tạo file rỗng không có mục đích. Với dự án hiện hữu, không ép cấu trúc tham khảo này lên dự án hoặc di chuyển file nếu chưa được người dùng duyệt.

Quy tắc bắt buộc:

- CSS nằm trong file `.css` riêng.
- JavaScript nằm trong file `.js` riêng.
- Không viết CSS trực tiếp trong thẻ `style` của HTML.
- Không sử dụng inline CSS.
- Không viết JavaScript trực tiếp trong thẻ `script` của HTML.
- Không sử dụng inline JavaScript như `onclick`.
- HTML chỉ đảm nhiệm cấu trúc nội dung.
- CSS đảm nhiệm trình bày giao diện.
- JavaScript đảm nhiệm xử lý logic và tương tác.
- Tái sử dụng các phần code dùng chung để tránh trùng lặp.
- Đường dẫn tài nguyên phải phù hợp với cấu trúc thư mục.

## 6. Lập kế hoạch và chờ phê duyệt trước khi code

Trước mọi thao tác tạo mới, chỉnh sửa, nâng cấp hoặc xóa code:

1. Đọc file `.skill/skill.md` trước khi lập kế hoạch.
2. Phân tích yêu cầu hiện tại và đối chiếu với các quy tắc trong Skill.
3. Nếu có xung đột, thông báo rõ và đề xuất phương án xử lý.
4. Trình bày kế hoạch gồm:
   - Mục tiêu cần thực hiện.
   - File và thư mục dự kiến bị ảnh hưởng.
   - Các bước thực hiện.
   - Tính năng sẽ được thêm, sửa hoặc loại bỏ.
   - Ảnh hưởng có thể xảy ra đối với tính năng hiện tại.
   - Phương án đề xuất và lựa chọn thay thế nếu có.
5. Sau khi trình bày kế hoạch, chờ người dùng lựa chọn hoặc xác nhận rồi mới thực hiện.

Không được vừa lập kế hoạch vừa tự động chỉnh sửa code khi chưa nhận được đồng ý. Quy tắc lập kế hoạch trước khi code áp dụng cho các yêu cầu code về sau; không ngăn cản việc thực hiện những thay đổi cụ thể mà người dùng đã trực tiếp yêu cầu và giới hạn rõ phạm vi.

## 7. Xác nhận thay đổi

Khi đề xuất thay đổi:

- Giải thích rõ nội dung và lý do thay đổi.
- Cho biết file nào bị ảnh hưởng.
- Đưa ra lựa chọn cho người dùng trước khi thực hiện.
- Tối thiểu cung cấp:
  - **Phương án A:** Đồng ý thực hiện thay đổi.
  - **Phương án B:** Giữ nguyên hiện trạng.
- Nếu có nhiều phương án kỹ thuật, trình bày các lựa chọn phù hợp cùng ưu và nhược điểm.
- Không tự ý quyết định thay người dùng.

Sau khi kế hoạch được duyệt, có thể thực hiện toàn bộ công việc trong phạm vi kế hoạch mà không cần hỏi lại từng thao tác nhỏ. Nếu phát sinh thay đổi ngoài phạm vi kế hoạch, phải xin xác nhận bổ sung.

## 8. Bảo vệ mã nguồn và dữ liệu

- Không tự ý xóa chức năng hiện có.
- Không tự ý đổi tên file, thư mục, class, ID hoặc function nếu có thể ảnh hưởng đến thành phần khác.
- Không viết lại toàn bộ dự án khi chỉ cần sửa một phần.
- Ưu tiên chỉnh sửa tối thiểu để đạt yêu cầu.
- Không làm mất dữ liệu hoặc thay đổi định dạng lưu trữ khi chưa được chấp thuận.
- Không tự ý thực hiện Git commit, push, merge, reset hoặc xóa branch.
- Nếu phát hiện lỗi ngoài phạm vi yêu cầu, thông báo và đề xuất cách xử lý; không tự tiện mở rộng phạm vi sửa chữa.

## 9. Kiểm tra chất lượng sau thay đổi đã được duyệt

Sau mỗi lần lập trình hoặc chỉnh sửa đã được phê duyệt, kiểm tra:

- HTML có cấu trúc hợp lệ.
- Các file CSS và JavaScript được liên kết đúng.
- Không có lỗi JavaScript rõ ràng.
- Giao diện responsive.
- Không làm hỏng chức năng cũ.
- Các nút bấm và chức năng tương tác hoạt động.
- Tìm kiếm, lọc, sắp xếp và phân trang hoạt động kết hợp chính xác.
- Màu sắc đúng quy chuẩn.
- Không vi phạm các quy tắc trong file này.

Không khẳng định website đã chạy hoặc kiểm thử thành công nếu chưa thực sự kiểm tra được. Báo cáo rõ những kiểm tra đã chạy và những gì chưa thể xác minh.

## 10. Quy trình ưu tiên cho mọi yêu cầu dự án

1. Đọc `.skill/skill.md`.
2. Phân tích yêu cầu hiện tại.
3. Đối chiếu yêu cầu với các quy tắc trong Skill.
4. Thông báo và đề xuất nếu phát hiện xung đột.
5. Lập kế hoạch.
6. Chờ người dùng phê duyệt.
7. Thực hiện các thay đổi đã được duyệt.
8. Kiểm tra kết quả.
9. Báo cáo các file đã thay đổi và kết quả kiểm tra.

Không tự ý tạo Skill khác hoặc sửa nội dung Skill này nếu người dùng không yêu cầu.
