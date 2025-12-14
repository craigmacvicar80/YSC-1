// src/App.js
import React, { useState } from 'react';
import { 
    LayoutDashboard, 
    FolderOpen, 
    Calendar, 
    Map, 
    BookOpen, 
    CheckSquare, 
    Users, 
    ShoppingBag, 
    Briefcase,
    Gamepad2, 
    Mail, 
    Menu, 
    X, 
    LogOut 
} from 'lucide-react';

// --- Import Pages ---
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

// --- Mock Data Imports ---
import { MOCK_PROFILE_DATA, INITIAL_ACTIVITIES } from './data/portfolioData';

export default function App() {
    const [activeView, setActiveView] = useState('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // --- Navigation Items ---
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

    // --- Render Content Logic ---
    const renderContent = () => {
        switch (activeView) {
            case 'dashboard':
                return <Dashboard totalPoints={32} activitiesCount={14} setActiveView={setActiveView} />;
            case 'portfolio':
                return <Portfolio activities={INITIAL_ACTIVITIES} />;
            case 'events':
                return <Events />;
            case 'pathway':
                return <Pathway />;
            case 'jobs':
                return <Jobs />;
            case 'development':
                return <PersonalDev />;
            case 'tasks':
                return <TaskBoard />;
            case 'network':
                return <Network />;
            case 'medle':
                return <Medle />;
            case 'marketplace':
                return <Marketplace />;
            case 'contact':
                return <Contact />;
            default:
                return <Dashboard setActiveView={setActiveView} />;
        }
    };

    // Safe fallback for user profile
    const userProfile = MOCK_PROFILE_DATA || { name: 'Registrar', level: 'ST3' };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
            
            {/* --- Sidebar (Desktop) --- */}
            <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 h-screen sticky top-0 shadow-xl">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-lg font-bold text-white flex items-center gap-2">
                        Your Surgical Career
                    </h1>
                    {/* "Portfolio Tracker" text removed here */}
                </div>

                <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                                ${activeView === item.id 
                                    ? 'bg-blue-600 text-white shadow-md' 
                                    : 'hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <item.icon size={18} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs">
                            {userProfile.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{userProfile.name}</p>
                            <p className="text-xs text-slate-500 truncate">{userProfile.level}</p>
                        </div>
                        <LogOut size={16} className="text-slate-500 hover:text-red-400" />
                    </div>
                </div>
            </aside>

            {/* --- Main Content Area --- */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                
                {/* Mobile Header */}
                <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center shadow-md z-20">
                    <h1 className="font-bold flex items-center gap-2">
                        Your Surgical Career
                    </h1>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-16 left-0 w-full bg-slate-900 text-slate-300 z-10 border-b border-slate-800 shadow-xl">
                        <nav className="p-4 space-y-2">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveView(item.id);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                                        ${activeView === item.id 
                                            ? 'bg-blue-600 text-white' 
                                            : 'hover:bg-slate-800 text-slate-400'
                                        }`}
                                >
                                    <item.icon size={18} />
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                )}

                {/* Scrollable View Area */}
                <div className="flex-1 overflow-auto bg-slate-50">
                    <div className="max-w-7xl mx-auto w-full">
                        {renderContent()}
                    </div>
                </div>
            </main>
        </div>
    );
}