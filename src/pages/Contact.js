// src/pages/Contact.js - OVERWRITE COMPLETELY (Final Contact Hub)

import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Instagram, Twitter, MessageSquare, Globe, Heart } from 'lucide-react';

const CONTACT_CHANNELS = [
    { icon: Mail, label: 'Email Support', detail: 'support@yoursurgicalcareer.com', link: 'mailto:support@yoursurgicalcareer.com', color: 'text-blue-600', buttonText: 'Send Email' },
    { icon: Phone, label: 'Technical Hotline', detail: '+44 20 7946 0999', link: 'tel:+442079460999', color: 'text-emerald-600', buttonText: 'Call Support' },
    { icon: Linkedin, label: 'LinkedIn Page', detail: '/YourSurgicalCareer', link: 'https://www.linkedin.com/', color: 'text-indigo-600', buttonText: 'View LinkedIn' },
    { icon: Instagram, label: 'Instagram', detail: '@YourSurgCareer', link: 'https://www.instagram.com/', color: 'text-pink-600', buttonText: 'Follow Us' },
    { icon: Twitter, label: 'Twitter/X', detail: '@SurgCareer_News', link: 'https://twitter.com/', color: 'text-sky-600', buttonText: 'Latest News' },
];

export default function Contact() {
    return (
        <div className="p-6 space-y-6">
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-8 rounded-xl text-white shadow-lg">
                <h2 className="text-3xl font-bold mb-2 flex items-center gap-3"><Globe size={30} /> YourSurgicalCareer Contact Hub</h2>
                <p className="text-blue-100 max-w-2xl">Connect with the development team and our community through our primary communication channels.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Contact Channel Cards */}
                {CONTACT_CHANNELS.map((channel, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col items-center text-center">
                        <channel.icon size={36} className={`${channel.color} mb-3`} />
                        <h3 className="text-xl font-bold text-slate-800">{channel.label}</h3>
                        <p className="text-sm text-gray-500 mb-4">{channel.detail}</p>
                        <a href={channel.link} target="_blank" rel="noreferrer" className={`w-full py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm ${channel.color.replace('text-', 'bg-').replace('-600', '-700')} text-white hover:${channel.color.replace('text-', 'bg-').replace('-600', '-800')}`}>
                            {channel.buttonText}
                        </a>
                    </div>
                ))}
                
                {/* Office Location Card */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col items-center text-center lg:col-span-1 md:col-span-2">
                    <MapPin size={36} className="text-gray-400 mb-3" />
                    <h3 className="text-xl font-bold text-slate-800">Operational Address</h3>
                    <p className="text-sm text-gray-500 mb-4">Royal College of Surgeons (RCS), London, UK</p>
                    <button disabled className="w-full py-2.5 rounded-lg text-sm font-bold bg-gray-100 text-gray-500 cursor-not-allowed">View Map (Internal Only)</button>
                </div>
            </div>

            {/* Footer Note */}
            <div className="pt-4 text-center text-gray-500 text-sm flex items-center justify-center gap-2">
                <Heart size={16} className="text-red-500" /> Thank you for being a part of the Surgical Career community.
            </div>
        </div>
    );
}