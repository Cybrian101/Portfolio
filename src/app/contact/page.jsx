"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

// --- SVG Icons ---
const PaperPlaneIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send-horizontal ml-2"><path d="m3 3 3 9-3 9 19-9Z"/><path d="M6 12h16"/></svg>);
const ArrowLeftIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>);

export default function ContactPage() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('');
    const [location, setLocation] = useState(null);

    // --- Get user location on component mount ---
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Geolocation permission denied or error:", error);
                    setLocation({ error: "Location permission not granted." });
                }
            );
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Sending...');

        try {
            const response = await fetch('/api/save-contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, location }),
            });

            if (response.ok) {
                setStatus('Message sent successfully!');
                setFormData({ name: '', email: '', message: '' });
                setTimeout(() => setStatus(''), 3000);
            } else {
                const errorData = await response.json();
                setStatus(`Error: ${errorData.error || 'Could not send message.'}`);
            }
        } catch (error) {
            console.error("Submission error:", error);
            setStatus('Error: Could not send message.');
        }
    };
    
    // --- Particles Background ---
    const particlesInit = useCallback(async (engine) => {
        await loadSlim(engine);
    }, []);

    const particlesOptions = {
        background: { color: { value: '#0f172a' } },
        fpsLimit: 120,
        interactivity: { events: { onHover: { enable: true, mode: 'grab' } } },
        particles: {
            color: { value: '#ffffff' },
            links: { color: '#ffffff', distance: 150, enable: true, opacity: 0.2, width: 1 },
            move: { direction: 'none', enable: true, outModes: { default: 'bounce' }, speed: 1 },
            number: { density: { enable: true, area: 800 }, value: 80 },
            opacity: { value: 0.2 },
            shape: { type: 'circle' },
            size: { value: { min: 1, max: 5 } },
        },
        detectRetina: true,
    };


    return (
        <div className="bg-slate-900 text-slate-300 min-h-screen font-sans flex flex-col items-center justify-center p-4">
            <Particles id="tsparticles" init={particlesInit} options={particlesOptions} className="fixed inset-0 z-0" />
            <div className="relative z-10 w-full max-w-2xl">
                <a href="/" className="absolute top-4 left-4 text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2">
                    <ArrowLeftIcon />
                    Back to Portfolio
                </a>

                <div className="glass-card rounded-2xl p-8 md:p-12 mt-20" style={{background: 'rgba(20, 20, 40, 0.6)', backdropFilter: 'blur(10px)', border: '1px solid rgba(0, 170, 255, 0.2)'}}>
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-white">Get In Touch</h1>
                        <p className="mt-4 text-lg text-slate-400">I'm always open to discussing new projects, creative ideas, or opportunities.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 focus:ring-cyan-500 focus:border-cyan-500 transition" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 focus:ring-cyan-500 focus:border-cyan-500 transition" />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                            <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows="5" required className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 focus:ring-cyan-500 focus:border-cyan-500 transition"></textarea>
                        </div>
                        <button type="submit" className="w-full bg-cyan-600 text-white text-lg font-semibold px-8 py-3 rounded-lg hover:bg-cyan-500 transition-all duration-300 flex items-center justify-center" disabled={status === 'Sending...'} style={{transition: 'all 0.3s ease'}}>
                            {status || 'Send Message'}
                            {status !== 'Sending...' && <PaperPlaneIcon />}
                        </button>

                        {status && status !== 'Sending...' && (
                             <p className={`text-center mt-4 ${status.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
                                {status}
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

