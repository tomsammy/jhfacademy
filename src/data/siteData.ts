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

export interface StudentProjectAngle {
  url: string;
  label: string;
}

export interface StudentProjectShowcase {
  id: string;
  title: string;
  studentLabel: string;
  category:
    | "Tailored Suits & Separates"
    | "Color-Block & Contour Dresses"
    | "Jumpsuits & Palazzo Sets"
    | "Embellished & Cape Couture";
  levelBadge: string;
  primaryImage: string;
  angles: StudentProjectAngle[];
  summary: string;
  pictorialDetails: string[];
  modulesApplied: string[];
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
    duration: "3–4 months",
    isoDuration: "P3M",
    level: "Foundational Male Fashion Design",
    badge: "Specialised Training",
    summary:
      "Structured foundational male fashion design training covering male body measurements, pattern drafting, shirts, trousers, Senator & kaftan native wear, jackets, and neat finishing.",
    curriculum: [
      "Male Body Measurements, Proportions & Half/Full-Scale Pattern Drafting",
      "Shirt Construction: Collar, Collar Stand, Sleeve, Cuff & Placket Development",
      "Trouser Construction: Measurements, Styles, Waistband, Pocket & Fly",
      "Native Wear Construction: Kaftan, Senator Wear, Collar & Pocket Details",
      "Jacket & Outerwear Pattern Development, Lapels, Sleeves, Lining & Finishing",
    ],
    outcomes: [
      "Take accurate male body measurements and draft foundational male patterns",
      "Independently cut, construct, and finish shirts, trousers, native wear (Kaftan & Senator), and simple jackets",
    ],
    courseOutline: [
      {
        title: "1. MEASUREMENTS AND PATTERN DRAFTING",
        topics: [
          "Understanding and reading the tape rule.",
          "Basic male body measurements.",
          "Understanding male body proportions.",
          "Basic pattern drafting techniques.",
          "Half-scale and full-scale pattern development.",
        ],
      },
      {
        title: "2. SHIRT CONSTRUCTION",
        topics: [
          "Basic shirt pattern drafting.",
          "Shirt variations and styles.",
          "Collar and collar stand construction.",
          "Sleeve and cuff construction.",
          "Placket development.",
          "Shirt construction and finishing.",
        ],
      },
      {
        title: "3. TROUSER CONSTRUCTION",
        topics: [
          "Basic trouser measurements and drafting.",
          "Trouser pattern development.",
          "Different trouser styles and variations.",
          "Waistband, pocket and fly construction.",
          "Cutting, sewing and finishing.",
        ],
      },
      {
        title: "4. NATIVE WEAR CONSTRUCTION",
        topics: [
          "Basic native wear pattern drafting.",
          "Different native wear styles.",
          "Kaftan construction.",
          "Senator wear construction.",
          "Collar variations.",
          "Pocket and design details.",
          "Cutting and finishing techniques.",
        ],
      },
      {
        title: "5. JACKET AND OUTERWEAR",
        topics: [
          "Introduction to jacket construction.",
          "Basic jacket pattern development.",
          "Jacket collar and lapel variations.",
          "Sleeve construction.",
          "Lining and finishing.",
        ],
      },
      {
        title: "6. CREATIVE DETAILS AND FINISHING",
        topics: [
          "Pocket variations and applications.",
          "Buttonholes and button placement.",
          "Zipper applications.",
          "Professional garment finishing.",
          "Fitting and basic alterations.",
        ],
      },
    ],
    expectedOutcomeText:
      "By the end of the programme, students should be able to take male body measurements, draft basic male patterns, cut and construct shirts, trousers, native wear and simple jackets, and execute neat garment finishing.",
    finalProject:
      "Each student will independently draft, cut and construct selected male outfits to demonstrate the skills acquired.",
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
    image: "/images/students/student-emerald-suit-logo.jpg",
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
    image: "/images/students/student-emerald-suit-logo.jpg",
    quote:
      "Before joining Julian House of Fashion Academy in Ilorin, trouser pattern drafting was my biggest challenge. Working hands-on with brown pattern paper and industrial machines step by step, I now draft and sew complete outfits confidently.",
    focus: "Trouser Pattern Drafting & Garment Assembly",
  },
  {
    name: "Full Programme Trainee",
    cohort: "9-Month Intensive Track",
    image: "/images/students/student-hotpink-cape-wings.jpg",
    quote:
      "Starting from zero machine experience in Foundational Class up to constructing beaded corsets and structured cape silhouettes in Advanced Class gave me everything I needed to launch my own bespoke brand.",
    focus: "Foundational to Advanced Couture Progression",
  },
  {
    name: "Out-of-Town Student",
    cohort: "Academy Resident",
    image: "/images/students/student-duo-satin-emerald.jpg",
    quote:
      "The studio accommodation option off Basin Road made relocating to Ilorin seamless. Being minutes away from the cutting tables meant extra practice hours every week.",
    focus: "Comfortable Student Accommodation & Studio Access",
  },
];

export const STUDENT_PROJECT_SHOWCASES: StudentProjectShowcase[] = [
  {
    id: "hotpink-pearl-cape-dress",
    title:
      "Hot-Pink Pearl-Beaded Square-Neck Midi Dress with Split Cape Sleeves",
    studentLabel: "Advanced Cohort Final Project",
    category: "Embellished & Cape Couture",
    levelBadge: "Advanced Couture Showcase",
    primaryImage: "/images/students/student-hotpink-cape-wings.jpg",
    angles: [
      {
        url: "/images/students/student-hotpink-cape-wings.jpg",
        label: "Wing-Spread View",
      },
      {
        url: "/images/students/student-hotpink-cape-front.jpg",
        label: "Front Silhouette",
      },
      {
        url: "/images/students/student-hotpink-cape-back.jpg",
        label: "Back Zipper & Vent",
      },
    ],
    summary:
      "Dramatic statement midi dress engineered with floor-grazing split cape sleeves, hand-beaded pearl neckline and hem edging, and precision back waist darting.",
    pictorialDetails: [
      "Square-neck structured bodice hand-embellished with graduating pearl bead trim along the collar and cape edges.",
      "Full-length open split cape sleeves drafted with balanced shoulder ease and fluid drape.",
      "Concealed center-back zipper, crisp vertical back darts, and tailored rear walking vent shown in the back view.",
    ],
    modulesApplied: [
      "Sleeve Development",
      "Advanced Structural Design",
      "Beadwork & Embellishment",
      "Advanced Finishing",
    ],
  },
  {
    id: "emerald-double-breasted-suit",
    title:
      "Emerald Green Asymmetric Double-Breasted Blazer & Cigarette Trouser Suit",
    studentLabel: "Intermediate & Blazer Track",
    category: "Tailored Suits & Separates",
    levelBadge: "Intermediate Blazer Project",
    primaryImage: "/images/students/student-emerald-suit-logo.jpg",
    angles: [
      {
        url: "/images/students/student-emerald-suit-logo.jpg",
        label: "Full Suit at JHF Crest",
      },
      {
        url: "/images/students/student-emerald-suit-closeup.jpg",
        label: "Lapel & Belt Detail",
      },
      {
        url: "/images/students/student-duo-satin-emerald.jpg",
        label: "Studio Duo View",
      },
    ],
    summary:
      "Sharp emerald tailored two-piece suit showcasing an asymmetric crossover front closure, pearl-rimmed decorative buttons, self-fabric waist belt, and sleek cigarette trousers.",
    pictorialDetails: [
      "Precision notched collar stand paired with a diagonal double-breasted button wrap and structured waist tabs.",
      "Two-piece tailored sleeves set cleanly into structured armholes with crisp interior interfacing.",
      "High-waist slim cigarette trousers drafted without front crotch pooling or pocket gaping.",
    ],
    modulesApplied: [
      "Blazer Construction",
      "Trouser Construction",
      "Structured Sleeves",
    ],
  },
  {
    id: "lilac-pearl-flounce-dress",
    title:
      "Lilac Pearl-Neckline Fitted Midi Dress with 3D Gathered Flounce Hem",
    studentLabel: "Studio Contouring Showcase",
    category: "Embellished & Cape Couture",
    levelBadge: "Intermediate / Advanced",
    primaryImage: "/images/students/student-lilac-pearl-ruffle-dress.jpg",
    angles: [
      {
        url: "/images/students/student-lilac-pearl-ruffle-dress.jpg",
        label: "Full Silhouette",
      },
      {
        url: "/images/students/student-lilac-pearl-closeup.jpg",
        label: "Pearl & Ruffle Detail",
      },
    ],
    summary:
      "Sculpted lilac midi dress featuring a mock-turtle collar lined with sewn pearls, contoured princess darting, and a voluminous gathered 3D ruffle skirt flounce.",
    pictorialDetails: [
      "Hand-sewn graduating pearl trim accentuating the high neckline and side cape sleeve slit.",
      "Contoured bodice and hip paneling for smooth waist-to-hip compression and balance.",
      "Dense gathered 3D fabric manipulation at the lower hem creating dramatic structured volume.",
    ],
    modulesApplied: [
      "Advanced Dart Manipulation",
      "Volume & Ruffle Creation",
      "Beadwork Application",
    ],
  },
  {
    id: "diamond-patchwork-maxi",
    title:
      "Espresso, Black & White Geometric Diamond Patchwork Maxi Gown",
    studentLabel: "Pattern Manipulation Showcase",
    category: "Color-Block & Contour Dresses",
    levelBadge: "Intermediate Pattern Project",
    primaryImage: "/images/students/student-diamond-patchwork-gown.jpg",
    angles: [
      {
        url: "/images/students/student-diamond-patchwork-gown.jpg",
        label: "Solo Full Gown",
      },
      {
        url: "/images/students/student-duo-diamond-royalblue.jpg",
        label: "Cohort Duo View",
      },
    ],
    summary:
      "Floor-length color-blocked column gown cut from alternating espresso crepe, obsidian, and crisp ivory geometric diamond pattern panels with contrast-piped flare cuffs.",
    pictorialDetails: [
      "Complex style-line pattern conversion matching multi-angle diamond seams seamlessly at every junction.",
      "Clean contrast white flat-piping framing the geometric center-front panels and bell-sleeve cuffs.",
      "Longline sheath fit balanced with precise bust, waist, and hip dart transfers.",
    ],
    modulesApplied: [
      "Advanced Dart Manipulation",
      "Dress Pattern Development",
      "Precision Seam Alignment",
    ],
  },
  {
    id: "royal-purple-stripe-jumpsuit",
    title:
      "Royal Purple & White Contrast-Stripe Wide-Leg Jumpsuit",
    studentLabel: "Jumpsuit & Menswear/Tailoring Showcase",
    category: "Jumpsuits & Palazzo Sets",
    levelBadge: "Foundational / Intermediate",
    primaryImage: "/images/students/student-purple-stripe-jumpsuit.jpg",
    angles: [
      {
        url: "/images/students/student-purple-stripe-jumpsuit.jpg",
        label: "Solo Jumpsuit Drape",
      },
      {
        url: "/images/students/student-duo-purple-grey-jumpsuits.jpg",
        label: "Duo Jumpsuit Study",
      },
    ],
    summary:
      "Statement royal purple jumpsuit featuring structured shoulder pleats, asymmetric black-and-white geometric bodice inlay, and continuous vertical white leg paneling.",
    pictorialDetails: [
      "Continuous vertical white contrast stripe drafted cleanly from the bodice shoulder line to the wide palazzo hem.",
      "Structured shoulder-cap elevation balancing the asymmetric geometric neckline.",
      "Accurate jumpsuit torso rise and crotch depth allowing effortless stride and upright drape.",
    ],
    modulesApplied: [
      "Jumpsuit Construction",
      "Sleeve Architecture",
      "Trouser Rise & Fit",
    ],
  },
  {
    id: "white-crossover-wrap-shirt",
    title:
      "Crisp White Architectural Cross-Front Wrap Shirt & Charcoal Trousers",
    studentLabel: "Shirting & Tailoring Project",
    category: "Tailored Suits & Separates",
    levelBadge: "Foundational Graduate",
    primaryImage: "/images/students/student-white-crossover-shirt.jpg",
    angles: [
      {
        url: "/images/students/student-white-crossover-shirt.jpg",
        label: "Full Look at JHF Crest",
      },
    ],
    summary:
      "Crisp cotton cross-front collared blouse drafted with asymmetric pointed hem panels and long buttoned French cuffs, paired with tailored charcoal ankle trousers.",
    pictorialDetails: [
      "Traditional two-piece shirt collar stand converted into a clean diagonal wrap overlap with concealed lower fit.",
      "Pointed asymmetric front hem panels interfaced for sharp crisp corners and clean under-stitching.",
      "Balanced charcoal straight trousers featuring clean waistline construction and flat front drape.",
    ],
    modulesApplied: [
      "Shirt & Collar Construction",
      "Trouser Drafting",
      "Interfacing & Pressing",
    ],
  },
  {
    id: "champagne-satin-wrap-trouser",
    title:
      "Champagne Satin Bishop-Sleeve Wrap Blouse & Espresso Wide-Leg Trousers",
    studentLabel: "Studio Showcase at JHF Crest",
    category: "Tailored Suits & Separates",
    levelBadge: "Foundational / Intermediate",
    primaryImage: "/images/students/student-duo-satin-emerald.jpg",
    angles: [
      {
        url: "/images/students/student-duo-satin-emerald.jpg",
        label: "JHF Crest Duo View",
      },
      {
        url: "/images/students/student-satin-wrap-trouser.jpg",
        label: "Wrap & Trouser Drape",
      },
    ],
    summary:
      "Lustrous champagne satin wrap top with collared neckline, waist tie sash, and blouson cuffs paired with high-waist chocolate brown wide-leg trousers.",
    pictorialDetails: [
      "Delicate slippery satin tension-controlled cleanly on industrial lockstitch machines with zero puckered seams.",
      "Full bishop sleeves gathered uniformly into structured buttoned shirt cuffs.",
      "High-waist espresso wide-leg trousers drafted for an elongated, fluid silhouette.",
    ],
    modulesApplied: [
      "Shirt & Sleeve Development",
      "Specialty Fabric Handling",
      "Wide-Leg Trouser Block",
    ],
  },
  {
    id: "plum-buttoned-jumpsuit-pink-gown",
    title:
      "Deep Plum Square-Neck Buttoned Jumpsuit & Rose-Blush Modest Gown",
    studentLabel: "Batch Practical Showcase",
    category: "Jumpsuits & Palazzo Sets",
    levelBadge: "Foundational Track",
    primaryImage: "/images/students/student-duo-plum-jumpsuit-pink-gown.jpg",
    angles: [
      {
        url: "/images/students/student-duo-plum-jumpsuit-pink-gown.jpg",
        label: "Duo Project Showcase",
      },
      {
        url: "/images/students/student-plum-jumpsuit-detail.jpg",
        label: "Bodice & Button Detail",
      },
    ],
    summary:
      "Dual practical showcase pairing a deep plum square-neck buttoned palazzo jumpsuit with a two-tone rose & blush panelled modest A-line maxi gown.",
    pictorialDetails: [
      "Asymmetric square neckline secured with decorative pearl-and-gold statement buttons and crisp vertical waist darts.",
      "Long-line palazzo trouser legs cut for smooth movement without waist pulling.",
      "Multi-panel princess and side-flare color blocking on the companion rose & blush modest maxi dress.",
    ],
    modulesApplied: [
      "Jumpsuit Pattern Modification",
      "Princess Seam Variations",
      "Dress Construction",
    ],
  },
  {
    id: "mustard-navy-and-plum-contour",
    title:
      "Mustard & Navy Geometric Panel Dress + Plum Sweetheart Contour Dress",
    studentLabel: "Contouring & Style-Line Study",
    category: "Color-Block & Contour Dresses",
    levelBadge: "Intermediate Contouring",
    primaryImage: "/images/students/student-duo-mustard-plum.jpg",
    angles: [
      {
        url: "/images/students/student-duo-mustard-plum.jpg",
        label: "Duo Contour Showcase",
      },
      {
        url: "/images/students/student-mustard-navy-panel.jpg",
        label: "Solo Mustard & Navy Dress",
      },
    ],
    summary:
      "Side-by-side demonstration of bustier sweetheart contouring and multi-piece architectural color-block panel cutting across fitted corporate midi silhouettes.",
    pictorialDetails: [
      "Sweetheart neckline contour seam converted smoothly across contrasting plum and blush fabric zones.",
      "Vertical and horizontal navy-and-mustard architectural cut-ins creating slimming optical lines.",
      "Crisp internal facing and concealed back zipper closure with zero ripple.",
    ],
    modulesApplied: [
      "Bustier & Contouring",
      "Pattern Manipulation",
      "Corporate Midi Finishing",
    ],
  },
  {
    id: "palazzo-paperbag-and-floral-jumpsuit",
    title:
      "Burnt-Orange Paperbag Palazzo Trousers & Botanical Palazzo Jumpsuit",
    studentLabel: "Cohort Wide-Leg Study",
    category: "Jumpsuits & Palazzo Sets",
    levelBadge: "Foundational Graduate",
    primaryImage: "/images/students/student-duo-palazzo-floral.jpg",
    angles: [
      {
        url: "/images/students/student-duo-palazzo-floral.jpg",
        label: "Duo Palazzo View",
      },
      {
        url: "/images/students/student-floral-palazzo-jumpsuit.jpg",
        label: "Floral Palazzo Jumpsuit",
      },
    ],
    summary:
      "Structured high-waist paperbag belted palazzo trousers presented alongside a vibrant gold-and-crimson floral wide-leg palazzo jumpsuit.",
    pictorialDetails: [
      "Gathered high-rise paperbag waistband with wide self-fabric sash tie and deep front trouser pleats.",
      "Matched print continuity along the center-front and side seams of the floral palazzo jumpsuit.",
      "Generous wide-leg flare engineered to fall cleanly without dragging or twisting.",
    ],
    modulesApplied: [
      "Trouser Construction",
      "Jumpsuit Pattern Drafting",
      "Print Layout & Cutting",
    ],
  },
  {
    id: "striped-bow-and-star-peplum",
    title:
      "Green Striped Statement Bow Shirt & Star-Print V-Neck Peplum Set",
    studentLabel: "Shirt & Separates Practical",
    category: "Tailored Suits & Separates",
    levelBadge: "Foundational Track",
    primaryImage: "/images/students/student-duo-striped-bow-star.jpg",
    angles: [
      {
        url: "/images/students/student-duo-striped-bow-star.jpg",
        label: "Duo Shirt & Trouser View",
      },
      {
        url: "/images/students/student-star-peplum-shirt.jpg",
        label: "Solo Star Peplum Top",
      },
    ],
    summary:
      "Two-student studio shirting presentation combining a green-and-white striped sculptural front-bow top with a fitted star-print V-neck notched-hem shirt.",
    pictorialDetails: [
      "Stripe direction intentionally alternated between collar, yoke, and oversized tailored bow tie.",
      "V-neck star-print shirt contoured through front darts into a sleek split-notch peplum hem.",
      "Complemented by clean lime-green and navy flat-front tailored trousers.",
    ],
    modulesApplied: [
      "Shirt Construction",
      "Collar & Placket Detailing",
      "Stripe Alignment",
    ],
  },
  {
    id: "colorblock-lattice-and-orchid-tailoring",
    title:
      "Royal Blue Princess-Lattice Dress, Burgundy Shift & Orchid Suit Set",
    studentLabel: "Multi-Cohort Studio Showcase",
    category: "Color-Block & Contour Dresses",
    levelBadge: "Foundational & Intermediate",
    primaryImage: "/images/students/student-duo-colorblock-dresses.jpg",
    angles: [
      {
        url: "/images/students/student-duo-colorblock-dresses.jpg",
        label: "Color-Block Dresses Duo",
      },
      {
        url: "/images/students/student-orchid-shirt-trouser.jpg",
        label: "Orchid Shirt & Trousers",
      },
    ],
    summary:
      "Creative pattern-manipulation showcase featuring curved ivory-and-royal princess paneling with side lattice ties, collared burgundy shift styling, and orchid monochrome tailoring.",
    pictorialDetails: [
      "Curved bust-to-hip contrast cream yoke integrated smoothly into royal blue dress paneling with tie-lattice cutouts.",
      "Clean contrast lapel and side-panel color blocking on the burgundy and blush longline shift dress.",
      "Fitted orchid satin-crepe button shirt paired with high-waist brown corporate trousers at the JHF crest.",
    ],
    modulesApplied: [
      "Princess Seam Variations",
      "Dress Variations",
      "Shirt & Trouser Assembly",
    ],
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
