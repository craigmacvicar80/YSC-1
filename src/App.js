// src/App.js
import React, { useState, useEffect } from 'react';
import { 
    LayoutDashboard, FolderOpen, Calendar, Map, BookOpen, 
    CheckSquare, Users, ShoppingBag, Briefcase, Gamepad2, 
    Mail, Menu, X, LogOut 
} from 'lucide-react';

// --- Firebase Imports ---
import { doc, onSnapshot } from 'firebase/firestore'; 
import { db } from './firebase'; 
import { AuthProvider, useAuth } from './context/AuthContext';

// --- Import Pages ---
import LandingPage from './pages/LandingPage'; 
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio'; 
import Events from './pages/Events';
import Pathway from './pages/Pathway';
import Jobs from './pages/Jobs';
import PersonalDev from './pages/PersonalDev';
import TaskBoard from './pages/TaskBoard'; 
import Network from './pages/Network';
import Marketplace from './pages/Marketplace'; 
import Contact from './pages/Contact'; 
import Medle from './pages/Medle';

function AppContent() {
    const [activeView, setActiveView] = useState('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { currentUser, logout } = useAuth();
    const [userProfile, setUserProfile] = useState(null); 

    useEffect(() => {
        if (currentUser) {
            const unsub = onSnapshot(doc(db, "users", currentUser.uid), (docSnapshot) => {
                if (docSnapshot.exists()) setUserProfile(docSnapshot.data());
                else setUserProfile({ name: currentUser.displayName || '', email: currentUser.email });
            });
            return () => unsub();
        }
    }, [currentUser]);

    const handleLogout = async () => { try { await logout(); } catch (error) { console.error("Logout failed", error); } };

    if (!currentUser) return <LandingPage />;

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'portfolio', label: 'Portfolio', icon: FolderOpen },
        { id: 'jobs', label: 'Jobs', icon: Briefcase },
        { id: 'events', label: 'Events', icon: Calendar },
        { id: 'tasks', label: 'Tasks', icon: CheckSquare },
        { id: 'network', label: 'Network', icon: Users },
        { id: 'pathway', label: 'Pathway', icon: Map },
        { id: 'development', label: 'Personal Dev', icon: BookOpen },
        { id: 'marketplace', label: 'Shop', icon: ShoppingBag },
        { id: 'contact', label: 'Contact', icon: Mail },
        { id: 'medle', label: 'Medle', icon: Gamepad2, separate: true },
    ];

    const renderContent = () => {
        switch (activeView) {
            case 'dashboard': return <Dashboard setActiveView={setActiveView} />;
            case 'portfolio': return <Portfolio activities={[]} />;
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

    const getDisplayName = () => userProfile?.name || userProfile?.displayName || currentUser.email?.split('@')[0] || 'User';
    
    const getInitials = () => {
        let name = getDisplayName().trim();
        const parts = name.split(' ');
        if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        return parts[0] ? parts[0][0].toUpperCase() : 'U';
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
            <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 h-screen sticky top-0 shadow-xl">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-lg font-bold text-white">Your Surgical Career</h1>
                </div>
                <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <React.Fragment key={item.id}>
                            {item.separate && <div className="my-2 border-t border-slate-700 mx-2"></div>}
                            <button onClick={() => setActiveView(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeView === item.id ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}>
                                <item.icon size={18} /> {item.label}
                            </button>
                        </React.Fragment>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 cursor-pointer group">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs">{getInitials()}</div>
                        <div className="flex-1 min-w-0"><p className="text-sm font-medium text-white truncate">{getDisplayName()}</p></div>
                        <button onClick={handleLogout}><LogOut size={16} /></button>
                    </div>
                </div>
            </aside>
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
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