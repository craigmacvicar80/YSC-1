import React, { useState, useEffect } from 'react';
import { X, Save, Star, Calendar, FileText, CheckCircle, Info, MessageSquare } from 'lucide-react';

// --- 1. GENERIC ADD/EDIT ITEM MODAL ---
export const AddItemModal = ({ category, initialData, onClose, onSave }) => {
    const [formData, setFormData] = useState({});

    // Populate form if editing
    useEffect(() => {
        if (initialData) {
            // FIX: Normalize data so the form isn't blank if fields were named differently in the past
            setFormData({
                ...initialData,
                // If 'name' is missing, try 'title'. If 'organization' is missing, try 'issuer' or 'employer'
                name: initialData.name || initialData.title || '',
                organization: initialData.organization || initialData.issuer || initialData.employer || initialData.hospital || '',
                role: initialData.role || initialData.title || '', // Fallback for employment
                description: initialData.description || '',
                date: initialData.date || '',
                rating: initialData.rating || 0
            });
        } else {
            // Default empty state for new items
            setFormData({ 
                rating: 0, 
                points: 1,
                date: new Date().toISOString().split('T')[0]
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRating = (ratingValue) => {
        setFormData(prev => ({ ...prev, rating: ratingValue }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(category, formData);
        onClose();
    };

    // Render Form Fields based on Category
    const renderFields = () => {
        switch (category) {
            case 'Employment History':
                return (
                    <>
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-700">Role / Job Title</label>
                            <input name="role" value={formData.role || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1" placeholder="e.g. Core Surgical Trainee" required />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-700">Hospital / Organization</label>
                            <input name="organization" value={formData.organization || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1" placeholder="e.g. St Thomas' Hospital" required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Start Date</label>
                            <input type="month" name="startDate" value={formData.startDate || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700">End Date</label>
                            <input type="month" name="endDate" value={formData.endDate || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1" placeholder="Leave blank if Current" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-700">Description / Responsibilities</label>
                            <textarea name="description" value={formData.description || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1" rows="3"></textarea>
                        </div>
                    </>
                );

            case 'Technical Skills':
                return (
                    <>
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-700">Skill Name</label>
                            <input name="name" value={formData.name || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1" placeholder="e.g. Laparoscopic Appendicectomy" required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Level</label>
                            <select name="level" value={formData.level || 'Beginner'} onChange={handleChange} className="w-full p-2 border rounded mt-1">
                                <option>Observed</option>
                                <option>Assisted</option>
                                <option>Supervised</option>
                                <option>Independent</option>
                                <option>Proficient</option>
                                <option>Expert</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Years Experience</label>
                            <input type="number" name="years" value={formData.years || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1" />
                        </div>
                        
                        {/* STAR RATING INPUT */}
                        <div className="col-span-2 bg-gray-50 p-3 rounded border">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Proficiency Rating (1-5)</label>
                            <div className="flex gap-2 items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => handleRating(star)}
                                        className={`p-1 transition-transform hover:scale-110 focus:outline-none ${Number(formData.rating) >= star ? 'text-amber-400' : 'text-gray-300'}`}
                                    >
                                        <Star size={28} fill={Number(formData.rating) >= star ? "currentColor" : "none"} />
                                    </button>
                                ))}
                                <span className="text-sm font-medium text-gray-600 ml-2">
                                    {formData.rating ? `${formData.rating} Stars` : 'Rate proficiency'}
                                </span>
                            </div>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-700">Last Performed Date</label>
                            <input type="date" name="date" value={formData.date || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1" />
                        </div>
                    </>
                );

            case 'Certificates':
            case 'Memberships':
                return (
                    <>
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-700">Name / Title</label>
                            <input name="name" value={formData.name || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1" required />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-700">Organization / Issuer</label>
                            <input name="organization" value={formData.organization || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1" required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Date Issued</label>
                            <input type="date" name="date" value={formData.date || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1" />
                        </div>
                        {category === 'Certificates' && (
                            <div>
                                <label className="block text-sm font-bold text-gray-700">Expiry Date</label>
                                <input type="date" name="expiryDate" value={formData.expiryDate || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1" />
                            </div>
                        )}
                    </>
                );

            case 'Activity':
                return (
                    <>
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-700">Activity Description</label>
                            <input name="description" value={formData.description || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1" placeholder="e.g. Attended World Congress" required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Category</label>
                            <select name="category" value={formData.category || 'Other'} onChange={handleChange} className="w-full p-2 border rounded mt-1">
                                <option>Exams</option>
                                <option>Courses</option>
                                <option>Publications</option>
                                <option>Teaching</option>
                                <option>Audit/QIP</option>
                                <option>Clinical Activity</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Date</label>
                            <input type="date" name="date" value={formData.date || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Points</label>
                            <input type="number" name="points" value={formData.points || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1" />
                        </div>
                        
                        {/* COMMENTS FIELD */}
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-700">Comments / Reflection</label>
                            <textarea name="comments" value={formData.comments || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1" rows="3" placeholder="Enter notes or reflection here..."></textarea>
                        </div>
                    </>
                );

            case 'Evidence':
                 return (
                    <>
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-700">File Title</label>
                            <input name="title" value={formData.title || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1" required />
                        </div>
                        <div className="col-span-2">
                             <label className="block text-sm font-bold text-gray-700">Description / Context</label>
                            <textarea name="description" value={formData.description || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1" rows="2"></textarea>
                        </div>
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="bg-slate-50 border-b p-4 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        {initialData ? 'Edit' : 'Add'} {category}
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderFields()}
                    </div>
                    <div className="mt-6 flex justify-end gap-3 border-t pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                        <button type="submit" className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded flex items-center gap-2"><Save size={16} /> Save Item</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- 2. ACTIVITY DETAIL MODAL ---
export const ActivityDetailModal = ({ activity, onClose }) => {
    if (!activity) return null;
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20} /></button>
                
                <div className="flex items-center gap-2 mb-4">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold uppercase">{activity.category}</span>
                    <span className="text-gray-400 text-sm flex items-center gap-1"><Calendar size={14}/> {activity.date}</span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{activity.description}</h3>
                <div className="text-emerald-600 font-bold mb-4">+{activity.points} Points</div>
                
                {/* DISPLAY COMMENTS */}
                {activity.comments && (
                    <div className="bg-gray-50 border border-gray-100 p-4 rounded-lg mt-4">
                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
                            <MessageSquare size={12}/> Reflection / Comments
                        </h4>
                        <p className="text-sm text-gray-700 italic">{activity.comments}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export const CPDMatrixModal = ({ onClose }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-4xl p-6 relative">
            <button onClick={onClose} className="absolute top-4 right-4"><X size={24}/></button>
            <h2 className="text-2xl font-bold mb-4">CPD Matrix</h2>
            <div className="h-96 border-2 border-dashed border-gray-200 rounded flex items-center justify-center text-gray-400">
                CPD Matrix Content
            </div>
        </div>
    </div>
);