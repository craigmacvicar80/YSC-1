// src/pages/Portfolio.js - OVERWRITE COMPLETELY (Aligned Categories: Exams, Publications, Teaching, Audit/QIP, Courses)

import React, { useState } from 'react';
import { Building2, Users, FileText, Code, Award, Briefcase, PlusCircle, TrendingUp, Award as AwardIcon, Pencil, Trash2, PieChart, GraduationCap, ClipboardList, BookOpen } from 'lucide-react';
import { EditableList } from '../components/SharedUI';
import { AddItemModal, ActivityDetailModal, CPDMatrixModal } from '../components/Modals'; 
import { MOCK_PROFILE_DATA } from '../data/portfolioData';

function Portfolio({ activities }) {
    const initialProfileData = MOCK_PROFILE_DATA || {}; 
    const [profileData, setProfileData] = useState(initialProfileData);
    const [localActivities, setLocalActivities] = useState(activities || []); 
    
    // Modals
    const [showCPDModal, setShowCPDModal] = useState(false); 
    const [activeModalCategory, setActiveModalCategory] = useState(null);
    const [itemToEdit, setItemToEdit] = useState(null);
    const [selectedActivity, setSelectedActivity] = useState(null); 
    
    // Profile Edit
    const [isProfileEditing, setIsProfileEditing] = useState(false);
    const [editFormData, setEditFormData] = useState(profileData);

    // Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');

    // --- SMART CATEGORY LOGIC ---
    // Helper to map any activity to one of the 5 target categories based on text analysis
    const getSmartCategory = (act) => {
        const text = `${act.category || ''} ${act.type || ''} ${act.description || ''}`.toLowerCase();
        
        if (text.includes('exam') || text.includes('mrcs') || text.includes('specialty') || text.includes('part a') || text.includes('part b')) return 'Exams';
        if (text.includes('publication') || text.includes('paper') || text.includes('peer') || text.includes('article') || text.includes('book')) return 'Publications';
        if (text.includes('teaching') || text.includes('lecture') || text.includes('mentor') || text.includes('tutor') || text.includes('education')) return 'Teaching';
        if (text.includes('audit') || text.includes('qip') || text.includes('cycle') || text.includes('quality') || text.includes('improvement')) return 'Audit/QIP';
        if (text.includes('course') || text.includes('atls') || text.includes('workshop') || text.includes('training') || text.includes('life support')) return 'Courses';
        
        return 'Other'; // Fallback
    };

    // --- HANDLERS ---
    const openAddModal = (category) => { setItemToEdit(null); setActiveModalCategory(category); };
    const openEditModal = (category, item) => { setItemToEdit(item); setActiveModalCategory(category); };
    
    const handleSaveItem = (category, item) => {
        if (category === 'Activity') {
            setLocalActivities(prev => {
                const exists = prev.find(i => i.id === item.id);
                return exists ? prev.map(i => i.id === item.id ? item : i) : [...prev, item];
            });
        } else if (category === 'Technical Skills') {
            setProfileData(prev => ({
                ...prev, skills: { ...prev.skills, technical: (prev.skills.technical || []).some(i => i.id === item.id) ? prev.skills.technical.map(i => i.id === item.id ? item : i) : [...(prev.skills.technical || []), item] }
            }));
        } else {
            const keyMap = { 'Employment History': 'employmentHistory', 'Memberships': 'memberships', 'Certificates': 'certifications', 'Awards': 'awards', 'Evidence': 'evidence' };
            const key = keyMap[category];
            if (key) {
                setProfileData(prev => ({
                    ...prev, [key]: (prev[key] || []).some(i => i.id === item.id) ? prev[key].map(i => i.id === item.id ? item : i) : [...(prev[key] || []), item]
                }));
            }
        }
    };

    const handleDeleteItem = (category, id) => {
        if (category === 'Activity') {
            setLocalActivities(prev => prev.filter(i => i.id !== id));
        } else if (category === 'Technical Skills') {
            setProfileData(prev => ({ ...prev, skills: { ...prev.skills, technical: (prev.skills.technical || []).filter(i => i.id !== id) } }));
        } else {
            const keyMap = { 'Employment History': 'employmentHistory', 'Memberships': 'memberships', 'Certificates': 'certifications', 'Awards': 'awards', 'Evidence': 'evidence' };
            const key = keyMap[category];
            if(key) setProfileData(prev => ({ ...prev, [key]: (prev[key] || []).filter(i => i.id !== id) }));
        }
    };

    const handleSaveActivityDetails = (id, updatedData) => {
        setLocalActivities(prev => prev.map(a => a.id === id ? { ...a, ...updatedData } : a));
        setSelectedActivity(null); 
    };

    const handleProfileSave = () => { setProfileData(editFormData); setIsProfileEditing(false); };
    
    // --- POINTS CALCULATION (Using Smart Categories) ---
    const totalPoints = localActivities.reduce((sum, act) => sum + (Number(act.points) || 0), 0);

    const pointsOverview = {
        exams: 0,
        publications: 0,
        teaching: 0,
        audit: 0,
        courses: 0
    };

    localActivities.forEach(act => {
        const p = Number(act.points) || 0;
        const smartCat = getSmartCategory(act);
        
        if (smartCat === 'Exams') pointsOverview.exams += p;
        else if (smartCat === 'Publications') pointsOverview.publications += p;
        else if (smartCat === 'Teaching') pointsOverview.teaching += p;
        else if (smartCat === 'Audit/QIP') pointsOverview.audit += p;
        else if (smartCat === 'Courses') pointsOverview.courses += p;
    });

    // --- FILTERING (Using Smart Categories) ---
    const filteredActivities = localActivities.filter(act => {
        const matchesSearch = (act.description || '').toLowerCase().includes(searchTerm.toLowerCase());
        const smartCat = getSmartCategory(act);
        const matchesCategory = filterCategory === 'All' || smartCat === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const userName = profileData.name || 'Surgical Trainee';
    const userLevel = profileData.level || 'CT1 (Core Training)';
    const userInitials = userName.split(' ').map(n => n[0]).join('').slice(0, 2);

    return (
        <div className="p-6 space-y-6">
            {showCPDModal && <CPDMatrixModal onClose={() => setShowCPDModal(false)} />}
            {activeModalCategory && <AddItemModal category={activeModalCategory} initialData={itemToEdit} onClose={() => setActiveModalCategory(null)} onSave={handleSaveItem} />}
            {selectedActivity && <ActivityDetailModal activity={selectedActivity} onClose={() => setSelectedActivity(null)} onSave={handleSaveActivityDetails} />}

            {/* Header */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative flex flex-col md:flex-row items-start justify-between gap-6">
                <div className="flex items-center gap-5 w-full">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white text-3xl font-bold shrink-0">
                        {userInitials} 
                    </div>
                    <div className="flex-1">
                        {isProfileEditing ? (
                            <input value={editFormData.name || ''} onChange={e => setEditFormData({...editFormData, name: e.target.value})} className="text-2xl font-bold border rounded p-1 mb-1 w-full" />
                        ) : (
                            <h3 className="text-2xl font-bold text-slate-900">{userName}</h3>
                        )}
                        <p className="text-blue-600 font-semibold bg-blue-50 inline-block px-2 py-0.5 rounded-md mt-1">{userLevel}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-2 mt-4 text-sm text-gray-500">
                            <div><span className="uppercase text-[10px] font-bold tracking-wider text-gray-400 block">GMC No.</span>
                                {isProfileEditing ? <input value={editFormData.gmc || ''} onChange={e => setEditFormData({...editFormData, gmc: e.target.value})} className="border rounded p-0.5 w-full text-slate-800" /> : (profileData.gmc || 'N/A')}
                            </div>
                            <div><span className="uppercase text-[10px] font-bold tracking-wider text-gray-400 block">Start Date</span>
                                {isProfileEditing ? <input value={editFormData.startDate || ''} onChange={e => setEditFormData({...editFormData, startDate: e.target.value})} className="border rounded p-0.5 w-full text-slate-800" /> : (profileData.startDate || 'N/A')}
                            </div>
                            <div><span className="uppercase text-[10px] font-bold tracking-wider text-gray-400 block">Interest</span>
                                {isProfileEditing ? <input value={editFormData.specialtyInterest || ''} onChange={e => setEditFormData({...editFormData, specialtyInterest: e.target.value})} className="border rounded p-0.5 w-full text-slate-800" /> : (profileData.specialtyInterest || 'N/A')}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                    <button onClick={isProfileEditing ? handleProfileSave : () => setIsProfileEditing(true)} className="text-xs bg-white border border-gray-300 text-slate-600 px-3 py-1.5 rounded-lg font-medium shadow-sm hover:bg-gray-50 transition-colors">
                        {isProfileEditing ? 'Save Changes' : 'Edit Profile'}
                    </button>
                    <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded-lg border border-emerald-200">
                        <AwardIcon size={14} /> <span className="text-sm">{totalPoints} Points</span>
                    </div>
                </div>
            </div>

            {/* Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <EditableList 
                    items={profileData.employmentHistory || []} 
                    title="Employment History" 
                    icon={<Building2 size={18}/>} 
                    onAdd={() => openAddModal('Employment History')} 
                    onEdit={(i) => openEditModal('Employment History', i)} 
                    onDelete={(id) => handleDeleteItem('Employment History', id)} 
                />
                <div className="space-y-6">
                    <EditableList 
                        items={profileData.memberships || []} 
                        title="Memberships" 
                        icon={<Users size={16}/>} 
                        onAdd={() => openAddModal('Memberships')} 
                        onEdit={(i) => openEditModal('Memberships', i)} 
                        onDelete={(id) => handleDeleteItem('Memberships', id)} 
                    />
                    <EditableList 
                        items={profileData.certifications || []} 
                        title="Certificates" 
                        icon={<FileText size={16}/>} 
                        onAdd={() => openAddModal('Certificates')} 
                        onEdit={(i) => openEditModal('Certificates', i)} 
                        onDelete={(id) => handleDeleteItem('Certificates', id)} 
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <EditableList 
                    items={profileData.skills?.technical || []} 
                    title="Technical Skills" 
                    icon={<Code size={18}/>} 
                    type="pill" 
                    onAdd={() => openAddModal('Technical Skills')} 
                    onEdit={(i) => openEditModal('Technical Skills', i)} 
                    onDelete={(id) => handleDeleteItem('Technical Skills', id)} 
                />
                <EditableList 
                    items={profileData.evidence || []} 
                    title="Evidence Uploads" 
                    icon={<Briefcase size={18}/>} 
                    onAdd={() => openAddModal('Evidence')} 
                    onEdit={(i) => openEditModal('Evidence', i)} 
                    onDelete={(id) => handleDeleteItem('Evidence', id)} 
                />
            </div>

            {/* --- PORTFOLIO POINTS OVERVIEW --- */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <PieChart size={20} className="text-blue-600"/> Portfolio Points Overview
                    </h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">High Yield Focus</span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    {/* 1. Exams */}
                    <div className="p-5 bg-blue-50 rounded-xl border border-blue-100 relative overflow-hidden group text-center">
                        <div className="flex justify-center mb-3">
                            <div className="bg-white p-2 rounded-full shadow-sm text-blue-600">
                                <GraduationCap size={20} />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-blue-900">{pointsOverview.exams}</p>
                        <p className="text-sm font-semibold text-blue-600 mt-1 uppercase tracking-wide">Exams</p>
                    </div>

                    {/* 2. Publications */}
                    <div className="p-5 bg-purple-50 rounded-xl border border-purple-100 relative overflow-hidden group text-center">
                        <div className="flex justify-center mb-3">
                            <div className="bg-white p-2 rounded-full shadow-sm text-purple-600">
                                <FileText size={20} />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-purple-900">{pointsOverview.publications}</p>
                        <p className="text-sm font-semibold text-purple-600 mt-1 uppercase tracking-wide">Publications</p>
                    </div>

                    {/* 3. Teaching */}
                    <div className="p-5 bg-amber-50 rounded-xl border border-amber-100 relative overflow-hidden group text-center">
                        <div className="flex justify-center mb-3">
                            <div className="bg-white p-2 rounded-full shadow-sm text-amber-600">
                                <Users size={20} />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-amber-900">{pointsOverview.teaching}</p>
                        <p className="text-sm font-semibold text-amber-600 mt-1 uppercase tracking-wide">Teaching</p>
                    </div>

                    {/* 4. Audit / QIP */}
                    <div className="p-5 bg-emerald-50 rounded-xl border border-emerald-100 relative overflow-hidden group text-center">
                        <div className="flex justify-center mb-3">
                            <div className="bg-white p-2 rounded-full shadow-sm text-emerald-600">
                                <ClipboardList size={20} />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-emerald-900">{pointsOverview.audit}</p>
                        <p className="text-sm font-semibold text-emerald-600 mt-1 uppercase tracking-wide">Audit / QIP</p>
                    </div>

                    {/* 5. Courses */}
                    <div className="p-5 bg-indigo-50 rounded-xl border border-indigo-100 relative overflow-hidden group text-center">
                        <div className="flex justify-center mb-3">
                            <div className="bg-white p-2 rounded-full shadow-sm text-indigo-600">
                                <BookOpen size={20} />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-indigo-900">{pointsOverview.courses}</p>
                        <p className="text-sm font-semibold text-indigo-600 mt-1 uppercase tracking-wide">Courses</p>
                    </div>
                </div>
            </div>

            {/* --- ACTIVITY LOG --- */}
            <div className="pt-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-slate-800">Activity Log</h3>
                    <button onClick={() => openAddModal('Activity')} className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-emerald-700 shadow-sm">
                        <PlusCircle size={16} /> Log Activity
                    </button>
                </div>
                
                {/* Search & Filter Bar (UPDATED CATEGORIES) */}
                <div className="flex gap-4 mb-4">
                    <input 
                        type="text" 
                        placeholder="Search activities..." 
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select 
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        <option value="All">All Categories</option>
                        <option value="Exams">Exams</option>
                        <option value="Publications">Publications</option>
                        <option value="Teaching">Teaching</option>
                        <option value="Audit/QIP">Audit / QIP</option>
                        <option value="Courses">Courses</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="space-y-3">
                    {filteredActivities.length > 0 ? (
                        filteredActivities.sort((a,b) => new Date(b.date) - new Date(a.date)).map(a => {
                            // Calculate proper category for display
                            const displayCategory = getSmartCategory(a);
                            return (
                                <div key={a.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center hover:bg-white transition group cursor-pointer" onClick={() => setSelectedActivity(a)}>
                                    <div>
                                        <p className="font-semibold text-slate-800">{a.description}</p>
                                        <p className="text-sm text-gray-500 flex items-center gap-2">
                                            {/* Display Smart Category instead of raw data */}
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                displayCategory === 'Exams' ? 'bg-blue-100 text-blue-700' :
                                                displayCategory === 'Publications' ? 'bg-purple-100 text-purple-700' :
                                                displayCategory === 'Teaching' ? 'bg-amber-100 text-amber-700' :
                                                displayCategory === 'Audit/QIP' ? 'bg-emerald-100 text-emerald-700' :
                                                displayCategory === 'Courses' ? 'bg-indigo-100 text-indigo-700' :
                                                'bg-gray-200 text-gray-700'
                                            }`}>
                                                {displayCategory}
                                            </span>
                                            <span>| {a.date}</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-bold text-emerald-600 flex items-center gap-1"><TrendingUp size={14}/> +{a.points}</span>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                            <button onClick={(e) => {e.stopPropagation(); openEditModal('Activity', a);}} className="text-gray-400 hover:text-blue-600"><Pencil size={14}/></button>
                                            <button onClick={(e) => {e.stopPropagation(); handleDeleteItem('Activity', a.id);}} className="text-gray-400 hover:text-red-500"><Trash2 size={14}/></button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-center text-gray-500 py-8">No activities found matching your filters.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Portfolio;