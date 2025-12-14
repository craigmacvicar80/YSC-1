// src/pages/Pathway.js - Fixed Import Error
import React, { useState } from 'react';
import { 
    GraduationCap, Stethoscope, Scissors, Award, // Changed Scalpel to Scissors
    BookOpen, ChevronDown, ChevronUp, CheckCircle, 
    Activity, ArrowRight 
} from 'lucide-react';

// --- DATA: COMPREHENSIVE SURGICAL PATHWAY ---
const PATHWAY_DATA = [
    {
        id: 'med_school',
        title: "Medical School",
        years: "Year 1 - 5/6",
        icon: <GraduationCap size={24} />,
        color: "bg-blue-100 text-blue-600",
        summary: "Building the foundation. Focus on anatomy, physiology, and early exposure to surgery.",
        guide: {
            title: "Medical School Maximizer Guide",
            sections: [
                {
                    header: "1. Academic Excellence & Anatomy",
                    content: "Surgery requires deep anatomical knowledge. Aim for distinctions in anatomy and physiology. Consider an intercalated BSc or MRes to gain early research points."
                },
                {
                    header: "2. Early Commitment (Max 3-5 points later)",
                    content: "Join your university Surgical Society. Aim for a committee role (President/Treasurer). Organize basic suturing workshops for younger years."
                },
                {
                    header: "3. Electives & Prizes",
                    content: "Use your elective to experience high-volume surgery (e.g., Trauma in South Africa or a busy UK unit). Apply for RCS essay prizes (e.g., The Lister Essay Prize)."
                },
                {
                    header: "4. Research & Audit",
                    content: "Don't just collect data. Try to present a poster at a national student conference. Even one poster now counts for your core training application later."
                }
            ]
        }
    },
    {
        id: 'foundation',
        title: "Foundation Training (FY1 - FY2)",
        years: "2 Years",
        icon: <Stethoscope size={24} />,
        color: "bg-emerald-100 text-emerald-600",
        summary: "Gaining core competencies, completing MRCS Part A, and building your generic portfolio.",
        guide: {
            title: "Foundation Years Success Strategy",
            sections: [
                {
                    header: "1. MRCS Part A (Essential)",
                    content: "Attempt this in FY1 or early FY2. It is a mandatory pass-fail barrier for entry into Core Surgical Training (CST). Start revision 3-4 months prior."
                },
                {
                    header: "2. The 'Taster Week'",
                    content: "Mandatory for CST application. Spend 5 days in your target specialty (e.g., Plastics, Gen Surg, Ortho). Get a signed letter confirming this."
                },
                {
                    header: "3. Audit / QIP (The 'Gold Standard')",
                    content: "Do not just collect data. You MUST complete the cycle (Plan -> Do -> Study -> Act -> Re-audit). A closed-loop audit scores significantly higher than a single cycle."
                },
                {
                    header: "4. Core Procedures",
                    content: "Log everything. Aim for competence in: Abscess drainage, excision of skin lesions, catheterization, and basic laparoscopy camera holding."
                }
            ]
        }
    },
    {
        id: 'core_training',
        title: "Core Surgical Training (CT1 - CT2)",
        years: "2 Years",
        icon: <Scissors size={24} />, // Changed Scalpel to Scissors
        color: "bg-purple-100 text-purple-600",
        summary: "The critical phase. Preparing for the ST3 National Selection.",
        guide: {
            title: "ST3 General Surgery Point Guide (Competitive Scoring)",
            sections: [
                {
                    header: "1. Commitment to Specialty (Max 8 points)",
                    content: "Demonstrate genuine interest. High-yield: Surgical Elective (2-4 pts), Society Membership (ASiT) (1-2 pts), Attend National Conferences (1 pt per conference)."
                },
                {
                    header: "2. Qualifications (Max 12 points)",
                    content: "PhD/MD (8-10 pts), Masters (MSc/MRes) (5-7 pts), Intercalated BSc (3-5 pts). MRCS Full Membership is Essential."
                },
                {
                    header: "3. Presentations & Publications (Max 24 points)",
                    content: "First Author PubMed paper (5-8 pts), Co-author (2-4 pts). International Oral Presentation (5 pts), National Oral (3 pts). Posters (1-2 pts)."
                },
                {
                    header: "4. Audits & QIP (Max 10 points)",
                    content: "Lead and complete full cycle with change implemented (6-8 pts). Single loop (3-4 pts). Contributing only (1-2 pts)."
                },
                {
                    header: "5. Teaching & Training (Max 8 points)",
                    content: "Develop a teaching programme (4-5 pts). Regular timetabled teaching (2-3 pts). 'Train the Trainers' qualification (2 pts)."
                },
                {
                    header: "TARGET SCORE",
                    content: "Aim for 40-50+ points to be competitive for ST3 posts in the UK."
                }
            ]
        }
    },
    {
        id: 'specialty',
        title: "Specialty Training (ST3 - ST8)",
        years: "6 Years",
        icon: <Activity size={24} />,
        color: "bg-orange-100 text-orange-600",
        summary: "Higher surgical training. Mastering the craft and passing the FRCS.",
        guide: {
            title: "The Road to Consultant",
            sections: [
                {
                    header: "1. The FRCS Exam (Section 1 & 2)",
                    content: "The exit exam. Typically taken around ST6/ST7. Requires intense study of pathology, critical care, and operative strategy."
                },
                {
                    header: "2. Index Procedures (Logbook)",
                    content: "You must hit indicative numbers for CCT (Certificate of Completion of Training). E.g., for Gen Surg: 80+ Appendicectomies, 50+ Cholecystectomies, etc."
                },
                {
                    header: "3. Research & Out of Programme (OOP)",
                    content: "Many registrars take 2 years out (OOPR) to complete a PhD or MD to secure competitive Consultant posts in teaching hospitals."
                },
                {
                    header: "4. Fellowship",
                    content: "Post-CCT fellowship (often international) to refine a sub-specialty skill (e.g., Bariatrics, Hand Surgery, Complex Trauma)."
                }
            ]
        }
    },
    {
        id: 'consultant',
        title: "Consultant Surgeon",
        years: "Career",
        icon: <Award size={24} />,
        color: "bg-indigo-100 text-indigo-600",
        summary: "Independent practice, leadership, and training the next generation.",
        guide: {
            title: "Life as a Consultant",
            sections: [
                {
                    header: "1. Clinical Leadership",
                    content: "Running your own theatre lists and clinics. You are legally responsible for patient outcomes under your care."
                },
                {
                    header: "2. Management Roles",
                    content: "Taking on roles like Clinical Lead, Medical Director, or College Tutor."
                },
                {
                    header: "3. Private Practice",
                    content: "Optional independent practice alongside NHS commitments."
                }
            ]
        }
    }
];

// --- COMPONENT ---
export default function Pathway() {
    const [expandedStage, setExpandedStage] = useState(null);

    const toggleStage = (id) => {
        if (expandedStage === id) {
            setExpandedStage(null);
        } else {
            setExpandedStage(id);
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-slate-800 mb-4">Surgical Training Pathway</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    A comprehensive roadmap from Medical School to Consultant. Click on any stage to reveal the detailed requirements, point-scoring opportunities, and milestones.
                </p>
            </div>

            <div className="relative">
                {/* Vertical Line (The Spine of the Flow Chart) */}
                <div className="absolute left-8 top-8 bottom-8 w-1 bg-gray-200 rounded-full hidden md:block"></div>

                <div className="space-y-8">
                    {PATHWAY_DATA.map((stage, index) => {
                        const isExpanded = expandedStage === stage.id;
                        
                        return (
                            <div key={stage.id} className="relative md:pl-24">
                                {/* Flow Chart Node (Circle on the line) */}
                                <div 
                                    className={`hidden md:flex absolute left-4 top-6 w-9 h-9 rounded-full border-4 border-white shadow-sm items-center justify-center z-10 transition-colors duration-300
                                    ${isExpanded ? 'bg-blue-600 scale-110' : 'bg-gray-300'}`}
                                >
                                    {isExpanded && <div className="w-3 h-3 bg-white rounded-full" />}
                                </div>

                                {/* Main Card */}
                                <div 
                                    className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden shadow-sm
                                    ${isExpanded ? 'border-blue-500 shadow-md ring-1 ring-blue-100' : 'border-gray-200 hover:border-blue-300'}`}
                                >
                                    {/* Card Header (Always Visible) */}
                                    <div 
                                        className="p-6 cursor-pointer flex flex-col md:flex-row gap-6 items-start md:items-center"
                                        onClick={() => toggleStage(stage.id)}
                                    >
                                        {/* Icon Box */}
                                        <div className={`p-4 rounded-xl shrink-0 ${stage.color}`}>
                                            {stage.icon}
                                        </div>

                                        {/* Title & Summary */}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <h2 className="text-xl font-bold text-slate-800">{stage.title}</h2>
                                                <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
                                                    {stage.years}
                                                </span>
                                            </div>
                                            <p className="text-gray-600">{stage.summary}</p>
                                        </div>

                                        {/* Arrow Toggle */}
                                        <div className="hidden md:block text-gray-400">
                                            {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                                        </div>
                                    </div>

                                    {/* Expanded Detail Guide */}
                                    {isExpanded && (
                                        <div className="border-t border-gray-100 bg-gray-50 p-6 md:p-8 animate-in slide-in-from-top-2 duration-200">
                                            <div className="flex items-center gap-2 mb-6">
                                                <BookOpen size={20} className="text-blue-600" />
                                                <h3 className="text-lg font-bold text-slate-800">{stage.guide.title}</h3>
                                            </div>

                                            <div className="grid grid-cols-1 gap-6">
                                                {stage.guide.sections.map((section, idx) => (
                                                    <div key={idx} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                                                        <h4 className="font-bold text-slate-800 mb-2 flex items-start gap-2">
                                                            {section.header.includes("TARGET SCORE") ? (
                                                                <Award className="text-yellow-500 shrink-0 mt-0.5" size={18} />
                                                            ) : (
                                                                <CheckCircle className="text-blue-500 shrink-0 mt-0.5" size={18} />
                                                            )}
                                                            {section.header}
                                                        </h4>
                                                        <p className="text-gray-600 text-sm leading-relaxed ml-7">
                                                            {section.content}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}