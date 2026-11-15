export interface TrainingProgram {
  id: string;
  slug: string;
  title: string;
  category: "Core Track" | "Full Programme" | "Specialised Training";
  priceNaira: number;
  priceFormatted: string;
  duration: string;
  isoDuration: string;
  level: string;
  badge?: string;
  summary: string;
  curriculum: string[];
  outcomes: string[];
  highlighted?: boolean;
}

export interface LookbookItem {
  id: string;
  title: string;
  category:
    | "Bridals & Reception"
    | "Aso-Ebi & Lace"
    | "Aso-Oke & Traditional"
    | "Blazers & Suits"
    | "Male Fashion";
  image?: string;
  description: string;
  techniqueTag: string;
}

export const SITE_CONFIG = {
  name: "Julian House of Fashion Academy",
  shortName: "Julian House of Fashion",
  acronym: "JHF Academy",
  domain: "https://jhfacademy.com.ng",
  tagline: "Building skills. Transforming lives through fashion education.",
  description:
    "Premier fashion design school and bespoke couture house in Ilorin, Kwara State. Master pattern drafting, corsetry, bridal engineering, and male fashion design through 100% hands-on studio training.",
  founder: "Julihana Tomori",
  foundedYear: "2018",
  foundedDateFull: "February 2018",
  address: {
    street: "12 Alarape Street, off Basin Road (off Taoheed Road)",
    city: "Ilorin",
    state: "Kwara State",
    postalCode: "234001",
    country: "Nigeria",
    countryCode: "NG",
    full: "12 Alarape Street, off Basin Road (off Taoheed Road), Ilorin, Kwara State, 234001, Nigeria",
  },
  geo: {
    latitude: 8.5048,
    longitude: 4.5686,
  },
  landmarks: [
    "Basin Road",
    "Taoheed Road",
    "Fate Road",
    "Tanke",
    "GRA Ilorin",
    "Unity Road",
    "University of Ilorin Axis",
  ],
  phoneDisplay: "+234 802 265 3399",
  phoneRaw: "+2348022653399",
  whatsappNumber: "2348022653399",
  email: "toluwaetom@gmail.com",
  hours: [
    { days: "Monday - Friday", time: "9:00 AM - 5:00 PM" },
    { days: "Saturday", time: "10:00 AM - 4:00 PM" },
    { days: "Sunday", time: "Closed" },
  ],
  social: {
    facebook: "https://web.facebook.com/julianhouseoffashion",
    instagram: "https://www.instagram.com/julianhouseoffashion/",
    instagramHandle: "@julianhouseoffashion",
  },
  googleReviewUrl:
    "https://www.google.com/maps/search/?api=1&query=Julian+House+of+Fashion+12+Alarape+Street+Basin+Road+Ilorin+Kwara+State",
  googleMapsEmbedUrl:
    "https://maps.google.com/maps?q=12%20Alarape%20Street%20Basin%20Road%20Ilorin%20Kwara%20State%20Nigeria&t=&z=15&ie=UTF8&iwloc=&output=embed",
};

export const ADDITIONAL_FEES = {
  registrationFee: 10000,
  registrationFormatted: "₦10,000",
  registrationNote: "One-time payment upon admission",
  accommodationFeePerBlock: 50000,
  accommodationFormatted: "₦50,000",
  accommodationDuration: "3 months",
  accommodationNote:
    "Comfortable, secure student accommodation available at ₦50,000 per 3-month block for out-of-town trainees.",
};

export const TRAINING_PROGRAMS: TrainingProgram[] = [
  {
    id: "foundational",
    slug: "foundational-class",
    title: "Foundational Class",
    category: "Core Track",
    priceNaira: 150000,
    priceFormatted: "₦150,000",
    duration: "3 months",
    isoDuration: "P3M",
    level: "Beginner to Foundation",
    badge: "Beginner Friendly",
    summary:
      "Built for complete beginners with zero prior sewing experience. Gain confidence on industrial machines and draft accurate foundational patterns from scratch.",
    curriculum: [
      "Industrial straight-stitch & overlock machine control and maintenance",
      "Accurate body measurement anatomy & standard measurement charts",
      "Foundational pattern drafting: basic bodice, straight & flared skirts, basic sleeve, and beginner trouser blocks",
      "Clean seam finishing, zipper insertion, neat hemming & garment pressing",
      "Complete practical projects: fitted skirts, simple dresses, and casual tops",
    ],
    outcomes: [
      "Cut and sew well-fitted everyday garments without guesswork",
      "Read and draft custom measurements on brown craft pattern paper",
    ],
  },
  {
    id: "intermediate",
    slug: "intermediate-class",
    title: "Intermediate Class",
    category: "Core Track",
    priceNaira: 150000,
    priceFormatted: "₦150,000",
    duration: "3 months",
    isoDuration: "P3M",
    level: "Intermediate",
    badge: "Skill Upgrade",
    summary:
      "Bridge the gap between basic sewing and commercial-ready tailoring. Master trousers, darts manipulation, structured collars, and Nigerian occasion wear.",
    curriculum: [
      "Precision trouser pattern drafting, trouser zip flaps, side & welt pockets",
      "Dart manipulation, princess seams, yokes & style-line transformations",
      "Structured shirt collars, cuffs, bishop sleeves & puff sleeves",
      "Full garment lining techniques and concealed inner finishing",
      "Aso-Ebi, Ankara & native attire fitting and alteration mastery",
    ],
    outcomes: [
      "Eliminate trouser crotch pulling and bodice gaping permanently",
      "Deliver commercial client orders with boutique-grade interior finishing",
    ],
  },
  {
    id: "advanced",
    slug: "advanced-class",
    title: "Advanced Class",
    category: "Core Track",
    priceNaira: 200000,
    priceFormatted: "₦200,000",
    duration: "3 months",
    isoDuration: "P3M",
    level: "Advanced / Couture",
    badge: "Bridal & Corsetry",
    summary:
      "Master high-value luxury fashion design: bridal gowns, structured beaded corsets, mannequin draping, and tailored women's blazers.",
    curriculum: [
      "Cupped bustier & Victorian/illusion corset pattern drafting and boning",
      "Bridal wear, reception dresses & layered princess ballgown engineering",
      "3D draping on dress forms & couture lace applique placement",
      "Tailored women's blazers, notched lapels, shoulder pads & two-piece suits",
      "Luxury fashion business pricing, client consultations & brand launch",
    ],
    outcomes: [
      "Design and construct high-ticket bridal, Aso-Ebi, and corporate outfits",
      "Launch or scale an independent luxury womenswear fashion house",
    ],
  },
  {
    id: "full-programme",
    slug: "full-programme",
    title: "Full Programme Option (9 Months)",
    category: "Full Programme",
    priceNaira: 500000,
    priceFormatted: "₦500,000",
    duration: "9 months",
    isoDuration: "P9M",
    level: "Complete Beginner to Master Designer",
    badge: "Complete Career Track",
    highlighted: true,
    summary:
      "For students enrolling in Foundational, Intermediate, and Advanced levels consecutively — 9 months of intensive studio mentorship transforming passion into mastery.",
    curriculum: [
      "Includes 100% of Foundational (3 mos), Intermediate (3 mos), and Advanced (3 mos) modules",
      "Continuous guided studio mentorship with Designer Julihana Tomori",
      "Graduated portfolio showcase featuring casual, native, blazer & bridal pieces",
      "Production speed coaching on industrial equipment & fashion entrepreneurship",
    ],
    outcomes: [
      "Graduate ready to run a profitable fashion studio or command senior roles",
      "Complete portfolio of self-drafted bespoke and ready-to-wear outfits",
    ],
  },
  {
    id: "male-fashion",
    slug: "male-fashion-design",
    title: "Male Fashion Design",
    category: "Specialised Training",
    priceNaira: 250000,
    priceFormatted: "₦250,000",
    duration: "4 months",
    isoDuration: "P4M",
    level: "Specialised Menswear",
    badge: "Specialised Training",
    summary:
      "Focused 4-month specialised training dedicated to bespoke menswear pattern drafting, crisp Senator wears, Agbada, tailored trousers, and formal shirts.",
    curriculum: [
      "Menswear anatomy, chest/shoulder balance & structured sleeve pitch",
      "Senator suits, kaftans, luxury Agbada embroidery prep & placket precision",
      "Bespoke men's pleated & flat-front trousers with welt pockets and waistband interfacing",
      "Classic collared dress shirts, yokes, French seams & cuff tailoring",
      "Crisp interfacing, fusing & sharp masculine pressing standards",
    ],
    outcomes: [
      "Construct crisp Senator outfits, Agbada, and bespoke men's trousers",
      "Tap into Nigeria's high-demand bespoke menswear and groom's attire market",
    ],
  },
];

export const INTAKE_BATCHES = [
  "Next Available Intake",
  "February Batch",
  "May Batch",
  "August Batch",
  "November Batch",
];

export const LOOKBOOK_ITEMS: LookbookItem[] = [
  {
    id: "bridal-fringe",
    title: "Off-Shoulder Bridal Reception Dress",
    category: "Bridals & Reception",
    image: "/images/outfit-bridal-white.png",
    description:
      "Sculpted white crepe silhouette featuring an architectural off-shoulder wrap, crimson fringe detailing, and floral couture accent.",
    techniqueTag: "Pattern Drafting & Bustier Contouring",
  },
  {
    id: "asoebi-turquoise",
    title: "Turquoise Beaded Lace Aso-Ebi",
    category: "Aso-Ebi & Lace",
    image: "/images/outfit-asoebi-2.png",
    description:
      "Custom illusion-neckline beaded lace corset paired with structured floral shoulder applique and matching royal blue gele styling.",
    techniqueTag: "Corsetry & Illusion Lace Applique",
  },
  {
    id: "staircase-evening",
    title: "Teal & Sequin Illusion Evening Gown",
    category: "Bridals & Reception",
    image: "/images/jhf-profile-gown.png",
    description:
      "Floor-length mermaid evening gown combining teal scuba draping, black sequin paneling, and sheer illusion sleeves.",
    techniqueTag: "Draping & Structured Gown Construction",
  },
  {
    id: "ankara-puff",
    title: "Royal Purple & Azure Puff-Sleeve Dress",
    category: "Aso-Oke & Traditional",
    image: "/images/outfit-ankara-purple.png",
    description:
      "Statement square-neckline print dress engineered with voluminous structured puff sleeves, peaked collar trim, and matching headpiece.",
    techniqueTag: "Sleeve Architecture & Bodice Fit",
  },
  {
    id: "asoebi-twin",
    title: "Ceremonial Aso-Ebi & Gele Ensemble",
    category: "Aso-Ebi & Lace",
    image: "/images/outfit-asoebi-1.png",
    description:
      "Bespoke wedding guest and bridal train couture crafted with precision boning for effortless comfort from morning vows to reception.",
    techniqueTag: "Custom Corset Engineering",
  },
  {
    id: "corporate-blazers",
    title: "Structured Women's Blazers & Suits",
    category: "Blazers & Suits",
    image: "/images/jhf-banner-showcase.png",
    description:
      "Power-tailored notched-lapel blazers, two-piece trouser suits, and crisp lined office separates taught in our Advanced module and available for bespoke order.",
    techniqueTag: "Two-Piece Sleeve & Lapel Tailoring",
  },
  {
    id: "menswear-senator",
    title: "Bespoke Senator Suits & Agbada",
    category: "Male Fashion",
    image: "/images/jhf-logo-crop.png",
    description:
      "Sharp placket lines, structured senator silhouettes, kaftans, and bespoke tailored trousers built in our 4-month Male Fashion Design track and custom menswear studio.",
    techniqueTag: "Specialised Menswear Tailoring",
  },
];

export const STUDENT_SPOTLIGHTS = [
  {
    name: "Designer Aishat",
    cohort: "August Batch Graduate",
    quote:
      "Before joining Julian House of Fashion Academy in Ilorin, trouser pattern drafting was my biggest challenge. Working hands-on with brown pattern paper and industrial machines step by step, I now draft and sew complete outfits confidently.",
    focus: "Trouser Pattern Drafting & Garment Assembly",
  },
  {
    name: "Full Programme Trainee",
    cohort: "9-Month Intensive Track",
    quote:
      "Starting from zero machine experience in Foundational Class up to constructing beaded corsets and structured blazers in Advanced Class gave me everything I needed to launch my own bespoke brand.",
    focus: "Foundational to Advanced Couture Progression",
  },
  {
    name: "Out-of-Town Student",
    cohort: "Academy Resident",
    quote:
      "The studio accommodation option off Basin Road made relocating to Ilorin seamless. Being minutes away from the cutting tables meant extra practice hours every week.",
    focus: "Comfortable Student Accommodation & Studio Access",
  },
];

export const LOCAL_FAQS = [
  {
    question: "Where is Julian House of Fashion Academy located in Ilorin?",
    answer:
      "Our training studio and fashion house is located at 12 Alarape Street, off Basin Road (off Taoheed Road), Ilorin, Kwara State (234001). We are easily accessible from Basin, Taoheed Road, Fate Road, Tanke, GRA, and Unity Road.",
  },
  {
    question: "How much are the fashion training courses at Julian House of Fashion Academy?",
    answer:
      "Foundational Class is ₦150,000 (3 months), Intermediate Class is ₦150,000 (3 months), and Advanced Class is ₦200,000 (3 months). Enrolling in all three levels consecutively for the 9-month Full Programme totals ₦500,000. Our specialised Male Fashion Design course is ₦250,000 (4 months). There is a one-time ₦10,000 registration fee.",
  },
  {
    question: "Is accommodation available for students coming from outside Ilorin?",
    answer:
      "Yes! Comfortable student accommodation is available at ₦50,000 for 3 months near our Basin Road studio in Ilorin, making it convenient for students relocating from across Kwara State and other parts of Nigeria.",
  },
  {
    question: "Do I need prior sewing experience before joining?",
    answer:
      "No prior experience is required. Our Foundational Class (3 months, ₦150,000) is designed specifically for complete beginners, teaching you industrial machine handling, body measurement anatomy, and pattern drafting from day one.",
  },
  {
    question: "Do you teach pattern drafting or only freehand cutting?",
    answer:
      "We teach structured, precision pattern drafting alongside practical garment construction. Students learn to draft custom blocks on pattern paper for skirts, bodices, sleeves, trousers (including zip flaps and pockets), corsets, and tailored blazers.",
  },
  {
    question: "How do I register for the next intake or book a bespoke outfit?",
    answer:
      "You can register immediately via WhatsApp or phone call on +234 802 265 3399, email toluwaetom@gmail.com, or visit our studio at 12 Alarape Street, off Basin Road, Ilorin between Monday and Saturday.",
  },
];

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;
}
