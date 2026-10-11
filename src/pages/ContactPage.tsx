import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.js';
import { MessageCircle, Mail, MapPin, Send, Heart, Clock } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { showToast } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && message.trim()) {
      setSent(true);
      showToast('Thank you for reaching out! We will reply soon ♡');
    }
  };

  return (
    <div className="py-10 sm:py-16 bg-[#FFF8EF] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#FFF2DE] flex items-center justify-center text-3xl mb-3 shadow-inner">
            💌
          </div>
          <h1 className="font-handwriting text-4xl sm:text-5xl font-bold text-[#684431]">
            Say Hello to the Siblings <span className="text-[#F3A59B]">♡</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#684431]/80 max-w-md mx-auto mt-2 font-sans">
            Have questions about yarn shades, sizing, custom orders, or order updates? We love chatting with our customers!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Studio Contact Cards */}
          <div className="md:col-span-5 space-y-4">
            
            <div className="bg-white p-6 rounded-3xl border border-[#684431]/10 shadow-xs space-y-4">
              <h3 className="font-sans font-bold text-base text-[#684431]">
                Our Studio Info
              </h3>

              <div className="space-y-3.5 text-xs text-[#684431]/80 font-sans">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FFF2DE] text-[#D97757] flex items-center justify-center shrink-0">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <strong className="block text-[#684431]">Craft Studio:</strong>
                    <span>Sunshine Squares, 12th Main, Indiranagar, Bengaluru, KA 560038, India</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FFF2DE] text-[#D97757] flex items-center justify-center shrink-0">
                    <Mail size={16} />
                  </div>
                  <div>
                    <strong className="block text-[#684431]">Email:</strong>
                    <span>hello@sunshinesquares.in</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FFF2DE] text-[#D97757] flex items-center justify-center shrink-0">
                    <Clock size={16} />
                  </div>
                  <div>
                    <strong className="block text-[#684431]">Studio Hours:</strong>
                    <span>Mon - Sat: 10:00 AM – 7:00 PM IST</span>
                  </div>
                </div>
              </div>

              {/* WhatsApp direct block */}
              <div className="pt-2">
                <a
                  href="https://wa.me/919876543210?text=Hello%20Sunshine%20Squares!%20I%20have%20a%20question%20about%20your%20crochet%20pieces%20♡"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold rounded-2xl shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle size={16} />
                  <span>WhatsApp: +91 98765 43210</span>
                </a>
              </div>
            </div>

          </div>

          {/* Contact Message Form */}
          <div className="md:col-span-7">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#684431]/10 shadow-xs">
              <h3 className="font-handwriting text-2xl font-bold text-[#684431] mb-4">
                Leave a Message ♡
              </h3>

              {sent ? (
                <div className="p-6 bg-[#FFF8EF] rounded-2xl text-center space-y-2 border border-[#F7C948]/30">
                  <span className="text-3xl">🌼</span>
                  <h4 className="font-sans font-bold text-sm text-[#684431]">Message Sent!</h4>
                  <p className="text-xs text-[#684431]/75">
                    We will reply to your message by email or WhatsApp within a few hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#684431] mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Shalini"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#684431]/20 bg-[#FFF8EF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#684431] mb-1">
                      Email or Mobile
                    </label>
                    <input
                      type="text"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="shalini@example.com or 9876543210"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#684431]/20 bg-[#FFF8EF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#684431] mb-1">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can we help you today?"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#684431]/20 bg-[#FFF8EF]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#684431] hover:bg-[#D97757] text-white text-xs font-semibold rounded-2xl shadow-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <Send size={14} />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
