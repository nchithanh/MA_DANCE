/** Port of ma-dance/script.js — call after homepage markup is in the DOM. */
export function initMaDance() {
const LOADER_MS = 3000;

// Page loader (3s) — lock scroll until dismissed
const pageLoader = document.getElementById("pageLoader");
const heroVideo = document.getElementById("heroVideo");

function restartHeroVideo() {
  if (!heroVideo) return;
  const src = heroVideo.getAttribute("src") || "";
  if (!src) return;
  heroVideo.src = "";
  heroVideo.src = src.includes("autoplay=1") ? src : `${src}${src.includes("?") ? "&" : "?"}autoplay=1&mute=1&playsinline=1`;
}

function dismissLoader() {
  if (!pageLoader || pageLoader.classList.contains("is-done")) return;
  pageLoader.classList.add("is-done");
  pageLoader.setAttribute("aria-busy", "false");
  document.body.classList.remove("is-loading");
  restartHeroVideo();
  window.setTimeout(() => pageLoader.remove(), 600);
}

if (pageLoader) {
  document.body.classList.add("is-loading");
  window.setTimeout(dismissLoader, LOADER_MS);
} else {
  document.body.classList.remove("is-loading");
  document.getElementById("header")?.classList.add("scrolled");
}

const translations = {
  vi: {
    "nav.about":"Giới thiệu","nav.styles":"Styles","nav.classes":"Khóa học","nav.schedule":"Lịch","nav.services":"Dịch vụ","nav.instructors":"Giảng viên","nav.pricing":"Gói học","nav.rooms":"Thuê phòng","nav.events":"Biên đạo","nav.bookShort":"ĐĂNG KÝ","nav.branches":"Chi nhánh","nav.partner":"Đối tác","nav.milestones":"Dấu ấn","nav.clients":"Thương hiệu","nav.social":"Social","nav.live":"Live","nav.contact":"Liên hệ","nav.book":"ĐĂNG KÝ HỌC",
    "menu.eyebrow":"Menu",
    "hero.badge":"DANCE STUDIO","hero.line1":"Không cần sân khấu","hero.line2":"để bắt đầu nhảy",
    "hero.sub1":"Studio nhảy đa chi nhánh · gói buổi · khóa 8 buổi/tháng",
    "hero.sub2":"Đăng ký học · thuê phòng · biên đạo sự kiện",
    "loader.l1":"Studio nhảy đa chi nhánh · gói buổi · khóa 8 buổi/tháng",
    "loader.l2":"Đăng ký học · thuê phòng · biên đạo sự kiện",
    "hero.cta1":"Đăng ký học","hero.cta2":"Xem khóa","hero.ctaRoom":"Đặt phòng","hero.scroll":"SCROLL",
    "imp.label":"Số liệu","imp.title":"MA qua con số",
    "imp.1.n":"3","imp.1.l":"chi nhánh","imp.2.n":"14+","imp.2.l":"phòng tập",
    "imp.3.n":"12+","imp.3.l":"styles","imp.4.n":"8","imp.4.l":"buổi / khóa",
    "imp.5.n":"50+","imp.5.l":"lớp / tháng","imp.6.n":"1K+","imp.6.l":"học viên",
    "imp.7.n":"4+","imp.7.l":"cộng tác","imp.8.n":"1","imp.8.l":"đã tài trợ",
    "about.label":"Về MA Dance","about.est":"EST. · TP.HCM, VIỆT NAM","about.title":"Studio nhảy · 3 chi nhánh · khóa tháng cố định",
    "about.sub":"Đăng ký học · thuê phòng · biên đạo sự kiện",
    "about.p1":"MA Dance vận hành theo gói học phí → ghi danh khóa (level / khung giờ) → 8 buổi cố định / tháng → điểm danh trừ buổi. Không học bù.",
    "about.p2":"Level Begin · Inter · Advance. Nhận giữa khóa theo rule. Bảo lưu gói ≥ 3 tháng — studio duyệt qua Zalo.",
    "about.s1":"chi nhánh","about.s2":"phòng tập","about.s3":"sĩ số / lớp","about.s4":"buổi / khóa tháng",
    "partner.badge":"Đối tác chính thức","partner.label":"Đối tác",
    "partner.title":"MA Dance × The New Gene 2026",
    "partner.bar":"MA DANCE STUDIO – ĐỐI TÁC VŨ ĐẠO & LUYỆN TẬP CHÍNH THỨC CỦA THE NEW GENE 2026",
    "partner.p1":"Một màn trình diễn ấn tượng không chỉ được tạo nên từ âm nhạc, mà còn từ từng chuyển động, đội hình và cách nghệ sĩ làm chủ sân khấu.",
    "partner.p2":"Đồng hành cùng The New Gene 2026, MA Dance Studio sẽ góp phần hỗ trợ các thí sinh trong hành trình luyện tập và hoàn thiện phần trình diễn, để mỗi tiết mục không chỉ được nghe, mà còn được nhìn thấy và cảm nhận trọn vẹn trên sân khấu.",
    "partner.p3":"Từ phòng tập đến ánh đèn sân khấu, cùng chờ đón những màn trình diễn bứt phá tại The New Gene 2026!",
    "partner.cta":"Xem The New Gene","partner.cta2":"Collab với MA",
    "cli.label":"Đối tác","cli.title":"Tin tưởng đồng hành cùng MA","cli.sub":"Thương hiệu & tổ chức đã làm việc với studio.",
    "ms.label":"Dấu ấn","ms.title":"Dấu ấn MA","ms.sub":"Cột mốc và cộng đồng làm nên uy tín studio.",
    "ms.1.t":"Cuộc thi Be Yourself","ms.1.d":"MA tổ chức / đồng hành Be Yourself — sân chơi để dancer thể hiện bản thân trên sàn.",
    "ms.2.t":"Đối tác & truyền thông","ms.2.d":"Collab The New Gene Show · hỗ trợ truyền thông ASEAN Culture Ambassador.",
    "ms.3.t":"Cộng đồng dancer","ms.3.d":"Kết nối Cộng đồng Dancer Sài Gòn — học, luyện và cháy cùng nhau.",
    "ms.4.t":"Casting & studio","ms.4.d":"Tuyển giảng viên / dancer tại studio — 436A/101 Đường 3/2 (Q10), 522/1 Phan Xích Long (PN), 02 Hồ Xuân Hương (Q3).",
    "svc.label":"Dịch vụ","svc.title":"Ba trụ cột của MA",
    "svc.1.t":"Học nhảy theo khóa tháng","svc.1.d":"Chọn chi nhánh, style và level Begin / Inter / Advance. Mỗi khóa 8 buổi cố định trong tháng — giữ chỗ online, studio xác nhận qua Zalo.",
    "svc.2.t":"Thuê phòng studio","svc.2.d":"Nhiều phòng tại Quận 10, Quận 3 và Phú Nhuận. Thuê theo giờ cho team cover, luyện tập hoặc quay video.",
    "svc.3.t":"Biên đạo & sự kiện","svc.3.d":"Choreography cho cá nhân, team, brand event và MV cover — gửi brief, team MA tư vấn.",
    "svc.link":"Xem khóa →","svc.link2":"Xem phòng →","svc.link3":"Gửi brief →","roomsTeaser.label":"Studio","roomsTeaser.title":"Thuê phòng tại 3 chi nhánh","roomsTeaser.sub":"Q10 · Q3 · Phú Nhuận — nhiều phòng demo. Slot trống ngoài lịch khóa có thể book theo giờ.","roomsTeaser.q10":"Quận 10","roomsTeaser.q3":"Quận 3","roomsTeaser.pn":"Phú Nhuận","roomsTeaser.link":"Xem phòng →","roomsTeaser.book":"Đặt phòng →","price.more":"Xem đủ gói 1 · 3 · 6 · 12 tháng →",
    "sty.label":"Catalog","sty.title":"Khám phá đam mê theo style","sty.sub":"Từ K-Pop đến street — chọn vibe của bạn.",
    "sch.label":"Lịch học","sch.title":"Lịch học hôm nay — LIVE","sch.live":"LIVE NOW","sch.book":"Đăng ký",
    "sch.r1":"HYE · Q10 · MI lớn","sch.r2":"JIN · Q3 · Room A","sch.r3":"MIN · PN · MI3","sch.r4":"SOO · Q10 · MON",
    "sch.note":"Demo lịch khóa tháng — form / Zalo để xác nhận sĩ số thật.","sch.title":"Lịch khóa tháng — demo",
    "reel.label":"Viral","reel.title":"Chuyển động đang cháy",
    "reel.1":"Jump energy","reel.2":"Studio crew","reel.3":"Challenge","reel.4":"Air time","reel.5":"Stage ready",
    "fac.label":"Trải nghiệm","fac.title":"Không gian đẳng cấp","fac.sub":"Ánh sáng · âm thanh · sàn — đủ để bạn cháy hết mình.",
    "fac.1.t":"Hệ thống ánh sáng","fac.1.d":"Đèn đa sắc, vibe sân khấu — tập như đang lên show.",
    "fac.2.t":"Âm thanh chuẩn","fac.2.d":"Bass chắc, phủ đều phòng — nghe rõ từng count.",
    "fac.3.t":"Không gian thoáng","fac.3.d":"Gương full, điều hòa, khu nghỉ — buổi tập mượt hơn.",
    "tes.label":"Học viên","tes.title":"Họ nói gì về MA",
    "tes.1.q":"“Lớp K-Pop quá cháy — instructor breakdown dễ hiểu, vibe cực đã.”",
    "tes.2.q":"“Phòng tập sạch, âm thanh mạnh. MA như nhà thứ hai.”",
    "tes.3.q":"“Choreo update trend liên tục. Mỗi tuần một track mới.”",
    "tes.4.q":"“Từ zero đến full choreo trong vài buổi. Recommend!”",
    "br.label":"Cơ sở","br.title":"Chi nhánh MA",
    "br.1.t":"MA Dance · Quận 10","br.1.a":"436A/101 Đường 3/2, Phường Hoà Hưng (Quận 10), TP.HCM",
    "br.2.t":"MA Dance · Phú Nhuận","br.2.a":"522/1 Phan Xích Long, Phường Đức Nhuận (Phú Nhuận), TP.HCM",
    "br.3.t":"MA Dance · Quận 3","br.3.a":"02 Hồ Xuân Hương, Phường Xuân Hoà (Quận 3), TP.HCM",
    "br.map":"Mở Maps →",
    "soc.label":"Social","soc.title":"Theo dõi MA","soc.sub":"Choreo mới · class vibe · behind the scenes.",
    "live.label":"TikTok","live.title":"Livestream MA","live.sub":"Xem live trên TikTok — web hoặc app.",
    "live.now.badge":"TikTok Live","live.now.t":"Mở livestream","live.now.d":"Chạm để xem trên TikTok @madancestudio.",
    "live.sched":"Lịch live",
    "live.1.when":"T3 · 20:00","live.1.t":"Cover night","live.1.d":"Choreo cover · vibe studio",
    "live.2.when":"T6 · 20:00","live.2.t":"Class recap","live.2.d":"Highlight buổi học trong tuần",
    "live.3.when":"CN · 16:00","live.3.t":"Collab / Q&A","live.3.d":"Guest · hỏi đáp",
    "cls.label":"Level","cls.title":"Begin · Inter · Advance","cls.hint":"← Kéo ngang xem level →",
    "cls.b.t":"Begin","cls.b.d":"Dành cho người mới — nhịp rõ, vào lớp đúng level Begin.","cls.b.l":"Cơ bản",
    "cls.s.t":"Inter","cls.s.d":"Đã có nền — kỹ thuật chắc hơn, bắt nhịp nhanh.","cls.s.l":"Trung cấp",
    "cls.l.t":"Advance","cls.l.d":"Intensity cao — choreo khó, performance quality.","cls.l.l":"Nâng cao",
    "cls.m.t":"Khóa tháng","cls.m.d":"8 buổi cố định / tháng · cố định chi nhánh · phòng linh hoạt.","cls.m.l":"Gói học phí",
    "cls.p.t":"Xem catalog","cls.p.d":"Lọc theo CN · style · level · sĩ số demo.","cls.p.l":"classes",
    "cls.dur":"8 buổi / tháng","cls.dur2":"Cố định khung giờ","cls.book":"Đăng ký",
    "cls.cta.t":"Chưa biết chọn khóa?","cls.cta.d":"Xem catalog hoặc form đăng ký — team xác nhận Zalo.","cls.cta.b":"Mở catalog",
    "how.label":"Cách tham gia","how.title":"4 bước ghi danh",
    "how.1.t":"Chọn khóa","how.1.d":"CN · style · level · khung giờ trên catalog.",
    "how.2.t":"Chọn gói","how.2.d":"1 / 3 / 6 / 12 tháng. ≥3th tặng BL · 6–12th có cọc.",
    "how.3.t":"Gửi form","how.3.d":"Giữ chỗ tạm. Studio xác nhận sĩ số qua Zalo.",
    "how.4.t":"Vào lớp","how.4.d":"Điểm danh trừ buổi. Không học bù.",
    "inst.label":"Giảng viên","inst.title":"Người đứng lớp cùng bạn","inst.choreo":"Choreographer","inst.inst":"Instructor",
    "price.label":"Gói học phí","price.title":"Thu theo gói · 8 buổi/tháng","price.unit":"",
    "price.1.tag":"1 tháng","price.1.t":"Gói 1 tháng","price.1.d":"8 buổi · không tặng BL","price.1.f1":"Mua BL lẻ nếu cần","price.1.f2":"Không cọc","price.1.f3":"Giá: Liên hệ",
    "price.2.tag":"Phổ biến","price.2.t":"Gói 3 tháng","price.2.d":"Tặng bảo lưu","price.2.f1":"8 buổi / tháng × 3","price.2.f2":"Không cọc","price.2.f3":"Giá: Liên hệ",
    "price.3.tag":"Studio","price.3.t":"Thuê phòng","price.3.d":"Nhiều phòng · theo giờ","price.3.f1":"Không chồng lịch khóa","price.3.f2":"3 chi nhánh","price.3.f3":"Giá: Liên hệ",
    "price.cta":"Đăng ký gói","price.cta2":"Đặt phòng",
    "gal.label":"Studio","gal.title":"Không gian MA","gal.a":"Phòng A — Main studio","gal.b":"Phòng B — Practice","gal.c":"Full mirror wall","gal.d":"Class energy","gal.e":"Evening session",
    "gal.close":"Đóng","gal.prev":"Ảnh trước","gal.next":"Ảnh sau","gal.thumbs":"Ảnh studio",
    "faq.label":"FAQ","faq.title":"Câu hỏi thường gặp",
    "faq.1.q":"Mới bắt đầu học level nào?","faq.1.a":"Begin. Nhận giữa khóa dừng từ buổi 4–5 theo rule MA.",
    "faq.2.q":"Một khóa tháng bao nhiêu buổi?","faq.2.a":"8 buổi cố định trong tháng theo ngày KG–KT. Lịch tuần cố định cả khóa.",
    "faq.3.q":"Đăng ký trên web là vào lớp luôn?","faq.3.a":"Chưa. Form = yêu cầu giữ chỗ. Studio xác nhận sĩ số và gói qua Zalo.",
    "faq.4.q":"Có thuê phòng riêng không?","faq.4.a":"Có. Nhiều phòng / 3 CN. Book khi không chồng lịch khóa. Giá/giờ: Liên hệ.",
    "faq.5.q":"Nghỉ buổi có học bù không?","faq.5.a":"Không học bù. Điểm danh trừ buổi. Nghỉ dài → xin bảo lưu (gói ≥ 3 tháng tặng BL).",
    "banner.title":"Sẵn sàng ghi danh?","banner.sub":"Chọn khóa → chọn gói → form → xác nhận Zalo.","banner.cta":"Đăng ký học",
    "ct.label":"Liên hệ","ct.title":"Nhắn để giữ chỗ","ct.desc":"Gửi form hoặc nhắn Zalo. Team confirm lịch trong 1–2 giờ.",
    "ct.box":"Thông tin liên hệ",
    "ct.address":"Địa chỉ","ct.addressVal":"CN1: 436A/101 Đường 3/2, Q10 · CN2: 522/1 Phan Xích Long, PN · CN3: 02 Hồ Xuân Hương, Q3","ct.social":"Facebook","ct.phone":"Zalo / Phone","ct.email":"Email",
    "ct.hours":"Giờ mở cửa","ct.hoursVal":"T2 – CN: 09:00 – 22:00",
    "ct.name":"Họ tên","ct.phonePh":"Zalo / SĐT","ct.interest":"Bạn quan tâm gì?","ct.message":"Ngày/giờ mong muốn...","ct.ok":"Đã nhận — team sẽ liên hệ sớm.","ct.err":"Vui lòng điền đủ thông tin.",
    "ct.formLead":"Gửi yêu cầu ghi danh trên web — studio xác nhận qua Zalo.",
    "ct.send":"Đăng ký học","ct.note":"Studio xác nhận sĩ số và gói qua Zalo.",
    "ft.tagline":"Không cần sân khấu để bắt đầu nhảy.","ft.studio":"Studio","ft.join":"Tham gia","ft.made":"Made for dancers who just want to move.","ft.credit":"Thiết kế & phát triển bởi"
  },
  en: {
    "nav.about":"About","nav.styles":"Styles","nav.classes":"Classes","nav.schedule":"Schedule","nav.services":"Services","nav.instructors":"Instructors","nav.pricing":"Pricing","nav.branches":"Branches","nav.partner":"Partner","nav.milestones":"Milestones","nav.clients":"Brands","nav.social":"Social","nav.live":"Live","nav.contact":"Contact","nav.book":"BOOK NOW",
    "menu.eyebrow":"Menu",
    "hero.badge":"DANCE STUDIO","hero.line1":"No stage needed","hero.line2":"to start dancing",
    "hero.sub1":"Leading dance studio in Ho Chi Minh City",
    "hero.sub2":"Dancers, company choreography, and artistic performances",
    "loader.l1":"Leading dance studio in Ho Chi Minh City",
    "loader.l2":"Dancers, company choreography, and artistic performances",
    "hero.cta1":"Book a class","hero.cta2":"View programs","hero.scroll":"SCROLL",
    "imp.label":"Impact","imp.title":"MA in numbers",
    "imp.1.n":"3","imp.1.l":"branches","imp.2.n":"14+","imp.2.l":"rooms",
    "imp.3.n":"12+","imp.3.l":"styles","imp.4.n":"8","imp.4.l":"sessions / course",
    "imp.5.n":"50+","imp.5.l":"classes / month","imp.6.n":"1K+","imp.6.l":"students",
    "imp.7.n":"4+","imp.7.l":"collabs","imp.8.n":"1","imp.8.l":"sponsored",
    "about.label":"About MA","about.est":"EST. · HO CHI MINH CITY, VIETNAM","about.title":"A studio for people who love to move — no stage required",
    "about.sub":"Class booking · room rental · event choreography",
    "about.p1":"MA Dance Studio is a K-Pop and street style space in HCMC. We believe anyone can dance — one session, one track, and a community ready to go all in with you.",
    "about.p2":"From Beginner one-day classes to Master & Popup with guest choreographers, MA keeps it simple: show up — learn — leave with the full choreography.",
    "about.s1":"students / month","about.s2":"classes / week","about.s3":"instructors","about.s4":"studios",
    "partner.badge":"Official partner","partner.label":"Partner",
    "partner.title":"MA Dance × The New Gene 2026",
    "partner.bar":"MA DANCE STUDIO – OFFICIAL DANCE & TRAINING PARTNER OF THE NEW GENE 2026",
    "partner.p1":"An unforgettable performance is shaped not only by music, but by every move, formation, and how artists own the stage.",
    "partner.p2":"Alongside The New Gene 2026, MA Dance Studio will support contestants through training and refining their acts — so each performance is not only heard, but seen and felt fully on stage.",
    "partner.p3":"From the rehearsal room to the stage lights — get ready for breakthrough performances at The New Gene 2026!",
    "partner.cta":"Visit The New Gene","partner.cta2":"Collab with MA",
    "cli.label":"Partners","cli.title":"Trusted alongside MA","cli.sub":"Brands & organizations that work with the studio.",
    "ms.label":"Milestones","ms.title":"MA milestones","ms.sub":"Moments and community that build studio trust.",
    "ms.1.t":"Be Yourself competition","ms.1.d":"MA hosts / partners Be Yourself — a stage for dancers to show who they are.",
    "ms.2.t":"Partners & media","ms.2.d":"Collab with The New Gene Show · media support for ASEAN Culture Ambassador.",
    "ms.3.t":"Dancer community","ms.3.d":"Connected with Saigon Dancer Community — learn, train, and move together.",
    "ms.4.t":"Casting & studio","ms.4.d":"Instructor / dancer casting — 436A/101 Duong 3/2 (D10), 522/1 Phan Xich Long (PN), 02 Ho Xuan Huong (D3).",
    "svc.label":"Services","svc.title":"Three pillars of MA",
    "svc.1.t":"K-Pop classes","svc.1.d":"One-day classes for every level. Choreo from hot MVs, viral challenges, and original MA work.",
    "svc.2.t":"Studio rental","svc.2.d":"Modern rooms: full mirrors, strong sound, A/C. Hourly rental for teams or individuals.",
    "svc.3.t":"Choreography & events","svc.3.d":"Choreo for individuals, teams, brand events, MV covers. MA team is ready to produce.",
    "svc.link":"View classes →","svc.link2":"Book room →","svc.link3":"Consult →",
    "sty.label":"Catalog","sty.title":"Explore styles","sty.sub":"From K-Pop to street — pick your vibe.",
    "sch.label":"Schedule","sch.title":"Today's classes — LIVE","sch.live":"LIVE NOW","sch.book":"Book",
    "sch.r1":"HYE · Room A","sch.r2":"JIN · Room B","sch.r3":"MIN · Room A","sch.r4":"SOO · Room A",
    "sch.note":"Demo schedule — message the studio to confirm real slots.",
    "reel.label":"Viral","reel.title":"Moves that hit",
    "reel.1":"Jump energy","reel.2":"Studio crew","reel.3":"Challenge","reel.4":"Air time","reel.5":"Stage ready",
    "fac.label":"Experience","fac.title":"Space built to move","fac.sub":"Lights · sound · floor — ready when you are.",
    "fac.1.t":"Stage lighting","fac.1.d":"Multi-color lights — train like you're on show.",
    "fac.2.t":"Pro sound","fac.2.d":"Solid bass, even coverage — hear every count.",
    "fac.3.t":"Open rooms","fac.3.d":"Full mirrors, A/C, rest zone — smoother sessions.",
    "tes.label":"Students","tes.title":"What they say about MA",
    "tes.1.q":"“K-Pop class was fire — clear breakdowns, unreal vibe.”",
    "tes.2.q":"“Clean rooms, strong sound. MA feels like a second home.”",
    "tes.3.q":"“Choreo stays on trend. New track every week.”",
    "tes.4.q":"“Zero to full choreo in a few sessions. Recommend!”",
    "br.label":"Locations","br.title":"MA branches",
    "br.1.t":"MA Dance · Dist. 10","br.1.a":"436A/101 Duong 3/2, Hoa Hung Ward (Dist. 10), HCMC",
    "br.2.t":"MA Dance · Phu Nhuan","br.2.a":"522/1 Phan Xich Long, Duc Nhuan Ward (Phu Nhuan), HCMC",
    "br.3.t":"MA Dance · Dist. 3","br.3.a":"02 Ho Xuan Huong, Xuan Hoa Ward (Dist. 3), HCMC",
    "br.map":"Open Maps →",
    "soc.label":"Social","soc.title":"Follow MA","soc.sub":"New choreo · class vibe · behind the scenes.",
    "live.label":"TikTok","live.title":"MA livestream","live.sub":"Watch on TikTok — web or app.",
    "live.now.badge":"TikTok Live","live.now.t":"Open livestream","live.now.d":"Tap to watch on TikTok @madancestudio.",
    "live.sched":"Live schedule",
    "live.1.when":"Tue · 20:00","live.1.t":"Cover night","live.1.d":"Cover choreo · studio vibe",
    "live.2.when":"Fri · 20:00","live.2.t":"Class recap","live.2.d":"Highlights from this week's classes",
    "live.3.when":"Sun · 16:00","live.3.t":"Collab / Q&A","live.3.d":"Guest · Q&A",
    "cls.label":"Programs","cls.title":"Pick your level","cls.hint":"← Drag / scroll sideways to see more →",
    "cls.b.t":"Step by MA","cls.b.d":"Never danced? Slow pace, clear breakdowns, focus on fun and body feel.","cls.b.l":"Absolute beginner",
    "cls.s.t":"Starter","cls.s.d":"Some basics already. Diverse moves + full choreo a step above Beginner.","cls.s.l":"Beginner+",
    "cls.l.t":"Learner","cls.l.d":"Build technique, pick up faster, own the full track in 1–2 sessions.","cls.l.l":"Intermediate",
    "cls.m.t":"Master","cls.m.d":"Harder choreo, performance quality, detail & musicality. For serious dancers.","cls.m.l":"Advanced",
    "cls.p.t":"Pro & Popup","cls.p.d":"Guest choreographers or top instructors. High intensity, pro vibe.","cls.p.l":"Pro level",
    "cls.dur":"80 min / class","cls.dur2":"80–90 min","cls.book":"Book",
    "cls.cta.t":"Not sure which level?","cls.cta.d":"Message MA — we'll recommend the right class in 2 minutes.","cls.cta.b":"Ask us",
    "how.label":"How it works","how.title":"4 steps to the floor",
    "how.1.t":"Choose a class","how.1.d":"Check the schedule or message us. Pick level + time slot.",
    "how.2.t":"Hold your spot","how.2.d":"Register via Google Form or confirm on Zalo. Slots often fill 1–2 days ahead.",
    "how.3.t":"Come to studio","how.3.d":"Arrive 10 min early. Changing room, lockers, water available.",
    "how.4.t":"Dance hard","how.4.d":"80 minutes all-out. Leave with the full choreography.",
    "inst.label":"Instructors","inst.title":"The people on the floor with you","inst.choreo":"Choreographer","inst.inst":"Instructor",
    "price.label":"Pricing","price.title":"Clear and simple","price.unit":"k VND",
    "price.1.tag":"One-day","price.1.t":"Single class","price.1.d":"Any one session (Beginner → Master)","price.1.f1":"Full 80 min","price.1.f2":"Any level","price.1.f3":"Reserve ahead",
    "price.2.tag":"Popular","price.2.t":"5-class pack","price.2.d":"Save ~13% · valid 45 days","price.2.f1":"5 flexible sessions","price.2.f2":"All levels","price.2.f3":"Priority booking",
    "price.3.tag":"Studio","price.3.t":"Room rental","price.3.d":"Room A/B · max 12–15 people","price.3.f1":"Full mirrors + sound","price.3.f2":"Air conditioning","price.3.f3":"Hourly booking",
    "price.cta":"Book ticket","price.cta2":"Book room",
    "gal.label":"Studio","gal.title":"MA space","gal.a":"Room A — Main studio","gal.b":"Room B — Practice","gal.c":"Full mirror wall","gal.d":"Class energy","gal.e":"Evening session",
    "gal.close":"Close","gal.prev":"Previous image","gal.next":"Next image","gal.thumbs":"Studio photos",
    "faq.label":"FAQ","faq.title":"Common questions",
    "faq.1.q":"Can complete beginners join?","faq.1.a":"Yes. Step by MA and Starter are for new dancers. Slow breakdowns, focus on fun and feel.",
    "faq.2.q":"How long is a class?","faq.2.a":"Usually 80 minutes. Pro/Popup may be 90. Arrive 10 minutes early.",
    "faq.3.q":"Do I need to book ahead?","faq.3.a":"Yes, preferably. Slots often fill 1–2 days ahead. Use the Google Form or message Zalo 076 466 9969.",
    "faq.4.q":"Can I rent a private room?","faq.4.a":"Yes. Rooms A/B by the hour — great for cover teams, practice, video shoots.",
    "faq.5.q":"What should I bring?","faq.5.a":"Comfortable sportswear, clean shoes, water. Lockers and changing rooms available.",
    "banner.title":"Ready to hit the floor?","banner.sub":"Pick one class → show up → dance hard. No experience needed.","banner.cta":"Book your first class",
    "ct.label":"Contact","ct.title":"Message to hold a spot","ct.desc":"Register via Google Form or message Zalo 076 466 9969. We confirm within 1–2 hours.",
    "ct.box":"Contact details",
    "ct.address":"Address","ct.addressVal":"CN1: 436A/101 Duong 3/2, D10 · CN2: 522/1 Phan Xich Long, PN · CN3: 02 Ho Xuan Huong, D3","ct.social":"Facebook","ct.phone":"Zalo / Phone","ct.email":"Email",
    "ct.hours":"Hours","ct.hoursVal":"Mon – Sun: 09:00 – 22:00",
    "ct.name":"Name","ct.phonePh":"Zalo / Phone","ct.interest":"What are you interested in?","ct.message":"Preferred day/time...","ct.ok":"Got it — we'll reach out soon.","ct.err":"Please fill in the required fields.",
    "ct.formLead":"Register for classes / Summer Deal via MA’s official form.",
    "ct.send":"Register now","ct.note":"Promo code SMD — see form terms (3–4 month packs / livestream).",
    "ft.tagline":"No stage needed to start dancing.","ft.studio":"Studio","ft.join":"Join","ft.made":"Made for dancers who just want to move.","ft.credit":"Designed & built by"
  },
  kr: {
    "nav.about":"소개","nav.styles":"스타일","nav.classes":"클래스","nav.schedule":"스케줄","nav.services":"서비스","nav.instructors":"강사","nav.pricing":"요금","nav.branches":"지점","nav.partner":"파트너","nav.milestones":"이정표","nav.clients":"브랜드","nav.social":"소셜","nav.live":"라이브","nav.contact":"문의","nav.book":"BOOK NOW",
    "menu.eyebrow":"메뉴",
    "hero.badge":"DANCE STUDIO","hero.line1":"무대는 필요 없다","hero.line2":"춤을 시작하기 위해",
    "hero.sub1":"호치민 최고의 댄스 스튜디오",
    "hero.sub2":"댄서·기업 안무·아트 퍼포먼스 제공",
    "loader.l1":"호치민 최고의 댄스 스튜디오",
    "loader.l2":"댄서·기업 안무·아트 퍼포먼스 제공",
    "hero.cta1":"수업 예약","hero.cta2":"프로그램 보기","hero.scroll":"SCROLL",
    "imp.label":"숫자","imp.title":"숫자로 보는 MA",
    "imp.1.n":"3","imp.1.l":"지점","imp.2.n":"14+","imp.2.l":"룸",
    "imp.3.n":"12+","imp.3.l":"스타일","imp.4.n":"8","imp.4.l":"회 / 코스",
    "imp.5.n":"50+","imp.5.l":"수업 / 월","imp.6.n":"1K+","imp.6.l":"수강생",
    "imp.7.n":"4+","imp.7.l":"협업","imp.8.n":"1","imp.8.l":"후원",
    "about.label":"MA 소개","about.est":"EST. · 호치민, 베트남","about.title":"진짜 춤을 좋아하는 사람을 위한 스튜디오 — 무대 불필요",
    "about.sub":"수업 등록 · 룸 대여 · 이벤트 안무",
    "about.p1":"MA Dance Studio는 호치민의 K-Pop·스트리트 댄스 공간입니다. 누구나 출 수 있다고 믿습니다 — 한 세션, 한 트랙, 함께 불탈 커뮤니티.",
    "about.p2":"비기너 원데이부터 게스트 안무가 마스터·팝업까지. 와서 — 배우고 — 풀 안무와 함께 돌아가세요.",
    "about.s1":"수강생 / 월","about.s2":"수업 / 주","about.s3":"강사","about.s4":"스튜디오",
    "partner.badge":"공식 파트너","partner.label":"파트너",
    "partner.title":"MA Dance × The New Gene 2026",
    "partner.bar":"MA DANCE STUDIO – THE NEW GENE 2026 공식 안무·트레이닝 파트너",
    "partner.p1":"인상적인 무대는 음악만으로 완성되지 않습니다. 움직임, 포메이션, 그리고 아티스트가 스테이지를 장악하는 방식에서 만들어집니다.",
    "partner.p2":"The New Gene 2026과 함께, MA Dance Studio는 참가자들의 연습과 퍼포먼스 완성도를 돕습니다. 각 무대를 듣기만 하는 것이 아니라, 보고 온전히 느낄 수 있도록.",
    "partner.p3":"연습실에서 스테이지 조명까지 — The New Gene 2026의 돌파력 있는 무대를 기대해 주세요!",
    "partner.cta":"The New Gene 보기","partner.cta2":"MA와 협업",
    "cli.label":"파트너","cli.title":"MA와 함께하는 브랜드","cli.sub":"스튜디오와 협업한 브랜드 · 기관.",
    "ms.label":"이정표","ms.title":"MA 이정표","ms.sub":"스튜디오 신뢰를 만드는 순간과 커뮤니티.",
    "ms.1.t":"Be Yourself 대회","ms.1.d":"MA가 주최·동행하는 Be Yourself — 댄서가 자신을 보여줄 무대.",
    "ms.2.t":"파트너 & 미디어","ms.2.d":"The New Gene Show 콜라보 · ASEAN Culture Ambassador 미디어 지원.",
    "ms.3.t":"댄서 커뮤니티","ms.3.d":"사이공 댄서 커뮤니티와 연결 — 함께 배우고 연습하고 불타오르다.",
    "ms.4.t":"캐스팅 & 스튜디오","ms.4.d":"강사·댄서 캐스팅 — 436A/101 Đường 3/2 (10군), 522/1 Phan Xích Long (푸년), 02 Hồ Xuân Hương (3군).",
    "svc.label":"서비스","svc.title":"MA의 세 기둥",
    "svc.1.t":"K-Pop 수업","svc.1.d":"모든 레벨 원데이. 핫 MV, 바이럴 챌린지, MA 오리지널 안무.",
    "svc.2.t":"스튜디오 대여","svc.2.d":"풀 미러, 강력한 사운드, 에어컨. 팀·개인 시간제 대여.",
    "svc.3.t":"안무 & 이벤트","svc.3.d":"개인·팀·브랜드 이벤트·MV 커버 안무. MA 팀이 제작합니다.",
    "svc.link":"클래스 보기 →","svc.link2":"룸 예약 →","svc.link3":"상담 →",
    "sty.label":"Catalog","sty.title":"스타일로 열정 찾기","sty.sub":"K-Pop부터 스트리트까지 — 바이브를 고르세요.",
    "sch.label":"스케줄","sch.title":"오늘의 수업 — LIVE","sch.live":"LIVE NOW","sch.book":"예약",
    "sch.r1":"HYE · 룸 A","sch.r2":"JIN · 룸 B","sch.r3":"MIN · 룸 A","sch.r4":"SOO · 룸 A",
    "sch.note":"데모 스케줄 — 실제 슬롯은 스튜디오에 문의해 주세요.",
    "reel.label":"Viral","reel.title":"지금 핫한 무브",
    "reel.1":"Jump energy","reel.2":"Studio crew","reel.3":"Challenge","reel.4":"Air time","reel.5":"Stage ready",
    "fac.label":"경험","fac.title":"프리미엄 공간","fac.sub":"조명 · 사운드 · 플로어 — 올인할 준비 완료.",
    "fac.1.t":"무대 조명","fac.1.d":"멀티 컬러 라이트 — 쇼처럼 연습하세요.",
    "fac.2.t":"프로 사운드","fac.2.d":"단단한 베이스, 고른 커버 — 카운트가 선명합니다.",
    "fac.3.t":"넓은 룸","fac.3.d":"풀 미러, 에어컨, 휴식 존 — 더 부드러운 세션.",
    "tes.label":"수강생","tes.title":"MA에 대한 이야기",
    "tes.1.q":"“K-Pop 수업 최고 — 설명이 쉽고 바이브가 미쳐요.”",
    "tes.2.q":"“룸이 깨끗하고 사운드가 강해요. 제2의 집 같아요.”",
    "tes.3.q":"“안무가 트렌드를 따라가요. 매주 새 트랙.”",
    "tes.4.q":"“제로에서 풀 안무까지 몇 번 만에. 추천!”",
    "br.label":"지점","br.title":"MA 지점",
    "br.1.t":"MA Dance · 10군","br.1.a":"436A/101 Đường 3/2, Hoà Hưng (10군), 호치민",
    "br.2.t":"MA Dance · Phu Nhuan","br.2.a":"522/1 Phan Xích Long, Đức Nhuận (푸년), 호치민",
    "br.3.t":"MA Dance · 3군","br.3.a":"02 Hồ Xuân Hương, Xuân Hoà (3군), 호치민",
    "br.map":"Maps 열기 →",
    "soc.label":"소셜","soc.title":"MA 팔로우","soc.sub":"새 안무 · 클래스 바이브 · 비하인드.",
    "live.label":"TikTok","live.title":"MA 라이브","live.sub":"TikTok에서 시청 — 웹 또는 앱.",
    "live.now.badge":"TikTok Live","live.now.t":"라이브 열기","live.now.d":"TikTok @madancestudio에서 시청하세요.",
    "live.sched":"라이브 일정",
    "live.1.when":"화 · 20:00","live.1.t":"커버 나이트","live.1.d":"커버 안무 · 스튜디오 바이브",
    "live.2.when":"금 · 20:00","live.2.t":"클래스 리캡","live.2.d":"이번 주 수업 하이라이트",
    "live.3.when":"일 · 16:00","live.3.t":"콜라보 / Q&A","live.3.d":"게스트 · 질의응답",
    "cls.label":"프로그램","cls.title":"레벨 선택","cls.hint":"← 가로로 스크롤하여 더 보기 →",
    "cls.b.t":"Step by MA","cls.b.d":"완전 초보? 느린 템포, 명확한 설명, 재미와 감각에 집중.","cls.b.l":"완전 초급",
    "cls.s.t":"Starter","cls.s.d":"기본이 조금 있는 분. 다양한 동작 + 비기너보다 한 단계 높은 풀 안무.","cls.s.l":"초급+",
    "cls.l.t":"Learner","cls.l.d":"기술 강화, 빠른 습득, 1–2회에 풀 트랙 마스터.","cls.l.l":"중급",
    "cls.m.t":"Master","cls.m.d":"어려운 안무, 퍼포먼스 퀄리티, 디테일 & 뮤지컬리티.","cls.m.l":"고급",
    "cls.p.t":"Pro & Popup","cls.p.d":"게스트 안무가 또는 탑 강사. 높은 강도, 프로 바이브.","cls.p.l":"프로",
    "cls.dur":"80분 / 수업","cls.dur2":"80–90분","cls.book":"예약",
    "cls.cta.t":"레벨을 모르겠다면?","cls.cta.d":"MA에 메시지 — 2분 안에 맞는 클래스를 추천합니다.","cls.cta.b":"상담하기",
    "how.label":"참여 방법","how.title":"무대까지 4단계",
    "how.1.t":"클래스 선택","how.1.d":"스케줄 확인 또는 메시지. 레벨 + 시간 선택.",
    "how.2.t":"자리 확보","how.2.d":"Google Form 또는 Zalo로 확인. 보통 1–2일 전 마감.",
    "how.3.t":"스튜디오 방문","how.3.d":"10분 일찍 도착. 탈의실, 락커, 물 이용 가능.",
    "how.4.t":"全力으로 춤","how.4.d":"80분 올아웃. 풀 안무와 함께 돌아가세요.",
    "inst.label":"강사","inst.title":"함께 서는 사람들","inst.choreo":"안무가","inst.inst":"강사",
    "price.label":"요금","price.title":"투명하고 간단","price.unit":"k VND",
    "price.1.tag":"원데이","price.1.t":"단권","price.1.d":"아무 수업 1회 (초급→마스터)","price.1.f1":"풀 80분","price.1.f2":"레벨 제한 없음","price.1.f3":"사전 예약",
    "price.2.tag":"인기","price.2.t":"5회 패키지","price.2.d":"약 13% 절약 · 45일 유효","price.2.f1":"5회 유연","price.2.f2":"모든 레벨","price.2.f3":"우선 예약",
    "price.3.tag":"스튜디오","price.3.t":"룸 대여","price.3.d":"룸 A/B · 최대 12–15명","price.3.f1":"풀 미러 + 사운드","price.3.f2":"에어컨","price.3.f3":"시간제",
    "price.cta":"티켓 예약","price.cta2":"룸 예약",
    "gal.label":"스튜디오","gal.title":"MA 공간","gal.a":"룸 A — 메인","gal.b":"룸 B — 연습","gal.c":"풀 미러 벽","gal.d":"클래스 에너지","gal.e":"저녁 세션",
    "gal.close":"닫기","gal.prev":"이전 사진","gal.next":"다음 사진","gal.thumbs":"스튜디오 사진",
    "faq.label":"FAQ","faq.title":"자주 묻는 질문",
    "faq.1.q":"완전 초보도 가능한가요?","faq.1.a":"네. Step by MA와 Starter는 초보자를 위한 수업입니다.",
    "faq.2.q":"수업 시간은?","faq.2.a":"보통 80분. Pro/Popup은 90분일 수 있습니다. 10분 일찍 와 주세요.",
    "faq.3.q":"사전 예약이 필요한가요?","faq.3.a":"네. 보통 1–2일 전 마감됩니다. Google Form 또는 Zalo 076 466 9969로 예약하세요.",
    "faq.4.q":"개인 룸 대여가 되나요?","faq.4.a":"네. 룸 A/B 시간제 — 커버 팀, 연습, 촬영에 적합합니다.",
    "faq.5.q":"무엇을 가져가야 하나요?","faq.5.a":"편한 운동복, 깨끗한 신발, 물. 락커와 탈의실이 있습니다.",
    "banner.title":"무대에 설 준비 됐나요?","banner.sub":"수업 하나 고르고 → 와서 → 힘껏 추세요.","banner.cta":"첫 수업 예약",
    "ct.label":"문의","ct.title":"자리 예약 메시지","ct.desc":"Google Form 또는 Zalo 076 466 9969. 1–2시간 내 확인합니다.",
    "ct.box":"연락처 정보",
    "ct.address":"주소","ct.addressVal":"CN1: 436A/101 Đường 3/2, 10군 · CN2: 522/1 Phan Xích Long, 푸년 · CN3: 02 Hồ Xuân Hương, 3군","ct.social":"Facebook","ct.phone":"Zalo / 전화","ct.email":"이메일",
    "ct.hours":"운영시간","ct.hoursVal":"월 – 일: 09:00 – 22:00",
    "ct.name":"이름","ct.phonePh":"Zalo / 전화","ct.interest":"관심 항목","ct.message":"희망 요일/시간...","ct.ok":"접수됨 — 곧 연락드릴게요.","ct.err":"필수 항목을 입력해 주세요.",
    "ct.formLead":"MA 공식 Google Form으로 클래스 / Summer Deal 등록하세요.",
    "ct.send":"지금 등록","ct.note":"할인 코드 SMD — 폼 조건 적용 (3–4개월 패키지 / 라이브).",
    "ft.tagline":"춤을 시작하기 위해 무대는 필요 없다.","ft.studio":"스튜디오","ft.join":"참여","ft.made":"Made for dancers who just want to move.","ft.credit":"디자인 · 개발"
  }
};

let currentLang = localStorage.getItem("ma-lang") || "vi";
let afterLanguage = () => {};

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("ma-lang", lang);
  document.documentElement.lang = lang === "kr" ? "ko" : lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang][key] !== undefined) el.textContent = translations[lang][key];
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    const key = el.getAttribute("data-i18n-aria");
    if (translations[lang][key]) el.setAttribute("aria-label", translations[lang][key]);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (translations[lang][key]) el.placeholder = translations[lang][key];
  });
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
  afterLanguage();
}

document.querySelectorAll(".lang-btn").forEach((btn) => {
  btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
});
setLanguage(currentLang);

// Mobile menu
const menuToggle = document.getElementById("menuToggle");
const sideRailMenu = document.getElementById("sideRailMenu");
const bottomBarMenu = document.getElementById("bottomBarMenu");
const sideRail = document.querySelector(".side-rail");
const bottomBar = document.getElementById("bottomBar");
const sectionSpy = document.getElementById("sectionSpy");
const mobileMenu = document.getElementById("mobileMenu");
const mobileMenuBackdrop = document.getElementById("mobileMenuBackdrop");
const mobileMenuClose = document.getElementById("mobileMenuClose");

function setMobileMenuOpen(open) {
  if (!mobileMenu) return;
  mobileMenu.classList.toggle("open", open);
  document.body.style.overflow = open ? "hidden" : "";
  document.body.classList.toggle("is-menu-open", open);
  sideRailMenu?.setAttribute("aria-expanded", open ? "true" : "false");
  bottomBarMenu?.setAttribute("aria-expanded", open ? "true" : "false");
  menuToggle?.setAttribute("aria-expanded", open ? "true" : "false");
  mobileMenuClose?.setAttribute("aria-expanded", open ? "true" : "false");
  sideRail?.classList.toggle("is-open", open);
  bottomBar?.classList.toggle("is-open", open);
  if (open) setChromeHidden(false);
}
function toggleMobileMenu() {
  setMobileMenuOpen(!mobileMenu?.classList.contains("open"));
}
menuToggle?.addEventListener("click", toggleMobileMenu);
sideRailMenu?.addEventListener("click", toggleMobileMenu);
bottomBarMenu?.addEventListener("click", toggleMobileMenu);
mobileMenuClose?.addEventListener("click", () => setMobileMenuOpen(false));
mobileMenuBackdrop?.addEventListener("click", () => setMobileMenuOpen(false));
mobileMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMobileMenuOpen(false));
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setMobileMenuOpen(false);
});

// Header + booking chrome hide/show on scroll
const header = document.getElementById("header");
const topBar = document.getElementById("topBar");
let lastScrollY = window.scrollY || 0;

function setChromeHidden(hidden) {
  header?.classList.toggle("is-chrome-hidden", hidden);
  sideRail?.classList.toggle("is-chrome-hidden", hidden);
  bottomBar?.classList.toggle("is-chrome-hidden", hidden);
  sectionSpy?.classList.toggle("is-flush", hidden);
}

function updateChromeScroll() {
  const y = window.scrollY;
  const delta = y - lastScrollY;
  const menuOpen = mobileMenu?.classList.contains("open");

  header?.classList.toggle("scrolled", y > 40);

  if (menuOpen || y < 24) {
    setChromeHidden(false);
  } else if (delta > 8) {
    setChromeHidden(true);
  } else if (delta < -8) {
    setChromeHidden(false);
  }

  lastScrollY = y;
}

window.addEventListener("scroll", updateChromeScroll, { passive: true });

function updateHeaderTheme() {
  if (!header) return;
  const lights = document.querySelectorAll('[data-header-theme="light"]');
  const bandTop = topBar?.offsetHeight || 0;
  const bandBottom = bandTop + (header.offsetHeight || 70);
  let onLight = false;
  lights.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < bandBottom && rect.bottom > bandTop) onLight = true;
  });
  header.classList.toggle("is-on-light", onLight);
}

window.addEventListener("scroll", updateHeaderTheme, { passive: true });
window.addEventListener("resize", updateHeaderTheme);
updateHeaderTheme();

// Reveal
const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
);
reveals.forEach((el) => observer.observe(el));

document.querySelectorAll(".svc-grid .reveal, .ms-bento .reveal, .how-steps .reveal, .inst-grid .reveal, .price-grid .reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 0.07}s`;
});

// Bottom section spy (scrollspy)
const spyLinks = [...document.querySelectorAll("#sectionSpy [data-spy]")];
const spyTrack = document.querySelector(".section-spy__track");
const spyRatios = new Map();
let activeSpyId = "";

function setActiveSpy(id) {
  if (!id || id === activeSpyId) return;
  activeSpyId = id;
  let activeLink = null;
  spyLinks.forEach((a) => {
    const on = a.dataset.spy === id;
    a.classList.toggle("is-active", on);
    a.setAttribute("aria-current", on ? "true" : "false");
    if (on) activeLink = a;
  });
  if (activeLink && spyTrack) {
    const left =
      activeLink.offsetLeft - spyTrack.clientWidth / 2 + activeLink.offsetWidth / 2;
    spyTrack.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
  }
}

if (spyLinks.length) {
  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        spyRatios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
      });
      let bestId = "";
      let bestRatio = 0;
      spyRatios.forEach((ratio, id) => {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestId = id;
        }
      });
      if (bestId) setActiveSpy(bestId);
    },
    {
      root: null,
      rootMargin: "-28% 0px -52% 0px",
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
    }
  );

  spyLinks.forEach((a) => {
    const el = document.getElementById(a.dataset.spy);
    if (el) spyObserver.observe(el);
    a.addEventListener("click", () => {
      const id = a.dataset.spy;
      if (id) setActiveSpy(id);
    });
  });
}

// Chrome socials: accordion only on mobile; desktop always expanded
const chromeSocials = [...document.querySelectorAll("details.chrome-socials")];
const chromeSocialsMq = window.matchMedia("(min-width: 961px)");
function syncChromeSocials() {
  chromeSocials.forEach((box) => {
    if (chromeSocialsMq.matches) box.open = true;
    else box.open = false;
  });
}
syncChromeSocials();
chromeSocialsMq.addEventListener("change", syncChromeSocials);
chromeSocials.forEach((box) => {
  box.addEventListener("toggle", () => {
    if (chromeSocialsMq.matches || !box.open) return;
    chromeSocials.forEach((other) => {
      if (other !== box) other.open = false;
    });
  });
});
document.addEventListener("click", (e) => {
  if (chromeSocialsMq.matches) return;
  if (e.target.closest("details.chrome-socials")) return;
  chromeSocials.forEach((box) => {
    box.open = false;
  });
});

// Contact box: open on desktop, collapsed on mobile
const contactBox = document.getElementById("contactBox");
const contactBoxMq = window.matchMedia("(min-width: 961px)");
function syncContactBox() {
  if (!contactBox) return;
  if (contactBoxMq.matches) contactBox.setAttribute("open", "");
  else contactBox.removeAttribute("open");
}
syncContactBox();
contactBoxMq.addEventListener("change", syncContactBox);

// Image load fallbacks (empty / broken → keep skeleton tone)
document.querySelectorAll(".ma-dance-root img").forEach((img) => {
  const mark = () => {
    if (img.naturalWidth > 0) img.classList.add("is-loaded");
    else img.classList.add("is-broken");
  };
  if (img.complete) mark();
  else {
    img.addEventListener("load", () => img.classList.add("is-loaded"));
    img.addEventListener("error", () => img.classList.add("is-broken"));
  }
});

const hero = document.getElementById("hero");
const heroBg = document.getElementById("heroVideoWrap");
const heroFrame = document.getElementById("heroFrame");
const pinStack = document.querySelector(".pin-stack");
const parallaxEls = [...document.querySelectorAll("[data-parallax]")];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function updateParallax() {
  if (reduceMotion.matches) return;
  const vh = window.innerHeight || 1;

  if (hero && pinStack) {
    const stackTop = pinStack.getBoundingClientRect().top;
    const p = Math.min(1, Math.max(0, -stackTop / vh));
    if (heroBg) heroBg.style.transform = `translate3d(0, ${p * 12}vh, 0) scale(${1.04 + p * 0.08})`;
    if (heroFrame) {
      heroFrame.style.transform = `translate3d(0, ${p * -5}vh, 0) scale(${1 - p * 0.1})`;
      heroFrame.style.opacity = String(Math.max(0.35, 1 - p * 0.55));
    }
  }

  parallaxEls.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.bottom < -vh * 0.1 || rect.top > vh * 1.1) return;
    const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
    const shift = Math.max(-3, Math.min(3, progress * 2.75));
    el.style.transform = `translate3d(0, ${shift}rem, 0)`;
  });
}

function parseStatLabel(text) {
  const raw = String(text || "").trim();
  const match = raw.match(/^([\d]+(?:[.,]\d+)?)(.*)$/);
  if (!match) return null;
  const value = Number(match[1].replace(",", "."));
  if (!Number.isFinite(value)) return null;
  return { value, suffix: match[2] || "" };
}

function formatStat(value, suffix) {
  return `${Math.round(value)}${suffix}`;
}

function animateCount(el, to, suffix, durationMs) {
  const start = performance.now();
  const tick = (now) => {
    const t = Math.min(1, (now - start) / durationMs);
    const eased = 1 - (1 - t) ** 3;
    el.textContent = formatStat(to * eased, suffix);
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = formatStat(to, suffix);
  };
  requestAnimationFrame(tick);
}

const impactNums = [...document.querySelectorAll(".impact-item strong")];
const countedStats = new WeakSet();

function snapshotImpactStats() {
  impactNums.forEach((el) => {
    if (el.dataset.statValue) return;
    const parsed = parseStatLabel(el.textContent);
    if (!parsed) return;
    el.dataset.statValue = String(parsed.value);
    el.dataset.statSuffix = parsed.suffix;
  });
}

function showImpactPlaceholders() {
  if (reduceMotion.matches) return;
  impactNums.forEach((el) => {
    if (countedStats.has(el)) return;
    const value = Number(el.dataset.statValue);
    if (!Number.isFinite(value)) return;
    el.textContent = formatStat(0, el.dataset.statSuffix || "");
  });
}

function playImpactCounts() {
  impactNums.forEach((el) => {
    if (countedStats.has(el)) return;
    const value = Number(el.dataset.statValue);
    const suffix = el.dataset.statSuffix || "";
    if (!Number.isFinite(value)) return;
    countedStats.add(el);
    el.dataset.counted = "1";
    if (reduceMotion.matches) {
      el.textContent = formatStat(value, suffix);
      return;
    }
    el.textContent = formatStat(0, suffix);
    animateCount(el, value, suffix, 1400);
  });
}

if (impactNums.length) {
  snapshotImpactStats();
  showImpactPlaceholders();
  afterLanguage = () => {
    snapshotImpactStats();
    showImpactPlaceholders();
  };
  const impactSection = document.getElementById("impact");
  const startCounts = () => {
    playImpactCounts();
    impactIo?.disconnect();
  };
  const impactIo = impactSection
    ? new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) startCounts();
      }, { threshold: 0.28, rootMargin: "0% 0% -8% 0%" })
    : null;
  if (impactIo && impactSection) impactIo.observe(impactSection);
  else startCounts();
}

function syncMarquees() {
  document.querySelectorAll(".marquee-track").forEach((track) => {
    const group = track.querySelector(".marquee-group");
    if (!group) return;
    const width = group.getBoundingClientRect().width;
    const gap = Number.parseFloat(getComputedStyle(track).gap) || 0;
    const shift = width + gap;
    if (shift <= 0) return;
    track.style.setProperty("--marquee-shift", `${shift}px`);
    track.style.setProperty("--marquee-duration", `${Math.max(16, shift / 45)}s`);
  });
}
syncMarquees();
window.addEventListener("resize", syncMarquees);

function initGalleryLightbox() {
  const dialog = document.getElementById("galLightbox");
  const imgEl = document.getElementById("galLightboxImg");
  const capEl = document.getElementById("galLightboxCaption");
  const thumbsEl = document.getElementById("galLightboxThumbs");
  const closeBtn = document.getElementById("galLightboxClose");
  const prevBtn = document.getElementById("galLightboxPrev");
  const nextBtn = document.getElementById("galLightboxNext");
  const stage = document.getElementById("galLightboxStage");
  const items = [...document.querySelectorAll("#gallery .gal-item")];
  if (!dialog || !imgEl || !thumbsEl || !items.length) return;

  const slides = items.map((btn) => {
    const img = btn.querySelector("img");
    const cap = btn.querySelector("span");
    return {
      src: img?.getAttribute("src") || "",
      alt: img?.getAttribute("alt") || "",
      caption: (cap?.textContent || "").trim(),
    };
  });

  thumbsEl.replaceChildren();
  slides.forEach((slide, i) => {
    const thumb = document.createElement("button");
    thumb.type = "button";
    thumb.className = "gal-lightbox__thumb";
    thumb.setAttribute("role", "tab");
    thumb.setAttribute("aria-selected", "false");
    const tImg = document.createElement("img");
    tImg.src = slide.src;
    tImg.alt = "";
    tImg.decoding = "async";
    thumb.appendChild(tImg);
    thumb.addEventListener("click", () => goTo(i));
    thumbsEl.appendChild(thumb);
  });

  let index = 0;

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    const slide = slides[index];
    imgEl.src = slide.src;
    imgEl.alt = slide.alt;
    if (capEl) capEl.textContent = slide.caption;
    thumbsEl.querySelectorAll(".gal-lightbox__thumb").forEach((thumb, ti) => {
      const on = ti === index;
      thumb.classList.toggle("is-active", on);
      thumb.setAttribute("aria-selected", on ? "true" : "false");
      if (on) {
        const left = thumb.offsetLeft - (thumbsEl.clientWidth - thumb.offsetWidth) / 2;
        thumbsEl.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
      }
    });
  }

  function openAt(i) {
    goTo(i);
    document.body.classList.add("gal-open");
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  }

  function closeLightbox() {
    document.body.classList.remove("gal-open");
    if (dialog.open) dialog.close();
    else dialog.removeAttribute("open");
  }

  items.forEach((btn, i) => {
    btn.addEventListener("click", () => openAt(i));
  });
  closeBtn?.addEventListener("click", closeLightbox);
  prevBtn?.addEventListener("click", () => goTo(index - 1));
  nextBtn?.addEventListener("click", () => goTo(index + 1));
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) closeLightbox();
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("gal-open");
  });

  let startX = 0;
  let tracking = false;
  stage?.addEventListener("touchstart", (e) => {
    if (e.touches.length !== 1) return;
    tracking = true;
    startX = e.touches[0].clientX;
  }, { passive: true });
  stage?.addEventListener("touchend", (e) => {
    if (!tracking) return;
    tracking = false;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) < 40) return;
    goTo(index + (dx < 0 ? 1 : -1));
  }, { passive: true });

  document.addEventListener("keydown", (e) => {
    if (!dialog.open) return;
    if (e.key === "ArrowLeft") goTo(index - 1);
    if (e.key === "ArrowRight") goTo(index + 1);
  });
}
initGalleryLightbox();

window.addEventListener("scroll", updateParallax, { passive: true });
window.addEventListener("resize", updateParallax);
updateParallax();

}

export function destroyMaDance() {
  /* listeners are on window/document; full teardown not required for SPA demos */
}
