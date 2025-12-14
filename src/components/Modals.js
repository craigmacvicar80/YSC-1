// src/components/Modals.js - Updated Activity Categories
import React, { useState, useEffect } from 'react';
import { X, Upload, Calendar, Link as LinkIcon, FileText, CheckCircle, AlertCircle } from 'lucide-react';

// --- GENERIC MODAL WRAPPER ---
const ModalWrapper = ({ title, onClose, children }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
                <h3 className="text-xl font-bold text-slate-800">{title}</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-200 rounded-full">
                    <X size={20} />
                </button>
            </div>
            <div className="p-6 overflow-y-auto">
                {children}
            </div>
        </div>
    </div>
);

// --- ADD/EDIT ITEM MODAL ---
export const AddItemModal = ({ category, initialData, onClose, onSave }) => {
    const [formData, setFormData] = useState(initialData || {});

    // Initialize defaults based on category
    useEffect(() => {
        if (!initialData) {
            if (category === 'Activity') {
                setFormData({ 
                    date: new Date().toISOString().split('T')[0], 
                    type: '', 
                    category: 'Courses', // Default
                    description: '', 
                    points: 0 
                });
            } else {
                setFormData({});
            }
        }
    }, [category, initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(category, { id: initialData?.id || Date.now(), ...formData });
        onClose();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- FORM RENDERING LOGIC ---
    const renderFormFields = () => {
        switch (category) {
            case 'Activity':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Activity Category</label>
                            <select 
                                name="category" 
                                value={formData.category || 'Courses'} 
                                onChange={handleChange} 
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                            >
                                <option value="Exams">Exams</option>
                                <option value="Publications">Publications</option>
                                <option value="Teaching">Teaching</option>
                                <option value="Audit/QIP">Audit/QIP</option>
                                <option value="Courses">Courses</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                            <input 
                                name="description" 
                                value={formData.description || ''} 
                                onChange={handleChange} 
                                placeholder="e.g. MRCS Part A, Published in BMJ..." 
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required 
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
                                <input 
                                    type="date" 
                                    name="date" 
                                    value={formData.date || ''} 
                                    onChange={handleChange} 
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Points Value</label>
                                <input 
                                    type="number" 
                                    name="points" 
                                    value={formData.points || 0} 
                                    onChange={handleChange} 
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    min="0"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Specific Type (Optional)</label>
                            <input 
                                name="type" 
                                value={formData.type || ''} 
                                onChange={handleChange} 
                                placeholder="e.g. Peer-Reviewed Paper, Regional Teaching" 
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>
                );

            case 'Employment History':
                return (
                    <div className="space-y-4">
                        <div><label className="block text-sm font-semibold text-gray-700 mb-1">Role</label><input name="role" value={formData.role || ''} onChange={handleChange} className="w-full p-2 border rounded-lg" required /></div>
                        <div><label className="block text-sm font-semibold text-gray-700 mb-1">Hospital</label><input name="hospital" value={formData.hospital || ''} onChange={handleChange} className="w-full p-2 border rounded-lg" required /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label><input name="start" type="month" value={formData.start || ''} onChange={handleChange} className="w-full p-2 border rounded-lg" /></div>
                            <div><label className="block text-sm font-semibold text-gray-700 mb-1">End Date</label><input name="end" type="month" value={formData.end || ''} onChange={handleChange} className="w-full p-2 border rounded-lg" /></div>
                        </div>
                    </div>
                );
            
            case 'Technical Skills':
                return (
                    <div className="space-y-4">
                        <div><label className="block text-sm font-semibold text-gray-700 mb-1">Skill Name</label><input name="name" value={formData.name || ''} onChange={handleChange} className="w-full p-2 border rounded-lg" required /></div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Level</label>
                            <select name="level" value={formData.level || 'Observed'} onChange={handleChange} className="w-full p-2 border rounded-lg bg-white">
                                <option>Observed</option>
                                <option>Assisted</option>
                                <option>Performed (Supervised)</option>
                                <option>Independent</option>
                            </select>
                        </div>
                    </div>
                );

            default: // Generic Fallback for Memberships, Awards, etc.
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Title / Name</label>
                            <input name="name" value={formData.name || ''} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Details / Organization</label>
                            <input name="details" value={formData.details || ''} onChange={handleChange} className="w-full p-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Date (Year)</label>
                            <input name="date" value={formData.date || ''} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="2024" />
                        </div>
                    </div>
                );
        }
    };

    return (
        <ModalWrapper title={`${initialData ? 'Edit' : 'Add'} ${category}`} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                {renderFormFields()}
                <div className="mt-6 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">Save Item</button>
                </div>
            </form>
        </ModalWrapper>
    );
};

// --- ACTIVITY DETAIL MODAL (Read Only / View) ---
export const ActivityDetailModal = ({ activity, onClose, onSave }) => {
    // We reuse AddItemModal logic conceptually, but for now this is just a detailed view 
    // or a bridge to editing.
    return (
        <ModalWrapper title="Activity Details" onClose={onClose}>
            <div className="space-y-6">
                <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold 
                        ${activity.category === 'Exams' ? 'bg-blue-100 text-blue-700' : 
                          activity.category === 'Publications' ? 'bg-purple-100 text-purple-700' :
                          'bg-gray-100 text-gray-700'}`}>
                        {activity.category}
                    </span>
                    <h2 className="text-2xl font-bold text-slate-900 mt-2">{activity.description}</h2>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-blue-500"/>
                        <span>{activity.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Award size={16} className="text-emerald-500"/>
                        <span className="font-semibold text-emerald-700">+{activity.points} Points</span>
                    </div>
                </div>

                {activity.type && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Type</p>
                        <p className="text-gray-800">{activity.type}</p>
                    </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Close</button>
                </div>
            </div>
        </ModalWrapper>
    );
};

// --- CPD MATRIX MODAL (Placeholder for future feature) ---
export const CPDMatrixModal = ({ onClose }) => (
    <ModalWrapper title="CPD Matrix" onClose={onClose}>
        <div className="text-center py-8">
            <AlertCircle size={48} className="mx-auto text-blue-500 mb-4" />
            <p className="text-gray-600">This feature is coming soon.</p>
        </div>
    </ModalWrapper>
);