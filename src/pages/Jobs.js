// src/pages/Jobs.js - OVERWRITE COMPLETELY (Fixing immediate crash on line 8)

import React, { useState, useMemo } from 'react';
import { Search, Building2, ExternalLink, MapPin, ArrowDown, ArrowUp, Star, List } from 'lucide-react';
// CRITICAL FIX: Ensure all arrays are correctly imported
import { MOCK_JOB_LISTINGS, HOSPITALS_DATA, JOB_PORTALS } from '../data/portfolioData';


// NOTE: ALL DATA CALCULATIONS MOVED INSIDE THE COMPONENT TO PREVENT CRASH

const ALL_JOB_TYPES = ['NHS', 'Private', 'Military']; // This one can remain outside

export default function Jobs() {
    const [activeTab, setActiveTab] = useState('listings'); // 'listings' | 'finder' | 'favorites'
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedHospital, setSelectedHospital] = useState(null);
    
    // New Filter States
    const [filterSpecialty, setFilterSpecialty] = useState('All');
    const [filterNation, setFilterNation] = useState('All');
    const [filterType, setFilterType] = useState('All');
    const [sort, setSort] = useState({ key: 'deadline', direction: 'asc' });
    const [favoriteIds, setFavoriteIds] = useState(['j1']); 

    // --- Data Calculation moved inside Component (CRITICAL FIX) ---
    const allSpecialties = useMemo(() => 
        [...new Set((MOCK_JOB_LISTINGS || []).map(j => j.specialty))].sort(), 
    [MOCK_JOB_LISTINGS]);

    const allNations = useMemo(() => 
        [...new Set((HOSPITALS_DATA || []).map(h => h.nation))].sort(), 
    [HOSPITALS_DATA]);

    // --- Helpers ---
    const getJobLink = (hospital) => {
        let baseUrl = JOB_PORTALS[hospital.type] || JOB_PORTALS['NHS'];
        // Defensive access to JOB_PORTALS properties
        if (hospital.nation === 'Scotland' && JOB_PORTALS.SCOT) baseUrl = JOB_PORTALS.SCOT;
        else if (hospital.nation === 'Northern Ireland' && JOB_PORTALS.HSC) baseUrl = JOB_PORTALS.HSC;
        
        if (JOB_PORTALS[hospital.employer]) baseUrl = JOB_PORTALS[hospital.employer];

        const key = hospital.search_key || hospital.location;
        return baseUrl + encodeURIComponent(key);
    };

    const handleSort = (key) => {
        setSort(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };
    
    const toggleFavorite = (id) => {
        setFavoriteIds(prev => prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]);
    };

    const getSortIcon = (key) => {
        if (sort.key !== key) return null;
        return sort.direction === 'asc' ? <ArrowUp size={12} className="ml-1" /> : <ArrowDown size={12} className="ml-1" />;
    };

    // --- Filtering Logic for Listings Tab ---
    const filteredListings = useMemo(() => {
        let jobs = MOCK_JOB_LISTINGS || []; // Defensively use empty array
        const lowerSearch = searchTerm.toLowerCase();

        // Apply filters
        jobs = jobs.filter(j => {
            const matchSpecialty = filterSpecialty === 'All' || j.specialty === filterSpecialty;
            const matchType = filterType === 'All' || j.employer.toLowerCase().includes(filterType.toLowerCase()); 
            const matchSearch = !searchTerm || 
                j.title.toLowerCase().includes(lowerSearch) || 
                j.employer.toLowerCase().includes(lowerSearch) ||
                j.hospital.toLowerCase().includes(lowerSearch);
            
            // Filter by favorites if activeTab is 'favorites'
            const matchFavorite = activeTab !== 'favorites' || favoriteIds.includes(j.id);
                
            return matchSpecialty && matchType && matchSearch && matchFavorite;
        });

        // Apply Sorting Logic
        if (sort.key) {
            jobs.sort((a, b) => {
                let comparison = 0;
                if (sort.key === 'deadline') {
                    comparison = new Date(a.deadline) - new Date(b.deadline); 
                } else {
                    const aVal = a[sort.key]?.toLowerCase() || ''; // Use safe access
                    const bVal = b[sort.key]?.toLowerCase() || ''; // Use safe access
                    if (aVal > bVal) comparison = 1;
                    else if (aVal < bVal) comparison = -1;
                }
                return sort.direction === 'asc' ? comparison : comparison * -1;
            });
        }

        return jobs;
    }, [searchTerm, filterSpecialty, filterType, sort, activeTab, favoriteIds]);

    // --- Filtering Logic for Directory Tab ---
    const filteredHospitals = useMemo(() => {
        let hospitals = HOSPITALS_DATA || []; // Defensively use empty array
        const lowerSearch = searchTerm.toLowerCase();

        hospitals = hospitals.filter(h => {
            const matchNation = filterNation === 'All' || h.nation === filterNation;
            const matchType = filterType === 'All' || h.type === filterType;
            const matchSearch = !searchTerm || 
                h.name.toLowerCase().includes(lowerSearch) || 
                h.location.toLowerCase().includes(lowerSearch);
            return matchNation && matchType && matchSearch;
        });
        return hospitals;
    }, [searchTerm, filterNation, filterType]);

    const TableHeader = ({ title, sortKey }) => (
        <th 
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-gray-800 transition"
            onClick={() => handleSort(sortKey)}
        >
            <div className="flex items-center">
                {title}
                {getSortIcon(sortKey)}
            </div>
        </th>
    );


    return (
        <div className="p-6 space-y-6 h-full flex flex-col">
            <div className="flex justify-between items-start shrink-0">
                <div><h1 className="text-3xl font-bold text-slate-900">Job Hunt</h1><p className="text-gray-500">Find training posts and explore hospitals.</p></div>
                
                {/* TAB SWITCHER */}
                <div className="flex bg-gray-200 p-1 rounded-lg">
                    <button onClick={() => setActiveTab('listings')} className={`px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 ${activeTab === 'listings' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}>
                        <List size={16}/> Listings
                    </button>
                    <button onClick={() => setActiveTab('favorites')} className={`px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 ${activeTab === 'favorites' ? 'bg-white shadow-sm text-red-600' : 'text-gray-500'}`}>
                        <Star size={16} className={activeTab === 'favorites' ? 'fill-red-500' : ''}/> My Favorites
                    </button>
                    <button onClick={() => setActiveTab('finder')} className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'finder' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}>
                        <Building2 size={16}/> Directory
                    </button>
                </div>
            </div>

            {/* Combined Search and Filter Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 shrink-0 space-y-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder={activeTab === 'listings' || activeTab === 'favorites' ? "Search job title, hospital, or employer..." : "Search hospital name or location..."} 
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                        value={searchTerm} 
                        onChange={e => setSearchTerm(e.target.value)} 
                    />
                </div>
                
                {/* Advanced Filters */}
                <div className="grid grid-cols-3 gap-4 text-sm">
                    {activeTab === 'listings' || activeTab === 'favorites' ? (
                        <>
                            <select value={filterSpecialty} onChange={e => setFilterSpecialty(e.target.value)} className="p-2 border rounded-lg outline-none disabled:opacity-70 disabled:bg-gray-100">
                                <option value="All">All Specialties</option>
                                {allSpecialties.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <select value={filterType} onChange={e => setFilterType(e.target.value)} className="p-2 border rounded-lg outline-none disabled:opacity-70 disabled:bg-gray-100">
                                <option value="All">All Job Types</option>
                                {ALL_JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <div className="text-gray-500 p-2 text-center border rounded-lg bg-gray-50">Sort by: {sort.key}</div>
                        </>
                    ) : (
                        <>
                            <select value={filterNation} onChange={e => setFilterNation(e.target.value)} className="p-2 border rounded-lg outline-none">
                                <option value="All">All Nations</option>
                                {allNations.map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                            <select value={filterType} onChange={e => setFilterType(e.target.value)} className="p-2 border rounded-lg outline-none">
                                <option value="All">All Hospital Types</option>
                                <option value="NHS">NHS</option>
                                <option value="Private">Private</option>
                            </select>
                            <div className="text-gray-500 p-2 text-center border rounded-lg bg-gray-50">Directory Search Mode</div>
                        </>
                    )}
                </div>
            </div>


            {activeTab === 'listings' || activeTab === 'favorites' ? (
                // Job Listings Table View (Streamlined Database Look)
                <div className="flex-1 overflow-y-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {activeTab === 'favorites' && filteredListings.length > 0 && (
                        <p className="p-3 bg-red-50 text-red-700 text-sm font-semibold border-b">Displaying {filteredListings.length} favorited job listings.</p>
                    )}
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr>
                                <th className="px-2 py-3"></th> {/* Favorite Star Column */}
                                <TableHeader title="Job Title" sortKey="title" />
                                <TableHeader title="Specialty" sortKey="specialty" />
                                <TableHeader title="Employer / Hospital" sortKey="employer" />
                                <TableHeader title="Deadline" sortKey="deadline" />
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredListings.map(job => (
                                <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                                    {/* FAVORITE ICON CELL */}
                                    <td className="px-2 py-4 text-center">
                                        <button onClick={() => toggleFavorite(job.id)} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                                            <Star size={16} className={favoriteIds.includes(job.id) ? "fill-red-500 text-red-500" : "text-gray-400"} />
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-blue-700">{job.title}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-purple-700">
                                        <span className="bg-purple-50 px-2 py-1 rounded text-xs">{job.specialty}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{job.employer}<div className="text-xs text-gray-400">{job.hospital}</div></td>
                                    <td className="px-6 py-4 text-sm font-medium text-red-500 whitespace-nowrap">{job.deadline}</td>
                                    <td className="px-6 py-4">
                                        <a href={job.link} target="_blank" rel="noreferrer" className="text-slate-900 hover:text-blue-600 font-bold text-xs flex items-center gap-1">
                                            Apply <ExternalLink size={14} />
                                        </a>
                                    </td>
                                </tr>
                            ))}
                            {filteredListings.length === 0 && (
                                <tr><td colSpan="6" className="p-8 text-center text-gray-400">No job listings found matching criteria.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                // Hospital Directory Split View (Remains the same)
                <div className="flex gap-6 h-full overflow-hidden">
                    <div className="flex-1 overflow-y-auto pr-2 space-y-2">
                        {filteredHospitals.map((h, i) => (
                            <div key={i} onClick={() => setSelectedHospital(h)} className={`p-4 border rounded-lg cursor-pointer transition ${selectedHospital?.name === h.name ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-200' : 'bg-white hover:bg-gray-50'}`}>
                                <h3 className={`font-bold ${selectedHospital?.name === h.name ? 'text-blue-700' : 'text-slate-800'}`}>{h.name}</h3>
                                <p className="text-xs text-gray-500 mb-1">{h.location}, {h.nation}</p>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${h.type === 'NHS' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{h.type}</span>
                            </div>
                        ))}
                        {filteredHospitals.length === 0 && (
                            <div className="p-8 text-center text-gray-400 bg-white rounded-xl shadow-sm border">No hospitals matched your directory search.</div>
                        )}
                    </div>

                    {/* Hospital Detail Panel */}
                    <div className="w-1/3 bg-slate-900 text-white rounded-xl p-6 hidden md:block h-fit sticky top-0 shadow-lg shrink-0">
                        {selectedHospital ? (
                            <>
                                <h3 className="text-xl font-bold mb-2">{selectedHospital.name}</h3>
                                <div className="text-slate-400 text-sm mb-4 space-y-1">
                                    <div className="flex items-center gap-2"><MapPin size={14}/> {selectedHospital.location}, {selectedHospital.nation}</div>
                                    <div className="flex items-center gap-2"><Building2 size={14}/> {selectedHospital.employer}</div>
                                </div>
                                <div className="border-t border-slate-700 pt-4 mb-6">
                                    <p className="text-xs font-bold text-blue-400 uppercase mb-2">Specialties</p>
                                    <ul className="text-sm text-slate-300 space-y-1">{selectedHospital.specialties?.map(s => <li key={s}>• {s}</li>)}</ul>
                                </div>
                                <a href={getJobLink(selectedHospital)} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-bold text-sm transition">
                                    <ExternalLink size={16}/> Visit Career Portal
                                </a>
                            </>
                        ) : (
                            <div className="text-center text-slate-500 py-10"><Building2 size={48} className="mx-auto mb-4 opacity-20"/><p>Select a hospital to view details.</p></div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}