// src/pages/Network.js - With Add, Delete, AND Edit Functionality
import React, { useState, useEffect } from 'react';
import { 
    UserPlus, Search, Mail, MapPin, Briefcase, Phone, 
    X, UserCircle, Trash2, Edit2 
} from 'lucide-react';
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Network() {
    const [contacts, setContacts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    
    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false);
    const [currentContactId, setCurrentContactId] = useState(null);
    
    // Form State
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        hospital: '',
        email: '',
        phone: '',
        notes: ''
    });

    // --- 1. LOAD CONTACTS FROM FIREBASE ---
    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "contacts"));
                const contactsList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setContacts(contactsList);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching contacts:", error);
                setLoading(false);
            }
        };

        fetchContacts();
    }, []);

    // --- 2. OPEN MODAL (ADD vs EDIT) ---
    const openAddModal = () => {
        setIsEditing(false);
        setFormData({ name: '', role: '', hospital: '', email: '', phone: '', notes: '' });
        setShowModal(true);
    };

    const openEditModal = (contact) => {
        setIsEditing(true);
        setCurrentContactId(contact.id);
        setFormData({
            name: contact.name,
            role: contact.role,
            hospital: contact.hospital,
            email: contact.email,
            phone: contact.phone,
            notes: contact.notes
        });
        setShowModal(true);
    };

    // --- 3. HANDLE SAVE (CREATE OR UPDATE) ---
    const handleSaveContact = async (e) => {
        e.preventDefault();
        if (!formData.name) return;

        try {
            if (isEditing) {
                // UPDATE Existing Contact
                const contactRef = doc(db, "contacts", currentContactId);
                await updateDoc(contactRef, formData);
                
                // Update Local State
                setContacts(contacts.map(c => 
                    c.id === currentContactId ? { ...c, ...formData } : c
                ));
            } else {
                // CREATE New Contact
                const docRef = await addDoc(collection(db, "contacts"), formData);
                const newContact = { id: docRef.id, ...formData };
                setContacts([...contacts, newContact]);
            }
            
            // Close Modal
            setShowModal(false);
        } catch (error) {
            console.error("Error saving contact:", error);
            alert("Failed to save contact.");
        }
    };

    // --- 4. DELETE CONTACT ---
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to remove this contact?')) {
            try {
                await deleteDoc(doc(db, "contacts", id));
                setContacts(contacts.filter(c => c.id !== id));
            } catch (error) {
                console.error("Error deleting contact:", error);
                alert("Failed to delete contact.");
            }
        }
    };

    // --- FILTERING ---
    const filteredContacts = contacts.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.hospital.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 max-w-7xl mx-auto min-h-screen">
            
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">My Network</h1>
                    <p className="text-gray-600 mt-1">Manage your professional relationships and mentors.</p>
                </div>
                <button 
                    onClick={openAddModal}
                    className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                >
                    <UserPlus size={20} />
                    Add New Contact
                </button>
            </div>

            {/* --- SEARCH --- */}
            <div className="relative mb-8 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Search by name, role, or hospital..." 
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* --- CONTACT GRID --- */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading your network...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredContacts.length > 0 ? (
                        filteredContacts.map(contact => (
                            <div key={contact.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow flex flex-col group relative">
                                
                                {/* Action Buttons (Top Right) */}
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => openEditModal(contact)}
                                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Edit Contact"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(contact.id)}
                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete Contact"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold text-lg">
                                            {contact.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800">{contact.name}</h3>
                                            <p className="text-sm text-blue-600 font-medium">{contact.role}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-3 text-sm text-gray-600 mb-4 flex-grow">
                                    {contact.hospital && (
                                        <div className="flex items-center gap-2">
                                            <Briefcase size={16} className="text-gray-400 shrink-0" />
                                            <span>{contact.hospital}</span>
                                        </div>
                                    )}
                                    {contact.email && (
                                        <div className="flex items-center gap-2">
                                            <Mail size={16} className="text-gray-400 shrink-0" />
                                            <a href={`mailto:${contact.email}`} className="hover:text-blue-600 hover:underline">{contact.email}</a>
                                        </div>
                                    )}
                                    {contact.phone && (
                                        <div className="flex items-center gap-2">
                                            <Phone size={16} className="text-gray-400 shrink-0" />
                                            <span>{contact.phone}</span>
                                        </div>
                                    )}
                                </div>

                                {contact.notes && (
                                    <div className="mt-auto pt-4 border-t border-gray-100">
                                        <p className="text-xs text-gray-500 italic">"{contact.notes}"</p>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-200">
                            <UserCircle size={48} className="mx-auto text-gray-300 mb-3" />
                            <p>No contacts found. Add someone to your network!</p>
                        </div>
                    )}
                </div>
            )}

            {/* --- ADD/EDIT CONTACT MODAL --- */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-slate-800">
                                {isEditing ? 'Edit Contact' : 'Add New Contact'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSaveContact} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                <input 
                                    required
                                    type="text" 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    placeholder="e.g. Dr. Sarah Smith"
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        value={formData.role}
                                        onChange={e => setFormData({...formData, role: e.target.value})}
                                        placeholder="e.g. Consultant"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hospital / Org</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        value={formData.hospital}
                                        onChange={e => setFormData({...formData, hospital: e.target.value})}
                                        placeholder="e.g. St Mary's"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input 
                                        type="email" 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        value={formData.email}
                                        onChange={e => setFormData({...formData, email: e.target.value})}
                                        placeholder="email@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input 
                                        type="tel" 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        value={formData.phone}
                                        onChange={e => setFormData({...formData, phone: e.target.value})}
                                        placeholder="077..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                <textarea 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none h-24 resize-none"
                                    value={formData.notes}
                                    onChange={e => setFormData({...formData, notes: e.target.value})}
                                    placeholder="Where did you meet? What did you discuss?"
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button 
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                                >
                                    {isEditing ? 'Update Contact' : 'Save Contact'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}