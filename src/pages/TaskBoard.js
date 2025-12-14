// src/pages/TaskBoard.js
import React, { useState, useEffect } from 'react';
import { 
    Plus, Calendar, Trash2, AlertCircle, ArrowUpDown, 
    Search, WifiOff, Pencil, X, MessageSquare, AlignLeft, Clock
} from 'lucide-react';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

export default function TaskBoard() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [filterText, setFilterText] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'dueDate', direction: 'asc' });
    const [isOffline, setIsOffline] = useState(false);

    // Track editing state
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: '',
        priority: 'Medium',
        status: 'To Do',
        comments: '' // New Field
    });

    // --- 1. FETCH TASKS ---
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                if (db) {
                    const querySnapshot = await getDocs(collection(db, "tasks"));
                    const tasksList = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setTasks(tasksList);
                } else {
                    throw new Error("Firebase not initialized");
                }
            } catch (error) {
                console.warn("Using Local Storage (Offline Mode):", error);
                setIsOffline(true);
                const localTasks = localStorage.getItem('surgical_tasks');
                if (localTasks) {
                    setTasks(JSON.parse(localTasks));
                }
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    const saveToLocal = (updatedTasks) => {
        setTasks(updatedTasks);
        localStorage.setItem('surgical_tasks', JSON.stringify(updatedTasks));
    };

    // --- 2. MODAL HANDLERS ---
    const openAddModal = () => {
        setEditingId(null);
        setFormData({ title: '', description: '', dueDate: '', priority: 'Medium', status: 'To Do', comments: '' });
        setShowModal(true);
    };

    const openTaskCard = (task) => {
        setEditingId(task.id);
        setFormData({
            title: task.title,
            description: task.description || '',
            dueDate: task.dueDate || '',
            priority: task.priority || 'Medium',
            status: task.status || 'To Do',
            comments: task.comments || '' // Load comments
        });
        setShowModal(true);
    };

    // --- 3. SAVE TASK ---
    const handleSaveTask = async (e) => {
        e.preventDefault();
        if (!formData.title) return;

        try {
            if (editingId) {
                // Update
                const updatedTasks = tasks.map(t => t.id === editingId ? { ...t, ...formData } : t);
                if (db && !isOffline) {
                    await updateDoc(doc(db, "tasks", editingId), formData);
                    setTasks(updatedTasks);
                } else {
                    saveToLocal(updatedTasks);
                }
            } else {
                // Create
                if (db && !isOffline) {
                    const docRef = await addDoc(collection(db, "tasks"), formData);
                    setTasks([...tasks, { id: docRef.id, ...formData }]);
                } else {
                    const offlineTask = { id: Date.now().toString(), ...formData };
                    saveToLocal([...tasks, offlineTask]);
                }
            }
            setShowModal(false);
        } catch (error) {
            console.error("Error saving task:", error);
            // Fallback
            const newList = editingId 
                ? tasks.map(t => t.id === editingId ? { ...t, ...formData } : t)
                : [...tasks, { id: Date.now().toString(), ...formData }];
            saveToLocal(newList);
            setShowModal(false);
        }
    };

    // --- 4. ACTIONS (Delete / Status) ---
    const handleStatusChange = async (e, task) => {
        e.stopPropagation(); // Prevent row click
        const newStatus = e.target.value;
        const updatedTasks = tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t);
        
        try {
            if (db && !isOffline) {
                await updateDoc(doc(db, "tasks", task.id), { status: newStatus });
                setTasks(updatedTasks);
            } else {
                saveToLocal(updatedTasks);
            }
        } catch (error) {
            saveToLocal(updatedTasks);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation(); // Prevent row click
        if (window.confirm("Delete this task?")) {
            const remainingTasks = tasks.filter(t => t.id !== id);
            try {
                if (db && !isOffline) {
                    await deleteDoc(doc(db, "tasks", id));
                    setTasks(remainingTasks);
                } else {
                    saveToLocal(remainingTasks);
                }
            } catch (error) {
                saveToLocal(remainingTasks);
            }
        }
    };

    // --- 5. SORTING & FILTERING ---
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });
    };

    const sortedTasks = [...tasks].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const filteredTasks = sortedTasks.filter(task => 
        task.title.toLowerCase().includes(filterText.toLowerCase())
    );

    // --- STYLES ---
    const getPriorityColor = (p) => {
        switch(p) {
            case 'High': return 'bg-red-100 text-red-700 border-red-200';
            case 'Medium': return 'bg-orange-100 text-orange-700 border-orange-200';
            default: return 'bg-blue-100 text-blue-700 border-blue-200';
        }
    };

    const getStatusColor = (s) => {
        switch(s) {
            case 'Completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'In Progress': return 'bg-blue-50 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    return (
        <div className="p-6 h-full flex flex-col max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        Task Database
                        {isOffline && <span className="text-xs font-normal bg-gray-100 text-gray-500 px-2 py-1 rounded-full flex items-center gap-1"><WifiOff size={12}/> Local Mode</span>}
                    </h1>
                    <p className="text-sm text-gray-500">Click on any row to view details and add comments.</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search tasks..." 
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={openAddModal} 
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm whitespace-nowrap"
                    >
                        <Plus size={18} /> Add Task
                    </button>
                </div>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1 flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100" onClick={() => requestSort('title')}>Task Name <ArrowUpDown size={12} className="inline ml-1"/></th>
                                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 w-40" onClick={() => requestSort('dueDate')}>Due Date <ArrowUpDown size={12} className="inline ml-1"/></th>
                                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 w-32" onClick={() => requestSort('priority')}>Priority <ArrowUpDown size={12} className="inline ml-1"/></th>
                                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 w-48" onClick={() => requestSort('status')}>Status <ArrowUpDown size={12} className="inline ml-1"/></th>
                                <th className="px-6 py-4 w-20 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="5" className="p-8 text-center text-gray-500">Loading...</td></tr>
                            ) : filteredTasks.length === 0 ? (
                                <tr><td colSpan="5" className="p-8 text-center text-gray-500 italic">No tasks found.</td></tr>
                            ) : (
                                filteredTasks.map((task) => (
                                    <tr 
                                        key={task.id} 
                                        onClick={() => openTaskCard(task)} 
                                        className="hover:bg-blue-50 transition-colors group cursor-pointer"
                                    >
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-slate-800">{task.title}</p>
                                            {task.description && <p className="text-xs text-gray-500 mt-0.5 truncate max-w-xs">{task.description}</p>}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {task.dueDate ? <div className="flex items-center gap-2"><Calendar size={14}/> {task.dueDate}</div> : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div onClick={(e) => e.stopPropagation()}>
                                                <select 
                                                    className={`appearance-none pl-3 pr-8 py-1.5 rounded-lg text-sm font-medium border cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(task.status)}`}
                                                    value={task.status}
                                                    onChange={(e) => handleStatusChange(e, task)}
                                                >
                                                    <option value="To Do">To Do</option>
                                                    <option value="In Progress">In Progress</option>
                                                    <option value="Completed">Completed</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button 
                                                onClick={(e) => handleDelete(e, task.id)}
                                                className="text-gray-300 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* TASK CARD MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                        
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">{editingId ? 'Task Details' : 'New Task'}</h3>
                                <p className="text-sm text-gray-500">View and update task information.</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-200 rounded-full transition-colors">
                                <X size={24}/>
                            </button>
                        </div>

                        {/* Modal Body (Scrollable) */}
                        <form onSubmit={handleSaveTask} className="flex-1 overflow-y-auto p-6 space-y-6">
                            
                            {/* Title Input */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Task Title</label>
                                <input 
                                    className="w-full text-lg font-semibold border-b-2 border-gray-200 focus:border-blue-500 outline-none pb-2 bg-transparent transition-colors"
                                    placeholder="Enter task title..."
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                    required
                                />
                            </div>

                            {/* Meta Data Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Due Date</label>
                                    <input 
                                        type="date"
                                        className="w-full bg-white border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.dueDate}
                                        onChange={e => setFormData({...formData, dueDate: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Priority</label>
                                    <select 
                                        className="w-full bg-white border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.priority}
                                        onChange={e => setFormData({...formData, priority: e.target.value})}
                                    >
                                        <option>Low</option>
                                        <option>Medium</option>
                                        <option>High</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                                    <select 
                                        className="w-full bg-white border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.status}
                                        onChange={e => setFormData({...formData, status: e.target.value})}
                                    >
                                        <option>To Do</option>
                                        <option>In Progress</option>
                                        <option>Completed</option>
                                    </select>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                                    <AlignLeft size={16}/> Description
                                </label>
                                <textarea 
                                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
                                    placeholder="Add details about this task..."
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                />
                            </div>

                            {/* Comments Section */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                                    <MessageSquare size={16}/> Comments & Notes
                                </label>
                                <textarea 
                                    className="w-full bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-yellow-400 outline-none min-h-[100px]"
                                    placeholder="Add updates, notes, or thoughts here..."
                                    value={formData.comments}
                                    onChange={e => setFormData({...formData, comments: e.target.value})}
                                />
                            </div>

                        </form>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                            <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleSaveTask} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}