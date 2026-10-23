NHẬT KÝ ĐỒNG HÀNH CÙNG AI (PROMPT LOG)
Học phần: Thiết kế Web – Trường Đại học Lạc Hồng (LHU)
Tên nhóm: Nhóm 11
Lớp: 26CT501
Thành viên: Huỳnh Mai Phát-526000150, Trần Thành Đạt-526000145
Tên dự án: KHUNG HÌNH – WEBSITE GIỚI THIỆU PHIM
Chủ đề: Thiết kế giao diện website giới thiệu phim, gồm cấu trúc trang web, trang đăng nhập, hiệu ứng Frontend/UI/UX và nội dung giới thiệu phim.
Phạm vi của nhật ký: Tài liệu được biên soạn để nhóm sử dụng trong báo cáo học phần. Phần trao đổi yêu cầu ưu tiên trang đăng nhập là nội dung có cơ sở từ hội thoại ChatGPT ngày 21/10/2026. Các prompt hoàn chỉnh ở những giai đoạn khác được biên soạn lại thành mẫu prompt chuẩn, chưa có bằng chứng rằng nhóm đã gửi nguyên văn hoặc triển khai đầy đủ. Những nhận xét kỹ thuật bên dưới mô tả cách xử lý và tiêu chí cần đạt, không thay thế kết quả chạy thử. Khi nộp nhật ký, nhóm cần bảo đảm nội dung khớp với công việc thực tế và dùng ảnh chụp cuộc hội thoại thật làm minh chứng.

1. Thông tin công cụ AI sử dụng
Nội dung	Công cụ	Mục đích sử dụng
Công cụ AI chính	ChatGPT	Phân tích yêu cầu, xây dựng prompt, gợi ý cấu trúc website, giải thích HTML/CSS/JavaScript và đề xuất cách sửa lỗi.
Công cụ hỗ trợ viết mã	GitHub Copilot trong Visual Studio Code	Gợi ý và hỗ trợ đọc, chỉnh sửa mã nguồn khi lập trình.
Công cụ AI được tìm hiểu thêm	Google Antigravity	Được thảo luận như một lựa chọn hỗ trợ xây dựng trang đăng nhập; chưa có bằng chứng để khẳng định toàn bộ dự án được tạo bằng công cụ này.
Môi trường lập trình	Visual Studio Code	Quản lý mã nguồn HTML, CSS và JavaScript.
Công cụ tạo hình ảnh/nội dung	ChatGPT (hỗ trợ diễn đạt nội dung)	Đề xuất tên mục, nhãn nút và cách trình bày nội dung. Chưa xác nhận nhóm sử dụng công cụ AI tạo poster riêng.
Cách kiểm tra mã nguồn AI	Trình duyệt và Chrome DevTools	Quy trình đề xuất: chạy website, xem Console, kiểm tra Elements, thử Responsive Mode và tương tác trực tiếp với các nút/form.


Nguyên tắc: AI là công cụ hỗ trợ. Mã nguồn được đề xuất phải phù hợp yêu cầu môn học, dễ giải thích, có khả năng chỉnh sửa và cần được kiểm chứng trong trình duyệt trước khi sử dụng làm bản nộp.
2. Nhật ký quá trình thực hiện
Giai đoạn 1 – Thiết kế cấu trúc trang web
Mục tiêu: Xác định bố cục và tổ chức mã nguồn hợp lý trước khi thiết kế chi tiết, tránh tạo dư tính năng không cần thiết cho đồ án.

Prompt 01 – Bản prompt biên soạn cho giai đoạn thiết kế cấu trúc:
Bạn là một Frontend Developer có kinh nghiệm thiết kế website. Tôi đang thực hiện đồ án môn Thiết kế Web tại LHU với chủ đề website giới thiệu phim Khung Hình. Hãy đề xuất cấu trúc website sử dụng HTML5, CSS3 và JavaScript. Trang chủ cần có Header, menu điều hướng, banner phim nổi bật, khu vực phim đề xuất, danh sách phim theo thể loại, vùng tìm kiếm và Footer. Ưu tiên HTML semantic, tên class dễ hiểu, mã nguồn dễ bảo trì và giao diện tương thích máy tính, điện thoại. Hãy phân tích cấu trúc thư mục và chức năng từng phần trước, sau đó mới đề xuất mã nguồn. Không tự ý bổ sung backend hoặc tính năng ngoài yêu cầu.

Kết quả và hướng tùy chỉnh:
- Phương án cấu trúc được xác định gồm: Header/Navigation, Hero Banner, Featured Movies, Movie Categories, Search và Footer.
- Ưu tiên phân chia HTML theo các khối chức năng, nhóm các quy tắc CSS theo thành phần và đặt tên rõ ràng để dễ bảo trì.
- Chỉnh hướng triển khai theo mức độ phù hợp với đồ án: làm rõ bố cục, khả năng điều hướng và nội dung giới thiệu phim trước khi phát triển tính năng nâng cao.
- Các thành phần trên là phạm vi thiết kế đề xuất; chưa có tài liệu kiểm thử xác nhận tất cả đã xuất hiện trong mã nguồn cuối cùng.
Vì sao đặt prompt như vậy? Việc xác định rõ chủ đề, công nghệ, bố cục và phạm vi giúp AI trả lời tập trung vào cấu trúc website, tránh sinh ra tính năng phức tạp vượt yêu cầu, đồng thời tạo cơ sở để nhóm chia việc.
Giai đoạn 2 – Tạo trang đăng nhập (Login)
Mục tiêu: Hoàn thiện một trang đăng nhập có giao diện dễ sử dụng, thống nhất với phong cách website phim và có kiểm tra dữ liệu ở mức giao diện.

Nội dung đã trao đổi thực tế với ChatGPT (21/10/2026): Người thực hiện hỏi cách viết prompt để AI code trang login của website giới thiệu phim; sau đó nhấn mạnh chỉ làm trang đăng nhập trước, có hỏi thêm về Google Antigravity và đề nghị dịch prompt sang tiếng Việt để kiểm tra. Ngoài ra, trong các trao đổi sau có yêu cầu kiểm tra lỗi của một file HTML trang đăng nhập.

Prompt 02 – Bản prompt chuẩn hóa từ yêu cầu đã trao đổi:
Bạn là Senior Frontend Developer chuyên thiết kế giao diện website phim. Hãy tạo riêng trang đăng nhập cho dự án Khung Hình, chưa cần xây dựng các trang khác. Sử dụng HTML5, CSS3 và JavaScript, thiết kế Dark Theme phong cách điện ảnh, hiện đại và responsive. Giao diện gồm tên website, trường email hoặc tên đăng nhập, trường mật khẩu, nút hiện/ẩn mật khẩu, nút Đăng nhập và thông báo lỗi nhập liệu. Bổ sung label rõ ràng, trạng thái hover/focus và kiểm tra trường trống hoặc email sai định dạng ở phía trình duyệt. Giữ mã dễ đọc, không cài thư viện không cần thiết. Nếu chưa có backend, chỉ tạo giao diện/demo và nói rõ chưa có chức năng xác thực tài khoản thật.

Kết quả và hướng tùy chỉnh:
- Phạm vi đã được thu hẹp về một trang Login, thay vì yêu cầu AI viết cả website trong một lần.
- Những thành phần quan trọng cần có là ô thông tin đăng nhập, mật khẩu, thông báo nhập liệu và tương tác hiện/ẩn mật khẩu.
- Giao diện đăng nhập được định hướng sử dụng màu tối, kiểu chữ rõ ràng, khoảng cách hợp lý và hoạt động trên nhiều kích thước màn hình.
- Không khẳng định đã có hệ thống xác thực thật khi chưa có bằng chứng về backend, cơ sở dữ liệu hoặc quá trình đăng nhập thành công.
Vì sao đặt prompt như vậy? Giới hạn ở trang login giúp AI tập trung xử lý đúng yêu cầu, tránh tạo các thành phần không liên quan. Yêu cầu phân biệt giao diện demo và xác thực thật cũng giúp nhóm tránh nhầm lẫn khi thuyết trình.
Giai đoạn 3 – Thiết kế hiệu ứng Frontend và UI/UX
Mục tiêu: Nâng cao trải nghiệm người dùng, làm giao diện có nét riêng nhưng vẫn đọc được nội dung, dễ thao tác và không làm hỏng chức năng đang có.

Prompt 03 – Bản prompt biên soạn cho giai đoạn UI/UX:
Hãy đóng vai UI/UX Designer và Frontend Developer. Tôi muốn nâng cấp giao diện website giới thiệu phim Khung Hình theo phong cách điện ảnh hiện đại. Hãy rà soát màu sắc, typography, bố cục, menu điều hướng, banner và movie card. Ưu tiên Dark Theme, màu nhấn nhất quán, khoảng trắng hợp lý và hình ảnh đúng tỷ lệ. Đề xuất các hiệu ứng nhẹ như hover card, chuyển trạng thái nút, xuất hiện nội dung khi cuộn và chuyển cảnh mượt mà. Hãy đảm bảo responsive cho mobile, tablet và desktop, hỗ trợ điều khiển bằng bàn phím và prefers-reduced-motion. Chỉ sửa những file cần thiết và không thêm thư viện nếu chưa có lý do rõ ràng. Cuối cùng, hướng dẫn cách kiểm tra kết quả bằng trình duyệt.

Kết quả và hướng tùy chỉnh:
- Phong cách thiết kế được định hướng là Dark Cinematic UI với poster nổi bật, nội dung dễ đọc và màu nhấn nhất quán.
- Các tương tác được ưu tiên: hover/focus trên nút và thẻ phim, chuyển động vừa phải, menu rõ ràng, phản hồi khi người dùng tương tác.
- Nhóm cần ưu tiên bố cục thích ứng thay vì giữ các kích thước cố định gây tràn màn hình điện thoại.
- Các hiệu ứng chỉ nên được thêm khi không ảnh hưởng tốc độ tải trang, tính dễ đọc hoặc khả năng sử dụng; chưa xác nhận mọi hiệu ứng đề xuất đều đã được triển khai.
Vì sao đặt prompt như vậy? Chỉ yêu cầu chỉnh UI/UX và ràng buộc không sửa logic giúp kiểm soát phạm vi thay đổi. Yêu cầu responsive và accessibility giúp giao diện phù hợp nhiều người dùng hơn thay vì chỉ đẹp trên một màn hình máy tính.
Giai đoạn 4 – Thêm nội dung giới thiệu phim
Mục tiêu: Xây dựng nội dung rõ ràng để người xem hiểu về từng bộ phim và dễ khám phá phim theo thể loại hoặc từ khóa.

Prompt 04 – Bản prompt biên soạn cho giai đoạn nội dung phim:
Tôi đang xây dựng website giới thiệu phim Khung Hình. Hãy hỗ trợ thiết kế phần danh sách phim gồm poster, tên phim, thể loại, năm phát hành và đoạn giới thiệu ngắn. Bố trí các phim dưới dạng card responsive, có trang hoặc cửa sổ xem thông tin chi tiết nếu phù hợp với mã hiện tại. Đề xuất chức năng tìm kiếm phim theo tên và lọc theo thể loại bằng JavaScript ở mức Frontend. Nội dung mô tả cần ngắn gọn, dễ đọc, không sao chép nguyên văn bài giới thiệu có bản quyền. Không tự bịa năm phát hành, tên diễn viên, điểm đánh giá hoặc nguồn ảnh; nếu thiếu dữ liệu hãy dùng thông tin mẫu được ghi rõ. Không làm thay đổi bố cục và chức năng đã có. Hãy giải thích cách nhóm có thể tự thêm, sửa hoặc xóa dữ liệu phim sau này.

Kết quả và hướng tùy chỉnh:
- Mô hình dữ liệu phim được đề xuất có các trường: tên phim, poster, thể loại, năm phát hành, mô tả ngắn; chỉ hiển thị thông tin mở rộng khi có nguồn đáng tin cậy.
- Cách trình bày ưu tiên movie card theo lưới, thống nhất màu sắc và kích thước ảnh, có đường dẫn hoặc tương tác xem chi tiết.
- Chức năng tìm kiếm/lọc cần hoạt động theo dữ liệu thực tế, có trạng thái thông báo khi không tìm thấy phim.
- Nhóm cần kiểm tra bản quyền ảnh, tính đúng đắn của nội dung và đường dẫn ảnh trước khi công bố; chưa có bằng chứng xác nhận số lượng phim cuối cùng.
Vì sao đặt prompt như vậy? Một website giới thiệu phim không chỉ cần giao diện đẹp mà còn cần nội dung chính xác và dễ tìm. Việc mô tả rõ dữ liệu và cách cập nhật giúp website dễ mở rộng, đồng thời tránh sử dụng thông tin phim hoặc ảnh không có nguồn rõ ràng.
3. Những bài học kinh nghiệm khi sử dụng AI
3.1. Câu lệnh (Prompt) hiệu quả nhất
Công thức nhóm có thể áp dụng:

Vai trò AI + Bối cảnh dự án + Công nghệ sử dụng + Yêu cầu cụ thể + Giới hạn chỉnh sửa + Tiêu chí kiểm thử + Kết quả mong muốn.

Prompt tiêu biểu:
Bạn là một Senior Frontend Developer. Dự án của tôi là website giới thiệu phim sử dụng HTML, CSS . Hãy kiểm tra và cải thiện giao diện hiện tại trên mobile, ưu tiên lỗi tràn nội dung và hiển thị card phim. Chỉ sửa những file có liên quan, không viết lại toàn bộ dự án, không thay đổi logic đang chạy. Nêu nguyên nhân lỗi, giải pháp, những file đã sửa và các bước để tôi tự kiểm tra bằng Chrome DevTools.

Điểm rút ra: Prompt có phạm vi rõ ràng dễ kiểm soát hơn một yêu cầu chung chung như “Hãy làm cho website đẹp hơn”. Nhóm cũng dễ hiểu và giải thích được vì sao AI đề xuất những chỉnh sửa cụ thể.
3.2. Những khó khăn tiêu biểu và cách khắc phục
Khó khăn	Nguyên nhân thường gặp	Hướng giải quyết phù hợp
AI tạo đoạn code dài, khó đọc	Yêu cầu quá rộng, nhiều tính năng cùng lúc	Chia công việc thành từng giai đoạn; yêu cầu giải thích các phần quan trọng và giữ code dễ bảo trì.
AI có xu hướng chỉnh quá nhiều file	Prompt không giới hạn phạm vi	Nêu rõ file/thành phần cần sửa, yêu cầu không đổi các chức năng hiện có.
CSS dễ bị trùng hoặc xung đột	Nhiều quy tắc áp dụng cho cùng thành phần	Kiểm tra selector bằng DevTools, gom các quy tắc trùng và dùng class rõ nghĩa.
Website đẹp trên desktop nhưng chưa tốt trên mobile	Kích thước cố định, bố cục thiếu breakpoint	Sử dụng Grid/Flexbox hợp lý, media query và kiểm tra nhiều kích thước màn hình.
Form login trông hoàn chỉnh nhưng chưa đăng nhập thật	Frontend demo không tự thay thế backend	Tách kiểm tra nhập liệu ở giao diện khỏi xác thực tài khoản trên máy chủ; mô tả đúng trạng thái dự án.
Poster hoặc thông tin phim thiếu chính xác	Nguồn ảnh/dữ liệu chưa được xác nhận	Chỉ sử dụng thông tin đã kiểm tra, ghi rõ dữ liệu mẫu và chọn nguồn ảnh có quyền sử dụng.


Bảng này tổng hợp các khó khăn phù hợp với loại dự án và cách xử lý; không có nghĩa mọi lỗi đều đã xảy ra hoặc đều đã được khắc phục trong mã nguồn cuối cùng.
3.3. Cách kiểm tra độ chính xác của mã do AI hỗ trợ
Quy trình kiểm thử nên thực hiện như sau:
1. Kiểm tra cấu trúc mã: Đọc file HTML/CSS đã thêm hoặc sửa, xác định nhiệm vụ của từng thành phần, phát hiện đoạn trùng và cú pháp sai.
2. Chạy giao diện trên trình duyệt: Mở bằng VS Code Live Server hoặc môi trường chạy phù hợp, đối chiếu giao diện với yêu cầu thiết kế.
3. Kiểm tra bằng Chrome DevTools: Sử dụng tab Elements để kiểm tra HTML/CSS.
4. Kiểm thử Responsive: Sử dụng Device Toolbar ở các kích thước phổ biến như 390px, 768px và 1440px; kiểm tra menu, nút bấm, form và thẻ phim.
5. Kiểm thử trang Login: Thử để trống các trường, nhập email sai định dạng, bật/tắt hiển thị mật khẩu và xem thông báo; chỉ gọi là đăng nhập thật khi có xác thực backend.
6. Kiểm thử nội dung phim: Kiểm tra poster, tên, thể loại, tìm kiếm/lọc, đường dẫn và trạng thái không có kết quả.
7. So sánh trước/sau: Đánh giá xem thay đổi giao diện có làm mất chức năng hoặc gây lỗi mới hay không.
Đây là quy trình kiểm tra được lựa chọn cho dự án, không phải biên bản xác nhận đã chạy tất cả các bước.
3.4. Kinh nghiệm rút ra
- AI hỗ trợ tiết kiệm thời gian phác thảo và tạo khung mã, nhưng chất lượng phụ thuộc nhiều vào cách đặt câu hỏi.
- Nên chia các yêu cầu lớn thành những tác vụ nhỏ có mục tiêu và giới hạn cụ thể.
- Không nên sao chép toàn bộ mã AI mà không hiểu nguyên lý hoạt động, đặc biệt với JavaScript xử lý biểu mẫu và tương tác.
- Cần kiểm tra giao diện trên nhiều màn hình, không đánh giá chỉ qua một ảnh chụp desktop.
- Cần phân biệt rõ tính năng đã chạy thực tế với tính năng được AI đề xuất hoặc mới là giao diện mẫu.
- Nguồn ảnh, nội dung giới thiệu và dữ liệu phim phải được rà soát để tránh thông tin sai và vi phạm bản quyền.
4. Cam kết của nhóm
Nhóm thống nhất các nguyên tắc trước khi nộp sản phẩm cuối kỳ:
- Đọc hiểu mã nguồn: Mục tiêu tối thiểu là hiểu được 80% mã nguồn có AI hỗ trợ, đặc biệt các phần có ảnh hưởng trực tiếp đến giao diện và chức năng.
- Tự chỉnh sửa sản phẩm: Rà soát và điều chỉnh màu sắc, bố cục, nội dung, hình ảnh để phù hợp với đề tài và yêu cầu môn học.
- Kiểm thử trước khi nộp: Không coi mã AI sinh ra là chính xác tuyệt đối; chạy thử các chức năng và giao diện trong trình duyệt.
- Trình bày trung thực: Phân biệt phần AI đề xuất, phần nhóm tự thực hiện và chức năng chưa hoàn thiện.
Các nguyên tắc trên là nội dung cam kết dự kiến. Chỉ có thể xác nhận nhóm đã đáp ứng đầy đủ sau khi thành viên tự đọc hiểu mã, chỉnh sửa và kiểm thử thực tế.
5. Phụ lục – Minh chứng hội thoại với AI
Theo hướng dẫn học phần, nhóm cần chụp ảnh màn hình từ các cuộc trao đổi thực tế, không tạo hoặc sử dụng ảnh minh chứng giả. Các nội dung nên chọn để minh họa gồm:
1. Thiết kế cấu trúc: Hội thoại trao đổi về các khu vực chính của website và cách tổ chức HTML/CSS.
2. Trang đăng nhập: Hội thoại ChatGPT ngày 21/10/2026 về yêu cầu tạo trang Login trước; đây là nội dung đã có cơ sở đối chiếu.
3. UI/UX: Hội thoại yêu cầu cải thiện màu sắc, responsive, hiệu ứng và nguyên tắc giữ nguyên chức năng cũ (nếu nhóm đã thực sự thực hiện).
4. Nội dung phim: Hội thoại về movie card, poster, giới thiệu phim hoặc tìm kiếm/lọc (nếu có trong lịch sử sử dụng AI).
Lưu ý: Phần phụ lục chỉ mô tả loại minh chứng cần đính kèm. Ảnh chụp hội thoại không được tự tạo từ một prompt mẫu chưa từng sử dụng.
Câu hỏi có thể được giảng viên đặt ra khi bảo vệ
1. Tại sao không yêu cầu AI viết toàn bộ website trong một câu lệnh?
Vì chia dự án thành cấu trúc, login, UI/UX và nội dung phim giúp nhóm kiểm soát mã nguồn, dễ tìm lỗi và dễ giải thích từng quyết định kỹ thuật.

2. Tại sao ưu tiên xây dựng trang đăng nhập trước?
Vì đó là một giao diện có phạm vi rõ ràng, có thể kiểm tra tính dễ sử dụng và khả năng responsive trước khi phát triển thêm các trang khác.

3. Tại sao yêu cầu AI không thay đổi logic khi sửa giao diện?
Vì mục tiêu của giai đoạn đó là cải thiện trải nghiệm hiển thị. Việc chỉnh sửa logic ngoài phạm vi có thể làm phát sinh lỗi và khiến nhóm khó xác định nguyên nhân.

4. Làm sao biết code AI đưa ra có đúng?
Không thể khẳng định chỉ bằng cách đọc câu trả lời của AI. Cần chạy mã, thử chức năng, kiểm tra lỗi Console và đối chiếu với các yêu cầu cụ thể của dự án.

5. Tại sao phải xác minh dữ liệu phim và hình ảnh?
Vì các thông tin như thể loại, năm phát hành và nguồn ảnh có thể bị nhầm lẫn; nhóm chịu trách nhiệm về độ chính xác và quyền sử dụng nội dung đăng tải.
Kết luận: AI giúp nhóm xác định hướng triển khai và xây dựng các yêu cầu kỹ thuật rõ ràng hơn. Hiệu quả sử dụng AI đến từ việc biết đặt câu hỏi phù hợp, kiểm soát phạm vi chỉnh sửa, tự hiểu mã nguồn và xác minh kết quả thay vì phụ thuộc hoàn toàn vào câu trả lời của công cụ.
