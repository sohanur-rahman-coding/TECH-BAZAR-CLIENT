"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !subject || !message) {
      toast.error("Please fill in all the form fields");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading("Sending message...");

    setTimeout(() => {
      toast.success("Message sent successfully! Our team will reach you soon.", { id: toastId });
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setSubmitting(false);
    }, 1500);
  };

  const contactInfos = [
    {
      title: "Our Location",
      detail: "Gulshan-2, Dhaka 1212, Bangladesh",
      icon: <MapPin className="h-5 w-5 text-violet-400" />,
    },
    {
      title: "Support Desk",
      detail: "+880 1712-345678",
      icon: <Phone className="h-5 w-5 text-violet-400" />,
    },
    {
      title: "Email Support",
      detail: "support@techbazaar.com",
      icon: <Mail className="h-5 w-5 text-violet-400" />,
    },
    {
      title: "Operating Hours",
      detail: "Sat - Thu: 9 AM - 6 PM",
      icon: <Clock className="h-5 w-5 text-violet-400" />,
    },
  ];

  return (
    <div className="space-y-12 py-6">
      {/* Hero */}
      <section className="text-center max-w-2xl mx-auto space-y-4">
        <span className="inline-flex rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-400 uppercase tracking-wider">
          Contact Us
        </span>
        <h1 className="text-3xl sm:text-5xl font-black uppercase text-slate-100 tracking-tight">
          Get in Touch
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          Have questions about shipping, escrow verification, or pricing? Drop us a message, and our team will respond within 24 hours.
        </p>
      </section>

      {/* Grid Layout: Info vs Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Side: Contact Cards */}
        <div className="space-y-4">
          {contactInfos.map((info, idx) => (
            <div key={idx} className="flex gap-4 p-5 bg-slate-900/20 border border-slate-800/80 rounded-2xl">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl h-fit text-violet-400">
                {info.icon}
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-350 text-xs uppercase tracking-wide">{info.title}</h3>
                <p className="text-xs text-slate-200 font-semibold">{info.detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Message Form */}
        <div className="lg:col-span-2 bg-slate-900/10 border border-slate-900 p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-900 pb-4">
            <MessageSquare className="text-violet-500" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">Send an Inquiry</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-1">
                <label className="block text-[10px] text-slate-500 uppercase font-semibold">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-slate-950 border border-slate-850 focus:border-violet-500 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="block text-[10px] text-slate-500 uppercase font-semibold">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full bg-slate-950 border border-slate-850 focus:border-violet-500 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none"
                />
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-1">
              <label className="block text-[10px] text-slate-500 uppercase font-semibold">Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Escrow Dispute / Account Plan"
                className="w-full bg-slate-950 border border-slate-850 focus:border-violet-500 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none"
              />
            </div>

            {/* Message Body */}
            <div className="space-y-1">
              <label className="block text-[10px] text-slate-500 uppercase font-semibold">Message Body</label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Details of your inquiry..."
                className="w-full bg-slate-950 border border-slate-850 focus:border-violet-500 rounded-xl p-4 text-xs text-slate-200 focus:outline-none resize-none"
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl py-3.5 text-xs transition duration-200 shadow-md shadow-violet-900/20 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Send size={14} />
                <span>{submitting ? "Sending Inquiry..." : "Submit Inquiry"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Map placeholder */}
      <section className="border border-slate-900 rounded-3xl overflow-hidden h-64 bg-slate-950/40 relative">
        <div className="absolute inset-0 bg-violet-900/5 mix-blend-color" />
        <div className="h-full w-full flex items-center justify-center flex-col text-center p-6 space-y-2">
          <MapPin className="text-violet-500 h-8 w-8 animate-bounce" />
          <h3 className="font-bold text-slate-200 text-sm">Interactive Map Location</h3>
          <p className="text-xs text-slate-500 max-w-xs">Gulshan Avenue, Circle-2, Dhaka 1212, Bangladesh</p>
          <div className="pt-2">
            <span className="text-[10px] bg-slate-900 text-violet-400 font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-slate-800">
              Coordinates Locked
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
