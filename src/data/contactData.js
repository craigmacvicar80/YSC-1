// src/data/contactData.js
import { Mail, Phone, Linkedin, Instagram, Twitter } from 'lucide-react';

export const CONTACT_CHANNELS = [
  { 
    icon: Mail, 
    label: 'Email Support', 
    detail: 'support@yoursurgicalcareer.com', 
    link: 'mailto:support@yoursurgicalcareer.com',
    color: 'text-blue-600',
    hex: '#2563EB' 
  },
  { 
    icon: Phone, 
    label: 'Technical Hotline', 
    detail: '+44 20 7946 0999', 
    link: 'tel:+442079460999',
    color: 'text-emerald-600',
    hex: '#059669'
  },
  { 
    icon: Linkedin, 
    label: 'LinkedIn Page', 
    detail: '/YourSurgicalCareer', 
    link: 'https://www.linkedin.com/',
    color: 'text-indigo-600',
    hex: '#4F46E5'
  },
  { 
    icon: Instagram, 
    label: 'Instagram', 
    detail: '@YourSurgCareer', 
    link: 'https://www.instagram.com/',
    color: 'text-pink-600',
    hex: '#DB2777'
  },
  { 
    icon: Twitter, 
    label: 'Twitter/X', 
    detail: '@SurgCareer_News', 
    link: 'https://twitter.com/',
    color: 'text-sky-600',
    hex: '#0284C7'
  },
];