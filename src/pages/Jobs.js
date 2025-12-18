import React, { useState, useEffect, useMemo } from 'react';
import { 
    Briefcase, MapPin, Search, Plus, X, ExternalLink, 
    Building2, Heart, Pencil, Trash2, Globe, User, CalendarClock,
    ChevronUp, ChevronDown, ArrowUpDown
} from 'lucide-react';
import { 
    collection, getDocs, addDoc, deleteDoc, 
    doc, getDoc, updateDoc, setDoc, 
    arrayUnion, arrayRemove 
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Papa from 'papaparse';

import { db, auth } from '../config/firebase'; 

export default function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null); 
    const [favorites, setFavorites] = useState([]);
    
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [formData, setFormData] = useState({
        id: null, title: '', deadline: '', type: 'Fellowship', 
        hospital: '', location: '', link: '', description: ''
    });

    const [activeTab, setActiveTab] = useState('database'); 
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    const [sortConfig, setSortConfig] = useState({ key: 'deadline', direction: 'asc' });

    const formatDate = (dateString) => {
        if (!dateString || dateString === 'Rolling') return 'Rolling / TBD';
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? dateString : new Intl.DateTimeFormat('en-GB', { 
            day: 'numeric', month: 'short', year: 'numeric' 
        }).format(date);
    };

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "jobs"));
                const firestoreJobs = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    isPersonal: true 
                }));

                Papa.parse('/jobs.csv', {
                    download: true,
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        const csvJobs = results.data.map((row, index) => ({
                            id: `csv_${index}`, 
                            title: row.title || "Untitled Role",
                            deadline: row.deadline || '2026-01-01', 
                            type: row.type || 'Fellowship',
                            hospital: row.hospital || "Unknown Hospital",
                            location: row.location || "TBD",
                            link: row.link || "#",
                            description: row.description || "",
                            isGlobal: true,
                            isPersonal: false 
                        }));
                        setJobs([...csvJobs, ...firestoreJobs]);
                        setLoading(false);
                    },
                    error: () => {
                        setJobs(firestoreJobs);
                        setLoading(false);
                    }
                });
            } catch (error) {
                console.error("Initialization error:", error);
                setLoading(false);
            }
        };

        fetchAllData();

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const userRef = doc(db, "users", currentUser.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    setFavorites(userSnap.data().jobFavorites || []);
                }
            }
        });
        return () => unsubscribe(); 
    }, []);

    const handleDelete = async (e, jobId) => {
        e.stopPropagation();
        if (!jobId || typeof jobId !== 'string') return;
        if (jobId.startsWith('csv_')) {
            alert("Global entries cannot be deleted.");
            return;
        }
        if (!window.confirm("Permanently delete this entry?")) return;
        try {
            await deleteDoc(doc(db, "jobs", jobId));
            setJobs(prev => prev.filter(j => j.id !== jobId));
        } catch (error) {
            alert("Error: " + error.message);
        }
    };

    const toggleFavorite = async (e, jobId) => {
        e.stopPropagation(); 
        if (!user) return alert("Please log in.");
        const isFav = favorites.includes(jobId);
        setFavorites(isFav ? favorites.filter(id => id !== jobId) : [...favorites, jobId]);
        try {
            await updateDoc(doc(db, "users", user.uid), {
                jobFavorites: isFav ? arrayRemove(jobId) : arrayUnion(jobId)
            });
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return alert("You must be logged in.");
        const payload = { ...formData, createdBy: user.uid, isGlobal: false };
        try {
            if (isEditing && formData.id) {
                await updateDoc(doc(db, "jobs", formData.id), payload);
                setJobs(jobs.map(j => j.id === formData.id ? { ...j, ...payload, isPersonal: true } : j));
            } else {
                const docRef = await addDoc(collection(db, "jobs"), payload);
                setJobs(prev => [...prev, { id: docRef.id, ...payload, isPersonal: true }]);
            }
            setShowModal(false);
        } catch (err) { alert("Save failed: " + err.message); }
    };

    const handleSort = (key) => setSortConfig({ key, direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc' });

    const filteredJobs = useMemo(() => {
        let finalData = [];

        if (activeTab === 'favorites') {
            // Logic: Get every job that is in the favorites array
            const favItems = jobs.filter(j => favorites.includes(j.id));
            
            // De-duplicate items that have the same Title and Hospital
            const uniqueMap = new Map();
            favItems.forEach(item => {
                const key = `${item.title}-${item.hospital}`.toLowerCase().trim();
                if (uniqueMap.has(key)) {
                    const existing = uniqueMap.get(key);
                    existing.isGlobal = existing.isGlobal || item.isGlobal;
                    existing.isPersonal = existing.isPersonal || item.isPersonal;
                    // Always favor the Firestore ID over CSV ID so buttons work
                    if (item.id && !item.id.toString().startsWith('csv_')) {
                        existing.id = item.id;
                        existing.createdBy = item.createdBy;
                    }
                } else {
                    uniqueMap.set(key, { ...item });
                }
            });
            finalData = Array.from(uniqueMap.values());
        } else if (activeTab === 'personal') {
            finalData = jobs.filter(j => user && j.createdBy === user.uid);
        } else {
            // Database Tab: show global + personal
            finalData = jobs.filter(j => j.isGlobal || (user && j.createdBy === user.uid));
        }

        // Apply Search and Type Filter
        const filtered = finalData.filter(job => {
            const searchStr = `${job.title} ${job.hospital}`.toLowerCase();
            const matchesSearch = searchStr.includes(searchTerm.toLowerCase());
            const matchesType = typeFilter === 'All' || job.type === typeFilter;
            return matchesSearch && matchesType;
        });

        // Apply Sorting
        if (sortConfig.key) {
            filtered.sort((a, b) => {
                const aV = (a[sortConfig.key] || '').toString().toLowerCase();
                const bV = (b[sortConfig.key] || '').toString().toLowerCase();
                return sortConfig.direction === 'asc' 
                    ? aV.localeCompare(bV) 
                    : bV.localeCompare(aV);
            });
        }

        return filtered;
    }, [jobs, activeTab, favorites, searchTerm, typeFilter, sortConfig, user]);

    return (
        <div className="p-6 max-w-full mx-auto bg-gray-50 h-full flex flex-col relative">
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-6 gap-4 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Jobs Database</h1>
                    <p className="text-sm text-gray-500 mt-1">Viewing {filteredJobs.length} opportunities</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
                    <div className="flex bg-white rounded-lg border border-gray-300 p-1 shadow-sm">
                        <button onClick={() => setActiveTab('database')} className={`px-3 py-1.5 text-sm font-medium rounded-md ${activeTab === 'database' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'}`}><Globe size={14} className="inline mr-2"/>Global</button>
                        <button onClick={() => setActiveTab('personal')} className={`px-3 py-1.5 text-sm font-medium rounded-md ${activeTab === 'personal' ? 'bg-purple-100 text-purple-700' : 'text-gray-600'}`}><User size={14} className="inline mr-2"/>My Jobs</button>
                        <button onClick={() => setActiveTab('favorites')} className={`px-3 py-1.5 text-sm font-medium rounded-md ${activeTab === 'favorites' ? 'bg-red-100 text-red-700' : 'text-gray-600'}`}><Heart size={14} className="inline mr-2"/>Favorites</button>
                    </div>
                    {user && <button onClick={() => { setIsEditing(false); setFormData({id:null, title:'', deadline:'', type:'Fellowship', hospital:'', location:'', link:'', description:''}); setShowModal(true); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-sm text-sm font-bold"><Plus size={16} /> Add Job</button>}
                    <div className="relative flex-grow md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm outline-none" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col">
                <div className="overflow-auto flex-1">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 sticky top-0 z-10 border-b">
                            <tr>
                                <th className="px-6 py-3 text-center w-12"><Heart size={16} className="text-gray-400 mx-auto" /></th>
                                <th onClick={() => handleSort('title')} className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100">Role <ArrowUpDown size={12} className="inline ml-1"/></th>
                                <th onClick={() => handleSort('deadline')} className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100">Deadline <ArrowUpDown size={12} className="inline ml-1"/></th>
                                <th onClick={() => handleSort('hospital')} className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100">Hospital <ArrowUpDown size={12} className="inline ml-1"/></th>
                                <th className="px-6 py-3 w-16"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredJobs.map(job => (
                                <tr key={job.id} onClick={() => setSelectedJob(job)} className="hover:bg-blue-50 cursor-pointer group transition-colors">
                                    <td className="px-6 py-4 text-center" onClick={e => e.stopPropagation()}>
                                        <button onClick={e => toggleFavorite(e, job.id)}><Heart size={18} className={favorites.includes(job.id) ? 'fill-red-500 text-red-500' : 'text-gray-300 hover:text-red-400'}/></button>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-800">
                                        {job.title}
                                        <div className="inline-flex gap-1 ml-2">
                                            {job.isPersonal && <span className="text-[10px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-tight">Personal</span>}
                                            {job.isGlobal && <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-tight">Global</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{formatDate(job.deadline)}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{job.hospital}</td>
                                    <td className="px-6 py-4 text-right whitespace-nowrap" onClick={e => e.stopPropagation()}>
                                        {user && job.createdBy === user.uid && (
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => { setIsEditing(true); setFormData(job); setShowModal(true); }} className="text-blue-400 hover:text-blue-600"><Pencil size={16}/></button>
                                                <button onClick={e => handleDelete(e, job.id)} className="text-red-300 hover:text-red-500"><Trash2 size={16}/></button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedJob && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedJob(null)}>
                    <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-2xl font-bold text-slate-800 leading-tight pr-4">{selectedJob.title}</h2>
                            <button onClick={() => setSelectedJob(null)} className="text-gray-400 hover:text-gray-600"><X size={28}/></button>
                        </div>
                        <div className="grid grid-cols-2 gap-y-4 text-sm mb-8">
                            <div><p className="text-gray-400 font-bold uppercase text-[10px]">Hospital</p><p className="font-medium text-slate-700">{selectedJob.hospital}</p></div>
                            <div><p className="text-gray-400 font-bold uppercase text-[10px]">Deadline</p><p className="font-medium text-slate-700">{formatDate(selectedJob.deadline)}</p></div>
                        </div>
                        <div className="bg-slate-50 p-5 rounded-xl text-sm text-slate-600 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto mb-8 border border-slate-100 italic">
                            {selectedJob.description || "No description provided."}
                        </div>
                        <a href={selectedJob.link} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white text-center py-3.5 rounded-xl font-bold hover:bg-blue-700 shadow-md">View Full Listing <ExternalLink size={18}/></a>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <form className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl" onSubmit={handleSubmit}>
                        <h2 className="text-xl font-bold text-slate-800 mb-6">{isEditing ? 'Edit Entry' : 'Add Entry'}</h2>
                        <div className="space-y-4">
                            <input className="w-full border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="Job Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                            <input className="w-full border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="Hospital/Trust" value={formData.hospital} onChange={e => setFormData({...formData, hospital: e.target.value})} />
                            <div className="flex gap-4">
                                <input type="date" className="w-1/2 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
                                <select className="w-1/2 border border-slate-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500 font-medium" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                                    <option>Fellowship</option><option>Consultant</option><option>Locum</option><option>Research</option><option>Other</option>
                                </select>
                            </div>
                            <textarea className="w-full border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="Description/Link" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                        </div>
                        <div className="flex justify-end gap-3 mt-8">
                            <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-slate-500 font-medium hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
                            <button type="submit" className="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md">Save Entry</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}