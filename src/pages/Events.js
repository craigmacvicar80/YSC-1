// src/pages/Events.js - Row Click opens Detail Card
import React, { useState, useEffect } from 'react';
import { 
    Calendar, MapPin, Search, 
    ChevronUp, ChevronDown, ArrowUpDown, 
    Heart, Plus, X, ExternalLink, Building2, Info 
} from 'lucide-react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase'; 

export default function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Feature States
    const [favorites, setFavorites] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    
    // DETAIL MODAL STATE
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Search & Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    
    // Sorting State
    const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc' });

    // Form State for New Event
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        type: 'Conference',
        source: '',
        location: '',
        link: ''
    });

    // --- 1. LOAD EVENTS & FAVORITES ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "events"));
                const eventsList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setEvents(eventsList);

                const savedFavs = JSON.parse(localStorage.getItem('surgicalCareerFavorites')) || [];
                setFavorites(savedFavs);
                
                setLoading(false);
            } catch (error) {
                console.error("Error fetching events:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // --- 2. TOGGLE FAVORITE ---
    const toggleFavorite = (e, eventId) => {
        e.stopPropagation(); // Prevent row click when clicking heart
        let updatedFavs;
        if (favorites.includes(eventId)) {
            updatedFavs = favorites.filter(id => id !== eventId);
        } else {
            updatedFavs = [...favorites, eventId];
        }
        setFavorites(updatedFavs);
        localStorage.setItem('surgicalCareerFavorites', JSON.stringify(updatedFavs));
    };

    // --- 3. CREATE EVENT ---
    const handleCreateEvent = async (e) => {
        e.preventDefault();
        if (!formData.title) return;

        try {
            const newEvent = {
                ...formData,
                category: "Personal/Manual",
                location: formData.location || 'TBD',
                source: formData.source || 'Unknown',
                link: formData.link || '#'
            };

            const docRef = await addDoc(collection(db, "events"), newEvent);
            setEvents([...events, { id: docRef.id, ...newEvent }]);
            
            setFormData({ title: '', date: '', type: 'Conference', source: '', location: '', link: '' });
            setShowCreateModal(false);
        } catch (error) {
            console.error("Error creating event:", error);
            alert("Failed to create event.");
        }
    };

    // --- 4. HANDLE ROW CLICK ---
    const handleRowClick = (event) => {
        setSelectedEvent(event);
    };

    const closeDetailModal = () => {
        setSelectedEvent(null);
    };

    // --- SORTING ---
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedEvents = React.useMemo(() => {
        let sortableItems = [...events];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                const aValue = a[sortConfig.key] ? a[sortConfig.key].toString().toLowerCase() : '';
                const bValue = b[sortConfig.key] ? b[sortConfig.key].toString().toLowerCase() : '';
                
                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [events, sortConfig]);

    // --- FILTERING ---
    const filteredEvents = sortedEvents.filter(event => {
        const matchesSearch = 
            event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.source?.toLowerCase().includes(searchTerm.toLowerCase());
        
        let matchesType = true;
        if (typeFilter === 'Favorites') {
            matchesType = favorites.includes(event.id);
        } else if (typeFilter !== 'All') {
            matchesType = event.type === typeFilter;
        }
        
        return matchesSearch && matchesType;
    });

    const SortIcon = ({ columnKey }) => {
        if (sortConfig.key !== columnKey) return <ArrowUpDown size={14} className="text-gray-400 ml-1" />;
        return sortConfig.direction === 'asc' 
            ? <ChevronUp size={14} className="text-blue-600 ml-1" />
            : <ChevronDown size={14} className="text-blue-600 ml-1" />;
    };

    return (
        <div className="p-6 max-w-full mx-auto bg-gray-50 h-full flex flex-col relative">
            
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-6 gap-4 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Events Database</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Viewing {filteredEvents.length} of {events.length} events
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
                    <button 
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm text-sm"
                    >
                        <Plus size={16} />
                        Create Event
                    </button>

                    <div className="flex bg-white rounded-lg border border-gray-300 p-1">
                        <button 
                            onClick={() => setTypeFilter('All')}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${typeFilter === 'All' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            All
                        </button>
                        <button 
                            onClick={() => setTypeFilter('Favorites')}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1 ${typeFilter === 'Favorites' ? 'bg-red-100 text-red-700' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <Heart size={14} className={typeFilter === 'Favorites' ? 'fill-current' : ''} />
                            Favourites
                        </button>
                    </div>

                    <select 
                        value={typeFilter === 'Favorites' ? 'All' : typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={typeFilter === 'Favorites'}
                    >
                        <option value="All">All Types</option>
                        <option value="Conference">Conference</option>
                        <option value="Course/Workshop">Course/Workshop</option>
                        <option value="Webinar">Webinar</option>
                        <option value="Exam Prep">Exam Prep</option>
                    </select>

                    <div className="relative flex-grow md:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* --- DATA TABLE --- */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col">
                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="overflow-auto flex-1">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                                <tr>
                                    <th className="px-6 py-3 w-12 text-center"><Heart size={16} className="text-gray-400 mx-auto" /></th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 w-4/12" onClick={() => handleSort('title')}>
                                        <div className="flex items-center">Event Name <SortIcon columnKey="title" /></div>
                                    </th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 w-2/12" onClick={() => handleSort('date')}>
                                        <div className="flex items-center">Date <SortIcon columnKey="date" /></div>
                                    </th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 w-2/12" onClick={() => handleSort('type')}>
                                        <div className="flex items-center">Type <SortIcon columnKey="type" /></div>
                                    </th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 w-3/12" onClick={() => handleSort('source')}>
                                        <div className="flex items-center">Location <SortIcon columnKey="source" /></div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredEvents.length > 0 ? (
                                    filteredEvents.map((event) => {
                                        const isFav = favorites.includes(event.id);
                                        return (
                                            <tr 
                                                key={event.id} 
                                                onClick={() => handleRowClick(event)} // Row Click triggers modal
                                                className="hover:bg-blue-50 transition-colors group cursor-pointer"
                                            >
                                                <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                                                    <button onClick={(e) => toggleFavorite(e, event.id)} className="focus:outline-none transition-transform active:scale-90">
                                                        <Heart size={20} className={`${isFav ? 'fill-red-500 text-red-500' : 'text-gray-300 hover:text-red-400'}`} />
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-slate-800">
                                                    {event.title}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar size={14} className="text-gray-400" />
                                                        {event.date || 'TBD'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium border ${
                                                        event.type === 'Conference' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                                        event.type === 'Course/Workshop' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                        'bg-blue-50 text-blue-700 border-blue-100'
                                                    }`}>
                                                        {event.type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin size={14} className="text-gray-400" />
                                                        {event.location || event.source || 'TBD'}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colspan="5" className="px-6 py-12 text-center text-gray-500">
                                            {typeFilter === 'Favorites' ? "You haven't saved any events yet." : "No events found matching your search."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* --- EVENT DETAIL MODAL --- */}
            {selectedEvent && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeDetailModal}>
                    <div 
                        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200" 
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-start">
                            <div>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
                                    selectedEvent.type === 'Conference' ? 'bg-purple-100 text-purple-700' :
                                    selectedEvent.type === 'Course/Workshop' ? 'bg-emerald-100 text-emerald-700' :
                                    'bg-blue-100 text-blue-700'
                                }`}>
                                    {selectedEvent.type}
                                </span>
                                <h2 className="text-2xl font-bold text-slate-800 leading-tight pr-8">
                                    {selectedEvent.title}
                                </h2>
                            </div>
                            <button onClick={closeDetailModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={28} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8 space-y-6">
                            
                            {/* Key Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Date</p>
                                        <p className="text-slate-800 font-medium">{selectedEvent.date || 'To Be Determined'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-red-50 rounded-lg text-red-600">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Location</p>
                                        <p className="text-slate-800 font-medium">{selectedEvent.location || 'Online / TBD'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                                        <Building2 size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Organizer</p>
                                        <p className="text-slate-800 font-medium">{selectedEvent.source || 'Unknown Organization'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Description Section */}
                            <div className="pt-4 border-t border-gray-100">
                                <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
                                    <Info size={18} className="text-gray-400" />
                                    About this Event
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {selectedEvent.description || `This is a ${selectedEvent.type} organized by ${selectedEvent.source}. Click the link below to visit the official website for registration details and the full agenda.`}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-4 pt-4 mt-auto">
                                <a 
                                    href={selectedEvent.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex-1 bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
                                >
                                    Visit Official Website <ExternalLink size={18} />
                                </a>
                                <button 
                                    onClick={(e) => toggleFavorite(e, selectedEvent.id)}
                                    className={`p-3 rounded-lg border-2 transition-colors ${
                                        favorites.includes(selectedEvent.id) 
                                        ? 'border-red-100 bg-red-50 text-red-500' 
                                        : 'border-gray-200 text-gray-400 hover:border-gray-300'
                                    }`}
                                    title="Save to Favorites"
                                >
                                    <Heart size={24} className={favorites.includes(selectedEvent.id) ? 'fill-current' : ''} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- CREATE EVENT MODAL --- */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-slate-800">Create New Event</h2>
                            <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleCreateEvent} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Event Name *</label>
                                <input 
                                    required
                                    type="text" 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                    placeholder="e.g. Annual Surgical Congress"
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        value={formData.date}
                                        onChange={e => setFormData({...formData, date: e.target.value})}
                                        placeholder="e.g. 12 Oct 2025"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                                        value={formData.type}
                                        onChange={e => setFormData({...formData, type: e.target.value})}
                                    >
                                        <option value="Conference">Conference</option>
                                        <option value="Course/Workshop">Course/Workshop</option>
                                        <option value="Webinar">Webinar</option>
                                        <option value="Exam Prep">Exam Prep</option>
                                        <option value="Event/Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Organizer (Source)</label>
                                <input 
                                    type="text" 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={formData.source}
                                    onChange={e => setFormData({...formData, source: e.target.value})}
                                    placeholder="e.g. Royal College of Surgeons"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <input 
                                    type="text" 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={formData.location}
                                    onChange={e => setFormData({...formData, location: e.target.value})}
                                    placeholder="e.g. London / Online"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Website Link (Optional)</label>
                                <input 
                                    type="text" 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={formData.link}
                                    onChange={e => setFormData({...formData, link: e.target.value})}
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button 
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                                >
                                    Create Event
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}