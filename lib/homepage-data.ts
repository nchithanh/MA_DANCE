export const HOME_LOCALES = ["vi", "en", "kr"] as const;
export type HomeLocale = (typeof HOME_LOCALES)[number];
export type I18nText = Record<HomeLocale, string>;

export const HOME_VERSION = 1 as const;

export function i18n(vi: string, en: string, kr: string): I18nText {
  return { vi, en, kr };
}

export function pickI18n(text: I18nText | undefined, lang: string): string {
  if (!text) return "";
  if (lang === "en" || lang === "kr") return text[lang] || text.vi || "";
  return text.vi || "";
}

export function emptyI18n(): I18nText {
  return { vi: "", en: "", kr: "" };
}

export type Homepage = {
  version: typeof HOME_VERSION;
  formHref: string;
  hero: {
    videoId: string;
    line1: I18nText;
    line2: I18nText;
    cta1: I18nText;
    ctaRoom: I18nText;
    scroll: I18nText;
  };
  about: {
    est: I18nText;
    title: I18nText;
    sub: I18nText;
    impact: { value: string; label: I18nText }[];
    marquee: string[];
  };
  partner: {
    label: I18nText;
    title: I18nText;
    p1: I18nText;
    p2: I18nText;
    p3: I18nText;
    cta: I18nText;
    cta2: I18nText;
    href: string;
    image: string;
    imageAlt: string;
  };
  clients: {
    label: I18nText;
    title: I18nText;
    sub: I18nText;
    logos: { src: string; alt: string; screen?: boolean }[];
  };
  milestones: {
    label: I18nText;
    title: I18nText;
    sub: I18nText;
    items: {
      title: I18nText;
      desc: I18nText;
      image: string;
      alt: string;
      badgeSrc?: string;
      badgeLabel?: string;
    }[];
  };
  services: {
    label: I18nText;
    title: I18nText;
    items: {
      title: I18nText;
      desc: I18nText;
      link: I18nText;
      href: string;
      image: string;
      alt: string;
    }[];
  };
  styles: {
    label: I18nText;
    title: I18nText;
    sub: I18nText;
    items: { name: string; image: string }[];
  };
  classes: {
    label: I18nText;
    title: I18nText;
    hint: I18nText;
    items: {
      tag: string;
      title: I18nText;
      desc: I18nText;
      meta: I18nText;
      extra: I18nText;
      href: string;
      link: I18nText;
      cta?: boolean;
    }[];
  };
  instructors: {
    label: I18nText;
    title: I18nText;
    roleChoreo: I18nText;
    roleInst: I18nText;
    items: {
      name: string;
      role: "choreo" | "inst";
      overlay: string;
      bio: I18nText;
      image: string;
    }[];
  };
  pricing: {
    label: I18nText;
    title: I18nText;
    note: I18nText;
    more: I18nText;
  };
  gallery: {
    label: I18nText;
    title: I18nText;
    sub: I18nText;
    cta: I18nText;
    hint: I18nText;
    items: { src: string; alt: string; caption: string }[];
  };
  live: {
    label: I18nText;
    title: I18nText;
    sub: I18nText;
    sched: I18nText;
    now: {
      badge: I18nText;
      title: I18nText;
      desc: I18nText;
      href: string;
      image: string;
      alt: string;
    };
    slots: {
      when: I18nText;
      title: I18nText;
      desc: I18nText;
      href: string;
      image: string;
      alt: string;
    }[];
  };
  storiesHead: {
    label: I18nText;
    title: I18nText;
    sub: I18nText;
    all: I18nText;
  };
  branchesHead: {
    label: I18nText;
    title: I18nText;
    map: I18nText;
  };
  faq: {
    label: I18nText;
    title: I18nText;
    items: { q: I18nText; a: I18nText }[];
  };
  banner: {
    title: I18nText;
    sub: I18nText;
    cta: I18nText;
    href: string;
  };
  contact: {
    label: I18nText;
    title: I18nText;
    desc: I18nText;
    box: I18nText;
    addressLabel: I18nText;
    addressVal: I18nText;
    phoneLabel: I18nText;
    phone: string;
    phoneHref: string;
    socialLabel: I18nText;
    facebook: string;
    facebookHref: string;
    hoursLabel: I18nText;
    hoursVal: I18nText;
    formLead: I18nText;
    send: I18nText;
    zalo: string;
    tiktok: string;
    youtube: string;
  };
};

function asI18n(raw: unknown): I18nText {
  const row = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return {
    vi: row.vi == null ? "" : String(row.vi),
    en: row.en == null ? "" : String(row.en),
    kr: row.kr == null ? "" : String(row.kr),
  };
}

function arr<T>(raw: unknown, map: (item: unknown) => T): T[] {
  return Array.isArray(raw) ? raw.map(map) : [];
}

function asImpact(about: Record<string, unknown>): Homepage["about"]["impact"] {
  if (Array.isArray(about.impact)) {
    return about.impact.map((item) => {
      const row = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
      return {
        value: row.value == null ? "" : String(row.value),
        label: asI18n(row.label),
      };
    });
  }
  return arr(about.impactLabels, asI18n).map((label) => ({ value: "", label }));
}

export function parseHomepage(raw: unknown): Homepage {
  if (!raw || typeof raw !== "object") throw new Error("homepage_invalid");
  const row = raw as Record<string, unknown>;
  if (Number(row.version) !== HOME_VERSION) throw new Error("homepage_invalid");
  const required = [
    "hero",
    "about",
    "partner",
    "clients",
    "milestones",
    "services",
    "styles",
    "classes",
    "instructors",
    "pricing",
    "gallery",
    "live",
    "storiesHead",
    "branchesHead",
    "faq",
    "banner",
    "contact",
  ];
  for (const key of required) {
    if (!row[key] || typeof row[key] !== "object") throw new Error("homepage_invalid");
  }
  const hero = row.hero as Record<string, unknown>;
  const about = row.about as Record<string, unknown>;
  const partner = row.partner as Record<string, unknown>;
  const clients = row.clients as Record<string, unknown>;
  const milestones = row.milestones as Record<string, unknown>;
  const services = row.services as Record<string, unknown>;
  const styles = row.styles as Record<string, unknown>;
  const classes = row.classes as Record<string, unknown>;
  const instructors = row.instructors as Record<string, unknown>;
  const pricing = row.pricing as Record<string, unknown>;
  const gallery = row.gallery as Record<string, unknown>;
  const live = row.live as Record<string, unknown>;
  const storiesHead = row.storiesHead as Record<string, unknown>;
  const branchesHead = row.branchesHead as Record<string, unknown>;
  const faq = row.faq as Record<string, unknown>;
  const banner = row.banner as Record<string, unknown>;
  const contact = row.contact as Record<string, unknown>;
  const now = (live.now && typeof live.now === "object" ? live.now : {}) as Record<string, unknown>;

  return {
    version: HOME_VERSION,
    formHref: String(row.formHref || ""),
    hero: {
      videoId: String(hero.videoId || ""),
      line1: asI18n(hero.line1),
      line2: asI18n(hero.line2),
      cta1: asI18n(hero.cta1),
      ctaRoom: asI18n(hero.ctaRoom),
      scroll: asI18n(hero.scroll),
    },
    about: {
      est: asI18n(about.est),
      title: asI18n(about.title),
      sub: asI18n(about.sub),
      impact: asImpact(about),
      marquee: arr(about.marquee, (item) => String(item ?? "")),
    },
    partner: {
      label: asI18n(partner.label),
      title: asI18n(partner.title),
      p1: asI18n(partner.p1),
      p2: asI18n(partner.p2),
      p3: asI18n(partner.p3),
      cta: asI18n(partner.cta),
      cta2: asI18n(partner.cta2),
      href: String(partner.href || ""),
      image: String(partner.image || ""),
      imageAlt: String(partner.imageAlt || ""),
    },
    clients: {
      label: asI18n(clients.label),
      title: asI18n(clients.title),
      sub: asI18n(clients.sub),
      logos: arr(clients.logos, (item) => {
        const logo = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
        return {
          src: String(logo.src || ""),
          alt: String(logo.alt || ""),
          screen: Boolean(logo.screen),
        };
      }),
    },
    milestones: {
      label: asI18n(milestones.label),
      title: asI18n(milestones.title),
      sub: asI18n(milestones.sub),
      items: arr(milestones.items, (item) => {
        const rowItem = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
        return {
          title: asI18n(rowItem.title),
          desc: asI18n(rowItem.desc),
          image: String(rowItem.image || ""),
          alt: String(rowItem.alt || ""),
          badgeSrc: rowItem.badgeSrc ? String(rowItem.badgeSrc) : undefined,
          badgeLabel: rowItem.badgeLabel ? String(rowItem.badgeLabel) : undefined,
        };
      }),
    },
    services: {
      label: asI18n(services.label),
      title: asI18n(services.title),
      items: arr(services.items, (item) => {
        const rowItem = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
        return {
          title: asI18n(rowItem.title),
          desc: asI18n(rowItem.desc),
          link: asI18n(rowItem.link),
          href: String(rowItem.href || ""),
          image: String(rowItem.image || ""),
          alt: String(rowItem.alt || ""),
        };
      }),
    },
    styles: {
      label: asI18n(styles.label),
      title: asI18n(styles.title),
      sub: asI18n(styles.sub),
      items: arr(styles.items, (item) => {
        const rowItem = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
        return { name: String(rowItem.name || ""), image: String(rowItem.image || "") };
      }),
    },
    classes: {
      label: asI18n(classes.label),
      title: asI18n(classes.title),
      hint: asI18n(classes.hint),
      items: arr(classes.items, (item) => {
        const rowItem = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
        return {
          tag: String(rowItem.tag || ""),
          title: asI18n(rowItem.title),
          desc: asI18n(rowItem.desc),
          meta: asI18n(rowItem.meta),
          extra: asI18n(rowItem.extra),
          href: String(rowItem.href || ""),
          link: asI18n(rowItem.link),
          cta: Boolean(rowItem.cta),
        };
      }),
    },
    instructors: {
      label: asI18n(instructors.label),
      title: asI18n(instructors.title),
      roleChoreo: asI18n(instructors.roleChoreo),
      roleInst: asI18n(instructors.roleInst),
      items: arr(instructors.items, (item) => {
        const rowItem = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
        return {
          name: String(rowItem.name || ""),
          role: rowItem.role === "inst" ? "inst" : "choreo",
          overlay: String(rowItem.overlay || ""),
          bio: asI18n(rowItem.bio),
          image: String(rowItem.image || ""),
        };
      }),
    },
    pricing: {
      label: asI18n(pricing.label),
      title: asI18n(pricing.title),
      note: asI18n(pricing.note),
      more: asI18n(pricing.more),
    },
    gallery: {
      label: asI18n(gallery.label),
      title: asI18n(gallery.title),
      sub: asI18n(gallery.sub),
      cta: asI18n(gallery.cta),
      hint: asI18n(gallery.hint),
      items: arr(gallery.items, (item) => {
        const rowItem = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
        return {
          src: String(rowItem.src || ""),
          alt: String(rowItem.alt || ""),
          caption: String(rowItem.caption || ""),
        };
      }),
    },
    live: {
      label: asI18n(live.label),
      title: asI18n(live.title),
      sub: asI18n(live.sub),
      sched: asI18n(live.sched),
      now: {
        badge: asI18n(now.badge),
        title: asI18n(now.title),
        desc: asI18n(now.desc),
        href: String(now.href || ""),
        image: String(now.image || ""),
        alt: String(now.alt || ""),
      },
      slots: arr(live.slots, (item) => {
        const rowItem = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
        return {
          when: asI18n(rowItem.when),
          title: asI18n(rowItem.title),
          desc: asI18n(rowItem.desc),
          href: String(rowItem.href || ""),
          image: String(rowItem.image || ""),
          alt: String(rowItem.alt || ""),
        };
      }),
    },
    storiesHead: {
      label: asI18n(storiesHead.label),
      title: asI18n(storiesHead.title),
      sub: asI18n(storiesHead.sub),
      all: asI18n(storiesHead.all),
    },
    branchesHead: {
      label: asI18n(branchesHead.label),
      title: asI18n(branchesHead.title),
      map: asI18n(branchesHead.map),
    },
    faq: {
      label: asI18n(faq.label),
      title: asI18n(faq.title),
      items: arr(faq.items, (item) => {
        const rowItem = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
        return { q: asI18n(rowItem.q), a: asI18n(rowItem.a) };
      }),
    },
    banner: {
      title: asI18n(banner.title),
      sub: asI18n(banner.sub),
      cta: asI18n(banner.cta),
      href: String(banner.href || ""),
    },
    contact: {
      label: asI18n(contact.label),
      title: asI18n(contact.title),
      desc: asI18n(contact.desc),
      box: asI18n(contact.box),
      addressLabel: asI18n(contact.addressLabel),
      addressVal: asI18n(contact.addressVal),
      phoneLabel: asI18n(contact.phoneLabel),
      phone: String(contact.phone || ""),
      phoneHref: String(contact.phoneHref || ""),
      socialLabel: asI18n(contact.socialLabel),
      facebook: String(contact.facebook || ""),
      facebookHref: String(contact.facebookHref || ""),
      hoursLabel: asI18n(contact.hoursLabel),
      hoursVal: asI18n(contact.hoursVal),
      formLead: asI18n(contact.formLead),
      send: asI18n(contact.send),
      zalo: String(contact.zalo || ""),
      tiktok: String(contact.tiktok || ""),
      youtube: String(contact.youtube || ""),
    },
  };
}

/** Seed = copy đang chạy trên site. Chỉ dùng admin / D1 — public không fallback file này. */
export function seedHomepage(): Homepage {
  const form = "https://forms.gle/LUyZiNv2F3Hnu499A";
  const liveHref = "https://www.tiktok.com/@madancestudio/live";
  return {
    version: HOME_VERSION,
    formHref: form,
    hero: {
      videoId: "_sC66dTpGMw",
      line1: i18n("Không cần sân khấu", "No stage needed", "무대는 필요 없다"),
      line2: i18n("để bắt đầu nhảy", "to start dancing", "춤을 시작하기 위해"),
      cta1: i18n("Đăng ký học", "Book a class", "수업 예약"),
      ctaRoom: i18n("Thuê phòng", "Rent a room", "룸 대여"),
      scroll: i18n("SCROLL", "SCROLL", "SCROLL"),
    },
    about: {
      est: i18n("EST. · TP.HCM, VIỆT NAM", "EST. · HO CHI MINH CITY, VIETNAM", "EST. · 호치민, 베트남"),
      title: i18n(
        "Studio nhảy · 3 chi nhánh · khóa tháng cố định",
        "A studio for people who love to move — no stage required",
        "진짜 춤을 좋아하는 사람을 위한 스튜디오 — 무대 불필요",
      ),
      sub: i18n(
        "Đăng ký học · thuê phòng · biên đạo sự kiện",
        "Class booking · room rental · event choreography",
        "수업 등록 · 룸 대여 · 이벤트 안무",
      ),
      impact: [
        { value: "", label: i18n("chi nhánh", "branches", "지점") },
        { value: "", label: i18n("phòng tập", "rooms", "룸") },
        { value: "", label: i18n("styles", "styles", "스타일") },
        { value: "", label: i18n("buổi / khóa", "sessions / course", "회 / 코스") },
      ],
      marquee: [
        "K-POP",
        "HIP-HOP",
        "GIRLS HIP",
        "WAACKING",
        "URBAN",
        "CHOREOGRAPHY",
        "8 BUỔI/THÁNG",
        "STUDIO RENTAL",
      ],
    },
    partner: {
      label: i18n("Đối tác", "Partner", "파트너"),
      title: i18n("MA Dance × The New Gene 2026", "MA Dance × The New Gene 2026", "MA Dance × The New Gene 2026"),
      p1: i18n(
        "Một màn trình diễn ấn tượng không chỉ được tạo nên từ âm nhạc, mà còn từ từng chuyển động, đội hình và cách nghệ sĩ làm chủ sân khấu.",
        "An unforgettable performance is shaped not only by music, but by every move, formation, and how artists own the stage.",
        "인상적인 무대는 음악만으로 완성되지 않습니다. 움직임, 포메이션, 그리고 아티스트가 스테이지를 장악하는 방식에서 만들어집니다.",
      ),
      p2: i18n(
        "Đồng hành cùng The New Gene 2026, MA Dance Studio sẽ góp phần hỗ trợ các thí sinh trong hành trình luyện tập và hoàn thiện phần trình diễn, để mỗi tiết mục không chỉ được nghe, mà còn được nhìn thấy và cảm nhận trọn vẹn trên sân khấu.",
        "Alongside The New Gene 2026, MA Dance Studio will support contestants through training and refining their acts — so each performance is not only heard, but seen and felt fully on stage.",
        "The New Gene 2026과 함께, MA Dance Studio는 참가자들의 연습과 퍼포먼스 완성도를 돕습니다. 각 무대를 듣기만 하는 것이 아니라, 보고 온전히 느낄 수 있도록.",
      ),
      p3: i18n(
        "Từ phòng tập đến ánh đèn sân khấu, cùng chờ đón những màn trình diễn bứt phá tại The New Gene 2026!",
        "From the rehearsal room to the stage lights — get ready for breakthrough performances at The New Gene 2026!",
        "연습실에서 스테이지 조명까지 — The New Gene 2026의 돌파력 있는 무대를 기대해 주세요!",
      ),
      cta: i18n("Xem The New Gene", "Visit The New Gene", "The New Gene 보기"),
      cta2: i18n("Collab với MA", "Collab with MA", "MA와 협업"),
      href: "https://thenewgene.vn/",
      image: "partners/the-new-gene.png",
      imageAlt: "The New Gene",
    },
    clients: {
      label: i18n("Đối tác", "Partners", "파트너"),
      title: i18n("Tin tưởng đồng hành cùng MA", "Trusted alongside MA", "MA와 함께하는 브랜드"),
      sub: i18n(
        "Thương hiệu & tổ chức đã làm việc với studio.",
        "Brands & organizations that work with the studio.",
        "스튜디오와 협업한 브랜드 · 기관.",
      ),
      logos: [
        { src: "partners/clients/thpt-nguyen-huu-tho.png", alt: "THPT Nguyễn Hữu Thọ" },
        { src: "partners/clients/vtv.png", alt: "VTV", screen: true },
        { src: "partners/clients/fpt.png", alt: "FPT", screen: true },
        { src: "partners/clients/dolphin.png", alt: "Dolphin", screen: true },
        { src: "partners/clients/nova-media.svg", alt: "Nova Media" },
        { src: "partners/clients/peak-event.svg", alt: "Peak Event" },
        { src: "partners/clients/urban-stage.svg", alt: "Urban Stage" },
        { src: "partners/clients/pulse-crew.svg", alt: "Pulse Crew" },
        { src: "partners/clients/atelier-k.svg", alt: "Atelier K" },
      ],
    },
    milestones: {
      label: i18n("Dấu ấn", "Milestones", "이정표"),
      title: i18n("Dấu ấn MA", "MA milestones", "MA 이정표"),
      sub: i18n(
        "Cột mốc và cộng đồng làm nên uy tín studio.",
        "Moments and community that build studio trust.",
        "스튜디오 신뢰를 만드는 순간과 커뮤니티.",
      ),
      items: [
        {
          title: i18n("Cuộc thi Be Yourself", "Be Yourself competition", "Be Yourself 대회"),
          desc: i18n(
            "MA tổ chức / đồng hành Be Yourself — sân chơi để dancer thể hiện bản thân trên sàn.",
            "MA hosts / partners Be Yourself — a stage for dancers to show who they are.",
            "MA가 주최·동행하는 Be Yourself — 댄서가 자신을 보여줄 무대.",
          ),
          image: "media/popup-chenchen-champion.jpg",
          alt: "Be Yourself — MA stage",
        },
        {
          title: i18n("Đối tác & truyền thông", "Partners & media", "파트너 & 미디어"),
          desc: i18n(
            "Collab The New Gene Show · hỗ trợ truyền thông ASEAN Culture Ambassador.",
            "Collab with The New Gene Show · media support for ASEAN Culture Ambassador.",
            "The New Gene Show 콜라보 · ASEAN Culture Ambassador 미디어 지원.",
          ),
          image: "media/popup-trunghieu-bts.jpg",
          alt: "MA × The New Gene",
          badgeSrc: "partners/the-new-gene.png",
          badgeLabel: "The New Gene",
        },
        {
          title: i18n("Cộng đồng dancer", "Dancer community", "댄서 커뮤니티"),
          desc: i18n(
            "Kết nối Cộng đồng Dancer Sài Gòn — học, luyện và cháy cùng nhau.",
            "Connected with Saigon Dancer Community — learn, train, and move together.",
            "사이공 댄서 커뮤니티와 연결 — 함께 배우고 연습하고 불타오르다.",
          ),
          image: "media/crew-girlstyle.jpg",
          alt: "Cộng đồng dancer MA",
        },
        {
          title: i18n("Casting & studio", "Casting & studio", "캐스팅 & 스튜디오"),
          desc: i18n(
            "Tuyển giảng viên / dancer tại studio — 436A/101 Đường 3/2 (Q10), 522/1 Phan Xích Long (PN), 02 Hồ Xuân Hương (Q3).",
            "Instructor / dancer casting — 436A/101 Duong 3/2 (D10), 522/1 Phan Xich Long (PN), 02 Ho Xuan Huong (D3).",
            "강사·댄서 캐스팅 — 436A/101 Đường 3/2 (10군), 522/1 Phan Xích Long (푸년), 02 Hồ Xuân Hương (3군).",
          ),
          image: "media/crew-bts-popup.jpg",
          alt: "Casting & studio MA",
        },
      ],
    },
    services: {
      label: i18n("Dịch vụ", "Services", "서비스"),
      title: i18n("Ba trụ cột của MA", "Three pillars of MA", "MA의 세 기둥"),
      items: [
        {
          title: i18n("Học nhảy theo khóa tháng", "K-Pop classes", "K-Pop 수업"),
          desc: i18n(
            "Chọn chi nhánh, style và level Begin / Inter / Advance. Mỗi khóa 8 buổi cố định trong tháng — giữ chỗ online, studio xác nhận qua Zalo.",
            "One-day classes for every level. Choreo from hot MVs, viral challenges, and original MA work.",
            "모든 레벨 원데이. 핫 MV, 바이럴 챌린지, MA 오리지널 안무.",
          ),
          link: i18n("Xem khóa →", "View classes →", "클래스 보기 →"),
          href: "/classes/",
          image: "media/popup-eira-choom.jpg",
          alt: "Học nhảy theo khóa tháng tại MA",
        },
        {
          title: i18n("Thuê phòng studio", "Studio rental", "스튜디오 대여"),
          desc: i18n(
            "Nhiều phòng tại Quận 10, Quận 3 và Phú Nhuận. Thuê theo giờ cho team cover, luyện tập hoặc quay video.",
            "Modern rooms: full mirrors, strong sound, A/C. Hourly rental for teams or individuals.",
            "풀 미러, 강력한 사운드, 에어컨. 팀·개인 시간제 대여.",
          ),
          link: i18n("Xem phòng →", "Book room →", "룸 예약 →"),
          href: "/rooms/",
          image: "media/crew-bts-popup.jpg",
          alt: "Thuê phòng studio MA",
        },
        {
          title: i18n("Biên đạo & sự kiện", "Choreography & events", "안무 & 이벤트"),
          desc: i18n(
            "Choreography cho cá nhân, team, brand event và MV cover — gửi brief, team MA tư vấn.",
            "Choreo for individuals, teams, brand events, MV covers. MA team is ready to produce.",
            "개인·팀·브랜드 이벤트·MV 커버 안무. MA 팀이 제작합니다.",
          ),
          link: i18n("Gửi brief →", "Consult →", "상담 →"),
          href: "/events/",
          image: "media/popup-chenchen-champion.jpg",
          alt: "Biên đạo và sự kiện MA",
        },
      ],
    },
    styles: {
      label: i18n("Catalog", "Catalog", "Catalog"),
      title: i18n("Khám phá đam mê theo style", "Explore styles", "스타일로 열정 찾기"),
      sub: i18n(
        "Từ K-Pop đến street — chọn vibe của bạn.",
        "From K-Pop to street — pick your vibe.",
        "K-Pop부터 스트리트까지 — 바이브를 고르세요.",
      ),
      items: [
        { name: "HIP-HOP", image: "media/popup-ache-lies.jpg" },
        { name: "K-POP", image: "media/popup-eira-choom.jpg" },
        { name: "GIRLS HIP", image: "media/crew-girlstyle.jpg" },
        { name: "WAACKING", image: "media/popup-vichu-iconic.jpg" },
        { name: "URBAN", image: "media/crew-bts-popup.jpg" },
        { name: "COVER", image: "media/brand-figure.jpg" },
      ],
    },
    classes: {
      label: i18n("Level", "Programs", "프로그램"),
      title: i18n("Begin · Inter · Advance", "Pick your level", "레벨 선택"),
      hint: i18n("← Kéo ngang xem level →", "← Drag / scroll sideways to see more →", "← 가로로 스크롤하여 더 보기 →"),
      items: [
        {
          tag: "BEGIN",
          title: i18n("Begin", "Step by MA", "Step by MA"),
          desc: i18n(
            "Dành cho người mới — nhịp rõ, vào lớp đúng level Begin.",
            "Never danced? Slow pace, clear breakdowns, focus on fun and body feel.",
            "완전 초보? 느린 템포, 명확한 설명, 재미와 감각에 집중.",
          ),
          meta: i18n("8 buổi / tháng", "80 min / class", "80분 / 수업"),
          extra: i18n("Cơ bản", "Absolute beginner", "완전 초급"),
          href: "/classes/",
          link: i18n("Xem khóa →", "View classes →", "클래스 보기 →"),
        },
        {
          tag: "INTER",
          title: i18n("Inter", "Starter", "Starter"),
          desc: i18n(
            "Đã có nền — kỹ thuật chắc hơn, bắt nhịp nhanh.",
            "Some basics already. Diverse moves + full choreo a step above Beginner.",
            "기본이 조금 있는 분. 다양한 동작 + 비기너보다 한 단계 높은 풀 안무.",
          ),
          meta: i18n("8 buổi / tháng", "80 min / class", "80분 / 수업"),
          extra: i18n("Trung cấp", "Beginner+", "초급+"),
          href: "/classes/",
          link: i18n("Xem khóa →", "View classes →", "클래스 보기 →"),
        },
        {
          tag: "ADVANCE",
          title: i18n("Advance", "Learner", "Learner"),
          desc: i18n(
            "Intensity cao — choreo khó, performance quality.",
            "Build technique, pick up faster, own the full track in 1–2 sessions.",
            "기술 강화, 빠른 습득, 1–2회에 풀 트랙 마스터.",
          ),
          meta: i18n("8 buổi / tháng", "80 min / class", "80분 / 수업"),
          extra: i18n("Nâng cao", "Intermediate", "중급"),
          href: "/classes/",
          link: i18n("Xem khóa →", "View classes →", "클래스 보기 →"),
        },
        {
          tag: "KHÓA THÁNG",
          title: i18n("Khóa tháng", "Master", "Master"),
          desc: i18n(
            "8 buổi cố định / tháng · cố định chi nhánh · phòng linh hoạt.",
            "Harder choreo, performance quality, detail & musicality. For serious dancers.",
            "어려운 안무, 퍼포먼스 퀄리티, 디테일 & 뮤지컬리티.",
          ),
          meta: i18n("Cố định khung giờ", "80–90 min", "80–90분"),
          extra: i18n("Gói học phí", "Advanced", "고급"),
          href: "/packages/",
          link: i18n("Xem đủ gói 1 · 3 · 6 · 12 tháng →", "View classes →", "클래스 보기 →"),
        },
        {
          tag: "",
          title: i18n("Chưa biết chọn khóa?", "Not sure which level?", "레벨을 모르겠다면?"),
          desc: i18n(
            "Xem catalog hoặc form đăng ký — team xác nhận Zalo.",
            "Message MA — we'll recommend the right class in 2 minutes.",
            "MA에 메시지 — 2분 안에 맞는 클래스를 추천합니다.",
          ),
          meta: emptyI18n(),
          extra: emptyI18n(),
          href: form,
          link: i18n("Đăng ký học", "Book a class", "수업 예약"),
          cta: true,
        },
      ],
    },
    instructors: {
      label: i18n("Giảng viên", "Instructors", "강사"),
      title: i18n("Người đứng lớp cùng bạn", "The people on the floor with you", "함께 서는 사람들"),
      roleChoreo: i18n("Choreographer", "Choreographer", "안무가"),
      roleInst: i18n("Instructor", "Instructor", "강사"),
      items: [
        {
          name: "HYE",
          role: "choreo",
          overlay: "K-Pop · Hip-Hop",
          image: "media/inst-trhieu.jpg",
          bio: i18n(
            "K-Pop · Hip-Hop — breakdown rõ, đúng count.",
            "K-Pop · Hip-Hop — clear counts, stage-ready breakdowns.",
            "K-Pop · Hip-Hop — 카운트 명확, 스테이지 브레이크다운.",
          ),
        },
        {
          name: "MIN",
          role: "choreo",
          overlay: "Girls Hip · Waacking",
          image: "media/popup-trunghieu-vansu.jpg",
          bio: i18n(
            "Girls Hip · Waacking — vibe mạnh, vào nhạc nhanh.",
            "Girls Hip · Waacking — strong vibe, quick musicality.",
            "Girls Hip · Waacking — 강한 바이브, 빠른 뮤지컬리티.",
          ),
        },
        {
          name: "JIN",
          role: "inst",
          overlay: "Urban · Popping",
          image: "media/popup-ache-lies.jpg",
          bio: i18n(
            "Urban · Popping — kỹ thuật sạch, foundation chắc.",
            "Urban · Popping — clean technique, solid foundation.",
            "Urban · Popping — 클린 테크닉, 단단한 기초.",
          ),
        },
        {
          name: "SOO",
          role: "inst",
          overlay: "K-Pop · Contemporary",
          image: "media/crew-girlstyle-aliyah.jpg",
          bio: i18n(
            "K-Pop · Contemporary — cảm nhạc, line mềm.",
            "K-Pop · Contemporary — musical lines, soft control.",
            "K-Pop · Contemporary — 음악적 라인, 부드러운 컨트롤.",
          ),
        },
        {
          name: "KAI",
          role: "choreo",
          overlay: "K-Pop · Cover",
          image: "media/popup-eira-choom.jpg",
          bio: i18n(
            "K-Pop · Cover — formation gọn, vào cam rõ.",
            "K-Pop · Cover — tight formations, camera-ready.",
            "K-Pop · Cover — 포메이션 정돈, 카메라 대비.",
          ),
        },
        {
          name: "REN",
          role: "inst",
          overlay: "Waacking · Hip-Hop",
          image: "media/popup-vichu-iconic.jpg",
          bio: i18n(
            "Waacking · Hip-Hop — tay sắc, groove chắc.",
            "Waacking · Hip-Hop — sharp arms, solid groove.",
            "Waacking · Hip-Hop — 샤프한 암, 단단한 그루브.",
          ),
        },
        {
          name: "YUNA",
          role: "inst",
          overlay: "Girls Hip · Urban",
          image: "media/crew-bts-popup.jpg",
          bio: i18n(
            "Girls Hip · Urban — energy lớp, dễ bắt nhịp.",
            "Girls Hip · Urban — class energy, easy to follow.",
            "Girls Hip · Urban — 클래스 에너지, 따라하기 쉬움.",
          ),
        },
        {
          name: "LEO",
          role: "choreo",
          overlay: "Hip-Hop · Locking",
          image: "media/popup-chenchen-champion.jpg",
          bio: i18n(
            "Hip-Hop · Locking — pocket rõ, foundation street.",
            "Hip-Hop · Locking — clear pocket, street foundation.",
            "Hip-Hop · Locking — 명확한 포켓, 스트리트 기초.",
          ),
        },
      ],
    },
    pricing: {
      label: i18n("Gói học phí", "Pricing", "요금"),
      title: i18n("Thu theo gói · 8 buổi/tháng", "Monthly packs · 8 sessions", "월 패키지 · 8회"),
      note: i18n(
        "Giá xác nhận qua Zalo. Gói ≥ 3 tháng tặng bảo lưu · 6–12 tháng có cọc.",
        "Price confirmed on Zalo. 3+ months include hold · 6–12 months may need a deposit.",
        "가격은 Zalo로 확인. 3개월 이상 홀드 포함 · 6–12개월은 보증금 가능.",
      ),
      more: i18n(
        "Xem đủ gói 1 · 3 · 6 · 12 tháng →",
        "See all 1 · 3 · 6 · 12 month packs →",
        "1 · 3 · 6 · 12개월 패키지 전체 →",
      ),
    },
    gallery: {
      label: i18n("Studio", "Studio", "스튜디오"),
      title: i18n("Không gian 3 chi nhánh", "Rooms across 3 branches", "3개 지점 공간"),
      sub: i18n(
        "Q10 · Q3 · Phú Nhuận — ảnh phòng thật. Bấm để xem lớn.",
        "D10 · D3 · Phu Nhuan — real studio photos. Tap to enlarge.",
        "10군 · 3군 · 푸년 — 실제 룸 사진. 눌러서 확대.",
      ),
      cta: i18n("Thuê phòng", "Rent a room", "룸 대여"),
      hint: i18n("Chạm", "Tap", "탭"),
      items: [
        { src: "media/studio-01.jpg", alt: "Phòng tập MA — tường logo, sàn gỗ tối, đèn warm", caption: "Logo wall" },
        { src: "media/studio-02.jpg", alt: "Phòng tập MA — gương full, sàn gỗ sáng", caption: "Daylight" },
        { src: "media/studio-03.jpg", alt: "Phòng tập MA — không gian rộng, cửa sổ city view", caption: "Wide room" },
        { src: "media/studio-04.jpg", alt: "Phòng tập MA — gương + logo tường xám", caption: "Mirror" },
        { src: "media/studio-05.jpg", alt: "Phòng tập MA — LED xanh dọc gương", caption: "Blue LED" },
        { src: "media/studio-06.jpg", alt: "Phòng tập MA — black box, logo trắng", caption: "Black box" },
        { src: "media/studio-07.jpg", alt: "Phòng tập MA — tường đen, hàng đèn trần", caption: "Dark room" },
        { src: "media/studio-08.jpg", alt: "Phòng tập MA — mood tối, rèm cửa sổ", caption: "Mood" },
      ],
    },
    live: {
      label: i18n("TikTok", "TikTok", "TikTok"),
      title: i18n("Livestream MA", "MA livestream", "MA 라이브"),
      sub: i18n(
        "Xem live trên TikTok — web hoặc app.",
        "Watch on TikTok — web or app.",
        "TikTok에서 시청 — 웹 또는 앱.",
      ),
      sched: i18n("Lịch live", "Live schedule", "라이브 일정"),
      now: {
        badge: i18n("TikTok Live", "TikTok Live", "TikTok Live"),
        title: i18n("Mở livestream", "Open livestream", "라이브 열기"),
        desc: i18n(
          "Chạm để xem trên TikTok @madancestudio.",
          "Tap to watch on TikTok @madancestudio.",
          "TikTok @madancestudio에서 시청하세요.",
        ),
        href: liveHref,
        image: "media/crew-bts-popup.jpg",
        alt: "Livestream TikTok MA Dance Studio",
      },
      slots: [
        {
          when: i18n("T3 · 20:00", "Tue · 20:00", "화 · 20:00"),
          title: i18n("Cover night", "Cover night", "커버 나이트"),
          desc: i18n("Choreo cover · vibe studio", "Cover choreo · studio vibe", "커버 안무 · 스튜디오 바이브"),
          href: liveHref,
          image: "media/popup-chuoi-ngayther.jpg",
          alt: "Lịch live Cover night — MA Dance",
        },
        {
          when: i18n("T6 · 20:00", "Fri · 20:00", "금 · 20:00"),
          title: i18n("Class recap", "Class recap", "클래스 리캡"),
          desc: i18n(
            "Highlight buổi học trong tuần",
            "Highlights from this week's classes",
            "이번 주 수업 하이라이트",
          ),
          href: liveHref,
          image: "media/crew-girlstyle.jpg",
          alt: "Lịch live Class recap — MA Dance",
        },
        {
          when: i18n("CN · 16:00", "Sun · 16:00", "일 · 16:00"),
          title: i18n("Collab / Q&A", "Collab / Q&A", "콜라보 / Q&A"),
          desc: i18n("Guest · hỏi đáp", "Guest · Q&A", "게스트 · 질의응답"),
          href: liveHref,
          image: "media/popup-chenchen-champion.jpg",
          alt: "Lịch live Collab / Q&A — MA Dance",
        },
      ],
    },
    storiesHead: {
      label: i18n("Stories", "Stories", "Stories"),
      title: i18n("Chia sẻ từ studio", "From the studio", "스튜디오 이야기"),
      sub: i18n(
        "TikTok · YouTube · case studio — bấm để đọc hoặc xem clip.",
        "TikTok · YouTube · studio notes — read or watch.",
        "TikTok · YouTube · 스튜디오 노트.",
      ),
      all: i18n("Xem tất cả stories →", "All stories →", "스토리 전체 →"),
    },
    branchesHead: {
      label: i18n("Cơ sở", "Locations", "지점"),
      title: i18n("Chi nhánh MA", "MA branches", "MA 지점"),
      map: i18n("Mở Maps →", "Open Maps →", "Maps 열기 →"),
    },
    faq: {
      label: i18n("FAQ", "FAQ", "FAQ"),
      title: i18n("Câu hỏi thường gặp", "Common questions", "자주 묻는 질문"),
      items: [
        {
          q: i18n("Mới bắt đầu học level nào?", "Can complete beginners join?", "완전 초보도 가능한가요?"),
          a: i18n(
            "Begin. Nhận giữa khóa dừng từ buổi 4–5 theo rule MA.",
            "Yes. Step by MA and Starter are for new dancers. Slow breakdowns, focus on fun and feel.",
            "네. Step by MA와 Starter는 초보자를 위한 수업입니다.",
          ),
        },
        {
          q: i18n("Một khóa tháng bao nhiêu buổi?", "How long is a class?", "수업 시간은?"),
          a: i18n(
            "8 buổi cố định trong tháng theo ngày KG–KT. Lịch tuần cố định cả khóa.",
            "Usually 80 minutes. Pro/Popup may be 90. Arrive 10 minutes early.",
            "보통 80분. Pro/Popup은 90분일 수 있습니다. 10분 일찍 와 주세요.",
          ),
        },
        {
          q: i18n("Đăng ký trên web là vào lớp luôn?", "Do I need to book ahead?", "사전 예약이 필요한가요?"),
          a: i18n(
            "Chưa. Form = yêu cầu giữ chỗ. Studio xác nhận sĩ số và gói qua Zalo.",
            "Yes, preferably. Slots often fill 1–2 days ahead. Use the Google Form or message Zalo 076 466 9969.",
            "네. 보통 1–2일 전 마감됩니다. Google Form 또는 Zalo 076 466 9969로 예약하세요.",
          ),
        },
        {
          q: i18n("Có thuê phòng riêng không?", "Can I rent a private room?", "개인 룸 대여가 되나요?"),
          a: i18n(
            "Có. Nhiều phòng / 3 CN. Book khi không chồng lịch khóa. Giá/giờ: Liên hệ.",
            "Yes. Rooms A/B by the hour — great for cover teams, practice, video shoots.",
            "네. 룸 A/B 시간제 — 커버 팀, 연습, 촬영에 적합합니다.",
          ),
        },
        {
          q: i18n("Nghỉ buổi có học bù không?", "What should I bring?", "무엇을 가져가야 하나요?"),
          a: i18n(
            "Không học bù. Điểm danh trừ buổi. Nghỉ dài → xin bảo lưu (gói ≥ 3 tháng tặng BL).",
            "Comfortable sportswear, clean shoes, water. Lockers and changing rooms available.",
            "편한 운동복, 깨끗한 신발, 물. 락커와 탈의실이 있습니다.",
          ),
        },
      ],
    },
    banner: {
      title: i18n("Sẵn sàng ghi danh?", "Ready to hit the floor?", "무대에 설 준비 됐나요?"),
      sub: i18n(
        "Chọn khóa → chọn gói → form → xác nhận Zalo.",
        "Pick one class → show up → dance hard. No experience needed.",
        "수업 하나 고르고 → 와서 → 힘껏 추세요.",
      ),
      cta: i18n("Đăng ký học", "Book your first class", "첫 수업 예약"),
      href: form,
    },
    contact: {
      label: i18n("Liên hệ", "Contact", "문의"),
      title: i18n("Nhắn để giữ chỗ", "Message to hold a spot", "자리 예약 메시지"),
      desc: i18n(
        "Gửi form hoặc nhắn Zalo. Team confirm lịch trong 1–2 giờ.",
        "Register via Google Form or message Zalo 076 466 9969. We confirm within 1–2 hours.",
        "Google Form 또는 Zalo 076 466 9969. 1–2시간 내 확인합니다.",
      ),
      box: i18n("Thông tin liên hệ", "Contact details", "연락처 정보"),
      addressLabel: i18n("Địa chỉ", "Address", "주소"),
      addressVal: i18n(
        "CN1: 436A/101 Đường 3/2, Q10 · CN2: 522/1 Phan Xích Long, PN · CN3: 02 Hồ Xuân Hương, Q3",
        "CN1: 436A/101 Duong 3/2, D10 · CN2: 522/1 Phan Xich Long, PN · CN3: 02 Ho Xuan Huong, D3",
        "CN1: 436A/101 Đường 3/2, 10군 · CN2: 522/1 Phan Xích Long, 푸년 · CN3: 02 Hồ Xuân Hương, 3군",
      ),
      phoneLabel: i18n("Zalo / Phone", "Zalo / Phone", "Zalo / 전화"),
      phone: "076 466 9969",
      phoneHref: "tel:+84764669969",
      socialLabel: i18n("Facebook", "Facebook", "Facebook"),
      facebook: "ma.dance.stu",
      facebookHref: "https://www.facebook.com/ma.dance.stu",
      hoursLabel: i18n("Giờ mở cửa", "Hours", "운영시간"),
      hoursVal: i18n("T2 – CN: 09:00 – 22:00", "Mon – Sun: 09:00 – 22:00", "월 – 일: 09:00 – 22:00"),
      formLead: i18n(
        "Mở form đăng ký chính thức — studio xác nhận qua Zalo.",
        "Register for classes / Summer Deal via MA’s official form.",
        "MA 공식 Google Form으로 클래스 / Summer Deal 등록하세요.",
      ),
      send: i18n("Đăng ký học", "Register now", "지금 등록"),
      zalo: "https://zalo.me/0764669969",
      tiktok: "https://www.tiktok.com/@madancestudio",
      youtube: "https://youtube.com/@madancestudio",
    },
  };
}
