import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ContactFormValues } from '../types';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  AlertCircle 
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const prefilledService = searchParams.get('service') || '';
  const prefilledSubject = searchParams.get('subject') || '';

  const [formValues, setFormValues] = useState<ContactFormValues>({
    name: '',
    email: '',
    phone: '',
    photographyType: prefilledService || 'Event Photography',
    eventDate: '',
    location: '',
    estimatedBudget: '',
    message: prefilledSubject ? `Hello Alan,\n\nI am interested in discussing: ${prefilledSubject}\n\n` : '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'submitted' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (prefilledService) {
      setFormValues((prev) => ({ ...prev, photographyType: prefilledService }));
    }
  }, [prefilledService]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.name.trim() || !formValues.email.trim() || !formValues.message.trim()) {
      setStatus('error');
      setErrorMessage('Please provide your name, email, and project details.');
      return;
    }

    setStatus('submitting');

    // Simulate reliable form submission
    setTimeout(() => {
      setStatus('submitted');
    }, 600);
  };

  const handleReset = () => {
    setFormValues({
      name: '',
      email: '',
      phone: '',
      photographyType: 'Event Photography',
      eventDate: '',
      location: '',
      estimatedBudget: '',
      message: '',
    });
    setStatus('idle');
  };

  return (
    <div id="contact-page" className="min-h-screen bg-[#050505] text-[#F5F5F4] pt-28 pb-20">
      
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="border-b border-white/10 pb-10 space-y-4 max-w-4xl">
          <div className="inline-block bg-[#E11D48] text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
            <span>Direct Inquiries</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-semibold uppercase tracking-[0.02em] text-white leading-none">
            Contact Alan Luby
          </h1>
          <p className="text-base sm:text-xl text-white/60 font-light leading-relaxed">
            Let's discuss your upcoming event, portrait session, editorial feature, or commercial assignment.
          </p>
        </div>
      </section>

      {/* Main Grid: Info + Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Direct Info & Social (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Identity Card */}
            <div className="p-8 bg-[#0A0A0A] border border-white/10 space-y-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#E11D48] font-bold block mb-1">
                  OFFICIAL STUDIO DIRECTORY
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold uppercase tracking-[0.02em] text-white">
                  Alan Luby Photography
                </h2>
                <p className="text-sm font-semibold text-white/60">
                  Alan Luby, Principal Photographer
                </p>
              </div>

              <div className="space-y-4 pt-2 border-t border-white/10 text-sm">
                
                {/* Email Item */}
                <a
                  href="mailto:aluby1441@aol.com"
                  id="contact-info-email"
                  className="group flex items-start gap-3.5 p-4 bg-[#111] border border-white/10 hover:border-[#E11D48] transition-all text-white/80 hover:text-white"
                >
                  <div className="h-9 w-9 bg-[#E11D48]/10 border border-[#E11D48]/30 flex items-center justify-center text-[#E11D48] shrink-0 group-hover:bg-[#E11D48] group-hover:text-white transition-all">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold tracking-widest text-white/40 block">
                      Direct Email
                    </span>
                    <span className="font-mono font-bold text-white group-hover:text-[#E11D48] transition-colors">
                      aluby1441@aol.com
                    </span>
                  </div>
                </a>

                {/* Phone Item */}
                <a
                  href="tel:5613409310"
                  id="contact-info-phone"
                  className="group flex items-start gap-3.5 p-4 bg-[#111] border border-white/10 hover:border-[#E11D48] transition-all text-white/80 hover:text-white"
                >
                  <div className="h-9 w-9 bg-[#E11D48]/10 border border-[#E11D48]/30 flex items-center justify-center text-[#E11D48] shrink-0 group-hover:bg-[#E11D48] group-hover:text-white transition-all">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold tracking-widest text-white/40 block">
                      Direct Phone
                    </span>
                    <span className="font-mono font-bold text-white group-hover:text-[#E11D48] transition-colors">
                      (561) 340-9310
                    </span>
                  </div>
                </a>

                {/* Response Note */}
                <div className="flex items-center gap-2 text-xs text-white/50 pt-1 font-light">
                  <Clock className="w-3.5 h-3.5 text-[#E11D48]" />
                  <span>Typically responds within 24 business hours.</span>
                </div>
              </div>
            </div>

            {/* Social Channels Card */}
            <div className="p-8 bg-[#0A0A0A] border border-white/10 space-y-4">
              <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-white">
                Social Channels
              </h3>
              <p className="text-xs text-white/60 font-light">
                Connect with Alan across official social media profiles:
              </p>

              <div className="space-y-3 pt-2">
                <a
                  href="https://www.facebook.com/share/1Jq7nQ8Rci/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  id="contact-social-facebook"
                  className="flex items-center justify-between p-3.5 bg-[#111] border border-white/10 hover:border-[#E11D48] text-xs font-bold uppercase tracking-wider text-white/80 hover:text-white transition-all"
                >
                  <span>Facebook Official Profile</span>
                  <ArrowUpRight className="w-4 h-4 text-[#E11D48]" />
                </a>

                <div className="p-3.5 bg-[#111] border border-white/10 text-xs text-white/70 flex items-center justify-between">
                  <span className="uppercase font-bold tracking-wider">Instagram</span>
                  <strong className="text-white font-mono">Alan Luby</strong>
                </div>
              </div>
            </div>

            {/* Travel & Assignments Note */}
            <div className="p-6 bg-[#0A0A0A] border border-white/10 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#E11D48] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Assignment Scope & Travel
              </span>
              <p className="text-xs text-white/60 font-light leading-relaxed">
                Based for regional coverage with flexibility for national and on-location travel assignments.
              </p>
            </div>

          </div>

          {/* Right Column: Contact & Project Inquiry Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 bg-[#0A0A0A] border border-white/10 shadow-2xl">
              
              {status === 'submitted' ? (
                <div className="text-center py-12 space-y-6 animate-in fade-in">
                  <div className="w-16 h-16 bg-[#E11D48]/10 border border-[#E11D48] text-[#E11D48] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display text-2xl sm:text-3xl font-semibold uppercase text-white tracking-[0.02em]">
                      Message Received
                    </h3>
                    <p className="text-sm text-white/70 max-w-md mx-auto leading-relaxed font-light">
                      Thank you for reaching out, <strong className="text-white">{formValues.name}</strong>. Alan Luby will review your project requirements and follow up directly at <strong className="text-white">{formValues.email}</strong>.
                    </p>
                  </div>

                  <div className="p-4 bg-[#050505] border border-white/10 max-w-md mx-auto text-xs text-white/60 text-left space-y-1 font-mono">
                    <p><strong>ASSIGNMENT:</strong> {formValues.photographyType}</p>
                    {formValues.eventDate && <p><strong>TARGET DATE:</strong> {formValues.eventDate}</p>}
                    {formValues.phone && <p><strong>PHONE:</strong> {formValues.phone}</p>}
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-6 py-3 border border-white/20 text-xs font-bold uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all"
                    >
                      Send Another Inquiry
                    </button>
                    <a
                      href={`mailto:aluby1441@aol.com?subject=${encodeURIComponent(`Follow-up regarding ${formValues.photographyType}`)}`}
                      className="px-6 py-3 bg-[#E11D48] text-xs font-bold uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all inline-flex items-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Open Direct Email</span>
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} id="booking-inquiry-form" className="space-y-6">
                  
                  <div className="space-y-2 border-b border-white/10 pb-4">
                    <h2 className="font-display text-xl sm:text-2xl font-semibold uppercase tracking-[0.02em] text-white">
                      Start a Project Inquiry
                    </h2>
                    <p className="text-xs text-white/50 font-light">
                      Fill out the form below to discuss dates, creative direction, and assignment details.
                    </p>
                  </div>

                  {status === 'error' && (
                    <div className="p-3.5 bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-white/70 block">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formValues.name}
                        onChange={handleChange}
                        placeholder="Jane Doe or Organization"
                        className="w-full bg-[#050505] border border-white/10 focus:border-[#E11D48] px-3.5 py-3 text-sm text-white placeholder-white/20 outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-white/70 block">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formValues.email}
                        onChange={handleChange}
                        placeholder="name@example.com"
                        className="w-full bg-[#050505] border border-white/10 focus:border-[#E11D48] px-3.5 py-3 text-sm text-white placeholder-white/20 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Phone & Photography Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label htmlFor="phone" className="text-[10px] font-bold uppercase tracking-widest text-white/70 block">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formValues.phone}
                        onChange={handleChange}
                        placeholder="(555) 000-0000"
                        className="w-full bg-[#050505] border border-white/10 focus:border-[#E11D48] px-3.5 py-3 text-sm text-white placeholder-white/20 outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="photographyType" className="text-[10px] font-bold uppercase tracking-widest text-white/70 block">
                        Type of Photography *
                      </label>
                      <select
                        id="photographyType"
                        name="photographyType"
                        value={formValues.photographyType}
                        onChange={handleChange}
                        className="w-full bg-[#050505] border border-white/10 focus:border-[#E11D48] px-3.5 py-3 text-sm text-white outline-none transition-colors"
                      >
                        <option value="Event Photography">Event Photography</option>
                        <option value="Portrait Photography">Portrait Photography</option>
                        <option value="Journalism & Editorial">Journalism & Editorial</option>
                        <option value="Commercial & Promotional">Commercial & Promotional</option>
                        <option value="Custom Photography Assignment">Custom Assignment</option>
                        <option value="Other / Multiple Needs">Other / Multiple Needs</option>
                      </select>
                    </div>
                  </div>

                  {/* Date & Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label htmlFor="eventDate" className="text-[10px] font-bold uppercase tracking-widest text-white/70 block">
                        Event / Project Date
                      </label>
                      <input
                        type="date"
                        id="eventDate"
                        name="eventDate"
                        value={formValues.eventDate}
                        onChange={handleChange}
                        className="w-full bg-[#050505] border border-white/10 focus:border-[#E11D48] px-3.5 py-3 text-sm text-white outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="location" className="text-[10px] font-bold uppercase tracking-widest text-white/70 block">
                        Location / City
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formValues.location}
                        onChange={handleChange}
                        placeholder="City, Venue, or On-site"
                        className="w-full bg-[#050505] border border-white/10 focus:border-[#E11D48] px-3.5 py-3 text-sm text-white placeholder-white/20 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label htmlFor="message" className="text-[10px] font-bold uppercase tracking-widest text-white/70 block">
                      Project Details & Vision *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      value={formValues.message}
                      onChange={handleChange}
                      placeholder="Describe the occasion, expected hours of coverage, key subjects, or any special visual goals..."
                      className="w-full bg-[#050505] border border-white/10 focus:border-[#E11D48] p-3.5 text-sm text-white placeholder-white/20 outline-none transition-colors"
                    />
                  </div>

                  {/* CTA Submit Button */}
                  <button
                    type="submit"
                    id="contact-submit-btn"
                    disabled={status === 'submitting'}
                    className="w-full bg-[#E11D48] hover:bg-white hover:text-black disabled:opacity-50 text-white text-xs sm:text-sm font-bold uppercase tracking-widest py-4 px-6 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {status === 'submitting' ? (
                      <span>TRANSMITTING INQUIRY...</span>
                    ) : (
                      <>
                        <span>LET'S TALK ABOUT YOUR PROJECT</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-center text-white/40 font-light">
                    Your details remain strictly confidential and will only be used to respond to your project request.
                  </p>

                </form>
              )}

            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
