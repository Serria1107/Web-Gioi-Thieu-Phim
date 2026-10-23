/* No dependencies. Uses a real browser and actual application pages. */
(async () => {
  'use strict';
  const { list, scores, storage, movies, auth } = window.KH;
  const output = document.getElementById('test-results');
  let passed = 0; let failed = 0;
  const assert = (condition, message = 'Điều kiện không thỏa') => { if (!condition) throw new Error(message); };
  const equal = (actual, expected) => assert(JSON.stringify(actual) === JSON.stringify(expected), `${JSON.stringify(actual)} ≠ ${JSON.stringify(expected)}`);
  const near = (actual, expected) => assert(Math.abs(actual - expected) < 1e-10, `${actual} ≠ ${expected}`);
  const accountKey = auth.accountsKey;
  const originalAccounts = localStorage.getItem(accountKey);
  const originalLocalSession = localStorage.getItem('khung-hinh:session:v1');
  const originalTabSession = sessionStorage.getItem('khung-hinh:session:v1');
  const originalLogout = localStorage.getItem('khung-hinh:logout:v1');
  const originalTheme = localStorage.getItem('theme');
  const originalReviews = localStorage.getItem(storage.key);
  const originalViews = Object.fromEntries(Object.keys(sessionStorage).filter(key => key.startsWith('khung-hinh:watchlist-view:')).map(key => [key, sessionStorage.getItem(key)]));
  const until = async (condition, message = 'Hết thời gian chờ') => {
    const deadline = Date.now() + 6000;
    while (!condition()) { if (Date.now() > deadline) throw new Error(message); await new Promise(resolve => setTimeout(resolve,20)); }
  };
  const clickAsync = async button => { button.click(); await until(() => !button.disabled); };
  // The runner owns only these keys and restores them in finally, even on an unexpected failure.
  try {
  localStorage.removeItem(accountKey); localStorage.removeItem(storage.key);
  localStorage.removeItem('khung-hinh:session:v1'); sessionStorage.removeItem('khung-hinh:session:v1');
  auth.refresh(); storage.refresh();
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
  await test('Sắp xếp Watchlist theo ngày/điểm giữ thiếu điểm ở cuối', () => {
    const saved=[{id:'a',title:'A',addedAt:'2026-01-01',listRating:null},{id:'b',title:'B',addedAt:'2026-02-01',listRating:7},{id:'c',title:'C',addedAt:'2026-03-01',listRating:9}];
    equal(list.run(saved,{sort:'rating-desc'}).items.map(item=>item.id),['c','b','a']);
    equal(list.run(saved,{sort:'rating-asc'}).items.map(item=>item.id),['b','c','a']);
    equal(list.run(saved,{sort:'added-desc'}).items.map(item=>item.id),['c','b','a']);
  });
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
  const record={id:'test-only',movieId:'interstellar',author:'Người kiểm thử',ownerId:'owner-a',title:'Một góc nhìn',body:'Dữ liệu tạm',score:8,createdAt:'2026-10-22T12:00:00Z',updatedAt:'2026-10-22T12:00:00Z'};
  await test('Validate cấu trúc review và dữ liệu lưu trữ', () => { assert(storage.valid(record)); assert(!storage.valid({...record,title:''})); assert(!storage.valid({...record,score:11})); equal(storage.decode(JSON.stringify({version:1,reviews:[record]})),[record]); });
  await test('Review cũ không owner vẫn đọc được nhưng không thể sửa hoặc xóa', () => {
    const legacy={...record};delete legacy.ownerId;
    assert(storage.valid(legacy));equal(storage.decode(JSON.stringify({version:1,reviews:[legacy]})),[legacy]);
    const local=storage.create(()=>({getItem:()=>JSON.stringify({version:1,reviews:[legacy]}),setItem:()=>{throw new Error('unexpected write');}}));
    let blocked=false;try{local.upsert({...legacy,title:'Không được sửa'});}catch(_){blocked=true;}assert(blocked);
    assert(!local.remove(legacy.id,legacy.movieId,'owner-a'));
  });
  await test('JSON lỗi, phiên bản sai, trùng ID đều bị từ chối', () => { for(const raw of ['{','{"version":2,"reviews":[]}',JSON.stringify({version:1,reviews:[record,record]})]) { let thrown=false;try{storage.decode(raw);}catch(_){thrown=true;}assert(thrown); } });
  await test('Lưu trữ bị chặn: thêm/sửa/xóa vẫn dùng được trong phiên', () => {
    const local = storage.create(() => { throw new DOMException('Blocked', 'SecurityError'); });
    local.upsert(record); equal(local.get('interstellar').length,1); assert(local.notice());
    local.upsert({...record,score:9}); equal(local.get('interstellar')[0].score,9);
    local.refresh(); equal(local.get('interstellar').length,1); local.remove(record.id,record.movieId,record.ownerId); equal(local.get('interstellar').length,0);
  });
  await test('Quota đầy: giữ dữ liệu cũ trên đĩa và thay đổi trong bộ nhớ', () => {
    const raw=JSON.stringify({version:1,reviews:[record]}); const local=storage.create(()=>({getItem:()=>raw,setItem:()=>{throw new DOMException('Full','QuotaExceededError');}}));
    local.upsert({...record,id:'another'});equal(local.get('interstellar').length,2);assert(local.notice());
    equal(storage.decode(raw).length,1); local.refresh();equal(local.get('interstellar').length,2);
  });
  let passwordA='MovieDemoA9!';
  const passwordB='MovieDemoB9!';
  await test('Đăng ký A/B, Watchlist tách biệt và không thêm trùng phim',async()=>{
    await auth.register('cineUserA','cine-a@example.test',passwordA);
    const accountA=auth.get(); assert(accountA && accountA.username==='cineUserA');
    assert((await auth.addToWatchlist('a-quiet-place')).added); assert((await auth.addToWatchlist('interstellar')).added);
    assert(!(await auth.addToWatchlist('interstellar')).added); equal(auth.getWatchlist().length,2);
    auth.logout();
    await auth.register('cineUserB','cine-b@example.test',passwordB);
    assert((await auth.addToWatchlist('arrival')).added); equal(auth.getWatchlist().map(item=>item.movieId),['arrival']);
    auth.logout();
  });
  await test('Không trùng username/email, từ chối mật khẩu sai và khôi phục A',async()=>{
    let duplicateName=false,duplicateEmail=false,badPassword=false;
    try{await auth.register('CineUserA','other@example.test',passwordA);}catch(_){duplicateName=true;}
    try{await auth.register('newUser','cine-a@example.test',passwordA);}catch(_){duplicateEmail=true;}
    try{await auth.login('cine-a@example.test','wrong-password');}catch(_){badPassword=true;}
    assert(duplicateName && duplicateEmail && badPassword);
    await auth.login('cine-a@example.test',passwordA,true);
    equal(auth.getWatchlist().map(item=>item.movieId),['a-quiet-place','interstellar']);
    assert(localStorage.getItem('khung-hinh:session:v1'));
  });
  await test('Đổi mật khẩu cần mật khẩu hiện tại và dùng hash mới',async()=>{
    let rejected=false;try{await auth.changePassword('sai-mat-khau','NewMoviePass9!');}catch(_){rejected=true;}assert(rejected);
    await auth.changePassword(passwordA,'NewMoviePass9!');auth.logout();
    let oldRejected = false; try { await auth.login('cineUserA', passwordA); } catch (_) { oldRejected = true; } assert(oldRejected);
    passwordA='NewMoviePass9!';
    await auth.login('cineUserA',passwordA,true);
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
  const input=(_w,node,value,type='input')=>{node.value=value;node.dispatchEvent(new Event(type,{bubbles:true}));};
  let app;
  await test('Trang chủ khởi tạo và menu tài khoản hỗ trợ bàn phím', async () => {
    app=await page('index.html');equal(app.d.querySelectorAll('.movie-card').length,10);equal(app.d.getElementById('sort').value,'asc');equal(app.d.getElementById('genre').value,'');assert(app.d.getElementById('pagination').textContent.includes('1 / 2'));
    const trigger=app.d.querySelector('.account-trigger');assert(trigger);trigger.click();assert(!app.d.querySelector('.account-menu').hidden);assert(app.d.querySelector('.account-menu').textContent.includes('Watchlist của tôi'));
    app.d.querySelector('.account-menu').dispatchEvent(new app.w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));app.w.document.dispatchEvent(new app.w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert(app.d.querySelector('.account-menu').hidden);
  });
  await test('Watchlist hiển thị đúng phim, bộ lọc và liên kết chi tiết chính xác',async()=>{
    const watch=await page('watchlist.html');equal(watch.d.querySelectorAll('.watchlist-card').length,2);
    assert(watch.d.querySelector('.watchlist-card-title').textContent.includes('A Quiet Place'));
    equal(watch.d.querySelector('.watchlist-poster-link').getAttribute('href'),'movie.html?id=a-quiet-place');
    input(watch.w,watch.d.getElementById('watchlist-search'),'quiet place');equal(watch.d.querySelectorAll('.watchlist-card').length,1);
    input(watch.w,watch.d.getElementById('watchlist-sort'),'added-desc','change');
    input(watch.w,watch.d.getElementById('watchlist-size'),'all','change');assert(watch.d.getElementById('watchlist-pagination').textContent.includes('1 / 1'));
    await clickAsync(watch.d.querySelector('button[data-movie-id="a-quiet-place"]'));equal(watch.w.KH.auth.getWatchlist().length,1);
    await watch.w.KH.auth.addToWatchlist('a-quiet-place');equal(watch.w.KH.auth.getWatchlist().length,2);
  });
  await test('Nhấn poster A Quiet Place mở đúng trang chi tiết và trở lại giữ điều kiện Watchlist', async () => {
    let watch = await page('watchlist.html');
    equal(watch.d.getElementById('watchlist-search').value, 'quiet place');
    equal(watch.d.getElementById('watchlist-size').value, 'all');
    watch.d.querySelector('.watchlist-poster-link').click();
    await until(() => frame.contentDocument.querySelector('h1')?.textContent === 'A Quiet Place');
    equal(frame.contentWindow.KH.auth.get().username, 'cineUserA');
    equal(frame.contentDocument.querySelector('.watchlist-toggle').getAttribute('aria-pressed'), 'true');
    await clickAsync(frame.contentDocument.querySelector('.watchlist-toggle'));
    equal(frame.contentDocument.querySelector('.watchlist-toggle').getAttribute('aria-pressed'), 'false');
    await clickAsync(frame.contentDocument.querySelector('.watchlist-toggle'));
    equal(frame.contentDocument.querySelector('.watchlist-toggle').getAttribute('aria-pressed'), 'true');
    watch = await page('watchlist.html');
    equal(watch.d.getElementById('watchlist-search').value, 'quiet place');
    equal(watch.d.getElementById('watchlist-sort').value, 'added-desc');
    equal(watch.d.querySelectorAll('.watchlist-card').length, 1);
    input(watch.w, watch.d.getElementById('watchlist-search'), '');
    input(watch.w, watch.d.getElementById('watchlist-size'), '10', 'change');
  });
  await test('Đăng ký qua form, đăng nhập ghi nhớ và màn hình khôi phục demo',async()=>{
    const guest=await page('index.html');guest.d.querySelector('.account-trigger').click();
    [...guest.d.querySelectorAll('.account-menu-item')].find(item=>item.textContent==='Đăng xuất').click();
    await new Promise(resolve=>setTimeout(resolve,50));
    guest.d.querySelector('.login-button').click();assert(guest.d.getElementById('account-dialog').open);
    assert(guest.d.querySelector('[name="identity"]'));assert(guest.d.querySelector('[name="password"]'));
    [...guest.d.querySelectorAll('.account-links .text-button')].find(item=>item.textContent.includes('Đăng ký')).click();
    assert(guest.d.querySelector('[name="confirm"]'));assert(guest.d.getElementById('account-dialog-title').textContent.includes('Tạo tài khoản'));
    const registerForm=guest.d.querySelector('.account-form');
    for(const [name,value] of Object.entries({username:'uiSmoke',email:'ui-smoke@example.test',password:'UiSmokePass9!',confirm:'MismatchPass9!'})) registerForm.elements[name].value=value;
    registerForm.dispatchEvent(new guest.w.Event('submit',{bubbles:true,cancelable:true}));
    assert(guest.d.getElementById('account-error-confirm').textContent.includes('khớp'),`Mismatch error missing: ${guest.d.getElementById('account-error-confirm').textContent}`);
    registerForm.elements.confirm.value='UiSmokePass9!';
    registerForm.dispatchEvent(new guest.w.Event('submit',{bubbles:true,cancelable:true}));
    await until(()=>guest.d.querySelector('.account-trigger')?.textContent.includes('uiSmoke'));
    assert(guest.d.querySelector('.account-trigger')?.textContent.includes('uiSmoke'),'Registration did not create an active user.');
    assert(guest.w.sessionStorage.getItem('khung-hinh:session:v1'),'Registration did not keep a tab session.');
    guest.d.querySelector('.account-trigger').click();
    [...guest.d.querySelectorAll('.account-menu-item')].find(item=>item.textContent==='Đăng xuất').click();
    guest.d.querySelector('.login-button').click();
    const loginForm=guest.d.querySelector('.account-form');
    loginForm.elements.identity.value='ui-smoke@example.test';loginForm.elements.password.value='UiSmokePass9!';
    guest.d.querySelector('.remember-row input').checked=true;
    loginForm.dispatchEvent(new guest.w.Event('submit',{bubbles:true,cancelable:true}));
    await until(()=>guest.w.localStorage.getItem('khung-hinh:session:v1') && !guest.d.getElementById('account-dialog').open);
    assert(guest.w.localStorage.getItem('khung-hinh:session:v1'),'Remembered login session was not persisted.');
    guest.w.location.reload();await new Promise(resolve=>setTimeout(resolve,400));
    guest.d=guest.w.document;assert(guest.d.querySelector('.account-trigger'),'Remembered session was lost after refresh.');
    guest.d.querySelector('.account-trigger').click();
    [...guest.d.querySelectorAll('.account-menu-item')].find(item=>item.textContent==='Đăng xuất').click();
    guest.d.querySelector('.login-button').click();
    [...guest.d.querySelectorAll('.account-links .text-button')].find(item=>item.textContent.includes('Quên mật khẩu')).click();
    assert(guest.d.querySelector('.account-limitation').textContent.includes('không gửi email'),'Password recovery UI does not explain its limitation.');
    guest.d.querySelector('.dialog-close').click();
    await auth.login('cine-a@example.test',passwordA,true);
  });
  await test('DOM tìm kiếm khi nhập và trạng thái không có kết quả',async()=>{app=await page('index.html');input(app.w,app.d.getElementById('search'),'AFTERSUN');equal(app.d.querySelectorAll('.movie-card').length,1);input(app.w,app.d.getElementById('search'),'khong-co-phim-nay');equal(app.d.querySelectorAll('.movie-card').length,0);assert(!app.d.getElementById('empty-state').hidden);assert(!app.d.getElementById('pagination').textContent.includes('1 / 0'));input(app.w,app.d.getElementById('search'),'');});
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
  await test('Nút Watchlist toggle đồng bộ header và trạng thái phim',async()=>{
    const button=detail.d.querySelector('.watchlist-toggle');assert(button.getAttribute('aria-pressed')==='true',`Watchlist button expected saved; user=${detail.w.KH.auth.get()?.username}; entries=${JSON.stringify(detail.w.KH.auth.getWatchlist())}`);
    await clickAsync(button);assert(button.textContent.includes('+ Watchlist'));assert(!detail.w.KH.auth.getWatchlist().some(item=>item.movieId==='interstellar'));
    await clickAsync(button);assert(button.getAttribute('aria-pressed')==='true');assert(detail.w.KH.auth.getWatchlist().some(item=>item.movieId==='interstellar'));
  });
  await test('Khách lưu phim sẽ đăng nhập rồi hoàn tất đúng hành động đang chờ',async()=>{
    const button=detail.d.querySelector('.watchlist-toggle');await clickAsync(button);detail.w.KH.auth.logout();
    button.click();assert(detail.d.getElementById('account-dialog').open);
    const form=detail.d.querySelector('.account-form');form.elements.identity.value='cine-a@example.test';
    form.elements.password.value=passwordA;detail.d.querySelector('.remember-row input').checked=true;
    form.dispatchEvent(new detail.w.Event('submit',{bubbles:true,cancelable:true}));
    await until(()=>!detail.d.getElementById('account-dialog').open && !button.disabled);
    assert(detail.w.KH.auth.getWatchlist().some(item=>item.movieId==='interstellar'));
    assert(detail.d.querySelector('.watchlist-toggle').getAttribute('aria-pressed')==='true');
  });
  await test('Danh sách nguồn điểm có đủ tìm kiếm, lọc, sort và phân trang',()=>{
    input(detail.w,detail.d.getElementById('source-search'),'USER');equal(detail.d.querySelectorAll('.source-table tbody tr').length,1);assert(detail.d.querySelector('.source-table tbody').textContent.includes('User Score'));
    input(detail.w,detail.d.getElementById('source-group'),'critics','change');assert(detail.d.querySelector('.source-table tbody').textContent.includes('Không có kết quả phù hợp'));
    detail.d.getElementById('source-clear').click();equal(detail.d.getElementById('source-search').value,'USER');
    input(detail.w,detail.d.getElementById('source-search'),'');equal(detail.d.querySelectorAll('.source-table tbody tr').length,2);
    equal([...detail.d.getElementById('source-size').options].map(o=>o.value),['10','20','50','all']);
  });
  const fillReview=(title,score,body='Nội dung kiểm thử')=>{for(const[key,value]of Object.entries({author:'Người kiểm thử',title,score,body}))detail.d.getElementById('review-'+key).value=value;};
  const submitReview=async()=>{detail.d.getElementById('review-form').dispatchEvent(new detail.w.Event('submit',{bubbles:true,cancelable:true}));await until(()=>!detail.d.getElementById('review-submit').disabled);};
  await test('Form từ chối thiếu trường và điểm ngoài khoảng',async()=>{await submitReview();equal(detail.w.KH.storage.get('interstellar').length,0);fillReview('Review kiểm thử',11);await submitReview();equal(detail.w.KH.storage.get('interstellar').length,0);assert(detail.d.getElementById('review-score-error').textContent);});
  await test('Thêm review 4,5 sao liên kết tài khoản, an toàn DOM và tính lại điểm',async()=>{fillReview('Cảm nhận <img src=x onerror=alert(1)>',4.5,'<script>window.injected=true</script>');await submitReview();equal(detail.w.KH.storage.get('interstellar').length,1);equal(detail.w.KH.storage.get('interstellar')[0].score,9);assert(detail.w.KH.storage.get('interstellar')[0].ownerId===detail.w.KH.auth.get().id);assert(detail.d.querySelector('.review-card h4').textContent.includes('<img'));assert(!detail.d.querySelector('.review-card img'));assert(!detail.w.injected);near(detail.w.KH.scores.calculate(movies[0],detail.w.KH.storage.get('interstellar')).total,8.525);assert(detail.d.querySelector('.score-tile.combined strong').textContent.includes('8.5'));});
  await test('Quay về danh mục nhận điểm review vừa tạo ở trang chi tiết',async()=>{
    const catalog=await page('index.html');const card=catalog.d.querySelector('[data-movie-id="interstellar"]');assert(card);assert(card.querySelector('.card-score.total strong').textContent.includes('8.5'));assert(card.querySelector('.card-score-note').textContent.includes('1 review'));detail=await page('movie.html?id=interstellar');
  });
  await test('Review tồn tại sau reload',async()=>{detail=await page('movie.html?id=interstellar');equal(detail.w.KH.storage.get('interstellar').length,1);equal(detail.d.querySelectorAll('.review-card').length,1);});
  await test('Tài khoản khác không sửa được review; chủ sở hữu sửa giữ ID và tính lại điểm',async()=>{const target=detail.w.KH.storage.get('interstellar')[0];let blocked=false;try{await detail.w.KH.storage.upsert({...target,ownerId:'account-b',score:6});}catch(_){blocked=true;}assert(blocked);assert(!(await detail.w.KH.storage.remove(target.id,target.movieId,'account-b')));const id=target.id;detail.d.querySelector('[data-action="edit"]').click();fillReview('Đã sửa cảm nhận',3.5);await submitReview();equal(detail.w.KH.storage.get('interstellar')[0].id,id);equal(detail.w.KH.storage.get('interstellar')[0].score,7);near(detail.w.KH.scores.calculate(movies[0],detail.w.KH.storage.get('interstellar')).total,7.525);});
  await test('Danh sách review có tìm kiếm, lọc, sort, size và reset riêng',()=>{input(detail.w,detail.d.getElementById('review-search'),'DA SUA');equal(detail.d.querySelectorAll('.review-card').length,1);input(detail.w,detail.d.getElementById('review-filter'),'7','change');input(detail.w,detail.d.getElementById('review-sort'),'desc','change');input(detail.w,detail.d.getElementById('review-size'),'all','change');detail.d.getElementById('review-clear').click();equal(detail.d.getElementById('review-search').value,'DA SUA');equal(detail.d.getElementById('review-sort').value,'desc');equal(detail.d.getElementById('review-size').value,'all');});
  await test('Review của phim này không xuất hiện ở phim khác',async()=>{const p=await page('movie.html?id=arrival');equal(p.w.KH.storage.get('arrival').length,0);equal(p.d.querySelectorAll('.review-card').length,0);detail=await page('movie.html?id=interstellar');});
  await test('Xóa có xác nhận, tính lại điểm và giữ sau reload',async()=>{detail.d.querySelector('[data-action="delete"]').click();assert(detail.d.querySelector('[data-action="confirm-delete"]'));await clickAsync(detail.d.querySelector('[data-action="confirm-delete"]'));equal(detail.w.KH.storage.get('interstellar').length,0);near(detail.w.KH.scores.calculate(movies[0],[]).total,8.05);detail=await page('movie.html?id=interstellar');equal(detail.d.querySelectorAll('.review-card').length,0);});
  await test('Dữ liệu lưu lỗi được giữ nguyên, review mới chỉ lưu trong phiên',async()=>{detail.w.localStorage.setItem(storage.key,'{corrupt');detail=await page('movie.html?id=interstellar');assert(!detail.d.getElementById('storage-notice').hidden);fillReview('Dữ liệu trong phiên',4);await submitReview();equal(detail.w.localStorage.getItem(storage.key),'{corrupt');const count=detail.w.KH.storage.get('interstellar').length;assert(count===1,`Có ${count} review; form="${detail.d.getElementById('form-status').textContent}"; user="${detail.w.KH.auth.get()?.username}"`);});
  localStorage.setItem(storage.key, JSON.stringify({ version: 1, reviews: [] }));
  await test('Validation trong dịch vụ từ chối dữ liệu sai, email chuẩn hóa và username gây nhập nhằng', async () => {
    const before = localStorage.getItem(accountKey);
    for (const args of [['', 'valid@example.test', passwordA], ['bad@name', 'valid@example.test', passwordA], ['newValid', 'bad-email', passwordA], ['newValid', 'valid@example.test', 'weak']]) {
      let rejected = false; try { await auth.register(...args); } catch (_) { rejected = true; } assert(rejected);
    }
    equal(localStorage.getItem(accountKey), before);
    let rejected = false; try { await auth.register('uniqueNewName', ' CINE-A@EXAMPLE.TEST ', passwordA); } catch (_) { rejected = true; } assert(rejected);
  });
  await test('Hai đăng ký đồng thời không ghi đè tài khoản và không tạo trùng', async () => {
    const results = await Promise.allSettled([
      auth.register('raceUser', 'race-user@example.test', passwordB),
      auth.register('RaceUser', 'race-user@example.test', passwordB)
    ]);
    equal(results.filter(result => result.status === 'fulfilled').length, 1);
    const accounts = JSON.parse(localStorage.getItem(accountKey)).accounts;
    equal(accounts.filter(account => account.email === 'race-user@example.test').length, 1);
    assert(accounts.some(account => account.username === 'cineUserA') && accounts.some(account => account.username === 'cineUserB'));
    assert(accounts.every(account => !('password' in account) && !JSON.stringify(account).includes(passwordB)));
    await auth.login('cineUserA', passwordA, true);
  });
  await test('Watchlist 20 phim: tìm/lọc/điểm/sort/10/20/50/all kết hợp và không sửa phim gốc', async () => {
    const original = JSON.stringify(movies);
    await Promise.all(movies.map(movie => auth.addToWatchlist(movie.id)));
    let watch = await page('watchlist.html');
    input(watch.w, watch.d.getElementById('watchlist-search'), '');
    input(watch.w, watch.d.getElementById('watchlist-sort'), 'asc', 'change');
    for (const [size, count] of [['10', 10], ['20', 20], ['50', 20], ['all', 20]]) {
      input(watch.w, watch.d.getElementById('watchlist-size'), size, 'change');
      equal(watch.d.querySelectorAll('.watchlist-card').length, count);
    }
    input(watch.w, watch.d.getElementById('watchlist-size'), '10', 'change');
    watch.d.querySelector('#watchlist-pagination .page-controls button:last-child').click();
    assert(watch.d.getElementById('watchlist-pagination').textContent.includes('2 / 2'));
    watch = await page('watchlist.html');
    assert(watch.d.getElementById('watchlist-pagination').textContent.includes('2 / 2'));
    input(watch.w, watch.d.getElementById('watchlist-search'), '  QUIET   PLACE ');
    input(watch.w, watch.d.getElementById('watchlist-genre'), 'Kinh dị', 'change');
    input(watch.w, watch.d.getElementById('watchlist-year'), '2018', 'change');
    const quiet = movies.find(movie => movie.id === 'a-quiet-place');
    const quietScore = scores.calculate(quiet, []).total;
    input(watch.w, watch.d.getElementById('watchlist-score'), quietScore >= 8 ? 'high' : quietScore >= 6 ? 'mid' : 'low', 'change');
    input(watch.w, watch.d.getElementById('watchlist-sort'), 'desc', 'change');
    equal(watch.d.querySelectorAll('.watchlist-card').length, 1);
    assert(watch.d.querySelector('.watchlist-card-title').textContent === 'A Quiet Place');
    watch.d.getElementById('watchlist-clear').click();
    equal(watch.d.getElementById('watchlist-search').value, '  QUIET   PLACE ');
    equal(watch.d.getElementById('watchlist-sort').value, 'desc');
    input(watch.w, watch.d.getElementById('watchlist-search'), 'no-such-movie');
    assert(!watch.d.getElementById('watchlist-empty').hidden); assert(watch.d.getElementById('watchlist-pagination').hidden);
    input(watch.w, watch.d.getElementById('watchlist-search'), '');
    for (const movie of movies.filter(movie => !['interstellar', 'a-quiet-place'].includes(movie.id))) await watch.w.KH.auth.removeFromWatchlist(movie.id);
    equal(JSON.stringify(movies), original);
  });
  await test('Đổi tài khoản không dùng bộ lọc hay Watchlist của người khác', async () => {
    let watch = await page('watchlist.html');
    input(watch.w, watch.d.getElementById('watchlist-search'), 'quiet');
    await watch.w.KH.auth.login('cineUserB', passwordB, true);
    equal(watch.d.getElementById('watchlist-search').value, '');
    equal(watch.d.querySelector('.watchlist-card-title').textContent, 'Arrival');
    await watch.w.KH.auth.login('cineUserA', passwordA, true);
    equal(watch.d.getElementById('watchlist-search').value, 'quiet');
    equal(watch.d.querySelector('.watchlist-card-title').textContent, 'A Quiet Place');
    input(watch.w, watch.d.getElementById('watchlist-search'), '');
  });
  await test('Hồ sơ có tìm/lọc/sort/phân trang; tên và avatar review cập nhật từ tài khoản', async () => {
    detail = await page('movie.html?id=interstellar');
    fillReview('Một góc nhìn hồ sơ', 4); await submitReview();
    detail.d.querySelector('.account-trigger').click();
    [...detail.d.querySelectorAll('.account-menu-item')].find(item => item.textContent === 'Hồ sơ của tôi').click();
    await until(() => frame.contentDocument.getElementById('profile-name')?.textContent === 'cineUserA');
    detail = { w: frame.contentWindow, d: frame.contentDocument }; detail.d.getElementById('tab-reviews').click();
    equal([...detail.d.getElementById('profile-size').options].map(option => option.value), ['10', '20', '50', 'all']);
    equal(detail.d.querySelectorAll('.profile-review-card').length, 1);
    input(detail.w, detail.d.getElementById('profile-search'), 'MOT GOC');
    input(detail.w, detail.d.getElementById('profile-score'), '8', 'change');
    input(detail.w, detail.d.getElementById('profile-sort'), 'desc', 'change');
    input(detail.w, detail.d.getElementById('profile-size'), 'all', 'change');
    assert(detail.d.querySelector('.profile-review-edit').getAttribute('href').includes('id=interstellar'));
    input(detail.w, detail.d.getElementById('profile-search'), 'not-found');
    equal(detail.d.querySelectorAll('.profile-review-card').length, 0);
    detail = await page('movie.html?id=interstellar');
    await detail.w.KH.auth.updateProfile('NewCineUserA');
    equal(detail.d.querySelector('.review-author').textContent, 'NewCineUserA');
    equal(detail.d.querySelector('.review-avatar').textContent, 'N');
    await detail.w.KH.auth.updateProfile('cineUserA');
  });
  await test('Tài khoản B thật không thể sửa/xóa review A qua UI hoặc hàm dữ liệu', async () => {
    const target = detail.w.KH.storage.get('interstellar')[0];
    await detail.w.KH.auth.login('cineUserB', passwordB, true);
    equal(detail.d.querySelectorAll('[data-action="edit"]').length, 0);
    for (const ownerId of [target.ownerId, detail.w.KH.auth.get().id]) {
      let rejected = false; try { await detail.w.KH.storage.upsert({ ...target, ownerId, body: 'Unauthorized' }); } catch (_) { rejected = true; } assert(rejected);
      assert(!(await detail.w.KH.storage.remove(target.id, target.movieId, ownerId)));
    }
    await detail.w.KH.auth.login('cineUserA', passwordA, true);
    equal(detail.w.KH.storage.get('interstellar')[0].body, target.body);
  });
  await test('Hết phiên ẩn nội dung riêng và từ chối thao tác ngay cả khi giao diện cũ còn hiện', async () => {
    const session = JSON.parse(detail.w.localStorage.getItem('khung-hinh:session:v1'));
    detail.w.localStorage.setItem('khung-hinh:session:v1', JSON.stringify({ ...session, expiresAt: Date.now() - 1 }));
    let rejected = false; try { await detail.w.KH.auth.addToWatchlist('arrival'); } catch (_) { rejected = true; } assert(rejected);
    assert(!detail.w.KH.auth.get()); assert(detail.d.querySelector('.login-button'));
    assert(detail.d.getElementById('review-form').hidden);
    await detail.w.KH.auth.login('cineUserA', passwordA, true);
    const remembered = JSON.parse(detail.w.localStorage.getItem('khung-hinh:session:v1'));
    assert(remembered.expiresAt - remembered.issuedAt === 30 * 24 * 60 * 60 * 1000);
  });
  await test('Tài khoản lưu hỏng và sự kiện xóa storage không gây exception hoặc ghi đè dữ liệu', async () => {
    const raw = detail.w.localStorage.getItem(accountKey);
    detail.w.localStorage.setItem(accountKey, '{broken');
    detail.w.dispatchEvent(new detail.w.StorageEvent('storage', { key: accountKey }));
    assert(detail.d.querySelector('.login-button'));
    equal(detail.w.localStorage.getItem(accountKey), '{broken');
    detail.w.localStorage.setItem(accountKey, raw);
    detail.w.dispatchEvent(new detail.w.StorageEvent('storage', { key: null }));
    assert(detail.d.querySelector('.account-trigger'));
  });
  await test('Quota tài khoản: báo lỗi, không đổi Watchlist và không báo lưu thành công', async () => {
    const before = detail.w.localStorage.getItem(accountKey);
    const originalSet = detail.w.Storage.prototype.setItem;
    detail.w.Storage.prototype.setItem = function(key, value) {
      if (key === accountKey) throw new detail.w.DOMException('Full', 'QuotaExceededError');
      return originalSet.call(this, key, value);
    };
    try {
      let rejected = false; try { await detail.w.KH.auth.addToWatchlist('arrival'); } catch (_) { rejected = true; } assert(rejected);
      equal(detail.w.localStorage.getItem(accountKey), before);
      assert(!detail.w.KH.auth.getWatchlist().some(entry => entry.movieId === 'arrival'));
    } finally { detail.w.Storage.prototype.setItem = originalSet; }
  });
  await test('Storage tài khoản bị chặn: UI về khách, báo lỗi thao tác và phục hồi sau khi truy cập lại', async () => {
    const originalGet = detail.w.Storage.prototype.getItem;
    detail.w.Storage.prototype.getItem = function(key) {
      if (key === accountKey) throw new detail.w.DOMException('Blocked', 'SecurityError');
      return originalGet.call(this, key);
    };
    try {
      detail.w.KH.auth.refresh(); assert(detail.d.querySelector('.login-button'));
      let rejected = false; try { await detail.w.KH.auth.addToWatchlist('arrival'); } catch (_) { rejected = true; } assert(rejected);
    } finally { detail.w.Storage.prototype.getItem = originalGet; detail.w.KH.auth.refresh(); }
    assert(detail.d.querySelector('.account-trigger'));
  });
  await test('Modal có nhãn/lỗi liên kết, toggle mật khẩu và phục hồi focus về nút Watchlist', async () => {
    detail.w.KH.auth.logout();
    const button = detail.d.querySelector('.watchlist-toggle'); button.focus(); button.click();
    equal(detail.d.getElementById('account-dialog').getAttribute('aria-labelledby'), 'account-dialog-title');
    const password = detail.d.querySelector('[name="password"]');
    assert(Number.parseFloat(detail.w.getComputedStyle(password).paddingRight) >= 58);
    assert(detail.d.querySelector('.remember-row input').getBoundingClientRect().width <= 20);
    assert(detail.d.getElementById(password.getAttribute('aria-describedby')));
    detail.d.querySelector('.password-toggle').click(); equal(password.type, 'text');
    detail.d.querySelector('.password-toggle').click(); equal(password.type, 'password');
    detail.d.querySelector('.dialog-close').click();
    await until(() => detail.d.activeElement === button);
    await detail.w.KH.auth.login('cineUserA', passwordA, true);
    assert(!detail.w.KH.auth.getWatchlist().some(entry => entry.movieId === 'arrival'));
  });
  await test('Hai trang đồng thời lưu phim không mất dữ liệu; storage event đồng bộ bộ đếm và đăng xuất', async () => {
    detail = await page('movie.html?id=interstellar');
    const second = document.createElement('iframe'); second.title = 'Trang thứ hai kiểm tra đồng bộ';
    document.getElementById('test-fixture').append(second);
    try {
      await new Promise(resolve => { second.onload = resolve; second.src = '../index.html'; });
      const other = second.contentWindow;
      assert(other.navigator.locks, 'Trình duyệt kiểm thử cần Web Locks cho ca nhiều trang.');
      await Promise.all([detail.w.KH.auth.addToWatchlist('arrival'), other.KH.auth.addToWatchlist('minari')]);
      await until(() => detail.w.KH.auth.getWatchlist().length === 4 && other.KH.auth.getWatchlist().length === 4);
      const duplicates = await Promise.all([detail.w.KH.auth.addToWatchlist('the-farewell'), other.KH.auth.addToWatchlist('the-farewell')]);
      equal(duplicates.filter(result => result.added).length, 1);
      await until(() => detail.d.querySelector('.watchlist-count').textContent === '5' && second.contentDocument.querySelector('.watchlist-count').textContent === '5');
      const now = new Date().toISOString();
      const draft = { movieId: 'interstellar', ownerId: detail.w.KH.auth.get().id, author: 'cineUserA', score: 8,
        title: 'Đánh giá đồng thời', body: 'Dữ liệu kiểm thử nhiều trang', createdAt: now, updatedAt: now };
      await Promise.all([
        detail.w.KH.storage.upsert({ ...draft, id: 'concurrent-review-one' }),
        other.KH.storage.upsert({ ...draft, id: 'concurrent-review-two' })
      ]);
      await until(() => detail.w.KH.storage.get('interstellar').length === 3 && other.KH.storage.get('interstellar').length === 3);
      await detail.w.KH.storage.upsert({ ...draft, id: 'concurrent-review-one', body: 'Đã sửa ở trang khác', updatedAt: '2026-10-23T12:00:00Z' }, now);
      let stale = false;
      try { await other.KH.storage.upsert({ ...draft, id: 'concurrent-review-one' }, now); } catch (_) { stale = true; }
      assert(stale, 'Không được ghi đè bản sửa mới bằng form cũ.');
      await detail.w.KH.storage.remove('concurrent-review-one', 'interstellar', draft.ownerId);
      await other.KH.storage.remove('concurrent-review-two', 'interstellar', draft.ownerId);
      for (const id of ['arrival', 'minari', 'the-farewell']) await other.KH.auth.removeFromWatchlist(id);
      other.KH.auth.logout();
      await until(() => detail.d.querySelector('.login-button'));
      assert(detail.d.getElementById('review-form').hidden);
      await detail.w.KH.auth.login('cineUserA', passwordA, true);
    } finally { second.remove(); }
  });
  for (const width of [360, 1440]) {
    await test(`Modal đăng ký/đổi mật khẩu và dropdown ở ${width}px có focus, không tràn ngang`, async () => {
      const p = await page('index.html', width);
      const trigger = p.d.querySelector('.account-trigger'); trigger.focus();
      trigger.dispatchEvent(new p.w.KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      assert(p.d.activeElement.textContent === 'Hồ sơ của tôi');
      p.d.activeElement.dispatchEvent(new p.w.KeyboardEvent('keydown', { key: 'End', bubbles: true }));
      assert(p.d.activeElement.textContent === 'Đăng xuất');
      p.d.activeElement.dispatchEvent(new p.w.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      assert(p.d.querySelector('.account-menu').hidden); assert(p.d.activeElement === trigger);
      trigger.click(); [...p.d.querySelectorAll('.account-menu-item')].find(item => item.textContent === 'Đổi mật khẩu').click();
      equal(p.d.querySelectorAll('.account-form .password-toggle').length, 3);
      let dialog = p.d.getElementById('account-dialog');
      assert(dialog.scrollWidth <= dialog.clientWidth + 1);
      p.d.querySelector('.dialog-close').click(); await until(() => !dialog.open);
      p.w.KH.auth.logout(); p.d.querySelector('.login-button').click();
      [...p.d.querySelectorAll('.account-links button')].find(item => item.textContent.includes('Đăng ký')).click();
      dialog = p.d.getElementById('account-dialog'); assert(dialog.scrollWidth <= dialog.clientWidth + 1);
      assert(p.d.activeElement.name === 'username');
      const close = p.d.querySelector('.dialog-close'); close.focus();
      close.dispatchEvent(new p.w.KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true }));
      assert(p.d.activeElement.textContent.includes('Đăng nhập'));
      p.d.activeElement.dispatchEvent(new p.w.KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
      assert(p.d.activeElement === close);
      const form = p.d.querySelector('.account-form'); form.dispatchEvent(new p.w.Event('submit', { bubbles: true, cancelable: true }));
      assert(form.elements.username.getAttribute('aria-invalid') === 'true');
      p.d.querySelector('.dialog-close').click();
      await p.w.KH.auth.login('cineUserA', passwordA, true);
    });
  }
  await test('Menu giữ liên kết khi focus chuyển từ nút tài khoản; đóng khi focus ra ngoài', async () => {
    const p = await page('movie.html?id=interstellar');
    await new Promise(resolve => p.w.setTimeout(resolve, 0));
    p.d.querySelector('[data-theme-toggle]').focus(); p.d.activeElement.blur();
    const trigger = p.d.querySelector('.account-trigger');
    const menu = p.d.querySelector('.account-menu');
    const links = [...menu.querySelectorAll('a')];
    equal(links.map(link => link.getAttribute('href')), ['profile.html', 'watchlist.html', 'profile-edit.html']);
    for (const link of links) {
      trigger.click();
      // Model the browser's blur/focusout interval, before the destination link becomes active.
      assert(p.d.activeElement === p.d.body, 'Chưa ở khoảng chuyển focus');
      trigger.dispatchEvent(new p.w.FocusEvent('focusout', { bubbles: true, relatedTarget: link }));
      await Promise.resolve();
      assert(!menu.hidden, 'Menu phải còn mở trước khi liên kết nhận focus');
      link.focus(); await Promise.resolve();
      assert(p.d.activeElement === link && !menu.hidden, 'Liên kết phải nhận focus trong menu đang mở');
      const outside = p.d.querySelector('[data-theme-toggle]');
      outside.focus();
      link.dispatchEvent(new p.w.FocusEvent('focusout', { bubbles: true, relatedTarget: outside }));
      await Promise.resolve();
      assert(menu.hidden && trigger.getAttribute('aria-expanded') === 'false', 'Menu phải đóng khi focus ra ngoài');
      p.d.activeElement.blur();
    }
  });
  let profilePage;
  let editPage;
  let avatarData;
  const submitEdit = async p => {
    p.d.getElementById('profile-edit-form').dispatchEvent(new p.w.Event('submit', { bubbles: true, cancelable: true }));
    await until(() => !p.d.getElementById('edit-save').disabled);
  };
  const upload = async (p, file) => {
    const transfer = new p.w.DataTransfer(); transfer.items.add(file);
    const input = p.d.getElementById('edit-avatar'); input.files = transfer.files;
    input.dispatchEvent(new p.w.Event('change', { bubbles: true }));
    await until(() => !p.d.getElementById('edit-save').disabled);
  };
  await test('Menu Hồ sơ của tôi điều hướng trang riêng với đúng tài khoản, avatar và thống kê', async () => {
    await auth.login('cineUserA', passwordA, true);
    const home = await page('index.html'); home.d.querySelector('.account-trigger').click();
    home.d.querySelector('a[href="profile.html"].account-menu-item').click();
    await until(() => frame.contentDocument.getElementById('profile-name')?.textContent === 'cineUserA');
    profilePage = { w: frame.contentWindow, d: frame.contentDocument };
    assert(profilePage.w.location.pathname.endsWith('/profile.html'));
    equal(profilePage.d.getElementById('profile-email').textContent, auth.get().email);
    equal(profilePage.d.getElementById('profile-avatar').textContent, 'C');
    equal(profilePage.d.getElementById('stat-watchlist').textContent, '2');
    equal(profilePage.d.getElementById('stat-reviews').textContent, '1');
    equal(profilePage.d.getElementById('stat-average').textContent, '4.0');
    equal(profilePage.d.getElementById('stat-movies').textContent, '1');
    assert(profilePage.d.getElementById('account-dialog').open === false);
  });
  await test('Tab hồ sơ dùng chung Watchlist: mở đúng phim, xóa và đồng bộ nút chi tiết', async () => {
    profilePage.d.getElementById('tab-watchlist').click();
    equal(profilePage.d.querySelectorAll('.watchlist-card').length, 2);
    equal(profilePage.d.getElementById('profile-view-all').getAttribute('href'), 'watchlist.html');
    const quiet = profilePage.d.querySelector('[data-movie-id="a-quiet-place"]');
    equal(quiet.querySelector('.watchlist-poster-link').getAttribute('href'), 'movie.html?id=a-quiet-place');
    await clickAsync(quiet.querySelector('button'));
    equal(profilePage.d.getElementById('stat-watchlist').textContent, '1');
    detail = await page('movie.html?id=a-quiet-place');
    equal(detail.d.querySelector('.watchlist-toggle').getAttribute('aria-pressed'), 'false');
    await clickAsync(detail.d.querySelector('.watchlist-toggle'));
    profilePage = await page('profile.html#watchlist'); equal(profilePage.d.querySelectorAll('.watchlist-card').length, 2);
  });
  await test('Thống kê đếm review, phim duy nhất và trung bình thực; xóa review từ hồ sơ tính lại điểm', async () => {
    const account = profilePage.w.KH.auth.get(); const now = new Date().toISOString();
    const draft = { ownerId: account.id, author: account.displayName, title: 'Đánh giá bổ sung', body: 'Dữ liệu kiểm thử thống kê', createdAt: now, updatedAt: now };
    await profilePage.w.KH.storage.upsert({ ...draft, id: 'profile-stats-one', movieId: 'interstellar', score: 10 });
    await profilePage.w.KH.storage.upsert({ ...draft, id: 'profile-stats-two', movieId: 'arrival', score: 4 });
    equal(profilePage.d.getElementById('stat-reviews').textContent, '3');
    equal(profilePage.d.getElementById('stat-movies').textContent, '2');
    equal(profilePage.d.getElementById('stat-average').textContent, '3.7');
    profilePage.d.getElementById('tab-reviews').click();
    profilePage.d.querySelector('[data-review-id="profile-stats-one"] [data-action="delete"]').click();
    await clickAsync(profilePage.d.querySelector('[data-action="confirm-delete"]'));
    equal(profilePage.d.getElementById('stat-reviews').textContent, '2');
    equal(profilePage.w.KH.storage.get('interstellar').length, 1);
    equal(profilePage.w.KH.scores.calculate(movies[0], profilePage.w.KH.storage.get('interstellar')).internal, 8);
    await profilePage.w.KH.storage.remove('profile-stats-two', 'arrival', account.id);
  });
  await test('Nút chỉnh sửa trong hồ sơ mở đúng review ở form trang phim hiện có', async () => {
    const review = profilePage.w.KH.storage.get('interstellar')[0];
    profilePage.d.querySelector('.profile-review-edit').click();
    await until(() => frame.contentDocument.getElementById('cancel-edit')?.hidden === false);
    detail = { w: frame.contentWindow, d: frame.contentDocument };
    equal(new URLSearchParams(detail.w.location.search).get('review'), review.id);
    equal(detail.d.getElementById('review-title').value, review.title);
    fillReview('Đánh giá sửa từ hồ sơ', 4.5); await submitReview();
    equal(detail.w.KH.storage.get('interstellar')[0].id, review.id);
    equal(detail.w.KH.storage.get('interstellar')[0].score, 9);
    profilePage = await page('profile.html#reviews'); equal(profilePage.d.getElementById('stat-average').textContent, '4.5');
  });
  await test('Danh sách review hồ sơ kết hợp tìm/lọc/sort và phân trang 10/20/50/all với 24 bài', async () => {
    const account = profilePage.w.KH.auth.get(); const now = new Date().toISOString(); const ids = [];
    try {
      for (let index = 0; index < 23; index++) {
        const id = `profile-pagination-${index}`; ids.push(id);
        await profilePage.w.KH.storage.upsert({ id, movieId: movies[index % movies.length].id, ownerId: account.id,
          author: account.displayName, title: `Nhìn phim ${index + 1}`, body: 'Dữ liệu kiểm thử phân trang hồ sơ', score: index % 10 + 1, createdAt: now, updatedAt: now });
      }
      for (const [size, count] of [['10', 10], ['20', 20], ['50', 24], ['all', 24]]) {
        input(profilePage.w, profilePage.d.getElementById('profile-size'), size, 'change'); equal(profilePage.d.querySelectorAll('.profile-review-card').length, count);
      }
      input(profilePage.w, profilePage.d.getElementById('profile-size'), '10', 'change');
      profilePage.d.querySelector('#profile-pagination .page-controls button:last-child').click();
      assert(profilePage.d.getElementById('profile-pagination').textContent.includes('2 / 3'));
      input(profilePage.w, profilePage.d.getElementById('profile-search'), 'NHIN PHIM');
      input(profilePage.w, profilePage.d.getElementById('profile-score'), '9', 'change');
      input(profilePage.w, profilePage.d.getElementById('profile-sort'), 'desc', 'change');
      input(profilePage.w, profilePage.d.getElementById('profile-size'), 'all', 'change');
      equal(profilePage.d.querySelectorAll('.profile-review-card').length, 2);
      profilePage.d.getElementById('profile-clear').click();
      equal(profilePage.d.getElementById('profile-search').value, 'NHIN PHIM'); equal(profilePage.d.getElementById('profile-sort').value, 'desc');
      equal(profilePage.d.getElementById('profile-size').value, 'all'); equal(profilePage.d.querySelectorAll('.profile-review-card').length, 23);
    } finally {
      for (const id of ids) {
        const record = profilePage.w.KH.storage.all().find(item => item.id === id);
        if (record) await profilePage.w.KH.storage.remove(record.id, record.movieId, account.id);
      }
      profilePage = await page('profile.html#reviews');
    }
  });
  await test('Đọc tài khoản cũ thiếu các trường hồ sơ vẫn giữ nguyên dữ liệu, phiên và ID', async () => {
    const raw = localStorage.getItem(accountKey); const parsed = JSON.parse(raw);
    const account = parsed.accounts.find(item => item.username === 'cineUserA');
    for (const key of ['displayName', 'bio', 'avatarImage', 'profileVersion']) delete account[key];
    const legacyRaw = JSON.stringify(parsed); localStorage.setItem(accountKey, legacyRaw); auth.refresh();
    equal(auth.get().displayName, 'cineUserA'); equal(auth.get().bio, ''); equal(auth.get().avatarImage, '');
    equal(auth.get().id, account.id); equal(auth.getWatchlist().length, 2);
    equal(localStorage.getItem(accountKey), legacyRaw);
    localStorage.setItem(accountKey, raw); auth.refresh();
  });
  await test('Form chỉnh sửa từ chối tên/email trùng và dữ liệu sai, báo lỗi tại trường', async () => {
    editPage = await page('profile-edit.html');
    const before = editPage.w.localStorage.getItem(accountKey);
    input(editPage.w, editPage.d.getElementById('edit-username'), 'cineUserB'); await submitEdit(editPage);
    assert(editPage.d.getElementById('edit-username-error').textContent.includes('sử dụng'));
    input(editPage.w, editPage.d.getElementById('edit-username'), 'cineUserA');
    input(editPage.w, editPage.d.getElementById('edit-email'), 'CINE-B@EXAMPLE.TEST'); await submitEdit(editPage);
    assert(editPage.d.getElementById('edit-email-error').textContent.includes('sử dụng'));
    input(editPage.w, editPage.d.getElementById('edit-email'), 'bad-email'); await submitEdit(editPage);
    assert(editPage.d.getElementById('edit-email-error').textContent);
    input(editPage.w, editPage.d.getElementById('edit-displayName'), '   '); await submitEdit(editPage);
    assert(editPage.d.getElementById('edit-displayName-error').textContent);
    equal(editPage.w.localStorage.getItem(accountKey), before);
  });
  await test('Ảnh avatar: chuẩn bị ảnh thật thu nhỏ; từ chối MIME, dữ liệu lỗi, quá dung lượng và kích thước', async () => {
    const canvas = document.createElement('canvas'); canvas.width = 480; canvas.height = 320;
    const context = canvas.getContext('2d'); context.fillStyle = '#147461'; context.fillRect(0, 0, 480, 320);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    const file = new editPage.w.File([blob], 'avatar.png', { type: 'image/png' });
    avatarData = await editPage.w.KH.avatar.prepare(file); assert(editPage.w.KH.avatar.valid(avatarData));
    const image = new editPage.w.Image(); image.src = avatarData; await image.decode();
    assert(image.naturalWidth <= 256 && image.naturalHeight <= 256); assert(avatarData.length <= 100000);
    const invalid = [new editPage.w.File(['<svg></svg>'], 'avatar.svg', { type: 'image/svg+xml' }),
      new editPage.w.File(['not-an-image'], 'broken.jpg', { type: 'image/jpeg' }),
      new editPage.w.File([new Uint8Array(2 * 1024 * 1024 + 1)], 'large.png', { type: 'image/png' })];
    canvas.width = 4097; canvas.height = 1;
    const wide = await new Promise(resolve => canvas.toBlob(resolve, 'image/png')); invalid.push(new editPage.w.File([wide], 'wide.png', { type: 'image/png' }));
    for (const item of invalid) { let rejected = false; try { await editPage.w.KH.avatar.prepare(item); } catch (_) { rejected = true; } assert(rejected); }
    await upload(editPage, invalid[0]); assert(editPage.d.getElementById('edit-avatarImage-error').textContent.includes('PNG'));
    await upload(editPage, file); assert(editPage.d.getElementById('edit-avatar-preview').querySelector('img'));
  });
  await test('Hủy chỉnh sửa tên và ảnh không lưu dữ liệu, quay lại đúng trang hồ sơ', async () => {
    const before = editPage.w.localStorage.getItem(accountKey);
    input(editPage.w, editPage.d.getElementById('edit-displayName'), 'Tên chưa lưu');
    editPage.d.getElementById('edit-cancel').click();
    await until(() => frame.contentDocument.getElementById('profile-name')?.textContent === 'cineUserA');
    equal(localStorage.getItem(accountKey), before);
  });
  await test('Lưu tên hiển thị, username, email, bio và avatar: giữ ID/Watchlist/review; không chèn mã vào DOM', async () => {
    editPage = await page('profile-edit.html');
    const account = editPage.w.KH.auth.get(); const saved = editPage.w.KH.auth.getWatchlist();
    const response = await fetch(avatarData); const blob = await response.blob();
    await upload(editPage, new editPage.w.File([blob], 'avatar.webp', { type: 'image/webp' }));
    for (const [name, value] of Object.entries({ displayName: 'Lan Điện Ảnh', username: 'cineRenamedA', email: ' RENAMED-A@EXAMPLE.TEST ', bio: '<script>window.profileInjected=true</script>' })) input(editPage.w, editPage.d.getElementById(`edit-${name}`), value);
    const version = account.profileVersion;
    const form = editPage.d.getElementById('profile-edit-form');
    form.dispatchEvent(new editPage.w.Event('submit', { bubbles: true, cancelable: true }));
    form.dispatchEvent(new editPage.w.Event('submit', { bubbles: true, cancelable: true }));
    await until(() => !editPage.d.getElementById('edit-save').disabled);
    assert(editPage.d.getElementById('edit-status').textContent.includes('Đã lưu'));
    equal(editPage.w.KH.auth.get().profileVersion, version + 1);
    equal(editPage.w.KH.auth.get().id, account.id); equal(editPage.w.KH.auth.get().email, 'renamed-a@example.test');
    equal(editPage.w.KH.auth.getWatchlist(), saved);
    equal(editPage.d.querySelector('.account-trigger-name').textContent, 'Lan Điện Ảnh');
    assert(editPage.d.querySelector('.account-trigger img'));
    profilePage = await page('profile.html');
    equal(profilePage.d.getElementById('profile-name').textContent, 'Lan Điện Ảnh');
    assert(profilePage.d.getElementById('profile-avatar').querySelector('img'));
    assert(profilePage.d.getElementById('profile-bio').textContent.includes('<script>')); assert(!profilePage.w.profileInjected);
    detail = await page('movie.html?id=interstellar');
    equal(detail.d.querySelector('.review-author').textContent, 'Lan Điện Ảnh'); assert(detail.d.querySelector('.review-avatar img'));
    equal(detail.w.KH.storage.get('interstellar')[0].ownerId, account.id);
    const watch = await page('watchlist.html'); assert(watch.d.getElementById('watchlist-owner').textContent.includes('Lan Điện Ảnh'));
    equal(watch.d.querySelectorAll('.watchlist-card').length, 2);
  });
  await test('Quota khi lưu hồ sơ/ảnh giữ nguyên toàn bộ bản lưu và hiện thông báo thất bại', async () => {
    editPage = await page('profile-edit.html'); const before = localStorage.getItem(accountKey);
    input(editPage.w, editPage.d.getElementById('edit-displayName'), 'Không thể lưu');
    const originalSet = editPage.w.Storage.prototype.setItem;
    editPage.w.Storage.prototype.setItem = function(key, value) { if (key === accountKey) throw new editPage.w.DOMException('Full', 'QuotaExceededError'); return originalSet.call(this, key, value); };
    try { await submitEdit(editPage); assert(editPage.d.getElementById('edit-status').textContent.includes('chưa được lưu')); equal(localStorage.getItem(accountKey), before); }
    finally { editPage.w.Storage.prototype.setItem = originalSet; }
  });
  await test('Hai trang cập nhật hồ sơ đồng bộ; form cũ không ghi đè thay đổi mới', async () => {
    editPage = await page('profile-edit.html'); input(editPage.w, editPage.d.getElementById('edit-displayName'), 'Bản nháp cũ');
    const second = document.createElement('iframe'); document.getElementById('test-fixture').append(second);
    try {
      await new Promise(resolve => { second.onload = resolve; second.src = '../profile.html'; });
      const other = second.contentWindow;
      await other.KH.auth.updateProfile({ ...other.KH.auth.get(), bio: 'Bản cập nhật ở trang khác', expectedVersion: other.KH.auth.get().profileVersion });
      await until(() => editPage.d.getElementById('edit-status').textContent.includes('trang khác'));
      await submitEdit(editPage);
      assert(editPage.d.getElementById('edit-status').textContent.includes('trang khác'));
      equal(other.KH.auth.get().displayName, 'Lan Điện Ảnh'); equal(other.KH.auth.get().bio, 'Bản cập nhật ở trang khác');
    } finally { second.remove(); }
  });
  await test('Hồ sơ B không lẫn tên/ảnh/review của A; thống kê rỗng chính xác', async () => {
    await auth.login('cineUserB', passwordB, true); profilePage = await page('profile.html#reviews');
    equal(profilePage.d.getElementById('profile-name').textContent, 'cineUserB');
    equal(profilePage.d.getElementById('stat-watchlist').textContent, '1'); equal(profilePage.d.getElementById('stat-reviews').textContent, '0');
    equal(profilePage.d.getElementById('stat-average').textContent, '—'); equal(profilePage.d.getElementById('stat-movies').textContent, '0');
    assert(!profilePage.d.getElementById('profile-avatar').querySelector('img')); equal(profilePage.d.querySelectorAll('.profile-review-card').length, 0);
    await auth.login('renamed-a@example.test', passwordA, true); profilePage = await page('profile.html');
    equal(profilePage.d.getElementById('profile-name').textContent, 'Lan Điện Ảnh'); equal(profilePage.d.getElementById('stat-watchlist').textContent, '2');
  });
  await test('Hủy đổi mật khẩu giữ dữ liệu; sai mật khẩu, mật khẩu yếu và dùng lại mật khẩu cũ bị từ chối', async () => {
    profilePage.d.querySelector('.account-trigger').click(); [...profilePage.d.querySelectorAll('.account-menu-item')].find(item => item.textContent === 'Đổi mật khẩu').click();
    const before = localStorage.getItem(accountKey); let form = profilePage.d.querySelector('.account-form');
    form.elements['old-password'].value = passwordA; form.elements['new-password'].value = 'NotSavedMovie9!'; form.elements['confirm-password'].value = 'MismatchMovie9!';
    form.dispatchEvent(new profilePage.w.Event('submit', { bubbles: true, cancelable: true }));
    assert(profilePage.d.getElementById('account-error-confirm-password').textContent.includes('khớp'));
    equal(localStorage.getItem(accountKey), before);
    form.elements['old-password'].value = passwordA; form.elements['new-password'].value = 'NotSavedMovie9!'; form.elements['confirm-password'].value = 'NotSavedMovie9!';
    [...form.querySelectorAll('button')].find(button => button.textContent === 'Hủy').click(); equal(localStorage.getItem(accountKey), before);
    for (const [old, next] of [['wrong-password', 'ValidNextMovie9!'], [passwordA, 'weak'], [passwordA, passwordA]]) {
      let rejected = false; try { await profilePage.w.KH.auth.changePassword(old, next); } catch (_) { rejected = true; } assert(rejected);
    }
    equal(localStorage.getItem(accountKey), before);
  });
  await test('Đổi mật khẩu vô hiệu hóa phiên cũ của tài khoản, đăng nhập lại bằng mật khẩu mới giữ hồ sơ', async () => {
    const oldSession = localStorage.getItem('khung-hinh:session:v1');
    await profilePage.w.KH.auth.changePassword(passwordA, 'ProfileNewMovie9!');
    assert(!profilePage.w.KH.auth.get()); assert(profilePage.d.getElementById('profile-private').hidden);
    localStorage.setItem('khung-hinh:session:v1', oldSession); auth.refresh(); assert(!auth.get());
    let rejected = false; try { await auth.login('cineRenamedA', passwordA, true); } catch (_) { rejected = true; } assert(rejected);
    passwordA = 'ProfileNewMovie9!'; await auth.login('cineRenamedA', passwordA, true);
    equal(auth.get().displayName, 'Lan Điện Ảnh'); equal(auth.getWatchlist().length, 2);
  });
  for (const width of [360, 768, 1024, 1440]) for (const path of ['profile.html', 'profile-edit.html']) {
    await test(`Trang cá nhân đã đăng nhập ${width}px, ${path}: không tràn ngang, tab/form thao tác được`, async () => {
      const p = await page(path, width); assert(p.d.documentElement.scrollWidth <= p.d.documentElement.clientWidth);
      if (path === 'profile.html') {
        assert(p.d.getElementById('profile-name').getBoundingClientRect().width >= 140, 'Nút chỉnh sửa không được ép hẹp tên hồ sơ.');
        p.d.getElementById('tab-overview').dispatchEvent(new p.w.KeyboardEvent('keydown', { key: 'End', bubbles: true, cancelable: true }));
        equal(p.d.getElementById('tab-reviews').getAttribute('aria-selected'), 'true'); assert(p.d.activeElement === p.d.getElementById('tab-reviews'));
      } else assert(!p.d.getElementById('profile-edit-form').hidden && p.d.getElementById('edit-save').getBoundingClientRect().width > 0);
    });
  }
  await test('Đăng xuất xóa nội dung riêng khỏi DOM; URL trực tiếp yêu cầu đăng nhập; dữ liệu vẫn còn', async () => {
    profilePage = await page('profile.html'); const before = localStorage.getItem(accountKey);
    profilePage.w.KH.auth.logout(); assert(profilePage.d.getElementById('profile-private').hidden);
    equal(profilePage.d.getElementById('profile-name').textContent, ''); equal(profilePage.d.querySelectorAll('.profile-review-card').length, 0);
    equal(profilePage.d.getElementById('profile-email').textContent, '');
    const guestEdit = await page('profile-edit.html'); assert(!guestEdit.d.getElementById('edit-signin').hidden);
    equal(guestEdit.d.getElementById('edit-email').value, ''); equal(guestEdit.d.getElementById('edit-displayName').value, '');
    const guestProfile = await page('profile.html#reviews'); assert(!guestProfile.d.getElementById('profile-signin').hidden);
    const guestWatch = await page('watchlist.html'); equal(guestWatch.d.querySelectorAll('.watchlist-card').length, 0);
    equal(localStorage.getItem(accountKey), before);
    await auth.login('cineRenamedA', passwordA, true);
    equal(auth.getWatchlist().length, 2); assert(auth.get().avatarImage); equal(auth.get().displayName, 'Lan Điện Ảnh');
  });
  try {
    if(detail){if(originalReviewRaw==null)localStorage.removeItem(storage.key);else localStorage.setItem(storage.key,originalReviewRaw);}
    if(originalAccounts==null)localStorage.removeItem(accountKey);else localStorage.setItem(accountKey,originalAccounts);
    if(originalLocalSession==null)localStorage.removeItem('khung-hinh:session:v1');else localStorage.setItem('khung-hinh:session:v1',originalLocalSession);
    if(originalTabSession==null)sessionStorage.removeItem('khung-hinh:session:v1');else sessionStorage.setItem('khung-hinh:session:v1',originalTabSession);
  }catch(_){}
  for(const width of [360,768,1024,1440])for(const path of ['index.html','movie.html?id=everything-everywhere-all-at-once','watchlist.html']) {
    await test(`Bố cục ${width}px, ${path}: không cuộn ngang toàn trang`,async()=>{
      const p=await page(path,width);assert(p.d.documentElement.scrollWidth<=p.d.documentElement.clientWidth,`${p.d.documentElement.scrollWidth} > ${p.d.documentElement.clientWidth}`);
      const account=p.d.querySelector('.login-button, .account-trigger').getBoundingClientRect();const theme=p.d.querySelector('[data-theme-toggle]').getBoundingClientRect();assert(account.right<=theme.left+1,'Tài khoản và theme chồng lấn');
    });
  }
  if(frame)frame.remove();
  document.getElementById('test-status').textContent=`Hoàn tất: ${passed} đạt, ${failed} lỗi.`;
  document.body.dataset.testResult=failed?'failed':'passed';
  document.body.dataset.passed=String(passed);document.body.dataset.failed=String(failed);
  } finally {
    for (const [key, value] of [[accountKey, originalAccounts], ['khung-hinh:session:v1', originalLocalSession], ['khung-hinh:logout:v1', originalLogout], ['theme', originalTheme], [storage.key, originalReviews]]) {
      if (value == null) localStorage.removeItem(key); else localStorage.setItem(key, value);
    }
    if (originalTabSession == null) sessionStorage.removeItem('khung-hinh:session:v1'); else sessionStorage.setItem('khung-hinh:session:v1', originalTabSession);
    Object.keys(sessionStorage).filter(key => key.startsWith('khung-hinh:watchlist-view:')).forEach(key => sessionStorage.removeItem(key));
    Object.entries(originalViews).forEach(([key, value]) => sessionStorage.setItem(key, value));
    document.querySelectorAll('#test-fixture iframe').forEach(node => node.remove());
  }
})().catch(error=>{document.getElementById('test-status').textContent='Lỗi bộ kiểm thử: '+error.message;document.body.dataset.testResult='failed';});
