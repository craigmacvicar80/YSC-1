import React, { useState, useEffect } from 'react';
import { 
    Users, Search, Plus, Mail, Phone, MapPin, 
    Briefcase, Trash2, ExternalLink, UserPlus 
} from 'lucide-react';
import { 
    collection, query, getDocs, addDoc, deleteDoc, doc, onSnapshot 
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

export default function Network() {
    const { currentUser } = useAuth();
    const [contacts, setContacts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // --- FORM STATE ---
    const [newContact, setNewContact] = useState({
        name: '',
        role: '',
        hospital: '',
        email: '',
        phone: '',
        notes: ''
    });

    // --- 1. FETCH CONTACTS (Strictly User-Specific) ---
    useEffect(() => {
        if (!currentUser) return;

        // Listener on: users/{uid}/contacts
        const q = query(collection(db, "users", currentUser.uid, "contacts"));
        
        const unsub = onSnapshot(q, (snapshot) => {
            const userContacts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setContacts(userContacts);
        });

        return () => unsub();
    }, [currentUser]);

    // --- 2. ADD CONTACT (Strictly User-Specific) ---
    const handleAddContact = async (e) => {
        e.preventDefault();
        if (!currentUser) return;
        setLoading(true);

        try {
            // Save to: users/{uid}/contacts
            await addDoc(collection(db, "users", currentUser.uid, "contacts"), {
                ...newContact,
                createdAt: new Date().toISOString()
            });
            
            setIsModalOpen(false);
            setNewContact({ name: '', role: '', hospital: '', email: '', phone: '', notes: '' });
        } catch (error) {
            console.error("Error adding contact:", error);
            alert("Failed to add contact.");
        }
        setLoading(false);
    };

    // --- 3. DELETE CONTACT ---
    const handleDelete = async (id) => {
        if (!confirm("Remove this contact?")) return;
        try {
            await deleteDoc(doc(db, "users", currentUser.uid, "contacts", id));
        } catch (error) {
            console.error("Error deleting:", error);
        }
    };

    // --- FILTERING ---
    const filteredContacts = contacts.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.hospital && c.hospital.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (c.role && c.role.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                        <Users className="text-blue-600" size={32} /> My Network
                    </h1>
                    <p className="text-slate-500 mt-1">Manage your professional surgical connections.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center gap-2 shadow-lg hover:shadow-blue-200"
                >
                    <UserPlus size={20} /> Add Contact
                </button>
            </div>

            {/* SEARCH BAR */}
            <div className="relative mb-8 max-w-2xl">
                <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
                <input 
                    type="text"
                    placeholder="Search by name, hospital, or role..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none text-slate-700 font-medium transition-colors"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* CONTACTS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContacts.length > 0 ? (
                    filteredContacts.map(contact => (
                        <div key={contact.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow group relative">
                            
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-sm">
                                        {contact.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-lg">{contact.name}</h3>
                                        <p className="text-blue-600 font-medium text-sm">{contact.role}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleDelete(contact.id)}
                                    className="text-slate-300 hover:text-red-500 transition-colors p-2"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="space-y-3">
                                {contact.hospital && (
                                    <div className="flex items-center gap-3 text-slate-600 text-sm">
                                        <Briefcase size={16} className="text-slate-400" />
                                        {contact.hospital}
                                    </div>
                                )}
                                {contact.email && (
                                    <div className="flex items-center gap-3 text-slate-600 text-sm overflow-hidden">
                                        <Mail size={16} className="text-slate-400 shrink-0" />
                                        <a href={`mailto:${contact.email}`} className="truncate hover:text-blue-600 hover:underline">{contact.email}</a>
                                    </div>
                                )}
                                {contact.phone && (
                                    <div className="flex items-center gap-3 text-slate-600 text-sm">
                                        <Phone size={16} className="text-slate-400" />
                                        {contact.phone}
                                    </div>
                                )}
                                {contact.notes && (
                                    <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 italic">
                                        "{contact.notes}"
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-300">
                        <Users size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="text-lg font-medium">No contacts found.</p>
                        <p className="text-sm">Add people to your network to see them here.</p>
                    </div>
                )}
            </div>

            {/* ADD CONTACT MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setIsModalOpen(false)}>
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-800">Add New Contact</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <Plus size={24} className="rotate-45" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleAddContact} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Name</label>
                                    <input required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Dr. John Doe" value={newContact.name} onChange={e => setNewContact({...newContact, name: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Role</label>
                                    <input className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Consultant" value={newContact.role} onChange={e => setNewContact({...newContact, role: e.target.value})} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Hospital / Organization</label>
                                <input className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="St. Mary's Hospital" value={newContact.hospital} onChange={e => setNewContact({...newContact, hospital: e.target.value})} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                                    <input type="email" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="john@nhs.net" value={newContact.email} onChange={e => setNewContact({...newContact, email: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone</label>
                                    <input type="tel" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="07700..." value={newContact.phone} onChange={e => setNewContact({...newContact, phone: e.target.value})} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Notes</label>
                                <textarea className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none" placeholder="Met at ASiT conference..." value={newContact.notes} onChange={e => setNewContact({...newContact, notes: e.target.value})}></textarea>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition flex justify-center items-center gap-2"
                            >
                                {loading ? 'Saving...' : 'Save Contact'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}