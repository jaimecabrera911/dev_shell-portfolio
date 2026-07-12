'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
 
import { useState, useRef, FormEvent } from 'react';
import { Mail, MapPin, Github, Linkedin, Twitter, Send, Terminal, CheckCircle } from 'lucide-react';
import { ContactMessage } from '../types';
import { saveContactMessage } from '../utils/storage';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('New Project Inquiry');
  const [message, setMessage] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [sentMessages, setSentMessages] = useState<ContactMessage[]>([]);
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  const addLog = (text: string, delay = 0) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const time = new Date().toLocaleTimeString();
        setLogs((prev) => [...prev, `[${time}] ${text}`]);
        terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        resolve();
      }, delay);
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert('Please fill out all fields.');
      return;
    }

    setSending(true);
    setLogs([]);

    // Simulate compilation, handshakes, and transmission logs
    await addLog('⚡ Initializing contact channel payload...', 100);
    await addLog(`[AUTH] Setting up secure transport wrapper for sender: ${email}`, 400);
    await addLog('⚙️ Parsing and validating payload...', 300);
    await addLog('🌐 Resolving SMTP Gateway hello@devshell.io...', 500);
    await addLog('🔑 TLS v1.3 handshake initiated on port 465...', 400);
    await addLog('✅ Handshake complete. Cipher suite: TLS_AES_256_GCM_SHA384', 300);
    await addLog(`📨 Sending mail packet (${(message.length * 2 + 100) / 1000} KB)`, 500);
    await addLog('🚀 Ingress successfully processed by cloud SMTP proxy!', 400);
    await addLog('✨ Status: 250 OK - Message delivered to devshell.io queue', 300);

    const newMessage: ContactMessage = {
      id: Date.now().toString(),
      name,
      email,
      subject,
      message,
      timestamp: new Date().toLocaleString(),
      status: 'delivered'
    };

    saveContactMessage(newMessage);
    setSentMessages((prev) => [newMessage, ...prev]);
    setSending(false);

    // Clear form inputs
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <section className="py-20 max-w-7xl mx-auto px-6" id="contact">
      <div className="glass-card rounded-3xl p-6 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Details and Socials */}
        <div className="flex flex-col justify-between space-y-8">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-primary block mb-2">Let's Connect</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-on-surface mb-4">Get In Touch</h2>
            <p className="font-sans text-on-surface-variant text-sm md:text-base leading-relaxed">
              I am always open to discussing new engineering projects, robust cloud architectures, collaboration opportunities, or being part of your technical vision.
            </p>
          </div>

          {/* Location / Info Cards */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-sm">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">Email Base</p>
                <a href="mailto:hello@devshell.io" className="font-sans text-sm md:text-base font-semibold text-on-surface hover:text-primary transition-colors">
                  hello@devshell.io
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary shadow-sm">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">Geographic Base</p>
                <p className="font-sans text-sm md:text-base font-semibold text-on-surface">San Francisco, CA</p>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap gap-3 pt-4" id="social-links-container">
            {[
              { href: '#', icon: Github, label: 'GitHub' },
              { href: '#', icon: Linkedin, label: 'LinkedIn' },
              { href: '#', icon: Twitter, label: 'X / Twitter' }
            ].map((soc) => {
              const Icon = soc.icon;
              return (
                <a
                  key={soc.label}
                  href={soc.href}
                  onClick={(e) => {
                    if (soc.href === '#') e.preventDefault();
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-outline-variant/30 hover:border-primary/50 text-on-surface-variant hover:text-primary transition-all text-xs font-mono bg-surface-container-low/40"
                >
                  <Icon className="w-4 h-4" />
                  {soc.label}
                </a>
              );
            })}
          </div>
        </div>

        {/* Right Column: Contact Form and Interactive Log Console */}
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4" id="contact-input-form">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider block px-1">Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-lg p-3 text-sm text-on-surface transition-all outline-none"
                  id="contact-name-input"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider block px-1">Email</label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-lg p-3 text-sm text-on-surface transition-all outline-none"
                  id="contact-email-input"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider block px-1">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-lg p-3 text-sm text-on-surface transition-all outline-none cursor-pointer"
                id="contact-subject-select"
              >
                <option>New Project Inquiry</option>
                <option>Collaboration Opportunity</option>
                <option>General Feedback</option>
                <option>Other</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider block px-1">Message</label>
              <textarea
                required
                rows={4}
                placeholder="Tell me about your project..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-lg p-3 text-sm text-on-surface transition-all outline-none resize-none"
                id="contact-message-textarea"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full bg-primary text-on-primary font-bold py-4 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
              id="contact-submit-btn"
            >
              <Send className="w-4 h-4" />
              {sending ? 'Initiating Cloud Ingress...' : 'Send Message'}
            </button>
          </form>

          {/* Interactive Developer Terminal Console */}
          {(logs.length > 0 || sentMessages.length > 0) && (
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden" id="developer-terminal-box">
              <div className="bg-surface-container-low px-4 py-2 border-b border-outline-variant/20 flex items-center gap-2 justify-between">
                <div className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-primary" />
                  <span className="font-mono text-[10px] text-on-surface-variant uppercase font-bold">
                    SMTP Handshake Log Stream
                  </span>
                </div>
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="w-2 h-2 rounded-full bg-yellow-400" />
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                </div>
              </div>

              {/* Logs */}
              <div className="p-4 font-mono text-[10px] space-y-1 bg-background/40 max-h-48 overflow-y-auto custom-scrollbar">
                {logs.map((log, idx) => (
                  <div key={idx} className="text-on-surface-variant leading-relaxed">
                    <span className="text-secondary select-none">❯</span> {log}
                  </div>
                ))}
                {sentMessages.map((msg) => (
                  <div key={msg.id} className="text-green-400 border-t border-outline-variant/10 pt-2 mt-2">
                    <div className="flex items-center gap-1 font-semibold">
                      <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                      Payload delivered! Receipt UUID: {msg.id}
                    </div>
                    <div className="text-[9px] text-on-surface-variant mt-1 italic pl-4">
                      Sender: {msg.name} ({msg.email}) | Topic: {msg.subject}
                    </div>
                  </div>
                ))}
                <div ref={terminalBottomRef} />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
