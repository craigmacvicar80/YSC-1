// src/pages/Specialties.js - OVERWRITE COMPLETELY (Final stabilization fix)

import React, { useState } from 'react';
import { Syringe, Bone, Droplet, Ear, Brain, PenTool as Pencil, Heart, GraduationCap, Zap, ChevronRight, ClipboardList, Milestone, ExternalLink, X, Globe, User, Activity, Lungs, Baby, Scissors } from 'lucide-react';
import { SURGICAL_SPECIALTIES } from '../data/portfolioData'; // Ensure data is imported

// Map icons to the specialty names for dynamic rendering (10 Icons)
const specialtyIcons = {
    "General Surgery": <Syringe size={24} />,
    "Trauma & Orthopaedics": <Bone size={24} />,
    "Urology": <Droplet size={24} />,
    "ENT (Otolaryngology)": <Ear size={24} />,
    "Neurosurgery": <Brain size={24} />,
    "Plastic Surgery": <Pencil size={24} />,
    "Cardiothoracic Surgery": <Heart size={24} />,
    "OMFS (Maxillofacial)": <GraduationCap size={24} />,
    "Vascular Surgery": <Scissors size={24} />, // New Icon
    "Paediatric Surgery": <Baby size={24} />,   // New Icon
};

function Specialties() {
    const [selectedSpecialty, setSelectedSpecialty] = useState(null);
    
    // CRITICAL FIX: Ensure array exists before mapping/rendering
    const specialtiesData = SURGICAL_SPECIALTIES || [];

    return (
        <div className="p-6 space-y-6">
             {selectedSpecialty && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full h-5/6 overflow-y-auto p-8 relative">
                        <button onClick={() => setSelectedSpecialty(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"><X size={20}/></button>
                        
                        {/* Modal Header */}
                        <div className="flex justify-between items-start mb-6 border-b pb-4">
                            <div className="flex items-center gap-4">
                                {React.cloneElement(specialtyIcons[selectedSpecialty.name] || <User size={24} />, { size: 32, className: 'text-blue-600' })}
                                <div>
                                    <h2 className="text-3xl font-bold text-slate-900">{selectedSpecialty.name}</h2>
                                    <p className="text-sm text-gray-500">Training Code: {selectedSpecialty.code}</p>
                                </div>
                            </div>
                            
                            {/* Society Link Button */}
                            <a href={selectedSpecialty.societyLink} target="_blank" rel="noreferrer" className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-teal-700 transition-colors shrink-0">
                                <Globe size={16}/> Visit {selectedSpecialty.societyName}
                            </a>
                        </div>
                        
                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-blue-50 p-4 rounded-lg text-center"><p className="text-sm text-blue-600 font-medium">Competition Ratio</p><p className="text-2xl font-bold text-slate-900">{selectedSpecialty.competition}</p></div>
                            <div className="bg-blue-50 p-4 rounded-lg text-center"><p className="text-sm text-blue-600 font-medium">Training Duration</p><p className="text-2xl font-bold text-slate-900">{selectedSpecialty.duration}</p></div>
                            <div className="bg-blue-50 p-4 rounded-lg text-center"><p className="text-sm text-blue-600 font-medium">Entry Type</p><p className="text-2xl font-bold text-slate-900">{selectedSpecialty.pathway.includes('Run-through') ? 'Run-Through' : 'Core + ST'}</p></div>
                        </div>
                        
                        {/* Detailed Requirements */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2"><ClipboardList size={20} className="text-blue-500"/> Key Entry Requirements</h3>
                                <ul className="space-y-2 text-gray-700 list-disc list-inside bg-gray-50 p-4 rounded-lg">
                                    {selectedSpecialty.requirements.map((req, idx) => <li key={idx} className="text-sm">{req}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2"><Milestone size={20} className="text-blue-500"/> Indicative Pathway</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedSpecialty.pathway.map((step, idx) => (
                                        <div key={idx} className="flex items-center">
                                            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">{step}</span>
                                            {idx < selectedSpecialty.pathway.length - 1 && <ChevronRight size={16} className="text-gray-400 mx-1" />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2"><Syringe size={20} className="text-blue-500"/> Key Procedures</h3>
                                <div className="flex flex-wrap gap-3">
                                    {selectedSpecialty.keyProcedures.map((proc, idx) => <span key={idx} className="bg-emerald-50 text-emerald-700 text-sm px-3 py-1 rounded-full">{proc}</span>)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
             )}

             {/* Header */}
             <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-8 rounded-xl text-white shadow-lg">
                <h2 className="text-3xl font-bold mb-2">Specialty Explorer</h2>
                <p className="text-blue-100 max-w-2xl">Explore the 10 surgical specialties. View competition ratios, training pathways, and essential portfolio requirements.</p>
             </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {specialtiesData.map((spec, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer group" onClick={() => setSelectedSpecialty(spec)}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-700 font-bold text-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                {React.cloneElement(specialtyIcons[spec.name] || <User size={24} />, { size: 24, className: 'text-blue-600 group-hover:text-white' })}
                            </div>
                            <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded">{spec.code}</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">{spec.name}</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                             <div className="flex justify-between"><span>Competition:</span><span className="font-semibold text-slate-900">{spec.competition}</span></div>
                             <div className="flex justify-between"><span>Society:</span><span className="font-semibold text-teal-600">{spec.societyName}</span></div>
                        </div>
                        <button className="w-full mt-4 py-2 border border-blue-200 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors">View Profile</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

// CRITICAL FIX: Add the default export
export default Specialties;