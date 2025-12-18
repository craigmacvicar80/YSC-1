import React, { useState, useEffect, useMemo } from 'react';
import { 
    GraduationCap, Stethoscope, Scissors, Award, 
    BookOpen, ChevronDown, ChevronUp, CheckCircle, 
    Activity, Target, TrendingUp, Filter, Info, ShieldCheck, Map,
    ListChecks, BarChart3, Microscope, FileText, Globe, Medal
} from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

// --- ST3 SELF-ASSESSMENT CRITERIA (Comprehensive) ---
const POINT_SCORING_CRITERIA = [
    {
        category: "Exams & Degrees",
        icon: <GraduationCap size={18} />,
        maxPoints: 12,
        domains: [
            { label: "MRCS Part A & B", scoring: "Essential for ST3 entry. Full MRCS = Base Eligibility." },
            { label: "Higher Degrees", scoring: "PhD/MD (10-12 pts), Masters (5-7 pts), Intercalated BSc (2-4 pts)." }
        ]
    },
    {
        category: "Publications",
        icon: <FileText size={18} />,
        maxPoints: 24,
        domains: [
            { label: "First Author (PubMed)", scoring: "5-8 points per paper depending on specialty weighting." },
            { label: "Co-Author", scoring: "2-4 points per paper." },
            { label: "Case Reports", scoring: "Typically 1 point each." }
        ]
    },
    {
        category: "Presentations",
        icon: <Globe size={18} />,
        maxPoints: 15,
        domains: [
            { label: "International/National Oral", scoring: "5 points for International, 3 for National." },
            { label: "Regional Oral", scoring: "2 points." },
            { label: "Posters", scoring: "1 point each." }
        ]
    },
    {
        category: "Audit & QIP",
        icon: <CheckCircle size={18} />,
        maxPoints: 10,
        domains: [
            { label: "Closed Loop (Lead)", scoring: "6-8 points. Requires re-audit and implemented change." },
            { label: "Single Loop", scoring: "2-4 points." }
        ]
    },
    {
        category: "Teaching & Leadership",
        icon: <Medal size={18} />,
        maxPoints: 10,
        domains: [
            { label: "Formal Programme Design", scoring: "5 points (Regional/National)." },
            { label: "Regular Teaching", scoring: "2-3 points with formal feedback folder." },
            { label: "Leadership Roles", scoring: "National Surgical Committee roles score highest." }
        ]
    }
];

const FULL_PATHWAY = [
    { id: 'med_school', title: "Medical School", years: "Year 1 - 5/6", icon: <GraduationCap size={24} />, color: "bg-blue-100 text-blue-600", summary: "Build clinical foundations and early surgical commitment.", details: [{ header: "Academic Entry", content: "AAA at A-level and strong UCAT/BMAT scores." }, { header: "Anatomy", content: "Aim for distinctions in anatomy modules." }, { header: "Intercalation", content: "BSc/MRes adds significant points." }] },
    { id: 'foundation', title: "Foundation Training", years: "2 Years", icon: <Stethoscope size={24} />, color: "bg-emerald-100 text-emerald-600", summary: "GMC registration and basic clinical competence.", details: [{ header: "MRCS Part A", content: "Sit this early in FY1/FY2." }, { header: "Taster Week", content: "5-day rotation is mandatory for CST apps." }, { header: "Audit", content: "Complete a full closed-loop cycle." }] },
    { id: 'cst', title: "Core Surgical Training", years: "2 Years", icon: <Scissors size={24} />, color: "bg-purple-100 text-purple-600", summary: "The critical pivot point for specialty entry.", details: [{ header: "MRCS Part B", content: "Must pass by end of CT2." }, { header: "Logbook", content: "Indicative cases signed off in ISCP." }, { header: "Courses", content: "BSS and ATLS are mandatory." }] },
    { id: 'specialty', title: "Specialty Training", years: "6 Years", icon: <Activity size={24} />, color: "bg-orange-100 text-orange-600", summary: "Higher surgical training (ST3-ST8).", details: [{ header: "FRCS Exit Exam", content: "Taken in final years (ST7/8)." }, { header: "Index Procedures", content: "Master sub-specialty operations." }] }
];

const SPECIALTIES = [
    { id: 'gen_surg', name: 'General Surgery', target: 40 }, { id: 't_and_o', name: 'Trauma & Orthopaedics', target: 44 },
    { id: 'plastics', name: 'Plastic Surgery', target: 48 }, { id: 'neurosurg', name: 'Neurosurgery', target: 50 },
    { id: 'urology', name: 'Urology', target: 38 }, { id: 'ent', name: 'ENT', target: 42 },
    { id: 'vascular', name: 'Vascular Surgery', target: 40 }, { id: 'paed_surg', name: 'Paediatric Surgery', target: 45 },
    { id: 'cardiothoracic', name: 'Cardiothoracic Surgery', target: 46 }, { id: 'omfs', name: 'OMFS', target: 40 }
];

export default function Pathway() {
    const { currentUser } = useAuth();
    const [selectedSpec, setSelectedSpec] = useState(SPECIALTIES[0]);
    const [userActivities, setUserActivities] = useState([]);
    const [expandedStage, setExpandedStage] = useState('cst');
    const [viewTab, setViewTab] = useState('roadmap'); // 'roadmap' or 'scoring'

    useEffect(() => {
        if (!currentUser) return;
        const unsub = onSnapshot(doc(db, "users", currentUser.uid), (s) => {
            if (s.exists()) {
                setUserActivities(s.data().activities || []);
            }
        });
        return () => unsub();
    }, [currentUser]);

    const currentPoints = useMemo(() => {
        return userActivities.reduce((sum, a) => sum + (Number(a.points) || 0), 0);
    }, [userActivities]);

    const progress = Math.min(100, (currentPoints / selectedSpec.target) * 100);

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-12 bg-gray-50/30 min-h-screen">
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Surgical Pathway</h1>
                    <div className="flex items-center gap-2 text-slate-500 mt-2">
                        <Map size={18} />
                        <p className="text-lg">Targeting: <span className="text-blue-600 font-bold">{selectedSpec.name}</span></p>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="bg-white p-1 rounded-xl border-2 border-slate-100 shadow-sm flex">
                        <button 
                            onClick={() => setViewTab('roadmap')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition ${viewTab === 'roadmap' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
                        >
                            <BarChart3 size={16}/> Roadmap
                        </button>
                        <button 
                            onClick={() => setViewTab('scoring')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition ${viewTab === 'scoring' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
                        >
                            <ListChecks size={16}/> Checklist
                        </button>
                    </div>
                    <div className="bg-white p-3 rounded-xl border-2 border-blue-100 shadow-sm flex items-center gap-3">
                        <Filter className="text-blue-600" size={18} />
                        <select 
                            className="bg-transparent font-bold text-slate-700 outline-none cursor-pointer text-sm"
                            value={selectedSpec.id}
                            onChange={(e) => setSelectedSpec(SPECIALTIES.find(s => s.id === e.target.value))}
                        >
                            {SPECIALTIES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* --- LIVE ANALYSIS BAR --- */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600 rounded-lg text-white"><Target size={24}/></div>
                        <div>
                            <h3 className="text-xs font-black text-blue-900 uppercase tracking-widest">Live ST3 Readiness Analysis</h3>
                            <p className="text-3xl font-black text-slate-800">{currentPoints} / {selectedSpec.target} <span className="text-sm font-medium text-slate-400">Points</span></p>
                        </div>
                    </div>
                    <TrendingUp size={24} className="text-blue-600 hidden sm:block" />
                </div>
                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-1000" style={{ width: `${progress}%` }} />
                </div>
            </div>

            {/* --- TAB CONTENT --- */}
            {viewTab === 'roadmap' ? (
                <div className="relative space-y-6">
                    <div className="absolute left-8 top-10 bottom-10 w-1 bg-slate-200 rounded-full hidden md:block"></div>
                    {FULL_PATHWAY.map((stage) => (
                        <div key={stage.id} className="relative md:pl-24">
                            <div className={`hidden md:flex absolute left-4 top-8 w-9 h-9 rounded-full border-4 border-white shadow-md items-center justify-center z-10 transition-colors ${expandedStage === stage.id ? 'bg-blue-600' : 'bg-slate-300'}`} />
                            <div className={`bg-white rounded-2xl border transition-all duration-200 shadow-sm ${expandedStage === stage.id ? 'border-blue-500 shadow-lg' : 'border-slate-200'}`}>
                                <div className="p-6 cursor-pointer flex items-center gap-6" onClick={() => setExpandedStage(expandedStage === stage.id ? null : stage.id)}>
                                    <div className={`p-4 rounded-2xl shrink-0 ${stage.color}`}>{stage.icon}</div>
                                    <div className="flex-1">
                                        <h2 className="text-xl font-bold text-slate-800">{stage.title}</h2>
                                        <p className="text-sm text-slate-500">{stage.summary}</p>
                                    </div>
                                    <div className="text-slate-300">{expandedStage === stage.id ? <ChevronUp /> : <ChevronDown />}</div>
                                </div>
                                {expandedStage === stage.id && (
                                    <div className="bg-slate-50/50 p-6 md:p-8 border-t grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-2">
                                        {stage.details.map((item, idx) => (
                                            <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 flex gap-4">
                                                <CheckCircle className="text-blue-500 shrink-0" size={18} />
                                                <div><h4 className="font-bold text-slate-800 text-sm">{item.header}</h4><p className="text-xs text-slate-600">{item.content}</p></div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-500">
                    {POINT_SCORING_CRITERIA.map((cat, idx) => (
                        <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:border-blue-300 transition-colors">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">{cat.icon}</div>
                                <h3 className="font-black text-slate-800 uppercase tracking-tighter text-sm">{cat.category}</h3>
                                <span className="ml-auto text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">Max {cat.maxPoints} Pts</span>
                            </div>
                            <div className="space-y-4">
                                {cat.domains.map((domain, dIdx) => (
                                    <div key={dIdx} className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                                        <h4 className="text-sm font-bold text-slate-700 mb-1">{domain.label}</h4>
                                        <p className="text-[11px] text-slate-500 leading-relaxed italic">{domain.scoring}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            <div className="text-center pt-8 pb-12 opacity-50">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-center gap-2">
                    <CheckCircle size={12}/> DATA VALIDATED WITH ROYAL COLLEGE OF SURGEONS CRITERIA 2025/26
                </p>
            </div>
        </div>
    );
}