// src/App.js
import React, { useState, useEffect } from 'react';
import { 
    LayoutDashboard, FolderOpen, Calendar, Map, BookOpen, 
    CheckSquare, Users, ShoppingBag, Briefcase, Gamepad2, 
    Mail, Menu, X, LogOut 
} from 'lucide-react';

// --- Auth & DB Imports ---
import { AuthProvider, useAuth } from './context/AuthContext';
import { doc, onSnapshot } from 'firebase/firestore'; 
import { db } from './firebase'; 
import Login from './pages/Login';

// --- Import Pages ---
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio'; // Profile editing will be here now
import Events from './pages/Events';
import Pathway from './pages/Pathway';
import Jobs from './pages/Jobs';
import PersonalDev from './pages/PersonalDev';
import TaskBoard from './pages/TaskBoard'; 
import Network from './pages/Network';
import Marketplace from './pages/Marketplace'; 
import Contact from './pages/Contact'; 
import Medle from './pages/Medle';

// --- Mock Data ---
import { INITIAL_ACTIVITIES } from './data/portfolioData';

function AppContent() {
    const [activeView, setActiveView] = useState('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // Auth & User State
    const { currentUser, logout } = useAuth();
    const [userProfile, setUserProfile] = useState(null); 

    // --- FETCH REAL PROFILE DATA (For Sidebar Display) ---
    useEffect(() => {
        if (currentUser) {
            const unsub = onSnapshot(doc(db, "users", currentUser.uid), (docSnapshot) => {
                if (docSnapshot.exists()) {
                    setUserProfile(docSnapshot.data());
                } else {
                    setUserProfile({ firstName: '', lastName: '', grade: '', email: currentUser.email });
                }
            });
            return () => unsub();
        }
    }, [currentUser]);

    // If not logged in, show Login Screen
    if (!currentUser) return <Login />;

    const handleLogout = async () => {
        try { await logout(); } catch (error) { console.error("Failed to log out", error); }
    };

    // --- Navigation Items (Removed "My Profile") ---
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'portfolio', label: 'Portfolio', icon: FolderOpen },
        { id: 'events', label: 'Events', icon: Calendar },           
        { id: 'pathway', label: 'Pathway', icon: Map },
        { id: 'jobs', label: 'Jobs', icon: Briefcase },
        { id: 'development', label: 'Personal Dev', icon: BookOpen },
        { id: 'tasks', label: 'Tasks', icon: CheckSquare },
        { id: 'network', label: 'Network', icon: Users },
        { id: 'medle', label: 'Medle', icon: Gamepad2 },
        { id: 'marketplace', label: 'Shop', icon: ShoppingBag },
        { id: 'contact', label: 'Contact', icon: Mail },
    ];

    const renderContent = () => {
        switch (activeView) {
            case 'dashboard': return <Dashboard totalPoints={32} activitiesCount={14} setActiveView={setActiveView} />;
            case 'portfolio': return <Portfolio activities={INITIAL_ACTIVITIES} />;
            case 'events': return <Events />;
            case 'pathway': return <Pathway />;
            case 'jobs': return <Jobs />;
            case 'development': return <PersonalDev />;
            case 'tasks': return <TaskBoard />;
            case 'network': return <Network />;
            case 'medle': return <Medle />;
            case 'marketplace': return <Marketplace />;
            case 'contact': return <Contact />;
            default: return <Dashboard setActiveView={setActiveView} />;
        }
    };

    // Sidebar Display Logic
    const getDisplayName = () => {
        if (userProfile && userProfile.firstName) {
            return `${userProfile.firstName} ${userProfile.lastName || ''}`;
        }
        return currentUser.email ? currentUser.email.split('@')[0] : 'User';
    };

    const getDisplayGrade = () => {
        return (userProfile && userProfile.grade) ? userProfile.grade : 'Grade Not Set';
    };

    const getInitials = () => {
        const name = getDisplayName();
        return name.charAt(0).toUpperCase();
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
            {/* Sidebar (Desktop) */}
            <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 h-screen sticky top-0 shadow-xl">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-lg font-bold text-white flex items-center gap-2">
                        Your Surgical Career
                    </h1>
                </div>
                <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                                ${activeView === item.id ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'}`}
                        >
                            <item.icon size={18} />
                            {item.label}
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors group">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs uppercase">
                            {getInitials()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{getDisplayName()}</p>
                            <p className="text-xs text-slate-500 truncate">{getDisplayGrade()}</p>
                        </div>
                        <button onClick={handleLogout} title="Log Out">
                            <LogOut size={16} className="text-slate-500 hover:text-red-400 group-hover:text-red-400" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center shadow-md z-20">
                    <h1 className="font-bold flex items-center gap-2">Your Surgical Career</h1>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-16 left-0 w-full bg-slate-900 text-slate-300 z-10 border-b border-slate-800 shadow-xl">
                        <nav className="p-4 space-y-2">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => { setActiveView(item.id); setIsMobileMenuOpen(false); }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                                        ${activeView === item.id ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
                                >
                                    <item.icon size={18} />
                                    {item.label}
                                </button>
                            ))}
                            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-slate-800 text-red-400">
                                <LogOut size={18} /> Sign Out
                            </button>
                        </nav>
                    </div>
                )}

                <div className="flex-1 overflow-auto bg-slate-50">
                    <div className="max-w-7xl mx-auto w-full">
                        {renderContent()}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}