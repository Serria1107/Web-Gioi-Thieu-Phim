# NHẬT KÝ ĐỒNG HÀNH CÙNG AI (PROMPT LOG)

**Học phần:** Thiết kế Web – Trường Đại học Lạc Hồng (LHU)  
**Tên nhóm:** ...............................................................  
**Lớp:** ...............................................................  
**Tên dự án:** **Khung Hình – Website giới thiệu phim** *(điều chỉnh nếu nhóm dùng tên khác)*  
**Thời gian thực hiện:** Từ ........../........../.......... đến ........../........../..........  
**Thành viên:** ................................................................................................................

> **Lưu ý về tính trung thực của nhật ký:** Giai đoạn **tạo trang đăng nhập** có thông tin đối chiếu với trao đổi thực tế cùng ChatGPT vào ngày 21/10/2026. Các prompt chi tiết ở **thiết kế cấu trúc, hiệu ứng UI/UX và nội dung phim** bên dưới là **prompt mẫu được biên soạn cho dự án**, không được hiểu là nhóm đã gửi nguyên văn hoặc đã hoàn thành mọi công việc. Trước khi nộp, hãy thay prompt mẫu bằng câu lệnh thực tế từ lịch sử sử dụng AI, điền kết quả kiểm thử và đính kèm ảnh chụp tương ứng. Không đánh dấu cam kết khi chưa thực hiện.

---

## 1. Thông tin công cụ AI sử dụng

| Hạng mục | Công cụ | Vai trò / ghi chú |
|---|---|---|
| Công cụ AI trao đổi ý tưởng và viết prompt | **ChatGPT** | Xây dựng yêu cầu, giải thích code, đề xuất cách kiểm tra giao diện. |
| Công cụ AI để triển khai giao diện | **Google Antigravity** | Đã tìm hiểu cách dùng cho yêu cầu tạo trang đăng nhập. **Cần xác nhận nhóm có thực sự dùng để tạo mã hay không.** |
| Extension hỗ trợ lập trình | **GitHub Copilot (VS Code)** | Được dùng trong quá trình làm việc và kiểm tra trang đăng nhập. |
| IDE / môi trường phát triển | **Visual Studio Code** | Chỉnh sửa HTML, CSS, JavaScript. |
| Công cụ tạo hình ảnh / nội dung | **Chưa xác nhận** | Nếu sử dụng Canva AI, công cụ tạo poster, AI viết mô tả phim… hãy ghi tên công cụ và nguồn ảnh/nội dung thực tế. |
| Cách kiểm tra độ chính xác | **Điền theo thực tế** | Gợi ý: mở website bằng Live Server, dùng Chrome DevTools (Console, Elements, Responsive), tự bấm thử form đăng nhập, tìm kiếm và các tương tác; đối chiếu lỗi với mã nguồn. |

**Nguyên tắc sử dụng AI:** Nhóm dùng AI để gợi ý giải pháp và hỗ trợ viết/sửa mã, sau đó tự đọc lại, chỉnh sửa theo yêu cầu của đồ án và kiểm thử trước khi đưa vào phiên bản cuối.

---

## 2. Nhật ký quá trình thực hiện (4 giai đoạn chính)

| Giai đoạn | Mục tiêu | Nội dung prompt | Kết quả & tùy chỉnh |
|---|---|---|---|
| **1. Thiết kế cấu trúc trang web** | Xây dựng bố cục website giới thiệu phim, tổ chức tệp và nội dung trang chính. | Xem **Prompt 01**. *Prompt mẫu, cần đối chiếu lịch sử sử dụng.* | **Cần điền thực tế:** các khu vực đã có; các file AI tạo; những phần nhóm tự đổi. |
| **2. Tạo trang đăng nhập** | Thiết kế trang login riêng, đẹp, dễ dùng, responsive. | Xem **Prompt 02**. Có yêu cầu thực tế “trang login trước thôi”. | **Đã ghi nhận:** nhóm yêu cầu ưu tiên trang đăng nhập. **Cần bổ sung:** kiểm thử form và các file đã chỉnh sửa. |
| **3. Thiết kế hiệu ứng Frontend và UI/UX** | Hoàn thiện giao diện, hiệu ứng tương tác và responsive. | Xem **Prompt 03**. *Prompt mẫu, cần đối chiếu lịch sử sử dụng.* | **Cần điền thực tế:** hiệu ứng nào đã triển khai, thiết bị đã thử, lỗi đã sửa. |
| **4. Thêm nội dung giới thiệu phim** | Hiển thị danh sách phim, thông tin và thao tác khám phá phim. | Xem **Prompt 04**. *Prompt mẫu, cần đối chiếu lịch sử sử dụng.* | **Cần điền thực tế:** số phim, nguồn dữ liệu, ảnh, tính năng lọc/tìm kiếm và kết quả. |

### Giai đoạn 1 — Thiết kế cấu trúc trang web

**Mục tiêu:** Có khung website giới thiệu phim rõ ràng, dễ phát triển và thuận tiện chia công việc trong nhóm.

**Prompt 01 – Prompt mẫu (chỉ ghi là đã sử dụng nếu nhóm thực sự gửi câu lệnh này):**

> Bạn là lập trình viên Frontend có kinh nghiệm. Hãy giúp nhóm xây dựng cấu trúc website **Khung Hình – Website giới thiệu phim** cho đồ án môn Thiết kế Web. Sử dụng HTML5, CSS3 và JavaScript thuần. Đề xuất cấu trúc thư mục rõ ràng; thiết kế trang chủ có Header, Navigation Bar, khu vực phim nổi bật (Hero/Banner), danh sách phim, tìm kiếm hoặc lọc phim và Footer. Ưu tiên HTML semantic, giao diện dễ hiểu, tương thích điện thoại và máy tính. Không thêm backend hoặc thư viện không cần thiết. Trước tiên, hãy mô tả cấu trúc và vai trò từng phần rồi mới viết code.

**Kết quả và tùy chỉnh thực tế (nhóm điền):**

- Các file được tạo / chỉnh sửa: ..........................................................................
- Cấu trúc được giữ lại: ..................................................................................
- Các thay đổi do nhóm tự thực hiện: ............................................................
- Đã kiểm tra trên trình duyệt nào, kết quả: ....................................................

**Vì sao đặt prompt như vậy?** Vì mô tả rõ chủ đề, công nghệ, từng khu vực và giới hạn phạm vi giúp AI đưa ra khung website phù hợp thay vì tạo những thành phần không cần cho đồ án.

### Giai đoạn 2 — Tạo trang đăng nhập (Login)

**Mục tiêu:** Ưu tiên hoàn thiện giao diện đăng nhập trước khi mở rộng thêm tính năng khác.

**Yêu cầu đã được trao đổi với ChatGPT ngày 21/10/2026 (trích ý từ hội thoại thực tế):**

> “mình muốn kêu AI code cho mình 1 trang login của 1 web giới thiệu phim, nên dùng promt như nào cho hợp lý nhất”
>
> “trang login trước thôi nhé baby”

Nhóm cũng đã hỏi cách dùng **Google Antigravity** và đề nghị chuyển prompt sang tiếng Việt để kiểm tra yêu cầu trước khi sử dụng.

**Prompt 02 – Bản diễn đạt rõ yêu cầu để nhóm dùng/đối chiếu (không phải trích nguyên văn prompt đã chạy):**

> Hãy đóng vai Senior Frontend Developer và thiết kế **duy nhất trang đăng nhập** cho website giới thiệu phim “Khung Hình”. Tạo giao diện theo phong cách điện ảnh, màu tối hiện đại, có logo/tên website, trường email hoặc tên đăng nhập, mật khẩu, nút hiện/ẩn mật khẩu, nút đăng nhập và các liên kết cần thiết. Dùng HTML5, CSS3 và JavaScript, thiết kế responsive, label rõ ràng, trạng thái hover/focus, thông báo hợp lệ phía giao diện và không gây lỗi khi người dùng bỏ trống thông tin. Giữ mã dễ đọc, chia file hợp lý, không tự ý tạo các trang khác hoặc thêm backend. Nếu chưa có hệ thống xác thực, hãy nói rõ đây mới chỉ là giao diện/demo, không tuyên bố đã đăng nhập thật.

**Kết quả và tùy chỉnh thực tế (nhóm điền):**

- File trang đăng nhập: `login.html` / tên file thực tế: ....................................
- Các file CSS/JavaScript liên quan: ..............................................................
- Nhóm đã yêu cầu AI giải thích hoặc sửa phần nào: .............................................
- Thử nhập trống/sai định dạng, hiển thị mật khẩu, chuyển hướng: .........................
- **Trạng thái xác thực:** [ ] Chỉ là giao diện  [ ] Có đăng nhập thật (ghi rõ backend: ............)

**Vì sao đặt prompt như vậy?** Vì nhóm chủ động giới hạn yêu cầu ở **trang login** để AI không tự viết toàn bộ website, giúp dễ kiểm thử, kiểm soát chất lượng và tiết kiệm công sức sửa lỗi.

### Giai đoạn 3 — Thiết kế hiệu ứng Frontend và UI/UX

**Mục tiêu:** Nâng cao tính thẩm mỹ và sự thuận tiện khi sử dụng trên desktop/mobile mà không làm hỏng các tính năng hiện có.

**Prompt 03 – Prompt mẫu (cần đối chiếu lịch sử sử dụng):**

> Hãy kiểm tra giao diện website giới thiệu phim hiện tại và đề xuất cải thiện UI/UX theo phong cách điện ảnh. Ưu tiên Dark Theme, màu nhấn nhất quán, Typography dễ đọc, khoảng cách hợp lý, các thẻ phim đẹp và bố cục responsive. Thêm hiệu ứng hover cho card phim/nút bấm, chuyển cảnh nhẹ, animation khi cuộn trang nếu hợp lý; có trạng thái focus rõ ràng, hỗ trợ bàn phím và `prefers-reduced-motion`. Hãy kiểm tra lỗi tràn màn hình trên mobile, tối ưu hiệu năng animation; chỉ sửa các file liên quan, giữ nguyên logic tính năng, không dùng thư viện mới nếu chưa cần. Giải thích ngắn gọn những thay đổi và cách kiểm thử.

**Kết quả và tùy chỉnh thực tế (nhóm điền):**

- Các thành phần UI đã thay đổi: .......................................................................
- Hiệu ứng đã thêm (hover, card flip, scroll, carousel…): ...................................
- Kích thước màn hình đã thử: ...........................................................................
- Lỗi UI đã phát hiện và cách nhóm sửa: ...........................................................

**Vì sao đặt prompt như vậy?** Vì chỉ yêu cầu AI cải thiện giao diện và trải nghiệm người dùng, đồng thời đặt ràng buộc **không thay đổi logic** để hạn chế phát sinh lỗi ngoài phạm vi.

### Giai đoạn 4 — Thêm nội dung giới thiệu phim

**Mục tiêu:** Bổ sung nội dung phim để người dùng dễ khám phá và lựa chọn phim quan tâm.

**Prompt 04 – Prompt mẫu (cần đối chiếu lịch sử sử dụng):**

> Hãy bổ sung phần nội dung cho website giới thiệu phim “Khung Hình”. Với mỗi phim, hiển thị tên, poster, thể loại, năm phát hành, mô tả ngắn và các trường thông tin chỉ khi có dữ liệu đáng tin cậy. Thiết kế danh sách phim dạng card, có trang/khung chi tiết phim và chức năng tìm kiếm hoặc lọc theo thể loại nếu phù hợp với cấu trúc hiện tại. Viết nội dung giới thiệu ngắn gọn, hấp dẫn nhưng không sao chép nguyên văn nội dung có bản quyền. Không bịa thông tin phim, diễn viên, điểm đánh giá hay nguồn ảnh; đánh dấu dữ liệu mẫu để nhóm thay sau. Đảm bảo responsive, hình ảnh có `alt` và giao diện thống nhất với trang chủ/trang đăng nhập. Chỉ thay đổi những file cần thiết và hướng dẫn nhóm tự cập nhật danh sách phim.

**Kết quả và tùy chỉnh thực tế (nhóm điền):**

- Số lượng phim đã bổ sung: ...............  Nguồn dữ liệu: ..................................
- Các trường đã hiển thị: .................................................................................
- Tìm kiếm/lọc/chi tiết phim hoạt động thế nào: ................................................
- Nhóm đã sửa poster, mô tả, thể loại hoặc nội dung nào: ....................................
- Đã kiểm tra ảnh bị lỗi và nội dung hiển thị trên mobile: [ ] Có  [ ] Chưa

**Vì sao đặt prompt như vậy?** Vì website giới thiệu phim cần thông tin rõ ràng, dễ tìm, nhưng cũng phải đảm bảo tính chính xác và tính hợp pháp của ảnh/nội dung.

---

## 3. Những bài học kinh nghiệm khi sử dụng AI

**3.1. Công thức prompt hiệu quả nhóm có thể áp dụng:**  
**Vai trò AI + Bối cảnh dự án + Công nghệ + Phạm vi công việc + Yêu cầu cụ thể + Ràng buộc + Cách kiểm tra + Đầu ra mong muốn.**

**Ví dụ rút gọn:**

> Bạn là Frontend Developer. Dự án của nhóm là web giới thiệu phim, dùng HTML/CSS/JS. Hãy sửa riêng phần responsive của các movie card, giữ nguyên tính năng tìm kiếm và nội dung hiện có. Giải thích file được sửa, nguyên nhân lỗi và cách kiểm tra trên màn hình 390px và desktop.

**3.2. Khó khăn gặp phải – chỉ giữ các mục đã thực sự xảy ra:**

- [ ] AI viết code dài, khó hiểu hoặc khó gộp với dự án.
- [ ] AI sửa quá nhiều file so với yêu cầu.
- [ ] CSS bị trùng hoặc xung đột.
- [ ] Giao diện đẹp trên desktop nhưng chưa tốt trên mobile.
- [ ] Hình ảnh, đường dẫn, dữ liệu phim chưa chính xác.
- [ ] JavaScript phát sinh lỗi, tính năng không hoạt động.
- [ ] Khác: ................................................................................................

**3.3. Cách nhóm kiểm tra độ chính xác của code AI – đánh dấu sau khi làm:**

- [ ] Đọc từng file do AI thêm hoặc sửa và đối chiếu yêu cầu.
- [ ] Chạy website bằng VS Code + Live Server (hoặc cách chạy thực tế: ...............).
- [ ] Mở Chrome DevTools → **Console** để phát hiện lỗi JavaScript.
- [ ] Dùng DevTools → **Elements** để kiểm tra HTML/CSS.
- [ ] Dùng **Responsive Device Toolbar** để thử kích thước điện thoại/tablet/desktop.
- [ ] Kiểm tra trang login: ô nhập, xác thực giao diện, liên kết và thông báo lỗi.
- [ ] Kiểm tra danh sách phim: poster, lọc/tìm kiếm, tương tác card, chi tiết phim.
- [ ] So sánh bản trước/sau và tự chỉnh sửa phần chưa phù hợp.

**3.4. Bài học nhóm thực sự rút ra (viết sau khi hoàn thành):**

.........................................................................................................................

.........................................................................................................................

---

## 4. Cam kết của nhóm

- [ ] Nhóm đã đọc và hiểu rõ **ít nhất 80% mã nguồn do AI tạo ra**.
- [ ] Nhóm đã **tự tay chỉnh sửa** giao diện (màu sắc, hình ảnh, nội dung) phù hợp với dự án.
- [ ] Nhóm đã **kiểm tra tính năng và responsive** trên trình duyệt thực tế.
- [ ] Nhóm phân biệt phần **AI hỗ trợ** và phần **nhóm tự hoàn thiện** trong nhật ký.

**Ngày xác nhận:** ........../........../..........  
**Đại diện nhóm:** .......................................................

---

## 5. Phụ lục – Screenshot các đoạn hội thoại quan trọng

> Chèn hình chụp thật từ lịch sử ChatGPT, Antigravity hoặc Copilot; không tạo ảnh giả cho những prompt chưa được dùng. Có thể lưu ảnh trong thư mục `screenshots/` bên cạnh file Markdown rồi dùng đường dẫn tương đối dưới đây.

| STT | Giai đoạn | Screenshot / bằng chứng | Nhận xét |
|---|---|---|---|
| 01 | Thiết kế cấu trúc website | `screenshots/01-cau-truc.png` *(thay bằng ảnh thật)* | Ghi AI đề xuất cấu trúc gì và nhóm thay đổi gì. |
| 02 | Tạo trang đăng nhập | `screenshots/02-login.png` *(thay bằng ảnh thật)* | Ghi rõ yêu cầu chỉ thiết kế trang login trước. |
| 03 | Nâng cấp Frontend – UI/UX | `screenshots/03-ui-ux.png` *(thay bằng ảnh thật)* | Chỉ ra animation/responsive đã được điều chỉnh. |
| 04 | Thêm nội dung giới thiệu phim | `screenshots/04-noi-dung-phim.png` *(thay bằng ảnh thật)* | Chỉ ra cách kiểm tra và sửa nội dung phim. |

### Những câu hỏi nhóm nên chuẩn bị khi bảo vệ

1. **Vì sao không yêu cầu AI tạo toàn bộ website trong một lần?**  
   Vì chia nhỏ thành từng bước giúp nhóm kiểm soát mã nguồn, hiểu tác động của từng thay đổi và dễ kiểm thử hơn.
2. **Vì sao tạo trang đăng nhập trước?**  
   Vì nhóm muốn hoàn thiện một giao diện cụ thể và xác nhận trải nghiệm người dùng trước khi mở rộng dự án.
3. **Vì sao yêu cầu AI giữ nguyên chức năng cũ khi sửa UI/UX?**  
   Vì thay đổi giao diện không nên vô tình làm hỏng logic hoặc các chức năng đã chạy ổn định.
4. **Vì sao không để AI tự bịa nội dung phim?**  
   Vì tên phim, năm phát hành, thể loại, đánh giá và nguồn ảnh cần chính xác và có thể kiểm tra.

---

**Ghi chú nộp bài:** Hãy cập nhật câu chữ, trạng thái checkbox, tên công cụ và minh chứng theo **quá trình nhóm thực sự thực hiện**. Nhật ký này là bản khung có định hướng chi tiết, không thay thế bằng chứng thực tế của nhóm.
