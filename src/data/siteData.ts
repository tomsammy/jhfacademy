export interface CourseModule {
  title: string;
  topics: string[];
}

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
  courseOutline: CourseModule[];
  expectedOutcomeText: string;
  finalProject?: string;
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
    level: "Beginners / Foundational",
    badge: "Beginner Friendly",
    summary:
      "Built for complete beginners with zero prior sewing experience. Gain confidence in measurements, pattern drafting, fashion sketching, and garment construction.",
    curriculum: [
      "Measurements & Pattern Drafting (Bodice, Bust/Waist Darts & Princess Seams)",
      "Fashion Illustration & Sketch Interpretation",
      "Skirt, Trouser & Shirt Drafting and Construction",
      "Sleeve Development, Dress & Jumpsuit Construction",
      "Creative Skills & Embellishment (Beadwork & Crochet)",
    ],
    outcomes: [
      "Take accurate body measurements and draft half-scale & full-scale patterns",
      "Cut, sew, fit, and finish skirts, trousers, shirts, dresses, and jumpsuits with creative embellishments",
    ],
    courseOutline: [
      {
        title: "1. MEASUREMENTS AND PATTERN DRAFTING",
        topics: [
          "Understanding and reading the tape rule.",
          "Basic body measurements.",
          "Half-scale pattern drafting.",
          "Full-scale pattern drafting.",
          "Basic bodice drafting.",
          "Bust dart and waist dart development.",
          "Princess seam variations: bust, shoulder and armhole.",
          "Dress pattern development.",
        ],
      },
      {
        title: "2. FASHION ILLUSTRATION",
        topics: [
          "Introduction to fashion sketching.",
          "Basic fashion figures and proportions.",
          "Sketching and interpreting garment designs.",
        ],
      },
      {
        title: "3. SKIRT CONSTRUCTION",
        topics: [
          "Basic skirt drafting.",
          "Skirt variations and styles.",
          "Pattern modification and garment construction.",
        ],
      },
      {
        title: "4. TROUSER CONSTRUCTION",
        topics: [
          "Basic trouser measurements and drafting.",
          "Trouser pattern development.",
          "Cutting and construction.",
        ],
      },
      {
        title: "5. SHIRT CONSTRUCTION",
        topics: [
          "Basic shirt drafting.",
          "Collar and placket construction.",
          "Sleeve attachment and finishing.",
        ],
      },
      {
        title: "6. SLEEVE DEVELOPMENT",
        topics: [
          "Understanding sleeve patterns.",
          "Different sleeve styles and variations.",
          "Sleeve drafting and attachment.",
        ],
      },
      {
        title: "7. DRESS CONSTRUCTION",
        topics: [
          "Dress pattern development.",
          "Different dress styles and variations.",
          "Cutting, sewing, fitting and finishing.",
        ],
      },
      {
        title: "8. JUMPSUIT CONSTRUCTION",
        topics: [
          "Basic jumpsuit drafting.",
          "Pattern development and modification.",
          "Cutting and construction.",
        ],
      },
      {
        title: "9. CREATIVE SKILLS AND EMBELLISHMENT",
        topics: [
          "Introduction to basic beadwork.",
          "Introduction to crochet making.",
          "Application of creative embellishments to garments.",
        ],
      },
    ],
    expectedOutcomeText:
      "By the end of the programme, students should be able to take body measurements, draft patterns, interpret fashion sketches, manipulate basic patterns, cut and construct different garment types, and apply basic creative embellishments.",
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
      "Bridge the gap between foundational sewing and commercial-ready tailoring. Master advanced dart manipulation, bustier contouring, blazers, cargo pants, hoodies, and heavy beadwork.",
    curriculum: [
      "Advanced Dart Manipulation, Bustier & Full Body Contouring",
      "Advanced Skirt Development & Structural Garment Design",
      "Cargo Pants & Hoodie Pattern Drafting and Construction",
      "Tailored Blazer Structure, Lapels, Collars & Lining",
      "Advanced Beadwork & Heavy Garment Embellishments",
    ],
    outcomes: [
      "Execute advanced dart transfers, bustier contouring, and structured garment designs",
      "Construct commercial-grade cargo pants, hoodies, blazers, and embellished pieces",
    ],
    courseOutline: [
      {
        title: "1. ADVANCED DART MANIPULATION",
        topics: [
          "Advanced dart manipulation techniques.",
          "Dart transfer and conversion.",
          "Multiple dart applications.",
          "Dart manipulation for creative design development.",
        ],
      },
      {
        title: "2. BUSTIER AND CONTOURING",
        topics: [
          "Bustier pattern development.",
          "Bust and under-bust contouring.",
          "Shoulder and armhole contouring.",
          "Yoke development and variations.",
          "Posterior contouring and variations.",
          "Different bustier styles and construction techniques.",
        ],
      },
      {
        title: "3. ADVANCED SKIRT DEVELOPMENT",
        topics: [
          "Advanced skirt pattern manipulation.",
          "Skirt variations and design development.",
          "Creative skirt construction techniques.",
        ],
      },
      {
        title: "4. STRUCTURAL DESIGN AND GARMENT DEVELOPMENT",
        topics: [
          "Introduction to structural fashion design.",
          "Understanding garment structure and support.",
          "Structural pattern development.",
          "Creating and applying garment structures.",
          "Developing structured garment designs.",
        ],
      },
      {
        title: "5. CARGO PANTS CONSTRUCTION",
        topics: [
          "Cargo pants pattern drafting.",
          "Pocket development and placement.",
          "Cargo details and construction.",
          "Professional finishing.",
        ],
      },
      {
        title: "6. HOODIE CONSTRUCTION",
        topics: [
          "Hoodie pattern development.",
          "Hood drafting and construction.",
          "Pocket and design details.",
          "Ribbing application and finishing.",
        ],
      },
      {
        title: "7. BLAZER CONSTRUCTION",
        topics: [
          "Blazer pattern development.",
          "Understanding blazer structure.",
          "Lapel and collar construction.",
          "Sleeve and lining application.",
          "Blazer construction and finishing.",
        ],
      },
      {
        title: "8. ADVANCED BEADWORK AND EMBELLISHMENT",
        topics: [
          "Advanced beadwork techniques.",
          "Heavy beadwork applications.",
          "Bead placement, patterns and design development.",
          "Incorporating embellishments into garment designs.",
        ],
      },
    ],
    expectedOutcomeText:
      "By the end of the programme, students should be able to execute advanced dart manipulation, develop bustier designs, apply contouring techniques, create structured garments, construct cargo pants, hoodies and blazers, and execute advanced beadwork.",
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
    level: "Advanced",
    badge: "Bridal & Corsetry",
    summary:
      "Master high-value luxury couture: advanced boned corsetry, sculptural structural design, bridal gown engineering, experimental pattern cutting, and runway presentation.",
    curriculum: [
      "Advanced Corset Design, Boning Placement & Bust/Waist Shaping",
      "Advanced Structural Design, Sculptural Volume, Ruching & 3D Details",
      "Bridal Wear Design, Trains, Structured Bodices & Lace Applique",
      "Deconstruction, Experimental Draping & Modular Pattern Cutting",
      "Couture Internal Finishing, Quality Control & Final Project Showcase",
    ],
    outcomes: [
      "Independently develop and construct advanced corsets, structured designs, and bridal outfits",
      "Execute experimental pattern techniques and present a complete advanced garment final project",
    ],
    courseOutline: [
      {
        title: "1. ADVANCED CORSET DESIGN AND CONSTRUCTION",
        topics: [
          "Introduction to advanced corsetry.",
          "Corset pattern drafting and development.",
          "Different corset styles and variations.",
          "Boning techniques and placement.",
          "Bust and waist shaping.",
          "Corset structure and support.",
          "Corset fitting and adjustments.",
          "Advanced corset finishing.",
        ],
      },
      {
        title: "2. ADVANCED STRUCTURAL DESIGN",
        topics: [
          "Advanced garment structuring.",
          "Understanding internal garment support.",
          "Structural pattern development.",
          "Sculptural garment design.",
          "Volume creation and manipulation.",
          "Ruching, pleating and 3D garment details.",
          "Experimental draping techniques.",
        ],
      },
      {
        title: "3. BRIDAL WEAR DESIGN AND CONSTRUCTION",
        topics: [
          "Bridal gown pattern development.",
          "Understanding bridal silhouettes.",
          "Structured bridal bodices.",
          "Wedding gown construction.",
          "Train development and construction.",
          "Lace application and placement.",
          "Bridal embellishment techniques.",
          "Bridal fitting and finishing.",
        ],
      },
      {
        title: "4. ADVANCED PATTERN CUTTING AND CREATIVE DEVELOPMENT",
        topics: [
          "Sculptural pattern cutting.",
          "Deconstruction and reconstruction techniques.",
          "Experimental pattern manipulation.",
          "Creative draping and design development.",
          "Modular and transformable garment concepts.",
        ],
      },
      {
        title: "5. ADVANCED FINISHING AND PRESENTATION",
        topics: [
          "Professional garment finishing.",
          "Internal garment finishing.",
          "Advanced fitting and corrections.",
          "Quality control.",
          "Garment presentation and styling.",
        ],
      },
    ],
    expectedOutcomeText:
      "By the end of the programme, students should be able to independently develop and construct advanced corsets, structured garments and bridal outfits, apply sculptural and experimental design techniques, execute complex garment details and deliver professionally finished pieces.",
    finalProject:
      "Each student will develop a design concept, create the necessary patterns, construct a complete advanced garment and present the finished piece.",
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
      "Phase 1 (Months 1–3): Complete Foundational Fashion Design (9 Core Modules)",
      "Phase 2 (Months 4–6): Complete Intermediate Fashion Design (8 Core Modules)",
      "Phase 3 (Months 7–9): Complete Advanced Fashion Design (5 Couture Modules + Final Project)",
      "Continuous guided studio mentorship with Designer Julihana Tomori",
    ],
    outcomes: [
      "Master every level sequentially from tape-rule fundamentals to advanced corsetry & bridals",
      "Graduate with a complete couture portfolio and readiness to run a profitable fashion studio",
    ],
    courseOutline: [
      {
        title: "PHASE 1 (MONTHS 1–3): FOUNDATIONAL FASHION DESIGN",
        topics: [
          "Measurements and pattern drafting (half-scale, full-scale, bodice, bust/waist darts, princess seams).",
          "Fashion illustration, basic figures, proportions & design interpretation.",
          "Skirt, trouser, shirt, sleeve, dress & jumpsuit construction.",
          "Creative skills: basic beadwork & crochet embellishment application.",
        ],
      },
      {
        title: "PHASE 2 (MONTHS 4–6): INTERMEDIATE FASHION DESIGN",
        topics: [
          "Advanced dart manipulation, transfer, conversion & multiple dart applications.",
          "Bustier and contouring (bust, under-bust, shoulder, armhole, yokes & posterior).",
          "Advanced skirt development & structural garment design with support.",
          "Cargo pants, hoodie & tailored blazer construction + heavy beadwork.",
        ],
      },
      {
        title: "PHASE 3 (MONTHS 7–9): ADVANCED FASHION DESIGN & CAPSTONE",
        topics: [
          "Advanced corset design, boning placement, waist shaping & internal support.",
          "Sculptural structural design, volume manipulation, ruching, pleating & 3D draping.",
          "Bridal wear design & construction (trains, structured bodices, lace placement).",
          "Experimental pattern cutting, deconstruction/reconstruction & modular garments.",
          "Couture internal finishing, quality control & final advanced garment presentation.",
        ],
      },
    ],
    expectedOutcomeText:
      "By the end of the 9-month Full Programme, students progress seamlessly from zero prior sewing experience to independently drafting, structuring, embellishing, and presenting advanced couture, bridal, structured, and commercial garments.",
    finalProject:
      "Each graduating Full Programme student develops a complete original design concept, drafts all patterns, constructs an advanced showpiece garment, and presents the finished piece.",
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
    courseOutline: [
      {
        title: "1. MENSWEAR MEASUREMENTS & BLOCK DRAFTING",
        topics: [
          "Menswear body measurement anatomy and posture balance.",
          "Chest, shoulder slope and back-width pattern drafting.",
          "Structured two-piece sleeve pitch and armhole balance.",
        ],
      },
      {
        title: "2. SENATOR SUITS, KAFTANS & AGBADA",
        topics: [
          "Senator top and traditional kaftan pattern drafting.",
          "Crisp hidden and exposed placket construction.",
          "Luxury Agbada cutting, neck-facing geometry & embroidery preparation.",
        ],
      },
      {
        title: "3. BESPOKE MEN'S TROUSER CONSTRUCTION",
        topics: [
          "Flat-front and pleated menswear trouser pattern drafting.",
          "Zipper fly shield, side slant pockets & double-welt back pockets.",
          "Waistband interfacing, curtain lining & bespoke fitting adjustments.",
        ],
      },
      {
        title: "4. FORMAL SHIRTS & FINISHING STANDARDS",
        topics: [
          "Classic two-piece collar stand, shoulder yoke & placket tailoring.",
          "Sleeve plackets, fused cuffs & French seam shirt construction.",
          "Sharp fusing, steam pressing & quality control for client delivery.",
        ],
      },
    ],
    expectedOutcomeText:
      "By the end of the 4-month Male Fashion Design track, students should be able to measure, draft, cut, fuse, assemble, and professionally press crisp Senator wears, Agbada sets, bespoke men's trousers, and tailored dress shirts.",
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
