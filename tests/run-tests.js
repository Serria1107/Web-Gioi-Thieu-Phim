/* No dependencies. Uses a real browser and actual application pages. */
(async () => {
  'use strict';
  const { list, scores, storage, movies } = window.KH;
  const output = document.getElementById('test-results');
  let passed = 0; let failed = 0;
  const assert = (condition, message = 'Điều kiện không thỏa') => { if (!condition) throw new Error(message); };
  const equal = (actual, expected) => assert(JSON.stringify(actual) === JSON.stringify(expected), `${JSON.stringify(actual)} ≠ ${JSON.stringify(expected)}`);
  const near = (actual, expected) => assert(Math.abs(actual - expected) < 1e-10, `${actual} ≠ ${expected}`);
  async function test(name, action) {
    const row = document.createElement('li');
    try { await action(); passed++; row.className = 'test-pass'; row.textContent = `ĐẠT · ${name}`; }
    catch (error) { failed++; row.className = 'test-fail'; row.textContent = `LỖI · ${name}: ${error.message}`; }
    output.append(row);
  }
  const makeSource = (value, scale = 10, group = 'critics', extra = {}) => ({ value, scale, group, status: 'verified', metric: 'rating', ...extra });
  await test('Chuẩn hóa dấu, đ, Unicode và khoảng trắng', () => { equal(list.normalize('  MẮT   BIẾC ĐẸP '), 'mat biec dep'); equal(list.normalize('Mắt Biếc'), 'mat biec'); });
  const sample = [{ id: 'vn', title: 'Mắt Biếc', genres: ['Lãng mạn', 'Chính kịch'], year: 2019 }, { id: '2', title: 'Phim 2', genres: ['Hài'], year: 2020 }, { id: '10', title: 'Phim 10', genres: ['Hài'], year: 2020 }];
  await test('Tìm MAT BIEC chỉ theo title, giữ nguyên tiêu đề', () => { const r = list.run(sample, { query: '  MAT   BIEC ' }); equal(r.items.map(item => item.title), ['Mắt Biếc']); });
  await test('Không tìm vào mô tả hoặc tên gốc', () => { equal(list.run([{ title: 'Khác', originalTitle: 'Mắt Biếc', summary: 'Mắt Biếc' }], { query: 'mat biec' }).total, 0); });
  await test('Truy vấn toàn khoảng trắng không giới hạn', () => equal(list.run(sample, { query: '   ' }).total, 3));
  await test('Lọc AND, chứa giá trị trong mảng thể loại', () => equal(list.run(sample, { query: 'mat', filters: { genres: 'Lãng mạn', year: '2019' } }).items.map(item => item.id), ['vn']));
  await test('Lọc khác năm cho kết quả rỗng', () => equal(list.run(sample, { filters: { genres: 'Lãng mạn', year: 2020 } }).total, 0));
  await test('Sắp xếp số tự nhiên trước khi phân trang', () => equal(list.run(sample).items.map(item => item.id), ['vn', '2', '10']));
  const ties = [{ title: 'abc', id: 1 }, { title: 'ABC', id: 2 }, { title: 'z', id: 3 }];
  await test('Tiêu đề trùng giữ thứ tự nguồn ở cả A–Z và Z–A', () => { equal(list.run(ties, { sort: 'asc' }).items.map(item => item.id), [1,2,3]); equal(list.run(ties, { sort: 'desc' }).items.map(item => item.id), [3,1,2]); });
  const fixture37 = Array.from({ length: 37 }, (_, i) => ({ id: i, title: `Phim ${i + 1}`, year: i % 2 ? 2020 : 2021 }));
  await test('37 bản ghi: 10/20/50/all tạo 4/2/1/1 trang', () => equal([10,20,50,'all'].map(size => list.run(fixture37, { size }).pages), [4,2,1,1]));
  await test('Trang cuối 31–37; tự kẹp trang vượt giới hạn', () => { const r = list.run(fixture37, { page: 99, size: 10 }); equal([r.page,r.start,r.end,r.items.length], [4,31,37,7]); equal(list.run(fixture37,{page:0}).page,1); });
  await test('Tất cả vẫn giữ bộ lọc', () => equal(list.run(fixture37, { size: 'all', filters: { year: 2020 } }).items.length, 18));
  await test('Trạng thái rỗng không có 1–0 hoặc trang 1/0', () => { const r = list.run([], { page: 9 }); equal([r.total,r.pages,r.start,r.end], [0,0,0,0]); });
  await test('Đổi điều kiện chỉ reset trang; xóa bộ lọc giữ tìm kiếm/sắp xếp/size', () => { const state={query:'abc',filters:{year:2020},sort:'desc',size:50,page:4}; equal(list.changed(state,{query:'b'}),{...state,query:'b',page:1}); equal(list.clearFilters(state),{...state,filters:{year:''},page:1}); });
  await test('Pipeline không thay đổi dữ liệu nguồn', () => { const before=JSON.stringify(sample); list.run(sample,{sort:'desc',page:2}); equal(JSON.stringify(sample),before); });
  await test('Thiếu title phải báo lỗi', () => { let thrown=false; try { list.run([{ id:'bad' }]); } catch (_) { thrown=true; } assert(thrown); });
  await test('Chuẩn hóa 8.6/10, 78/100, 4.2/5', () => { near(scores.normalize(makeSource(8.6)),8.6); near(scores.normalize(makeSource(78,100)),7.8); near(scores.normalize(makeSource(4.2,5)),8.4); });
  await test('Loại tỷ lệ tích cực và điểm chưa xác minh', () => { equal(scores.normalize(makeSource(90,100,'critics',{metric:'positive-percentage'})),null); equal(scores.normalize(makeSource(8,10,'critics',{status:'unverified'})),null); });
  await test('Loại NaN, Infinity, chuỗi, âm, vượt thang, thang 0', () => { [NaN,Infinity,'8',-1,11].forEach(value=>equal(scores.normalize(makeSource(value)),null)); equal(scores.normalize(makeSource(1,0)),null); });
  await test('Điểm 0 hợp lệ được giữ, không dùng 0 thay dữ liệu thiếu', () => { equal(scores.normalize(makeSource(0)),0); equal(scores.calculate({ratings:[]}).total,null); });
  const scoreMovie={ratings:[makeSource(80,100),makeSource(90,100),makeSource(7,10,'audience')]};
  await test('Trọng số nhóm chuyên gia/khán giả và bên ngoài/nội bộ chính xác', () => { const r=scores.calculate(scoreMovie,[{score:9},{score:10}]); near(r.critics,8.5); near(r.external,7.75); near(r.internal,9.5); near(r.total,8.625); });
  await test('Không làm tròn trung gian', () => { const r=scores.calculate({ratings:[makeSource(1,3),makeSource(2,3)]},[{score:8.123}]); near(r.total,6.5615); });
  await test('Thiếu một nhóm vẫn tính đúng; thiếu tất cả trả null', () => { equal(scores.calculate({ratings:[makeSource(8)]}).total,8); equal(scores.calculate({},[{score:9}]).total,9); equal(scores.calculate({}).total,null); });
  await test('Review ngoài khoảng không ảnh hưởng trung bình', () => equal(scores.calculate({},[{score:0},{score:11},{score:NaN},{score:'9'},{score:8}]).internal,8));
  await test('Danh mục thật có 20 ID duy nhất, tiêu đề và nguồn điểm đầy đủ', () => { equal(movies.length,20); equal(new Set(movies.map(m=>m.id)).size,20); assert(movies.every(m=>m.title && m.poster && m.sources.info && m.ratings.every(r=>r.url && r.checkedAt && r.status==='verified'))); });
  await test('Dữ liệu phim được đóng băng sâu', () => assert(Object.isFrozen(movies) && Object.isFrozen(movies[0].ratings[0])));
  const record={id:'test-only',movieId:'interstellar',author:'Người kiểm thử',title:'Một góc nhìn',body:'Dữ liệu tạm',score:8,createdAt:'2026-10-22T12:00:00Z',updatedAt:'2026-10-22T12:00:00Z'};
  await test('Validate cấu trúc review và dữ liệu lưu trữ', () => { assert(storage.valid(record)); assert(!storage.valid({...record,title:''})); assert(!storage.valid({...record,score:11})); equal(storage.decode(JSON.stringify({version:1,reviews:[record]})),[record]); });
  await test('JSON lỗi, phiên bản sai, trùng ID đều bị từ chối', () => { for(const raw of ['{','{"version":2,"reviews":[]}',JSON.stringify({version:1,reviews:[record,record]})]) { let thrown=false;try{storage.decode(raw);}catch(_){thrown=true;}assert(thrown); } });
  await test('Lưu trữ bị chặn: thêm/sửa/xóa vẫn dùng được trong phiên', () => {
    const local = storage.create(() => { throw new DOMException('Blocked', 'SecurityError'); });
    local.upsert(record); equal(local.get('interstellar').length,1); assert(local.notice());
    local.upsert({...record,score:9}); equal(local.get('interstellar')[0].score,9);
    local.refresh(); equal(local.get('interstellar').length,1); local.remove(record.id,record.movieId); equal(local.get('interstellar').length,0);
  });
  await test('Quota đầy: giữ dữ liệu cũ trên đĩa và thay đổi trong bộ nhớ', () => {
    const raw=JSON.stringify({version:1,reviews:[record]}); const local=storage.create(()=>({getItem:()=>raw,setItem:()=>{throw new DOMException('Full','QuotaExceededError');}}));
    local.upsert({...record,id:'another'});equal(local.get('interstellar').length,2);assert(local.notice());
    equal(storage.decode(raw).length,1); local.refresh();equal(local.get('interstellar').length,2);
  });
  await test('Một review lỗi không làm ghi đè hoặc mất bản lưu cũ', () => {
    const raw=JSON.stringify({version:1,reviews:[record,{...record,id:'broken',score:100}]}); let writes=0;
    const local=storage.create(()=>({getItem:()=>raw,setItem:()=>{writes++;}}));
    local.upsert({...record,id:'session'});equal(writes,0);assert(local.notice());equal(local.get('interstellar').length,1);
  });
  await test('ID review không được chuyển sang phim khác', () => {
    const local=storage.create(()=>({getItem:()=>null,setItem:()=>{}}));local.upsert(record);let thrown=false;
    try{local.upsert({...record,movieId:'arrival'});}catch(_){thrown=true;}assert(thrown);equal(local.get('interstellar').length,1);
  });
  await test('Theme ưu tiên giá trị hợp lệ, bỏ giá trị sai và dùng dự phòng', () => {
    equal(window.KH.theme.resolve('light',true),'light');equal(window.KH.theme.resolve('dark',false),'dark');
    equal(window.KH.theme.resolve('broken',true),'dark');equal(window.KH.theme.resolve(null,false),'light');equal(window.KH.theme.resolve(undefined,undefined),'light');
  });
  await test('Toàn bộ poster và backdrop cục bộ tải được', async () => {
    const paths=[...new Set(movies.flatMap(m=>[m.poster,m.backdrop]).filter(Boolean))];
    await Promise.all(paths.map(path=>new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>{if(img.naturalWidth>0)resolve();else reject(new Error(path));};img.onerror=()=>reject(new Error(path));img.src='../'+path;})));
  });
  let frame;
  async function page(path, width=1440) {
    if(frame)frame.remove();
    frame=document.createElement('iframe');frame.width=String(width);frame.height='1000';frame.title='Trang kiểm thử tạm';
    document.getElementById('test-fixture').append(frame);
    await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('Trang kiểm thử không tải được')),6000);frame.onload=()=>{clearTimeout(timer);resolve();};frame.src='../'+path;});
    return {w:frame.contentWindow,d:frame.contentDocument};
  }
  const input=(w,node,value,type='input')=>{node.value=value;node.dispatchEvent(new w.Event(type,{bubbles:true}));};
  let app;
  await test('Trang chủ khởi tạo 10 phim, A–Z, tất cả bộ lọc', async () => { app=await page('index.html');equal(app.d.querySelectorAll('.movie-card').length,10);equal(app.d.getElementById('sort').value,'asc');equal(app.d.getElementById('genre').value,'');assert(app.d.getElementById('pagination').textContent.includes('1 / 2')); });
  await test('DOM tìm kiếm khi nhập và trạng thái không có kết quả',()=>{input(app.w,app.d.getElementById('search'),'AFTERSUN');equal(app.d.querySelectorAll('.movie-card').length,1);input(app.w,app.d.getElementById('search'),'khong-co-phim-nay');equal(app.d.querySelectorAll('.movie-card').length,0);assert(!app.d.getElementById('empty-state').hidden);assert(!app.d.getElementById('pagination').textContent.includes('1 / 0'));input(app.w,app.d.getElementById('search'),'');});
  await test('DOM lọc kết hợp, xóa bộ lọc giữ truy vấn/sort/size',()=>{input(app.w,app.d.getElementById('search'),'a');input(app.w,app.d.getElementById('sort'),'desc','change');input(app.w,app.d.getElementById('page-size'),'20','change');input(app.w,app.d.getElementById('genre'),'Chính kịch','change');input(app.w,app.d.getElementById('year'),'2022','change');const ids=[...app.d.querySelectorAll('.movie-card')].map(n=>n.dataset.movieId);assert(ids.every(id=>movies.find(m=>m.id===id).year===2022));app.d.getElementById('clear-filters').click();equal(app.d.getElementById('search').value,'a');equal(app.d.getElementById('sort').value,'desc');equal(app.d.getElementById('page-size').value,'20');equal(app.d.getElementById('year').value,'');});
  await test('DOM flip và nút lật lại không điều hướng',()=>{const card=app.d.querySelector('.movie-card');const before=app.w.location.href;card.querySelector('.poster-front').click();assert(card.classList.contains('is-flipped'));assert(card.querySelector('.poster-front').inert);assert(!card.querySelector('.poster-back').inert);card.querySelector('.flip-back').click();assert(!card.classList.contains('is-flipped'));equal(app.w.location.href,before);});
  await test('DOM theme giữ điều kiện tra cứu',()=>{const query=app.d.getElementById('search').value;const before=app.d.documentElement.dataset.theme;app.d.querySelector('[data-theme-toggle]').click();assert(app.d.documentElement.dataset.theme!==before);equal(app.d.getElementById('search').value,query);assert(app.d.querySelector('[data-theme-toggle]').getAttribute('aria-label').includes('Chuyển sang'));});
  await test('Theme giữ trang 2/bộ lọc và tồn tại sau reload',async()=>{
    input(app.w,app.d.getElementById('search'),'');input(app.w,app.d.getElementById('page-size'),'10','change');
    input(app.w,app.d.getElementById('genre'),'Chính kịch','change');app.d.querySelector('#pagination .page-controls button:last-child').click();
    assert(app.d.getElementById('pagination').textContent.includes('2 / 2'));
    const query=app.w.location.search;app.d.querySelector('[data-theme-toggle]').click();const theme=app.d.documentElement.dataset.theme;
    equal(app.w.location.search,query);app=await page('index.html'+query);equal(app.d.documentElement.dataset.theme,theme);equal(app.d.getElementById('genre').value,'Chính kịch');assert(app.d.getElementById('pagination').textContent.includes('2 / 2'));
  });
  await test('ID phim sai có thông báo và không hiển thị form review',async()=>{const p=await page('movie.html?id=does-not-exist');assert(p.d.querySelector('.invalid-movie'));assert(p.d.getElementById('reviews-section').hidden);});
  let detail;let originalReviewRaw;
  await test('Mở trực tiếp chi tiết đúng phim',async()=>{detail=await page('movie.html?id=interstellar');equal(detail.d.querySelector('h1').textContent,'Interstellar');assert(!detail.d.getElementById('reviews-section').hidden);originalReviewRaw=detail.w.localStorage.getItem(storage.key);detail.w.localStorage.setItem(storage.key,JSON.stringify({version:1,reviews:[]}));detail.w.KH.storage.refresh();});
  await test('Danh sách nguồn điểm có đủ tìm kiếm, lọc, sort và phân trang',()=>{
    input(detail.w,detail.d.getElementById('source-search'),'USER');equal(detail.d.querySelectorAll('.source-table tbody tr').length,1);assert(detail.d.querySelector('.source-table tbody').textContent.includes('User Score'));
    input(detail.w,detail.d.getElementById('source-group'),'critics','change');assert(detail.d.querySelector('.source-table tbody').textContent.includes('Không có kết quả phù hợp'));
    detail.d.getElementById('source-clear').click();equal(detail.d.getElementById('source-search').value,'USER');
    input(detail.w,detail.d.getElementById('source-search'),'');equal(detail.d.querySelectorAll('.source-table tbody tr').length,2);
    equal([...detail.d.getElementById('source-size').options].map(o=>o.value),['10','20','50','all']);
  });
  const fillReview=(title,score,body='Nội dung kiểm thử')=>{for(const[key,value]of Object.entries({author:'Người kiểm thử',title,score,body}))detail.d.getElementById('review-'+key).value=value;};
  const submitReview=()=>detail.d.getElementById('review-form').dispatchEvent(new detail.w.Event('submit',{bubbles:true,cancelable:true}));
  await test('Form từ chối thiếu trường và điểm ngoài khoảng',()=>{submitReview();equal(detail.w.KH.storage.get('interstellar').length,0);fillReview('Review kiểm thử',11);submitReview();equal(detail.w.KH.storage.get('interstellar').length,0);assert(detail.d.getElementById('review-score-error').textContent);});
  await test('Thêm review cập nhật điểm ngay; HTML người dùng hiển thị an toàn',()=>{fillReview('Cảm nhận <img src=x onerror=alert(1)>',9,'<script>window.injected=true</script>');submitReview();equal(detail.w.KH.storage.get('interstellar').length,1);assert(detail.d.querySelector('.review-card h4').textContent.includes('<img'));assert(!detail.d.querySelector('.review-card img'));assert(!detail.w.injected);near(detail.w.KH.scores.calculate(movies[0],detail.w.KH.storage.get('interstellar')).total,8.525);assert(detail.d.querySelector('.score-tile.combined strong').textContent.includes('8.5'));});
  await test('Quay về danh mục nhận điểm review vừa tạo ở trang chi tiết',async()=>{
    const catalog=await page('index.html');const card=catalog.d.querySelector('[data-movie-id="interstellar"]');assert(card);assert(card.querySelector('.card-score.total strong').textContent.includes('8.5'));assert(card.querySelector('.card-score-note').textContent.includes('1 review'));detail=await page('movie.html?id=interstellar');
  });
  await test('Review tồn tại sau reload',async()=>{detail=await page('movie.html?id=interstellar');equal(detail.w.KH.storage.get('interstellar').length,1);equal(detail.d.querySelectorAll('.review-card').length,1);});
  await test('Sửa review giữ ID, thay nội dung và tính lại điểm',()=>{const id=detail.w.KH.storage.get('interstellar')[0].id;detail.d.querySelector('[data-action="edit"]').click();fillReview('Đã sửa cảm nhận',7);submitReview();equal(detail.w.KH.storage.get('interstellar')[0].id,id);equal(detail.w.KH.storage.get('interstellar')[0].score,7);near(detail.w.KH.scores.calculate(movies[0],detail.w.KH.storage.get('interstellar')).total,7.525);});
  await test('Danh sách review có tìm kiếm, lọc, sort, size và reset riêng',()=>{input(detail.w,detail.d.getElementById('review-search'),'DA SUA');equal(detail.d.querySelectorAll('.review-card').length,1);input(detail.w,detail.d.getElementById('review-filter'),'7','change');input(detail.w,detail.d.getElementById('review-sort'),'desc','change');input(detail.w,detail.d.getElementById('review-size'),'all','change');detail.d.getElementById('review-clear').click();equal(detail.d.getElementById('review-search').value,'DA SUA');equal(detail.d.getElementById('review-sort').value,'desc');equal(detail.d.getElementById('review-size').value,'all');});
  await test('Review của phim này không xuất hiện ở phim khác',async()=>{const p=await page('movie.html?id=arrival');equal(p.w.KH.storage.get('arrival').length,0);equal(p.d.querySelectorAll('.review-card').length,0);detail=await page('movie.html?id=interstellar');});
  await test('Xóa có xác nhận, tính lại điểm và giữ sau reload',async()=>{detail.d.querySelector('[data-action="delete"]').click();assert(detail.d.querySelector('[data-action="confirm-delete"]'));detail.d.querySelector('[data-action="confirm-delete"]').click();equal(detail.w.KH.storage.get('interstellar').length,0);near(detail.w.KH.scores.calculate(movies[0],[]).total,8.05);detail=await page('movie.html?id=interstellar');equal(detail.d.querySelectorAll('.review-card').length,0);});
  await test('Dữ liệu lưu lỗi được giữ nguyên, review mới chỉ lưu trong phiên',async()=>{detail.w.localStorage.setItem(storage.key,'{corrupt');detail=await page('movie.html?id=interstellar');assert(!detail.d.getElementById('storage-notice').hidden);fillReview('Dữ liệu trong phiên',8);submitReview();equal(detail.w.localStorage.getItem(storage.key),'{corrupt');equal(detail.w.KH.storage.get('interstellar').length,1);});
  try { if(detail){if(originalReviewRaw==null)detail.w.localStorage.removeItem(storage.key);else detail.w.localStorage.setItem(storage.key,originalReviewRaw);} }catch(_){}
  for(const width of [360,768,1024,1440])for(const path of ['index.html','movie.html?id=everything-everywhere-all-at-once']) {
    await test(`Bố cục ${width}px, ${path}: không cuộn ngang toàn trang`,async()=>{
      const p=await page(path,width);assert(p.d.documentElement.scrollWidth<=p.d.documentElement.clientWidth,`${p.d.documentElement.scrollWidth} > ${p.d.documentElement.clientWidth}`);
      const login=p.d.querySelector('.login-button').getBoundingClientRect();const theme=p.d.querySelector('[data-theme-toggle]').getBoundingClientRect();assert(login.right<=theme.left+1,'Đăng nhập và theme chồng lấn');
    });
  }
  if(frame)frame.remove();
  document.getElementById('test-status').textContent=`Hoàn tất: ${passed} đạt, ${failed} lỗi.`;
  document.body.dataset.testResult=failed?'failed':'passed';
  document.body.dataset.passed=String(passed);document.body.dataset.failed=String(failed);
})().catch(error=>{document.getElementById('test-status').textContent='Lỗi bộ kiểm thử: '+error.message;document.body.dataset.testResult='failed';});
