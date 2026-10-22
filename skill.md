---
name: movie-website-conventions
description: Quy tắc lập kế hoạch, phê duyệt và phát triển website giới thiệu phim trong dự án này bằng HTML5, CSS và JavaScript.
---

# Quy tắc phát triển website giới thiệu phim

## 1. Phạm vi và cách hiểu

- Áp dụng khi tạo, sửa, di chuyển hoặc xóa code, tài nguyên, cấu hình và tài liệu trong dự án này, kể cả file hướng dẫn này.
- “Phải”, “luôn”, “không được” là yêu cầu bắt buộc. “Đề xuất”, “ví dụ” là gợi ý, không tự trở thành yêu cầu mới.
- Các giá trị mặc định trong file này áp dụng khi người dùng chưa chỉ định khác. Nếu yêu cầu mới mâu thuẫn quy tắc hiện tại, nêu rõ mâu thuẫn và để người dùng chọn trước khi sửa; không tự diễn giải thành ngoại lệ.
- Chỉ thực hiện phần việc thuộc yêu cầu đã duyệt. Không tự thêm tính năng, đổi giao diện, tái cấu trúc hoặc sửa nội dung ngoài phạm vi.
- Đây là tài liệu hướng dẫn tại đường dẫn người dùng yêu cầu `.skill/skill.md`. Không tự đổi tên, di chuyển hoặc tuyên bố rằng file đã được công cụ tự động nạp khi chưa xác minh.

## 2. Quy trình lập kế hoạch và phê duyệt

### 2.1. Khảo sát trước khi đề xuất

- Được đọc file, tìm kiếm, xem trạng thái Git và phân tích mà chưa cần xin duyệt vì các thao tác này không sửa dự án.
- Kiểm tra nội dung thực tế trên đĩa; không coi tab IDE đang mở là bằng chứng file vẫn tồn tại.
- Giữ nguyên thay đổi có sẵn của người dùng. Không khôi phục file bị xóa, ghi đè hoặc hoàn tác thay đổi ngoài yêu cầu.

### 2.2. Kế hoạch phải có trước khi sửa

Trình bày bằng tiếng Việt, đủ các mục sau; tác vụ nhỏ có thể gói trong một đoạn ngắn:

1. Mục tiêu và hành vi mong muốn sau thay đổi.
2. Phạm vi: file/thư mục dự kiến tạo, sửa, di chuyển hoặc xóa.
3. Các bước thực hiện và ảnh hưởng đến chức năng hiện có.
4. Các lựa chọn thực tế, khác nhau về kết quả hoặc phạm vi; nêu ưu/nhược điểm và phương án khuyến nghị.
5. Cách kiểm tra và tiêu chí hoàn thành.

Không tạo lựa chọn giả chỉ để đủ số lượng. Khi chỉ có một cách phù hợp, cho phép chọn thực hiện phương án cụ thể đó hoặc giữ nguyên và điều chỉnh yêu cầu.

### 2.3. Khi nào được thực hiện

- Sau khi trình bày lựa chọn, phải chờ câu trả lời chọn hoặc phê duyệt rõ ràng. Im lặng, hết thời gian chờ hoặc câu hỏi tiếp theo không phải phê duyệt.
- Câu trả lời như “1” phê duyệt phương án 1 của danh sách lựa chọn gần nhất khi tham chiếu rõ ràng.
- Nếu người dùng đã duyệt kế hoạch và phạm vi, thực hiện toàn bộ phần đó; không hỏi lại từng file hoặc từng dòng.
- Yêu cầu chung như “làm đẹp hơn” chưa xác định thiết kế cụ thể: phải đưa lựa chọn trước khi sửa.
- Yêu cầu sửa tiếp chưa nêu phương án cụ thể vẫn phải có kế hoạch và lựa chọn; không coi việc từng được duyệt là quyền sửa vô hạn.
- Khi cần thêm file, chức năng, phụ thuộc hoặc thay đổi hành vi ngoài kế hoạch, dừng phần phát sinh, giải thích lý do và chờ duyệt bổ sung. Có thể tiếp tục phần độc lập đã được duyệt.
- Ví dụ đúng: đã duyệt sửa tìm kiếm không dấu thì sửa logic và xử lý lỗi trong phạm vi đó. Ví dụ sai: đồng thời đổi bảng màu hoặc thêm trang đăng nhập.

## 3. Công nghệ được phép

- Code của website chỉ dùng HTML5, CSS thuần và JavaScript thuần chạy trên trình duyệt.
- Không thêm React, Vue, Angular, jQuery, Bootstrap, Tailwind, thư viện icon hoặc framework/thư viện tương tự, dù cài cục bộ hay nhúng qua CDN.
- Không thêm TypeScript, Sass/Less, backend, cơ sở dữ liệu hoặc quy trình biên dịch để xây dựng website nếu chưa có yêu cầu thay đổi quy tắc được duyệt.
- Được dùng API có sẵn của trình duyệt như DOM, `Intl.Collator`, `localStorage`, `matchMedia` và CSS custom properties; chúng không phải thư viện ngoài.
- Tài liệu Markdown, ảnh, video, font và dữ liệu không phải ngôn ngữ lập trình bổ sung. Không tự tải tài nguyên, dùng API ngoài hoặc thêm CDN; trình bày nguồn, mục đích và ảnh hưởng để người dùng chọn trước.
- CSS nằm trong file `.css`, liên kết bằng `<link rel="stylesheet">`. JavaScript nằm trong file `.js`, nạp bằng `<script src="..." defer>` hoặc module khi cấu trúc chạy phù hợp.
- Không viết thẻ `<style>`, thuộc tính `style`, JavaScript inline, `onclick` hoặc các thuộc tính xử lý sự kiện inline khác. Gắn sự kiện bằng `addEventListener`; dùng class hoặc thuộc tính trạng thái để đổi giao diện.
- Khi gặp code cũ vi phạm, báo rõ và đề xuất phạm vi sửa; không tự tái cấu trúc toàn dự án.

## 4. Cấu trúc file

Cấu trúc minh họa; chỉ tạo file/thư mục thực sự cần trong phạm vi đã duyệt:

```text
/
├── index.html
├── css/
│   ├── style.css        # Bố cục và thành phần giao diện
│   └── themes.css       # Biến màu sáng/tối, nếu cần tách riêng
├── js/
│   ├── app.js           # Khởi tạo và kết nối các chức năng
│   ├── movies.js        # Dữ liệu phim, khi dùng dữ liệu JavaScript cục bộ
│   ├── list.js          # Tìm kiếm, lọc, sắp xếp, phân trang nếu cần tách
│   └── theme.js         # Quản lý chế độ sáng/tối nếu cần tách
├── images/
├── video/
├── fonts/              # Chỉ khi sử dụng font cục bộ
├── docs/
└── .skill/
    └── skill.md
```

- HTML trang chính ở thư mục gốc; đề xuất vị trí rõ ràng trước khi thêm trang khác.
- File CSS vào `css/`, JavaScript vào `js/`, ảnh vào `images/`, video vào `video/`; không nhúng dữ liệu ảnh/video lớn trong code.
- File mới dùng tên chữ thường, không dấu, không khoảng trắng, phân tách từ bằng dấu gạch ngang, ví dụ `movie-detail.js`. Không tự đổi tên file hiện có.
- Dùng đường dẫn tương đối phù hợp với vị trí HTML; kiểm tra cả chữ hoa/thường để tránh lỗi khi chuyển môi trường.
- Tách trách nhiệm theo nhu cầu thực tế; không bắt buộc tạo tất cả file minh họa, không nhân bản dữ liệu giữa nhiều file.

## 5. Danh sách: phạm vi và dữ liệu

- “Danh sách” là tập bản ghi nội dung được lặp lại để người dùng tra cứu, ví dụ danh sách phim dạng thẻ hoặc bảng. Đổi cách trình bày không làm mất các chức năng bắt buộc.
- Menu điều hướng, breadcrumb, danh sách lựa chọn trong bộ lọc và danh sách văn bản trong tài liệu không phải danh sách dữ liệu cần phân trang.
- Mỗi danh sách dữ liệu phải có tìm kiếm, bộ lọc, sắp xếp theo `title` và phân trang, kể cả khi số mục hiện tại nhỏ hơn 10.
- Mỗi bản ghi có định danh ổn định và `title` dạng chuỗi không rỗng. Không dùng vị trí trên trang làm định danh.
- Nếu dữ liệu thiếu hoặc sai `title`, báo vấn đề và đề xuất cách xử lý; không âm thầm bỏ bản ghi hoặc tự bịa tiêu đề.
- Giữ nguyên tập dữ liệu nguồn. Tạo kết quả dẫn xuất để lọc/sắp xếp; thao tác giao diện không sửa dữ liệu gốc.

## 6. Tìm kiếm theo tiêu đề

- Chỉ tìm trong `title` theo mặc định; không tự mở rộng sang mô tả, diễn viên hoặc trường khác.
- So khớp chuỗi con, không phân biệt hoa/thường và dấu tiếng Việt. Chuẩn hóa Unicode, bỏ dấu kết hợp, chuyển `đ/Đ` thành `d`, bỏ khoảng trắng đầu/cuối và gộp khoảng trắng liên tiếp cho cả truy vấn lẫn tiêu đề khi so khớp.
- Giữ nguyên cách viết tiêu đề khi hiển thị; chuẩn hóa chỉ phục vụ tìm kiếm.
- Ví dụ: `  MAT   BIEC ` khớp `Mắt Biếc`; truy vấn rỗng hoặc toàn khoảng trắng không giới hạn kết quả.
- Cập nhật kết quả khi người dùng nhập, không bắt buộc bấm Enter. Nếu cần debounce vì dữ liệu lớn, nêu độ trễ trong kế hoạch.
- Đổi truy vấn đưa về trang 1, giữ nguyên bộ lọc, thứ tự sắp xếp và kích thước trang đang chọn.

## 7. Bộ lọc

- Bộ lọc phải dựa trên dữ liệu thực tế, ví dụ thể loại, năm phát hành hoặc quốc gia. Trình bày các trường lọc trong kế hoạch; không tự thêm dữ liệu giả để tạo bộ lọc.
- Mỗi bộ lọc có lựa chọn “Tất cả” nghĩa là không giới hạn trường đó; chỉ dùng lựa chọn có ý nghĩa với dữ liệu hiện có.
- Mặc định chọn “Tất cả” ở mọi bộ lọc.
- Kết hợp các trường lọc bằng AND: phim phải thỏa tất cả trường đang chọn và truy vấn tìm kiếm.
- Nếu được duyệt bộ lọc chọn nhiều giá trị trong cùng một trường, các giá trị đó kết hợp bằng OR. Ví dụ: (Hành động HOẶC Hài) VÀ năm 2024.
- Với trường có nhiều giá trị như thể loại, bản ghi khớp khi chứa giá trị đã chọn; không yêu cầu cả mảng phải bằng nhau.
- Đổi bộ lọc đưa về trang 1, giữ nguyên truy vấn, sắp xếp và kích thước trang.
- Có nút “Xóa bộ lọc”: chỉ đưa các trường lọc về “Tất cả” và trang 1, giữ truy vấn, sắp xếp và kích thước trang. Nếu cần nút đặt lại toàn bộ, đề xuất riêng và ghi rõ hành vi.

## 8. Sắp xếp theo title

- Luôn có hai lựa chọn rõ ràng: “Tiêu đề A–Z” và “Tiêu đề Z–A”. Mặc định là A–Z.
- Dùng quy tắc so sánh tiếng Việt, ví dụ `Intl.Collator('vi', { sensitivity: 'base', numeric: true })`, để xử lý chữ và số tự nhiên; không dùng phép so sánh mã ký tự đơn giản.
- `numeric: true` nghĩa là `Phim 2` đứng trước `Phim 10` khi tăng dần.
- Khi hai tiêu đề bằng nhau theo bộ so sánh, giữ thứ tự của chúng trong dữ liệu nguồn ở cả hai chiều; không đảo cả mảng đã sắp xếp để tạo chiều giảm nếu làm đảo nhóm trùng nhau.
- Sắp xếp toàn bộ kết quả đã tìm kiếm/lọc trước khi lấy dữ liệu cho trang hiện tại.
- Đổi thứ tự sắp xếp đưa về trang 1, giữ nguyên các điều kiện còn lại.

## 9. Phân trang và luồng xử lý

Luồng bắt buộc: **dữ liệu nguồn → tìm kiếm → lọc → sắp xếp → tính số kết quả/số trang → lấy trang → hiển thị**.

- Bộ chọn luôn có đủ bốn giá trị `10`, `20`, `50`, `all`; nhãn của `all` là “Tất cả”. Mặc định 10 mục/trang, bắt đầu ở trang 1.
- `all` hiển thị toàn bộ kết quả đang khớp tìm kiếm/bộ lọc, không khôi phục các bản ghi đã bị loại.
- Với kích thước số: số trang bằng làm tròn lên của tổng kết quả chia kích thước trang. Chỉ trang cuối được ít hơn kích thước đã chọn.
- Khi chọn `all` và có kết quả, coi là một trang; vô hiệu hóa các nút chuyển trang.
- Cung cấp nút “Trước”, “Sau” và thông tin trang hiện tại/tổng số trang. Vô hiệu hóa “Trước” ở trang đầu và “Sau” ở trang cuối; không cho truy cập trang 0 hoặc vượt trang cuối.
- Với kết quả không rỗng, hiển thị khoảng mục và tổng, ví dụ “Hiển thị 11–20 trên 37 kết quả”. Tổng này là sau tìm kiếm/lọc, không phải tổng dữ liệu nguồn.
- Khi không có kết quả: hiển thị “Không có kết quả phù hợp”, tổng 0, không hiện khoảng `1–0` hoặc trang `1/0`; ẩn hoặc vô hiệu hóa điều hướng trang. Trạng thái trang nội bộ có thể giữ 1 để xử lý lần tiếp theo.
- Khi dữ liệu thay đổi khiến trang hiện tại không hợp lệ, đưa về trang hợp lệ gần nhất; khi tìm kiếm, lọc, sắp xếp hoặc đổi kích thước trang, luôn về trang 1.
- Ví dụ: có 37 kết quả thì chế độ 10 có 4 trang, chế độ 20 có 2 trang, chế độ 50 và `all` có 1 trang.

## 10. Glass Morphism và khả năng đọc

- Áp dụng bề mặt kính cho các khối phù hợp như thanh đầu trang, thanh công cụ, thẻ phim và hộp thoại: nền bán trong suốt, `backdrop-filter: blur(...)`, viền mảnh và bóng mềm.
- Không giảm `opacity` toàn bộ khối làm chữ và nút bị mờ. Đặt độ trong suốt ở màu nền của bề mặt.
- Nếu trình duyệt không hỗ trợ làm mờ nền, dùng nền dự phòng đủ đậm/đục để nội dung vẫn đọc được.
- Dùng màu nền và màu chữ truyền thống: light mode nền trắng/xám nhạt, chữ tối; dark mode nền đen/xám đậm, chữ sáng. Không tự chuyển sang bảng màu neon hoặc nền màu bão hòa làm chủ đạo.
- Màu nhấn cho nút, liên kết và trạng thái được đề xuất khi duyệt thiết kế; không thay đổi màu chủ đạo đã duyệt.
- Khai báo màu qua CSS custom properties, tối thiểu cho nền trang, bề mặt kính, chữ chính/phụ, viền, màu nhấn và trạng thái focus. Cả hai chế độ dùng cùng hệ biến.
- Chữ, placeholder, viền ô nhập, nút và trạng thái hover/focus/disabled phải phân biệt được trong cả hai chế độ. Có focus nhìn thấy khi dùng bàn phím.
- Giao diện thích ứng điện thoại và máy tính; ở chiều rộng 360px không gây cuộn ngang toàn trang hoặc làm nút chồng lên nội dung. Thanh công cụ được xuống dòng.
- Dùng HTML ngữ nghĩa, nhãn cho ô nhập/select, nút thật cho hành động; ảnh có `alt` phù hợp. Không chỉ dùng màu để thông báo trạng thái.

## 11. Chế độ sáng/tối

- Có đúng hai chế độ người dùng chuyển đổi: `light` và `dark`; một lần bấm đổi sang chế độ còn lại.
- Nút ở phía phải thanh đầu trang tại góc trên bên phải, xuất hiện trên mọi trang. Trên màn hình nhỏ vẫn ở vùng đầu trang bên phải, không che nội dung; không mặc định phải ghim nổi theo cuộn.
- Nút dùng được với Tab, Enter và Space. Nhãn/`aria-label` thể hiện hành động tiếp theo, ví dụ đang tối thì là “Chuyển sang chế độ sáng”; icon không được là tên truy cập duy nhất.
- Khi tải trang, ưu tiên lựa chọn hợp lệ đã lưu trong `localStorage` với khóa `theme` (`light` hoặc `dark`). Nếu chưa có, dùng `prefers-color-scheme`; nếu không xác định được, dùng light.
- Khi người dùng đổi chế độ, áp dụng cho toàn trang và lưu lựa chọn để tải lại/chuyển trang vẫn giữ chế độ đó.
- Nếu `localStorage` không dùng được, nút vẫn hoạt động trong phiên trang hiện tại, không làm website lỗi. Giá trị lưu không hợp lệ được coi như chưa có lựa chọn.
- Trước khi người dùng chọn thủ công, có thể đồng bộ theo thay đổi chế độ hệ điều hành; sau khi đã chọn, ưu tiên lựa chọn đó. Không tự thêm chế độ thứ ba “Hệ thống” vào nút.
- Tải thiết lập sớm bằng JavaScript external để hạn chế nháy sai màu; không vi phạm quy tắc cấm script inline.
- Đổi theme chỉ thay giao diện, không xóa truy vấn, bộ lọc, thứ tự, trang hiện tại hoặc dữ liệu.

## 12. Tiêu chí kiểm tra và báo cáo

Chọn kiểm tra phù hợp phần đã sửa. Với thay đổi tài liệu, kiểm tra tính đầy đủ, nhất quán và phạm vi file; không tuyên bố đã kiểm tra website. Khi sửa chức năng danh sách/theme, dùng các tình huống liên quan sau:

| Tình huống | Kết quả mong đợi |
| --- | --- |
| Lần đầu mở danh sách | Tìm kiếm rỗng, bộ lọc Tất cả, A–Z, 10 mục, trang 1 |
| Tìm `  MAT   BIEC ` | Khớp `Mắt Biếc`, giữ nguyên chữ hiển thị |
| Truy vấn rỗng/toàn khoảng trắng | Không giới hạn kết quả theo tìm kiếm |
| Kết hợp truy vấn, thể loại và năm | Kết quả thỏa đồng thời cả ba điều kiện |
| Đổi điều kiện khi đang ở trang sau | Về trang 1, giữ các điều kiện không liên quan |
| Đổi A–Z sang Z–A | Toàn bộ kết quả đổi thứ tự trước khi phân trang; nhóm tiêu đề bằng nhau giữ thứ tự nguồn |
| Có 37 kết quả, chọn 10/20/50/all | Lần lượt 4/2/1/1 trang; `all` hiện đủ 37 mục |
| Ở trang đầu/trang cuối | Không thể đi lùi/vượt giới hạn |
| Không có kết quả | Thông báo rõ, tổng 0, không có trang 1/0 hoặc khoảng 1–0 |
| Xóa bộ lọc | Các bộ lọc về Tất cả, trang 1; giữ truy vấn, sắp xếp, kích thước trang |
| Đổi theme rồi tải lại | Giữ lựa chọn nếu lưu trữ khả dụng |
| Lưu trữ bị chặn hoặc có giá trị sai | Trang vẫn chạy, chọn theme theo thứ tự dự phòng |
| Đổi theme khi đang lọc ở trang sau | Điều kiện và trang hiện tại không đổi |
| Dùng bàn phím và màn hình 360px | Điều khiển thao tác được, focus rõ, không chồng lấn/cuộn ngang toàn trang |
| Kiểm tra tài nguyên | CSS/JS external, đường dẫn hợp lệ, không có lỗi do file thiếu hoặc lỗi JavaScript trong phần đã sửa |

- Không thêm dữ liệu thử nghiệm vào dữ liệu thật; dùng dữ liệu tạm khi cần kiểm tra trường hợp biên.
- Chỉ nói “đã kiểm tra” khi thực sự thực hiện; ghi rõ kiểm tra bằng đọc code, công cụ tự động hay trình duyệt.
- Nếu không có môi trường chạy, nêu phần chưa xác minh và cách người dùng có thể kiểm tra; không suy diễn kết quả thành đã đạt.
- Báo cáo cuối gồm file đã thay đổi, hành vi đã thay đổi, kiểm tra đã thực hiện và hạn chế còn lại. Không tự commit, triển khai hoặc xuất bản nếu chưa được yêu cầu.
