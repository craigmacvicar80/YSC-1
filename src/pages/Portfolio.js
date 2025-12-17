import React, { useState, useEffect, useRef } from 'react';
import { 
    Building2, Users, FileText, Code, Award, Briefcase, PlusCircle, 
    TrendingUp, Award as AwardIcon, Pencil, Trash2, PieChart, 
    Save, Loader, CheckCircle, Calendar, Star, Paperclip, ExternalLink, Clock
} from 'lucide-react';
import { AddItemModal, ActivityDetailModal, CPDMatrixModal } from '../components/Modals'; 
import { useAuth } from '../context/AuthContext';
import { doc, setDoc, onSnapshot } from 'firebase/firestore'; 
import { db } from '../firebase';

function Portfolio() {
    const { currentUser } = useAuth();
    const fileInputRef = useRef(null);
    
    // Data State
    const [profileData, setProfileData] = useState({
        employmentHistory: [], memberships: [], certifications: [], 
        technicalSkills: [], evidence: [], awards: []
    });
    const [localActivities, setLocalActivities] = useState([]); 
    
    // UI State
    const [activeModalCategory, setActiveModalCategory] = useState(null);
    const [itemToEdit, setItemToEdit] = useState(null);
    const [selectedActivity, setSelectedActivity] = useState(null); 
    const [showCPDModal, setShowCPDModal] = useState(false);
    
    const [isProfileEditing, setIsProfileEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({});
    const [saving, setSaving] = useState(false); 
    const [successMsg, setSuccessMsg] = useState(''); 
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');

    // --- FETCH DATA ---
    useEffect(() => {
        if (!currentUser) return;
        const unsub = onSnapshot(doc(db, "users", currentUser.uid), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setProfileData(prev => ({ ...prev, ...data }));
                setEditFormData(prev => ({ ...prev, ...data }));
                setLocalActivities(data.activities || []);
            }
        });
        return () => unsub();
    }, [currentUser]);

    // --- HANDLERS ---
    const openAddModal = (category) => { 
        if (category === 'Evidence') {
            if (fileInputRef.current) fileInputRef.current.click();
            return;
        }
        setItemToEdit(null); 
        setActiveModalCategory(category); 
    };

    const openEditModal = (category, item) => { 
        setItemToEdit(item); 
        setActiveModalCategory(category); 
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const tempUrl = URL.createObjectURL(file); 
        const newEvidenceItem = {
            id: Date.now().toString(),
            title: file.name,
            fileName: file.name,
            description: `File type: ${file.type}`,
            fileSize: `${(file.size/1024).toFixed(1)} KB`,
            date: new Date().toISOString().split('T')[0],
            url: tempUrl,
            type: file.type
        };
        await handleSaveItem('Evidence', newEvidenceItem);
        e.target.value = null; 
    };

    const handleViewFile = (url) => {
        if (url) window.open(url, '_blank');
        else alert("Preview not available.");
    };

    const handleSaveItem = async (category, item) => {
        if (!currentUser) return alert("Please log in.");
        setSaving(true);

        let fieldKey = category === 'Activity' ? 'activities' : 
            (category === 'Employment History' ? 'employmentHistory' : 
            (category === 'Memberships' ? 'memberships' : 
            (category === 'Certificates' ? 'certifications' : 
            (category === 'Technical Skills' ? 'technicalSkills' : 
            (category === 'Evidence' ? 'evidence' : 'awards')))));

        const currentList = (fieldKey === 'activities' ? localActivities : profileData[fieldKey]) || [];
        const cleanItem = { ...item, id: item.id || Date.now().toString() };
        
        let newList = currentList.some(i => i.id === cleanItem.id)
            ? currentList.map(i => i.id === cleanItem.id ? cleanItem : i) 
            : [...currentList, cleanItem]; 

        try {
            await setDoc(doc(db, "users", currentUser.uid), { [fieldKey]: newList }, { merge: true });
            setSuccessMsg(`${category} saved!`);
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (error) {
            alert("Save failed: " + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteItem = async (category, id) => {
        if (!currentUser || !confirm("Delete this item?")) return;
        
        let fieldKey = category === 'Activity' ? 'activities' : 
            (category === 'Employment History' ? 'employmentHistory' : 
            (category === 'Memberships' ? 'memberships' : 
            (category === 'Certificates' ? 'certifications' : 
            (category === 'Technical Skills' ? 'technicalSkills' : 
            (category === 'Evidence' ? 'evidence' : 'awards')))));

        const currentList = (fieldKey === 'activities' ? localActivities : profileData[fieldKey]) || [];
        const newList = currentList.filter(i => i.id !== id);

        try {
            await setDoc(doc(db, "users", currentUser.uid), { [fieldKey]: newList }, { merge: true });
            setSuccessMsg("Item deleted.");
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (error) {
            alert("Error deleting: " + error.message);
        }
    };

    const handleProfileSave = async () => { 
        if (!currentUser) return;
        setSaving(true);
        try {
            await setDoc(doc(db, "users", currentUser.uid), editFormData, { merge: true });
            setIsProfileEditing(false);
        } finally { setSaving(false); }
    };

    // --- RENDERERS ---

    const renderEmploymentItem = (item) => (
        <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-100 mb-3 hover:shadow-md transition group">
            <div className="flex justify-between items-start">
                <div className="w-full">
                    <h4 className="font-bold text-gray-900 text-lg">{item.role || item.title || 'Role Not Set'}</h4>
                    <p className="text-emerald-600 font-semibold">{item.organization || item.employer || item.hospital || 'Organization Not Set'}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <Calendar size={14}/> 
                        <span>{item.startDate}</span> 
                        <span>-</span> 
                        <span>{item.endDate || 'Present'}</span>
                    </div>
                    {item.description && (
                        <div className="mt-3 text-gray-600 text-sm bg-gray-50 p-3 rounded border border-gray-100 whitespace-pre-wrap">
                            {item.description}
                        </div>
                    )}
                </div>
                <div className="opacity-0 group-hover:opacity-100 flex gap-2 shrink-0 ml-2">
                    <button onClick={() => openEditModal('Employment History', item)} className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Pencil size={16}/></button>
                    <button onClick={() => handleDeleteItem('Employment History', item.id)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={16}/></button>
                </div>
            </div>
        </div>
    );

    const renderSkillItem = (item) => (
        <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-100 flex flex-col gap-2 mb-2 group hover:shadow-md transition">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-bold text-gray-800 text-base">{item.name || item.skill || 'Skill'}</h4>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Level:</span>
                        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">{item.level || 'Not set'}</span>
                    </div>
                    {item.years && (
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                            <Clock size={14} className="text-gray-400"/>
                            <span>{item.years} Years Experience</span>
                        </div>
                    )}
                    {item.date && (
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                            <Calendar size={14} className="text-gray-400"/>
                            <span>Last performed: {item.date}</span>
                        </div>
                    )}
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="flex text-amber-400">
                        {[1,2,3,4,5].map(star => (
                            <Star key={star} size={16} fill={Number(item.rating || 0) >= star ? "currentColor" : "none"} />
                        ))}
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 flex gap-2">
                        <button onClick={() => openEditModal('Technical Skills', item)} className="text-gray-400 hover:text-blue-600"><Pencil size={16}/></button>
                        <button onClick={() => handleDeleteItem('Technical Skills', item.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderCertificateItem = (item) => (
        <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-100 mb-2 group hover:shadow-md transition">
            <div className="flex justify-between items-start">
                <div className="w-full">
                    <h5 className="font-bold text-gray-800 text-base">{item.name || item.title}</h5>
                    
                    {/* Check organization OR issuer OR description */}
                    <p className="text-sm text-emerald-700 font-medium mt-1">
                        {item.organization || item.issuer || item.description || 'Issuer not set'}
                    </p>
                    
                    <div className="flex gap-4 mt-2 text-xs text-gray-500 border-t pt-2 mt-2">
                        {item.date && <span><strong>Issued:</strong> {item.date}</span>}
                        {item.expiryDate && <span className="text-red-500"><strong>Expires:</strong> {item.expiryDate}</span>}
                    </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 flex gap-2 shrink-0 ml-2">
                    <button onClick={() => openEditModal('Certificates', item)} className="text-gray-400 hover:text-blue-600"><Pencil size={16}/></button>
                    <button onClick={() => handleDeleteItem('Certificates', item.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
                </div>
            </div>
        </div>
    );

    const renderMembershipItem = (item) => (
        <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-100 mb-2 group hover:shadow-md transition">
            <div className="flex justify-between items-start">
                <div>
                    <h5 className="font-bold text-gray-800 text-base">{item.name || item.title}</h5>
                    
                    {/* Check organization OR issuer OR description */}
                    <p className="text-sm text-gray-600 mt-1">
                        {item.organization || item.issuer || item.description || 'Organization not set'}
                    </p>
                    
                    {item.date && <p className="text-xs text-gray-400 mt-1">Joined: {item.date}</p>}
                </div>
                <div className="opacity-0 group-hover:opacity-100 flex gap-2 shrink-0">
                    <button onClick={() => openEditModal('Memberships', item)} className="text-gray-400 hover:text-blue-600"><Pencil size={16}/></button>
                    <button onClick={() => handleDeleteItem('Memberships', item.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
                </div>
            </div>
        </div>
    );

    const renderEvidenceItem = (item) => (
        <div key={item.id} onDoubleClick={() => handleViewFile(item.url)} className="bg-white p-4 rounded-lg border border-gray-100 mb-3 cursor-pointer hover:bg-blue-50/30 group transition">
            <div className="flex justify-between items-start">
                <div className="flex gap-3 items-start w-full">
                    <div className="bg-blue-100 p-2 rounded text-blue-600 shrink-0"><Paperclip size={20}/></div>
                    <div className="w-full">
                        <h4 className="font-bold text-sm text-gray-800 hover:text-blue-600 underline-offset-2 hover:underline" onClick={() => handleViewFile(item.url)}>
                            {item.title || item.fileName || 'Untitled'}
                        </h4>
                        {item.description && (
                            <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-2 rounded border border-gray-100">
                                {item.description}
                            </p>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                            <span>{item.date}</span>
                            <span>•</span>
                            <span>{item.fileSize}</span>
                            <span>•</span>
                            <span>{item.type}</span>
                        </div>
                    </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 flex gap-2 shrink-0">
                    <button onClick={() => openEditModal('Evidence', item)} className="text-gray-400 hover:text-blue-600"><Pencil size={14}/></button>
                    <button onClick={() => handleDeleteItem('Evidence', item.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={14}/></button>
                </div>
            </div>
        </div>
    );

    // --- MAIN RENDER ---
    const userInitials = (profileData.name || 'User').slice(0, 2).toUpperCase();
    const filteredActivities = localActivities.filter(a => 
        (a.description || '').toLowerCase().includes(searchTerm.toLowerCase()) && 
        (filterCategory === 'All' || a.category === filterCategory)
    );

    return (
        <div className="p-6 space-y-6 bg-slate-50 min-h-screen relative">
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} />
            {successMsg && <div className="fixed top-5 right-5 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50 flex items-center animate-bounce"><CheckCircle size={18} className="mr-2"/> {successMsg}</div>}
            
            {showCPDModal && <CPDMatrixModal onClose={() => setShowCPDModal(false)} />}
            {activeModalCategory && <AddItemModal category={activeModalCategory} initialData={itemToEdit} onClose={() => setActiveModalCategory(null)} onSave={handleSaveItem} />}
            {selectedActivity && <ActivityDetailModal activity={selectedActivity} onClose={() => setSelectedActivity(null)} />}

            {/* HEADER */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start gap-6">
                <div className="flex gap-5 w-full">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white text-2xl font-bold shrink-0">
                        {userInitials}
                    </div>
                    <div className="flex-1">
                        {isProfileEditing ? (
                            <div className="space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="col-span-2">
                                        <label className="text-xs text-gray-500 font-bold uppercase">Full Name</label>
                                        <input value={editFormData.name || ''} onChange={e => setEditFormData({...editFormData, name: e.target.value})} className="w-full border p-2 rounded font-bold text-lg" placeholder="Full Name" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 font-bold uppercase">Current Level</label>
                                        <input value={editFormData.level || ''} onChange={e => setEditFormData({...editFormData, level: e.target.value})} className="w-full border p-2 rounded text-sm" placeholder="e.g. ST3" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 font-bold uppercase">GMC No.</label>
                                        <input value={editFormData.gmc || ''} onChange={e => setEditFormData({...editFormData, gmc: e.target.value})} className="w-full border p-2 rounded text-sm" placeholder="1234567" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 font-bold uppercase">Start Date</label>
                                        {/* CHANGED TO DATE INPUT FOR CALENDAR POPUP */}
                                        <input type="date" value={editFormData.startDate || ''} onChange={e => setEditFormData({...editFormData, startDate: e.target.value})} className="w-full border p-2 rounded text-sm" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 font-bold uppercase">Interest</label>
                                        <input value={editFormData.specialtyInterest || ''} onChange={e => setEditFormData({...editFormData, specialtyInterest: e.target.value})} className="w-full border p-2 rounded text-sm" placeholder="e.g. Colorectal" />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold text-slate-800">{profileData.name || 'Surgical Trainee'}</h2>
                                <p className="text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded inline-block text-sm">{profileData.level || 'CT1'}</p>
                                
                                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-500 border-t pt-3">
                                    <div>
                                        <span className="block font-bold uppercase tracking-wider text-gray-400">GMC No.</span>
                                        <span className="text-slate-700 font-medium">{profileData.gmc || 'N/A'}</span>
                                    </div>
                                    <div>
                                        <span className="block font-bold uppercase tracking-wider text-gray-400">Start Date</span>
                                        <span className="text-slate-700 font-medium">{profileData.startDate || 'N/A'}</span>
                                    </div>
                                    <div>
                                        <span className="block font-bold uppercase tracking-wider text-gray-400">Interest</span>
                                        <span className="text-slate-700 font-medium">{profileData.specialtyInterest || 'N/A'}</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                
                <div className="flex flex-col items-end gap-2 shrink-0">
                    <button onClick={isProfileEditing ? handleProfileSave : () => setIsProfileEditing(true)} className="text-xs border px-3 py-1 rounded bg-white hover:bg-gray-50 transition-colors">
                        {isProfileEditing ? <><Save size={12} className="inline mr-1"/> Save Profile</> : <><Pencil size={12} className="inline mr-1"/> Edit Profile</>}
                    </button>
                    <div className="bg-emerald-50 text-emerald-800 px-3 py-1 rounded font-bold text-sm flex items-center gap-2">
                        <AwardIcon size={14}/> {localActivities.reduce((acc, curr) => acc + (Number(curr.points)||0), 0)} Points
                    </div>
                </div>
            </div>

            {/* CONTENT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between mb-4">
                        <h3 className="font-bold flex gap-2 items-center"><Building2 size={18}/> Employment History</h3>
                        <button onClick={() => openAddModal('Employment History')} className="text-blue-600"><PlusCircle size={20}/></button>
                    </div>
                    {profileData.employmentHistory.length > 0 ? profileData.employmentHistory.map(renderEmploymentItem) : <p className="text-gray-400 text-sm">No history added.</p>}
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex justify-between mb-4">
                            <h3 className="font-bold flex gap-2 items-center"><Users size={18}/> Memberships</h3>
                            <button onClick={() => openAddModal('Memberships')} className="text-blue-600"><PlusCircle size={20}/></button>
                        </div>
                        {profileData.memberships.length > 0 ? profileData.memberships.map(renderMembershipItem) : <p className="text-gray-400 text-sm">No memberships.</p>}
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex justify-between mb-4">
                            <h3 className="font-bold flex gap-2 items-center"><FileText size={18}/> Certificates</h3>
                            <button onClick={() => openAddModal('Certificates')} className="text-blue-600"><PlusCircle size={20}/></button>
                        </div>
                        {profileData.certifications.length > 0 ? profileData.certifications.map(renderCertificateItem) : <p className="text-gray-400 text-sm">No certificates.</p>}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between mb-4">
                        <h3 className="font-bold flex gap-2 items-center"><Code size={18}/> Technical Skills</h3>
                        <button onClick={() => openAddModal('Technical Skills')} className="text-blue-600"><PlusCircle size={20}/></button>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                        {profileData.technicalSkills.length > 0 ? profileData.technicalSkills.map(renderSkillItem) : <p className="text-gray-400 text-sm">No skills added.</p>}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between mb-4">
                        <h3 className="font-bold flex gap-2 items-center"><Briefcase size={18}/> Evidence Uploads</h3>
                        <button onClick={() => openAddModal('Evidence')} className="text-blue-600"><PlusCircle size={20}/></button>
                    </div>
                    {profileData.evidence.length > 0 ? profileData.evidence.map(renderEvidenceItem) : <p className="text-gray-400 text-sm">No evidence uploaded.</p>}
                </div>
            </div>

            {/* ACTIVITY LOG */}
            <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Activity Logbook</h3>
                    <button onClick={() => openAddModal('Activity')} className="bg-emerald-600 text-white px-4 py-2 rounded flex gap-2 items-center hover:bg-emerald-700"><PlusCircle size={16}/> Log Activity</button>
                </div>
                <div className="flex gap-4 mb-4">
                    <input className="border p-2 rounded flex-1" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    <select className="border p-2 rounded" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                        <option value="All">All</option>
                        <option>Exams</option><option>Courses</option><option>Publications</option><option>Teaching</option><option>Audit/QIP</option>
                    </select>
                </div>
                <div className="space-y-2">
                    {filteredActivities.length > 0 ? filteredActivities.map(act => (
                        <div key={act.id} className="bg-white p-4 rounded border flex justify-between items-center hover:bg-gray-50 group cursor-pointer" onClick={() => setSelectedActivity(act)}>
                            <div>
                                <p className="font-bold text-slate-800">{act.description}</p>
                                <p className="text-xs text-gray-500">{act.category} • {act.date}</p>
                            </div>
                            <div className="flex gap-4 items-center">
                                <span className="font-bold text-emerald-600">+{act.points} pts</span>
                                <div className="opacity-0 group-hover:opacity-100 flex gap-2" onClick={(e) => e.stopPropagation()}>
                                    <button onClick={() => openEditModal('Activity', act)} className="text-gray-400 hover:text-blue-600"><Pencil size={14}/></button>
                                    <button onClick={() => handleDeleteItem('Activity', act.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={14}/></button>
                                </div>
                            </div>
                        </div>
                    )) : <p className="text-gray-400 text-sm py-4 text-center">No activities found.</p>}
                </div>
            </div>
        </div>
    );
}

export default Portfolio;