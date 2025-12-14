// src/components/SharedUI.js - OVERWRITE COMPLETELY (Final stabilization fix)

import React from 'react';
import { Briefcase, TrendingUp, Cpu, Users, Award, Code, FileText, Pencil, Trash2, CornerRightUp, Clock, Globe, Zap, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { Bar, Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, CategoryScale, LinearScale);

// --- New Components for Events Page ---

export const TypeBadge = ({ type }) => {
    let classes = 'bg-gray-100 text-gray-700';
    let icon = <Briefcase size={12} />;

    if (type === 'Conference') {
        classes = 'bg-blue-100 text-blue-700';
        icon = <Globe size={12} />;
    } else if (type === 'Course') {
        classes = 'bg-purple-100 text-purple-700';
        icon = <Zap size={12} />;
    } else if (type === 'Exam') {
        classes = 'bg-red-100 text-red-700';
        icon = <Award size={12} />;
    }

    return (
        <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${classes}`}>
            {icon} {type}
        </span>
    );
};

export const StatusBadge = ({ status }) => {
    let classes = 'bg-gray-100 text-gray-700';
    let icon = <Clock size={12} />;

    if (status === 'Open' || status === 'Upcoming') {
        classes = 'bg-emerald-100 text-emerald-700';
        icon = <CheckCircle size={12} />;
    } else if (status === 'Full' || status === 'Closed') {
        classes = 'bg-red-100 text-red-700';
        icon = <AlertTriangle size={12} />;
    }

    return (
        <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${classes}`}>
            {icon} {status}
        </span>
    );
};


// --- Existing Components ---

// 1. Dashboard Metric Card
export const DashboardMetric = ({ title, value, onClick }) => (
    <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 flex flex-col justify-center h-full cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <p className="text-3xl font-bold text-blue-600">{value}</p>
    </div>
);

// 2. Mentor Panel
export const MentorPanel = ({ supervisor, formStatus, alignmentScore, onClick }) => (
    <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
        <h3 className="text-lg font-semibold mb-2 text-slate-800 flex justify-between items-start">
            Mentorship & Alignment
            <button onClick={onClick} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-full"><Pencil size={16} /></button>
        </h3>
        <p className="text-sm text-gray-500 mb-2">Supervisor: <span className="font-medium text-slate-800">{supervisor}</span></p>
        <div className="flex justify-between items-center py-2 border-t">
            <span className="text-sm text-gray-500">Alignment:</span>
            <span className={`text-lg font-bold ${alignmentScore >= 75 ? 'text-emerald-600' : 'text-orange-500'}`}>{alignmentScore}%</span>
        </div>
        <div className="flex justify-between items-center py-2 border-t">
            <span className="text-sm text-gray-500">Review Form:</span>
            <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded">
                {formStatus}
            </span>
        </div>
    </div>
);

// 3. Network Contact (Updated to pass onClick)
export const NetworkContact = ({ name, role, initials, color, onClick }) => (
    <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer" onClick={onClick}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${color || 'bg-gray-500'}`}>
            {initials}
        </div>
        <div>
            <p className="font-semibold text-slate-800 text-sm">{name}</p>
            <p className="text-xs text-gray-500">{role}</p>
        </div>
        <CornerRightUp size={14} className="text-gray-300 ml-auto mr-1" />
    </div>
);

// 4. Upcoming Item
export const UpcomingItem = ({ title, date, icon, onClick }) => {
    let IconComponent = Clock;
    if (icon === 'award') IconComponent = Award;
    if (icon === 'globe') IconComponent = Globe;
    
    return (
        <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer" onClick={onClick}>
            <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-full bg-blue-100 text-blue-600"><IconComponent size={14} /></div>
                <span className="text-sm text-slate-800 font-medium">{title}</span>
            </div>
            <span className="text-xs text-gray-500 font-medium">{date}</span>
        </div>
    );
};

// 5. Case Log Card
export const CaseLogCard = ({ totalCases, completed, target, onClick }) => {
    const progress = Math.round((completed / target) * 100);
    return (
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 flex flex-col justify-between h-full cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
            <p className="text-sm font-medium text-gray-500 mb-1">Essential Procedures Logged</p>
            <p className="text-3xl font-bold text-blue-600">{completed}/{target}</p>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${Math.min(progress, 100)}%` }}></div>
            </div>
            <div className="flex items-center mt-1 gap-1 text-xs text-gray-600">
                <TrendingUp size={16} className="text-emerald-500" /> {progress}% of target achieved
            </div>
        </div>
    );
};

// 6. Radar Chart Component
export const RadarChart = ({ data }) => {
    const chartData = {
        labels: data.map(d => d.subject),
        datasets: [{
            label: 'Your Readiness Score',
            data: data.map(d => d.A),
            backgroundColor: 'rgba(59, 130, 246, 0.4)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(239, 68, 68, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(239, 68, 68, 1)'
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            r: {
                angleLines: { color: 'rgba(0, 0, 0, 0.1)' },
                grid: { color: 'rgba(0, 0, 0, 0.1)' },
                pointLabels: { font: { size: 11, weight: 'bold' }, color: '#4b5563' },
                suggestedMin: 0,
                suggestedMax: 100,
                ticks: { backdropColor: 'transparent', display: false }
            }
        },
        plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: (context) => `${context.dataset.label}: ${context.raw}%` } }
        }
    };

    return <Radar data={chartData} options={options} />;
};

// 7. Editable List Item (Used in Portfolio)
export const EditableList = ({ items, title, icon, type = 'list', onAdd, onEdit, onDelete }) => {
    // --- Data Definitions ---
    const keyMap = { 'Employment History': 'role', 'Technical Skills': 'name', 'Memberships': 'title', 'Certificates': 'title', 'Awards': 'title', 'Evidence': 'title' };
    const detailMap = { 'Employment History': ['location', 'period'], 'Technical Skills': ['level', 'endorsers'], 'Memberships': ['details'], 'Certificates': ['details'], 'Awards': ['details'], 'Evidence': ['details'] };
    const primaryKey = keyMap[title];
    const detailKeys = detailMap[title] || []; 
    
    // --- Render Logic ---
    const renderDetails = (item) => {
        if (title === 'Technical Skills') {
            return (
                <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-3 h-3 ${i < item.level ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.635-.921 1.935 0l2.378 7.306 7.674.56a1 1 0 01.554 1.706l-5.918 4.305 2.27 7.005a1 1 0 01-1.54 1.12l-6.52-4.757-6.52 4.757a1 1 0 01-1.54-1.12l2.27-7.005-5.918-4.305a1 1 0 01.554-1.706l7.674-.56L9.049 2.927z"></path></svg>
                    ))}
                    <span className="text-xs text-gray-500 ml-1">({item.level}/5)</span>
                </div>
            );
        }
        
        return (
            <span className="text-xs text-gray-500">
                {detailKeys.map(key => item[key] ? item[key] : '').filter(Boolean).join(' | ')}
                {item.evidence && (
                    <span className="ml-2 text-blue-600 font-medium flex items-center gap-1">
                        <FileText size={12}/> {item.evidence}
                    </span>
                )}
            </span>
        );
    };
    
    // --- CRITICAL FIX: Ensure items is an array before attempting map ---
    const validItems = Array.isArray(items) ? items : []; 

    const renderItem = (item) => (
        <div key={item.id} className="p-3 bg-white rounded-lg border border-gray-200 flex justify-between items-center hover:bg-gray-50 transition group">
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 truncate">{item[primaryKey]}</p>
                {renderDetails(item)}
                {item.notes && (
                    <p className="text-xs text-gray-500 mt-1 italic flex items-center gap-1">
                        <Info size={12}/> Notes: {item.notes}
                    </p>
                )}
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4 shrink-0">
                <button onClick={(e) => {e.stopPropagation(); onEdit(item);}} className="text-gray-400 hover:text-blue-600"><Pencil size={14}/></button>
                <button onClick={(e) => {e.stopPropagation(); onDelete(item.id);}} className="text-gray-400 hover:text-red-500"><Trash2 size={14}/></button>
            </div>
        </div>
    );

    const renderPillItem = (item) => (
        <div key={item.id} className="inline-flex items-center bg-blue-50 text-blue-800 text-sm font-medium px-3 py-1 rounded-full border border-blue-200 shadow-sm">
             <span className="mr-2">{item.name}</span>
             {renderDetails(item)}
             <div className="ml-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={(e) => {e.stopPropagation(); onEdit(item);}} className="text-blue-600 hover:text-blue-900"><Pencil size={12}/></button>
                <button onClick={(e) => {e.stopPropagation(); onDelete(item.id);}} className="text-red-500 hover:text-red-700"><Trash2 size={12}/></button>
            </div>
        </div>
    );

    return (
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">{icon} {title}</h3>
                <button onClick={onAdd} className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    Add
                </button>
            </div>
            <div className={type === 'list' ? "space-y-3" : "flex flex-wrap gap-2"}>
                {/* Use the validated array */}
                {validItems.length > 0 ? (
                    validItems.map(item => type === 'list' ? renderItem(item) : renderPillItem(item))
                ) : (
                    <p className="text-gray-400 text-sm italic">No {title.toLowerCase()} recorded yet.</p>
                )}
            </div>
        </div>
    );
};