// src/data/portfolioData.js - OVERWRITE COMPLETELY (Finalizing all features and content)

// --- CPD Guidelines (Used by Modals and Pathway) ---
const CPD_GUIDELINES = [
    { 
        category: 'Research & Innovation', 
        items: [
            { criteria: 'First/Senior Author Publication (Peer-Reviewed)', points: 15 }, 
            { criteria: 'Co-Author Publication (Peer-Reviewed)', points: 10 }, 
            { criteria: 'Oral Presentation (National/International)', points: 8 }, 
            { criteria: 'Poster Presentation (National/International)', points: 5 },
            { criteria: 'Local/Regional Presentation', points: 2 },
            { criteria: 'Grant or Fellowship Awarded (per £10k)', points: 5 }
        ] 
    },
    { 
        category: 'Teaching & Education', 
        items: [
            { criteria: 'Formal Teaching Program Lead (e.g. Course Director)', points: 5 }, 
            { criteria: 'Delivered a Formal Lecture/Seminar (1hr+)', points: 3 }, 
            { criteria: 'Mentoring/Supervision (per trainee per annum)', points: 2 },
            { criteria: 'Informal Bedside Teaching (Logged Session)', points: 0.5 },
            { criteria: 'Teaching Qualification (e.g. PGCert completion)', points: 10 }
        ] 
    },
    { 
        category: 'Clinical Activities', 
        items: [
            { criteria: 'Clinical Audit Cycle Completion (Two Stages)', points: 5 }, 
            { criteria: 'Formal QI Project Lead', points: 8 }, 
            { criteria: 'Significant Adverse Event Reflection', points: 1 }, 
            { criteria: 'Formal Course Attendance (e.g. ATLS, CCrISP)', points: 3 },
            { criteria: 'Journal Club Participation (per session)', points: 0.5 },
            { criteria: 'Appraisal Meeting Attendance (Annual)', points: 4 }
        ] 
    },
    { 
        category: 'Leadership & Management', 
        items: [
            { criteria: 'Formal Committee Membership (Local/Regional)', points: 4 }, 
            { criteria: 'Successful Change Management Initiative', points: 6 }, 
            { criteria: 'Management Qualification/Module', points: 5 },
            { criteria: 'Trainee Representative Role (per annum)', points: 3 }
        ] 
    }
];

// --- Dashboard Data ---
const GOAL_POINTS = 150;
const INITIAL_READINESS_SCORES = [
    { subject: 'Clinical', A: 80 }, { subject: 'Research', A: 55 }, { subject: 'Teaching', A: 70 }, { subject: 'Audit/QI', A: 65 }, { subject: 'Leadership', A: 75 }
];
const MOCK_CASE_DATA = {
    totalCases: 452,
    essentialProceduresCompleted: 45,
    essentialProceduresTarget: 60
};
const MOCK_MENTOR_STATUS = {
    supervisor: "Dr. Eleanor Vance (Consultant)",
    formStatus: "Pending Trainee Submission",
    alignmentScore: 78
};

// --- Network Data ---
const MOCK_NETWORK = [
    { id: 1, name: "Prof. Alan Turing", role: "Head of Research & Innovation", initials: "AT", color: "bg-indigo-500", specialty: "General Surgery", email: "alan.turing@example.com", phone: "+44 20 7946 0999", linkedin: "https://linkedin.com/in/alanturing", status: "Active Mentor", notes: "Lead on my AI in Surgery paper. Contact for publication advice." },
    { id: 2, name: "Dr. Grace Hopper", role: "Trainee Mentor & ST6", initials: "GH", color: "bg-teal-500", specialty: "Trauma & Orthopaedics", email: "grace.hopper@example.com", phone: "+44 20 7946 0998", linkedin: "https://linkedin.com/in/gracehopper", status: "Past Rotation", notes: "Excellent source for ST3 application advice. Very approachable." },
    { id: 3, name: "Dr. Charles Babbage", role: "Medical Director (Trust Level)", initials: "CB", color: "bg-red-500", specialty: "Leadership & Management", email: "charles.babbage@example.com", phone: "+44 20 7946 0997", linkedin: "https://linkedin.com/in/charlesbabbage", status: "Active Collaborator", notes: "A key contact for any QI projects needing trust-level support." },
    { id: 4, name: "Ada Lovelace", role: "Surgical Registrar ST4", initials: "AL", color: "bg-purple-500", specialty: "Plastic Surgery", email: "ada.lovelace@example.com", phone: "+44 20 7946 0996", linkedin: "https://linkedin.com/in/adalovelace", status: "Peer Support", notes: "Contact for interview practice and portfolio review." }
];
const DASHBOARD_EVENTS = [
    { title: "Surgical Skills Course", date: "20 Jan 2026", icon: "scalpel" },
    { title: "Leadership Workshop", date: "15 Feb 2026", icon: "award" },
    { title: "National Conference", date: "10 Mar 2026", icon: "globe" }
];

// --- Portfolio Data ---
const PREDEFINED_SKILLS = ["Laparoscopy", "Endoscopy", "Suturing", "Anastomosis", "Critical Care", "Audit", "Research Methodology"];
const MOCK_PROFILE_DATA = {
    name: "Dr. Jamie Smith",
    level: "Core Trainee ST1",
    gmc: "7654321",
    startDate: "Aug 2025",
    specialtyInterest: "Cardiothoracic Surgery",
    employmentHistory: [
        { id: 101, role: "CT1 Surgery", location: "St Thomas' Hospital", period: "Aug 2025 - Present", notes: "Focus on trauma and acute care." },
        { id: 102, role: "Foundation Year 2", location: "King's College Hospital", period: "Aug 2024 - Aug 2025", notes: "Key achievement: Led a hospital-wide audit." },
    ],
    memberships: [
        { id: 201, title: "Royal College of Surgeons (Eng)", details: "Full Member", evidence: "MembershipCard.pdf", notes: "Annual fee due in October." },
        { id: 202, title: "British Medical Association", details: "Junior Doctor", notes: "Negotiating new contract terms." }
    ],
    certifications: [
        { id: 301, title: "ATLS", details: "Valid until 2028", evidence: "ATLS_Cert.pdf", notes: "Need to book the next provider course." },
        { id: 302, title: "CCrISP", details: "Completed Jan 2025", notes: "Excellent course for non-technical skills." }
    ],
    skills: {
        technical: [
            { id: 401, name: "Laparoscopy", level: 4, endorsers: 3, notes: "Proficient with basic procedures (appendectomy, cholecystectomy)." },
            { id: 402, name: "Suturing", level: 5, endorsers: 5, notes: "Expert in continuous running subcuticular closure." }
        ],
    },
    awards: [
        { id: 501, title: "Deanery Quality Improvement Prize", details: "2024", notes: "Led to policy change in fluid prescribing." }
    ],
    evidence: [
        { id: 601, title: "Research Paper: 'AI in Surgery'", details: "Submitted to Lancet", evidence: "Paper_Draft.pdf", notes: "Awaiting final feedback from Prof. Turing." }
    ]
};
const MOCK_ACTIVITIES = [
    { id: 1, description: "Oral presentation at ASGBI conference", date: "2025-11-20", category: "Research & Innovation", points: 3, file: "ASGBI_Proof.pdf", summary: "Presented our paper on robotic surgery. Great feedback.", comments: "Need to network more at these events." },
    { id: 2, description: "Completed Trust Leadership Module", date: "2025-10-05", category: "Leadership & Management", points: 3, summary: "Learned about delegation.", comments: "Will apply lessons to team meetings." },
    { id: 3, description: "Completed Basic Suturing Workshop", date: "2025-09-01", category: "Clinical Activities", points: 2, summary: "Refined basic suturing techniques.", comments: "Practice is key." },
    { id: 4, description: "Co-authored journal article on ethics", date: "2025-08-15", category: "Research & Innovation", points: 3, summary: "Contributed two sections.", comments: "First publication, very proud." }
];
const INITIAL_ACTIVITIES = MOCK_ACTIVITIES; 

// --- Events Data ---
const INITIAL_EVENTS = [
    { id: 'e1', title: 'RCS Annual Conference', organizer: 'RCS England', type: 'Conference', location: 'London', cpd: 12, status: 'Open', startDate: '2026-10-25', url: '#' },
    { id: 'e2', title: 'ATLS Recertification', organizer: 'Major Trauma Centre', type: 'Course', location: 'Birmingham', cpd: 6, status: 'Full', startDate: '2025-12-15', url: '#' },
    { id: 'e3', title: 'Basic Skills Course', organizer: 'Local Deanery', type: 'Course', location: 'Hospital X', cpd: 5, status: 'Upcoming', startDate: '2026-03-01', url: '#' },
];

// --- Task Data ---
const MOCK_TASKS = [
    { id: 1, title: "Finalize Abstract for Conference", date: "2025-12-15", category: "Research", status: "due", priority: "High" },
    { id: 2, title: "Renew Royal College Membership", date: "2025-11-30", category: "Admin", status: "complete", priority: "Medium" },
    { id: 3, title: "Book ATLS Re-verification Course", date: "2026-01-20", category: "Clinical", status: "due", priority: "High" },
    { id: 4, title: "Organise Surgical Teaching Session", date: "2026-02-01", category: "Teaching", status: "pending", priority: "Medium" }
];
const INITIAL_TASKS = MOCK_TASKS; 


// --- Specialties Data (Full Detail) ---
const SPECIALTIES_DATA = [
    { 
        name: "General Surgery", competition: "2.5:1", duration: "8 years", code: "GS", societyName: "ASGBI", societyLink: "https://www.asgbi.org.uk/", 
        requirements: ["Full MRCS", "2 Core Surgical Years", "40+ Portfolio Points (competitive)"], 
        pathway: ["CT1-2", "ST3-8 (General Surgery)", "Consultant"], 
        keyProcedures: ["Laparoscopic Cholecystectomy", "Hernia Repair", "Appendicectomy"] 
    },
    { 
        name: "Trauma & Orthopaedics", competition: "4.5:1", duration: "8 years", code: "T&O", societyName: "BOTA", societyLink: "https://www.bota.org.uk/",
        requirements: ["Full MRCS", "Trauma and Orthopaedic Logbook", "National Presentation"], 
        pathway: ["CT1-2", "ST3-8 (T&O)", "Consultant"], 
        keyProcedures: ["Internal Fixation of Fractures", "Joint Arthroplasty", "Arthroscopy"] 
    },
    { 
        name: "Urology", competition: "3.2:1", duration: "7 years", code: "URO", societyName: "BAUS", societyLink: "https://www.baus.org.uk/",
        requirements: ["Full MRCS", "FRCS (Urol)", "Endoscopy experience"], 
        pathway: ["CT1-2", "ST3-7 (Urology)", "Consultant"], 
        keyProcedures: ["Cystoscopy", "TURP/TURBT", "Nephrectomy"] 
    },
    { 
        name: "ENT (Otolaryngology)", competition: "2.8:1", duration: "7 years", code: "ENT", societyName: "ENT UK", societyLink: "https://www.entuk.org/",
        requirements: ["Full MRCS or equivalent", "Head/Neck Anatomy knowledge"], 
        pathway: ["CT1-2", "ST3-7 (ENT)", "Consultant"], 
        keyProcedures: ["Tonsillectomy", "Septoplasty", "Tracheostomy"] 
    },
    { 
        name: "Neurosurgery", competition: "9.0:1", duration: "8 years", code: "NS", societyName: "SBNS", societyLink: "https://www.sbns.org.uk/",
        requirements: ["Neurosurgical Experience (Min 6 months)", "Academic record (PhD/MD preferred)"], 
        pathway: ["ST1-8 (Run-through)", "Consultant"], 
        keyProcedures: ["Craniotomy for Trauma", "Shunt Insertion", "Spinal Decompression"] 
    },
    { 
        name: "Plastic Surgery", competition: "6.5:1", duration: "8 years", code: "PLA", societyName: "BAPRAS", societyLink: "https://www.bapras.org.uk/",
        requirements: ["Relevant publications", "Microsurgery Course/Skills"], 
        pathway: ["CT1-2", "ST3-8 (Plastics)", "Consultant"], 
        keyProcedures: ["Flap Surgery", "Skin Grafting", "Microsurgical Anastomosis"] 
    },
    { 
        name: "Cardiothoracic Surgery", competition: "7.2:1", duration: "8 years", code: "CTS", societyName: "SCTS", societyLink: "https://scts.org/",
        requirements: ["Cardiothoracic specific experience", "Research or Academic degree"], 
        pathway: ["ST1-8 (Run-through)", "Consultant"], 
        keyProcedures: ["Coronary Bypass", "Valve Replacement", "Lobectomy"] 
    },
    { 
        name: "OMFS (Maxillofacial)", competition: "1.5:1", duration: "7 years", code: "OMFS", societyName: "BAOMS", societyLink: "https://www.baoms.org.uk/",
        requirements: ["Medical Degree AND Dental Degree", "Full MRCS"], 
        pathway: ["Pre-ST", "ST3-7 (OMFS)", "Consultant"], 
        keyProcedures: ["Facial Trauma Fixation", "Orthognathic Surgery", "Head & Neck Cancer Resection"] 
    },
    { 
        name: "Vascular Surgery", competition: "2.1:1", duration: "8 years", code: "VAS", societyName: "VASC", societyLink: "https://www.vascularsociety.org.uk/",
        requirements: ["Experience in acute general surgery", "FRCS (Gen/Vasc)"], 
        pathway: ["CT1-2", "ST3-8 (Vascular)", "Consultant"], 
        keyProcedures: ["Aortic Aneurysm Repair (Open/Endo)", "Carotid Endarterectomy", "Peripheral Bypass"] 
    },
    { 
        name: "Paediatric Surgery", competition: "6.0:1", duration: "8 years", code: "PAED", societyName: "BAPS", societyLink: "https://www.baps.org.uk/",
        requirements: ["Experience in Paediatrics", "Demonstrated commitment to children's surgery"], 
        pathway: ["CT1-2", "ST3-8 (Paeds)", "Consultant"], 
        keyProcedures: ["Appendicectomy (Paediatric)", "Inguinal Hernia Repair", "Congenital Anomaly Correction"] 
    },
];
const SURGICAL_SPECIALTIES = SPECIALTIES_DATA;

// --- Pathway Data (Full Detail) ---
const TRAINING_PATHWAY = [
    {
        stage: "Foundation Years (FY1 - FY2) - Core Preparation",
        duration: "2 Years",
        focus: "Broad experience across medical and surgical specialties. Essential skill acquisition.",
        milestones: [{ id: 1, title: "Successful ARCP Progression", deadline: "Jul 2026", target: "Completed", status: "complete" }, { id: 2, title: "MRCS Part A Exam", deadline: "Sep 2026", target: "Attempt/Pass", status: "due" }],
        targets: ["1 Teaching Activity", "1 Audit/QIP Cycle", "Basic Suturing Skills"],
        resources: [{ name: "RCS Core Surgery Interview Guide", link: "https://www.rcseng.ac.uk/education/career-development/core-surgical-training/" }, { name: "BMA Career Resources", link: "https://www.bma.org.uk/advice-and-support/career-development" }]
    },
    {
        stage: "Core Surgical Training (CT1 - CT2) - ST3 Readiness",
        duration: "2 Years",
        focus: "Specialty rotation and preparation for competitive ST3 application.",
        milestones: [{ id: 3, title: "Full MRCS (Part B)", deadline: "Dec 2027", target: "Pass", status: "due" }, { id: 4, title: "ST3 Application Readiness", deadline: "Nov 2027", target: "40+ Points", status: "due" }],
        targets: ["1 Peer-Reviewed Publication", "ATLS and CSTC Certification", "Advanced Laparoscopic Skills"],
        resources: [{ name: "ST3 Recruitment National Guidelines", link: "https://specialtytraining.hee.nhs.uk/recruitment" }, { name: "Surgical Portfolio Scoring Criteria Breakdown", link: "#" }]
    },
    {
        stage: "Registrar (ST3 - ST8) - Specialty Training",
        duration: "6 Years",
        focus: "Intensive training in chosen surgical specialty (e.g., General Surgery). Developing independence and sub-specialty interest.",
        milestones: [{ id: 5, title: "FRCS Exit Exam", deadline: "Year 6", target: "Pass", status: "upcoming" }, { id: 6, title: "Sub-specialty Fellowship Planning", deadline: "Year 7", target: "Secured Post", status: "upcoming" }],
        targets: ["Logbook Completion (Min 1200 Cases)", "Advanced Leadership Role", "Sub-Specialty Fellowship"],
        resources: [{ name: "RCS FRCS Exam Resources", link: "https://www.rcseng.ac.uk/education/exams/frcs/" }, { name: "Fellowship Opportunities Directory", link: "#" }]
    },
];

// --- Personal Dev Data (Full Detail) ---
const PERSONAL_DEV_RESOURCES = [
    { topic: "Leadership & Management (Registrar Focus)", level: "ST3+", brief: "Formal leadership training and understanding clinical governance.", goals: ["Complete mandatory Leadership and Management module (e.g., FMLM)", "Lead one major audit or QIP project."], resources: [{ name: "FMLM: The Leadership Framework", link: "https://www.fmlm.ac.uk/" }, { name: "NHS Leadership Academy Programs", link: "https://www.leadershipacademy.nhs.uk/" }] },
    { topic: "Mentorship & Coaching (Consultant Focus)", level: "Consultant", brief: "Developing effective mentoring skills to guide junior trainees.", goals: ["Complete a 'Training the Trainers' course.", "Set up a formal mentorship group."], resources: [{ name: "RCS: Surgical Educators Course", link: "https://www.rcseng.ac.uk/education/" }, { name: "Medical Mentor Network UK", link: "#" }] },
];

// --- Job Data ---
const HOSPITALS_DATA = [
    { name: "St. Thomas' Hospital", location: 'London', type: 'NHS', nation: 'England', employer: 'Guy\'s and and St Thomas\' NHS Foundation Trust', specialties: ['Cardiothoracic Surgery', 'General Surgery', 'Urology'] },
    { name: 'Royal Infirmary', location: 'Edinburgh', type: 'NHS', nation: 'Scotland', employer: 'NHS Lothian', specialties: ['Trauma & Orthopaedics', 'Neurosurgery'] },
];
const MOCK_JOB_LISTINGS = [
    { id: 'j1', title: 'CT1/2 Surgical Rotation', employer: 'Barts Health NHS Trust', hospital: 'The Royal London Hospital', specialty: 'General Surgery', deadline: '2025-12-30', link: '#' },
    { id: 'j2', title: 'ST3 Neurosurgery Training Post', employer: 'NHS Greater Glasgow and Clyde', hospital: 'Queen Elizabeth University Hospital', specialty: 'Neurosurgery', deadline: '2026-01-15', link: '#' },
];
const JOB_PORTALS = {
    NHS: 'https://www.nhsjobs.com/search?keyword=',
    SCOT: 'https://www.medicaljobs.scot.nhs.uk/search?keyword=',
    HSC: 'https://jobs.hscni.net/search?keyword=',
    BUPA: 'https://careers.bupa.co.uk/search?q=',
};


// --- FINAL EXPORTS LIST (Unifying all constants) ---
export {
    GOAL_POINTS, INITIAL_READINESS_SCORES, MOCK_CASE_DATA, MOCK_MENTOR_STATUS,
    MOCK_NETWORK, DASHBOARD_EVENTS, PREDEFINED_SKILLS, MOCK_PROFILE_DATA,
    MOCK_ACTIVITIES, INITIAL_ACTIVITIES, INITIAL_EVENTS, MOCK_TASKS, INITIAL_TASKS,
    CPD_GUIDELINES, SURGICAL_SPECIALTIES, TRAINING_PATHWAY, PERSONAL_DEV_RESOURCES,
    HOSPITALS_DATA, MOCK_JOB_LISTINGS, JOB_PORTALS
};