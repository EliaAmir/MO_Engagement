/* ============================================================================
   content.ts — single source of truth for every string, EN + AR.
   No component should hardcode copy; everything reads from here.
============================================================================ */

export type Lang = "en" | "ar";

export const LANGS: readonly Lang[] = ["en", "ar"] as const;

export type Dir = "ltr" | "rtl";

export const langDir = (lang: Lang): Dir => (lang === "ar" ? "rtl" : "ltr");

/* ----- Event data (language-neutral) ----------------------------------- */
export const EVENT = {
  couple: { en: "Onur & Marina", ar: "اونور ومارينا" },
  firstPerson: { en: "Onur", ar: "اونور" },
  secondPerson: { en: "Marina", ar: "مارينا" },
  monogram: "O&M",
  type: { en: "Engagement Party", ar: "حفل الخطوبة" },
  dateLong: {
    en: "Sunday, September 13, 2026",
    ar: "الأحد، ١٣ سبتمبر ٢٠٢٦",
  },
  dateShort: { en: "13.09.2026", ar: "١٣٫٠٩٫٢٠٢٦" },
  time: { en: "7:00 PM", ar: "الساعة ٧:٠٠ مساءً" },
  timeShort: { en: "19:00", ar: "١٩:٠٠" },
  /** Local-time anchor (no timezone offset) for the countdown + calendar */
  iso: "2026-09-13T19:00:00",
  venue: { en: "Dar Gardenia Wedding Halls", ar: "قاعات دار جاردينيا للأفراح" },
  hall: { en: "Tulip Hall", ar: "قاعة التيوليب" },
  address: {
    en: "Dar El Harb El Kimiya, El Thawra Street, right after El Geish Bridge, Cairo, Egypt",
    ar: "دار الحرب الكيميائية امتداد شارع الثورة بعد كوبري الجيش مباشرةً، القاهرة، مصر",
  },
  /** Exact Google Maps place URL for the venue */
  mapsUrl: "https://maps.app.goo.gl/8cNo39q8UpjYsafu9?g_st=ic",
  /** Exact venue coordinates — pin the embed + route directions here */
  mapsCoord: { lat: 30.0796643, lng: 31.3996781 },
  calendarTitle: "Onur & Marina — Engagement Party",
} as const;

/* ----- Dress-code palette (DressCode component only) -------------------- */
export type SwatchColor =
  | { type: "hex"; value: string }
  | { type: "image"; src: string };

export type SwatchRow = {
  id: string;
  label: { en: string; ar: string };
  colors: readonly SwatchColor[];
};

export const DRESS_CODE: readonly SwatchRow[] = [
  {
    id: "warm-neutrals",
    label: { en: "Warm Neutrals", ar: "محايد دافئ" },
    colors: [
      { type: "hex", value: "#A58C74" },
      { type: "hex", value: "#BC8B56" },
      { type: "hex", value: "#84614F" },
    ],
  },
  {
    id: "deep-browns",
    label: { en: "Deep Browns", ar: "بنّي عميق" },
    colors: [
      { type: "hex", value: "#66463d" },
      { type: "hex", value: "#4f3129" },
      { type: "hex", value: "#522518" },
      { type: "hex", value: "#240e08" },
      { type: "hex", value: "#543128" },
    ],
  },
  {
    id: "reds-wine",
    label: { en: "Reds & Wine", ar: "أحمر نبيذي" },
    colors: [
      { type: "hex", value: "#5e1111" },
      { type: "hex", value: "#470505" },
      { type: "hex", value: "#7a1515" },
      { type: "hex", value: "#7d0e0e" },
    ],
  },
  {
    id: "greens",
    label: { en: "Greens", ar: "أخضر" },
    colors: [
      { type: "hex", value: "#4c5c1d" },
      { type: "hex", value: "#303b0e" },
      { type: "hex", value: "#2d331b" },
      { type: "hex", value: "#093009" },
    ],
  },
  {
    id: "golds",
    label: { en: "Warm Yellows", ar: "أصفر دافئ" },
    colors: [
      { type: "hex", value: "#9c6e3e" },
      { type: "hex", value: "#cca985" },
      { type: "hex", value: "#ab8359" },
      { type: "hex", value: "#7d5b37" },
      { type: "hex", value: "#967047" },
      { type: "image", src: "/dress-swatch.jpeg" },
    ],
  },
  {
    id: "blacks",
    label: { en: "Blacks", ar: "أسود" },
    colors: [
      { type: "hex", value: "#0F0F0F" },
    ],
  },
] as const;

/* ----- Bilingual UI dictionary ----------------------------------------- */
export type Dict = {
  meta: {
    htmlLang: string;
    title: string;
    description: string;
  };
  nav: {
    story: string;
    details: string;
    dressCode: string;
    rsvp: string;
    guestbook: string;
    calendar: string;
    langToggle: string;
    langToggleLong: string;
  };
  preloader: {
    tagline: string;
    loading: string;
    enter: string;
  };
  envelope: {
    hint: string;
    cardEyebrow: string;
    cardHeadline: string;
    cardTo: string;
    cardCouple: string;
    cardBody: string;
    cardSignoff: string;
    photoAlt: string;
  };
  hero: {
    eyebrow: string;
    scroll: string;
    cta: string;
  };
  story: {
    eyebrow: string;
    title: string;
    lines: string[];
    closing: string;
  };
  details: {
    eyebrow: string;
    title: string;
    venueLabel: string;
    hallLabel: string;
    dateLabel: string;
    timeLabel: string;
    addressLabel: string;
    maps: string;
    directions: string;
  };
  dress: {
    eyebrow: string;
    title: string;
    note: string;
    swatchLabel: string;
  };
  rsvp: {
    eyebrow: string;
    title: string;
    intro: string;
    nameLabel: string;
    namePlaceholder: string;
    guestsLabel: string;
    guestsHint: string;
    guestNameLabel: (n: number) => string;
    guestNamePlaceholder: (n: number) => string;
    submit: string;
    submitting: string;
    confirmation: (name: string, total: number) => string;
    edit: string;
    requiredName: string;
  };
  guestbook: {
    eyebrow: string;
    title: string;
    intro: string;
    nameLabel: string;
    namePlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submit: string;
    submitting: string;
    empty: string;
    countOne: string;
    countMany: (n: number) => string;
    requiredName: string;
    requiredMessage: string;
    charsLeft: (n: number) => string;
  };
  music: {
    ariaOn: string;
    ariaOff: string;
  };
  calendar: {
    eyebrow: string;
    title: string;
    intro: string;
    google: string;
    apple: string;
    download: string;
  };
  countdown: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
    label: string;
    happened: string;
  };
  footer: {
    names: string;
    rights: string;
    madeWith: string;
    backToTop: string;
  };
  admin: {
    title: string;
    subtitle: string;
    backHome: string;
    lockedTitle: string;
    lockedHint: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    enter: string;
    wrongPassword: string;
    logout: string;
    statRsvp: string;
    statGuests: string;
    searchPlaceholder: string;
    exportCsv: string;
    clearAll: string;
    confirmClear: string;
    cancel: string;
    empty: string;
    colName: string;
    colGuests: string;
    colWhen: string;
    colActions: string;
    deleteOne: string;
  };
};

export const CONTENT: Record<Lang, Dict> = {
  en: {
    meta: {
      htmlLang: "en",
      title: "Onur & Marina — Engagement Invitation",
      description:
        "You are cordially invited to the engagement of Onur & Marina, Sunday, September 13, 2026 at 7:00 PM, Dar Gardenia Wedding Halls, Cairo.",
    },
    nav: {
      story: "Story",
      details: "Details",
      dressCode: "Dress Code",
      rsvp: "RSVP",
      guestbook: "Wishes",
      calendar: "Calendar",
      langToggle: "العربية",
      langToggleLong: "Switch to Arabic",
    },
    preloader: {
      tagline: "An Invitation",
      loading: "Preparing your invitation",
      enter: "Onur & Marina",
    },
    envelope: {
      hint: "Scroll to open",
      cardEyebrow: "Together with their families",
      cardHeadline: "are getting engaged",
      cardTo: "Request the honour of your presence as",
      cardCouple: "Onur & Marina",
      cardBody:
        "Sunday the 13th of September, 2026 at 7:00 PM",
      cardSignoff: "Dar Gardenia Wedding Halls · Tulip Hall · Cairo",
      photoAlt: "Portrait of Onur and Marina",
    },
    hero: {
      eyebrow: "The Engagement Of",
      scroll: "Scroll to begin",
      cta: "Open the invitation",
    },
    story: {
      eyebrow: "Their Story",
      title: "A Spark That Refused to Fade",
      lines: [
        "One promise.",
        "A thousand tomorrows",
        "",
        "The wait is almost over.",
        "The story is just beginning.",
      ],
      closing: "Onur & Marina",
    },
    details: {
      eyebrow: "When & Where",
      title: "Event Details",
      venueLabel: "Venue",
      hallLabel: "Hall",
      dateLabel: "Date",
      timeLabel: "Time",
      addressLabel: "Address",
      maps: "View on Map",
      directions: "Get Directions",
    },
    dress: {
      eyebrow: "Style Guide",
      title: "Dress Code",
      note: "Warm, earthy elegance — rich neutrals, deep browns, wine-reds, hunter greens, and burnished golds. We would love for you to weave these tones into your ensemble. No bright neons, please.",
      swatchLabel: "Tap a shade to copy its hex",
    },
    rsvp: {
      eyebrow: "Kindly Respond",
      title: "Will You Join Us?",
      intro: "Let us know if you can make it, and how many seats to reserve.",
      nameLabel: "Your Name",
      namePlaceholder: "Enter your full name",
      guestsLabel: "Extra Guests",
      guestsHint: "How many will accompany you? (0–3)",
      guestNameLabel: (n) => `Guest ${n}`,
      guestNamePlaceholder: (n) => `Guest ${n} name`,
      submit: "Confirm Attendance",
      submitting: "Saving…",
      confirmation: (name, total) =>
        `We've reserved ${total} seat${total === 1 ? "" : "s"} for you, ${name}.`,
      edit: "Edit response",
      requiredName: "Please enter your name to continue.",
    },
    guestbook: {
      eyebrow: "Guestbook",
      title: "Leave a Wish",
      intro: "Share a note, a blessing, or a memory for Onur & Marina.",
      nameLabel: "Your Name",
      namePlaceholder: "Enter your name",
      messageLabel: "Your Wish",
      messagePlaceholder: "Write a few words for the couple…",
      submit: "Sign the Guestbook",
      submitting: "Saving…",
      empty: "Be the first to leave a wish.",
      countOne: "1 wish",
      countMany: (n) => `${n} wishes`,
      requiredName: "Please enter your name.",
      requiredMessage: "Please write a short wish.",
      charsLeft: (n) => `${n} characters left`,
    },
    music: {
      ariaOn: "Mute ambient music",
      ariaOff: "Play ambient music",
    },
    calendar: {
      eyebrow: "Save the Date",
      title: "Add to Calendar",
      intro: "Keep this evening close — add it to your calendar in a single tap.",
      google: "Google Calendar",
      apple: "Apple Calendar (.ics)",
      download: "Download .ics",
    },
    countdown: {
      days: "Days",
      hours: "Hours",
      minutes: "Minutes",
      seconds: "Seconds",
      label: "Until forever begins",
      happened: "Forever has begun",
    },
    footer: {
      names: "Onur & Marina",
      rights: "Engagement · September 13, 2026",
      madeWith: "With love, forever.",
      backToTop: "Back to top",
    },
    admin: {
      title: "RSVP Dashboard",
      subtitle: "Onur & Marina — Engagement",
      backHome: "Back to invitation",
      lockedTitle: "Private",
      lockedHint: "Enter the access code to view responses.",
      passwordLabel: "Access code",
      passwordPlaceholder: "Enter code",
      enter: "Unlock",
      wrongPassword: "Incorrect code. Please try again.",
      logout: "Lock",
      statRsvp: "Responses",
      statGuests: "Total Guests",
      searchPlaceholder: "Search by name…",
      exportCsv: "Export CSV",
      clearAll: "Clear all",
      confirmClear: "Delete every response? This cannot be undone.",
      cancel: "Cancel",
      empty: "No responses yet. They will appear here automatically.",
      colName: "Name",
      colGuests: "Guests",
      colWhen: "Received",
      colActions: "",
      deleteOne: "Delete",
    },
  },
  ar: {
    meta: {
      htmlLang: "ar",
      title: "اونور ومارينا — دعوة الخطوبة",
      description:
        "يسعدنا أن ندعوك لحضور خطوبة اونور ومارينا، يوم الأحد ١٣ سبتمبر ٢٠٢٦ الساعة ٧:٠٠ مساءً، قاعات دار جاردينيا للأفراح، القاهرة.",
    },
    nav: {
      story: "قصتنا",
      details: "التفاصيل",
      dressCode: "ملابس",
      rsvp: "تأكيد الحضور",
      guestbook: "تمنيات",
      calendar: "التقويم",
      langToggle: "English",
      langToggleLong: "التبديل إلى الإنجليزية",
    },
    preloader: {
      tagline: "دعوة",
      loading: "نُجهّز دعوتك",
      enter: "اونور ومارينا",
    },
    envelope: {
      hint: "مرّر للفتح",
      cardEyebrow: "مع عائلتَيْهما",
      cardHeadline: "يخطِبان",
      cardTo: "يَطْلبان شرف حضورك",
      cardCouple: "اونور ومارينا",
      cardBody: "الأحد، الثالث عشر من سبتمبر، ألفان وستة وعشرون — السابعة مساءً.",
      cardSignoff: "قاعات دار جاردينيا · قاعة التيوليب · القاهرة",
      photoAlt: "صورة لاونور ومارينا",
    },
    hero: {
      eyebrow: "خطوبة",
      scroll: "مرّر للبدء",
      cta: "افتح الدعوة",
    },
    story: {
      eyebrow: "قصتهما",
      title: "شرارة أبت أن تخبو",
      lines: [
        "بعض القصص تبدأ بنظرة.",
        "قصتهما بدأت بشرارة أبت أن تخبو",
        "— عبر المدن والفصول وكل ما بينهما.",
        "في ١٣ سبتمبر، يدعوانك لتكون شاهداً",
        "على اللحظة التي تصبح فيها إلى الأبد.",
      ],
      closing: "اونور ومارينا",
    },
    details: {
      eyebrow: "الموعد والمكان",
      title: "تفاصيل الحفل",
      venueLabel: "المكان",
      hallLabel: "القاعة",
      dateLabel: "التاريخ",
      timeLabel: "الوقت",
      addressLabel: "العنوان",
      maps: "اعرض على الخريطة",
      directions: "احصل على الاتجاهات",
    },
    dress: {
      eyebrow: "دليل الأناقة",
      title: "ملابس الحفل",
      note: "أناقة دافئة ترابية — مستوحاة من المحايدات الغنية، والبُنّي العميق، والأحمر النبيذي، والأخضر الداكن، والذهب المصقول. يسعدنا أن تُدمج هذه الدرجات في إطلالتك. نرجو تجنّب الألوان النيون الزاهية.",
      swatchLabel: "اضغط على اللون لنسخ درجته",
    },
    rsvp: {
      eyebrow: "أكد الحضور",
      title: "هل ستكون معنا؟",
      intro: "أخبرنا إن استطعت الحضور، وكم مقعداً نحجز لك.",
      nameLabel: "اسمك",
      namePlaceholder: "أدخل اسمك الكامل",
      guestsLabel: "مدعوون إضافيون",
      guestsHint: "كم شخصاً سيكون معك؟ (٠–٣)",
      guestNameLabel: (n) => `الضيف ${n}`,
      guestNamePlaceholder: (n) => `اسم الضيف ${n}`,
      submit: "أكّد الحضور",
      submitting: "جارٍ الحفظ…",
      confirmation: (name, total) =>
        `لقد حجزنا ${total} مقعداً لك، ${name}.`,
      edit: "تعديل الرد",
      requiredName: "من فضلك أدخل اسمك للمتابعة.",
    },
    guestbook: {
      eyebrow: "دفتر الزوار",
      title: "اترك أمنية",
      intro: "شارك كلمة أو دعوة أو ذكرى لاونور ومارينا.",
      nameLabel: "اسمك",
      namePlaceholder: "أدخل اسمك",
      messageLabel: "أمنيتك",
      messagePlaceholder: "اكتب بضع كلمات للعروسَين…",
      submit: "وقّع دفتر الزوار",
      submitting: "جارٍ الحفظ…",
      empty: "كن أول من يترك أمنية.",
      countOne: "أمنية واحدة",
      countMany: (n) => `${n} أمنية`,
      requiredName: "من فضلك أدخل اسمك.",
      requiredMessage: "من فضلك اكتب أمنية قصيرة.",
      charsLeft: (n) => `متبقّى ${n} حرفاً`,
    },
    music: {
      ariaOn: "كتم الموسيقى",
      ariaOff: "تشغيل الموسيقى",
    },
    calendar: {
      eyebrow: "احفظ الموعد",
      title: "أضف إلى التقويم",
      intro: "اجعل هذه اللحظة قريبة منك — أضفها إلى تقويمك بضغطة واحدة.",
      google: "تقويم جوجل",
      apple: "تقويم آبل (.ics)",
      download: "تنزيل .ics",
    },
    countdown: {
      days: "يوم",
      hours: "ساعة",
      minutes: "دقيقة",
      seconds: "ثانية",
      label: "حتى يبدأ الأبد",
      happened: "بدأ الأبد",
    },
    footer: {
      names: "اونور ومارينا",
      rights: "خطوبة · ١٣ سبتمبر ٢٠٢٦",
      madeWith: "بحب، إلى الأبد.",
      backToTop: "العودة للأعلى",
    },
    admin: {
      title: "لوحة الردود",
      subtitle: "اونور ومارينا — الخطوبة",
      backHome: "العودة للدعوة",
      lockedTitle: "خاص",
      lockedHint: "أدخل رمز الدخول لعرض الردود.",
      passwordLabel: "رمز الدخول",
      passwordPlaceholder: "أدخل الرمز",
      enter: "فتح",
      wrongPassword: "رمز غير صحيح. حاول مرة أخرى.",
      logout: "قفل",
      statRsvp: "الردود",
      statGuests: "إجمالي المدعوين",
      searchPlaceholder: "ابحث بالاسم…",
      exportCsv: "تصدير CSV",
      clearAll: "حذف الكل",
      confirmClear: "حذف جميع الردود؟ لا يمكن التراجع.",
      cancel: "إلغاء",
      empty: "لا توجد ردود بعد. ستظهر هنا تلقائياً.",
      colName: "الاسم",
      colGuests: "المدعوون",
      colWhen: "وقت الاستلام",
      colActions: "",
      deleteOne: "حذف",
    },
  },
};
