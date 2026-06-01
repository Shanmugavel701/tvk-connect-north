import { createContext, useContext, useState, type ReactNode } from "react";

export type Lang = "ta" | "en";

type Dict = Record<string, { ta: string; en: string }>;

export const t: Dict = {
  partyName: { ta: "தமிழக வெற்றிக் கழகம்", en: "Tamilaga Vettri Kazhagam" },
  constituency: { ta: "கோயம்புத்தூர் வடக்கு", en: "Coimbatore North" },
  tagline: { ta: "மக்களின் குரல், எங்கள் பொறுப்பு", en: "The People's Voice, Our Responsibility" },
  hero: { ta: "மக்கள் குறைதீர் மையம்", en: "Citizen Grievance Centre" },
  heroSub: { ta: "உங்கள் குறைகளை எளிதாக சமர்ப்பிக்கவும்", en: "Submit your grievances with one tap" },
  formTitle: { ta: "புகார் சமர்ப்பிக்கவும்", en: "Submit a Complaint" },
  name: { ta: "பெயர்", en: "Full Name" },
  mobile: { ta: "மொபைல் எண்", en: "Mobile Number" },
  address: { ta: "முகவரி", en: "Address" },
  category: { ta: "பிரச்சனை வகை", en: "Issue Category" },
  area: { ta: "பகுதி", en: "Area" },
  description: { ta: "குறை விவரம்", en: "Complaint Description" },
  upload: { ta: "புகைப்படம் பதிவேற்றம்", en: "Upload Image / PDF" },
  submit: { ta: "சமர்ப்பிக்கவும்", en: "Submit Complaint" },
  submitting: { ta: "சமர்ப்பிக்கிறது...", en: "Submitting..." },
  success: { ta: "உங்கள் புகார் வெற்றிகரமாக பெறப்பட்டது", en: "Your complaint has been received" },
  successDesc: { ta: "உங்கள் புகார் எண்", en: "Your complaint ID" },
  required: { ta: "கட்டாயம்", en: "Required" },
  track: { ta: "புகார் நிலை அறிய", en: "Track Complaint" },
  trackPlaceholder: { ta: "புகார் எண் அல்லது மொபைல் எண்", en: "Complaint ID or Mobile Number" },
  search: { ta: "தேடு", en: "Search" },
  status: { ta: "நிலை", en: "Status" },
  noResults: { ta: "முடிவுகள் இல்லை", en: "No results found" },
  selectCategory: { ta: "வகையை தேர்ந்தெடுக்கவும்", en: "Select category" },
  selectArea: { ta: "பகுதியை தேர்ந்தெடுக்கவும்", en: "Select area" },
  optional: { ta: "விருப்பத்தேர்வு", en: "Optional" },
  adminLogin: { ta: "நிர்வாக உள்நுழைவு", en: "Admin Login" },
  footer: { ta: "© TVK கோயம்புத்தூர் வடக்கு. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.", en: "© TVK Coimbatore North. All rights reserved." },
};

export const categories: { value: string; ta: string; en: string }[] = [
  { value: "water", ta: "தண்ணீர் பிரச்சனை", en: "Water Problem" },
  { value: "road", ta: "சாலை சேதம்", en: "Road Damage" },
  { value: "drainage", ta: "வடிகால்", en: "Drainage" },
  { value: "electricity", ta: "மின்சாரம்", en: "Electricity" },
  { value: "public", ta: "பொது புகார்", en: "Public Complaint" },
  { value: "scheme", ta: "அரசு திட்டம்", en: "Government Scheme" },
  { value: "others", ta: "மற்றவை", en: "Others" },
];

export const areas: string[] = [
  "Saibaba Colony", "Ganapathy", "RS Puram", "Tatabad", "Peelamedu",
  "Singanallur", "Saravanampatti", "Vadavalli", "Edayarpalayam", "Thudiyalur",
  "Kavundampalayam", "Sundarapuram", "Mettupalayam Road", "Avinashi Road", "Trichy Road",
];

const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "ta",
  setLang: () => {},
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("ta");
  return <LangCtx.Provider value={{ lang, setLang }}>{children}</LangCtx.Provider>;
}

export function useLang() {
  return useContext(LangCtx);
}

export function tr(key: keyof typeof t, lang: Lang) {
  return t[key][lang];
}