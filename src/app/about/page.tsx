import React from "react";
import { Compass, Eye, ShieldCheck, Heart } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      title: "Trust First",
      description: "We safeguard electronic listings and hold payments in secure escrow until item check confirmation.",
      icon: <ShieldCheck className="h-6 w-6 text-violet-400" />,
    },
    {
      title: "Innovation Focus",
      description: "We build intuitive tools including search routing, multi-field filters, and data visualization sheets.",
      icon: <Compass className="h-6 w-6 text-violet-400" />,
    },
    {
      title: "Transparency",
      description: "We display seller history, item conditions, views logs, and uncensored customer reviews.",
      icon: <Eye className="h-6 w-6 text-violet-400" />,
    },
    {
      title: "Customer Support",
      description: "Our dedicated support desk is available around the clock to assist in district logistics.",
      icon: <Heart className="h-6 w-6 text-violet-400" />,
    },
  ];

  const team = [
    {
      name: "Sohan Chowdhury",
      role: "CEO & Platform Architect",
      bio: "Tech entrepreneur with a focus on web architectures. Designing tools that empower small businesses.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    },
    {
      name: "Farhana Yasmin",
      role: "Head of Operations",
      bio: "10+ years managing digital commerce logistics. Ensuring fast shipping across all 64 districts.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    },
    {
      name: "Imran Khan",
      role: "Lead Backend Developer",
      bio: "Database administrator specializing in Mongo clustering and token verification protocols.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    },
  ];

  return (
    <div className="space-y-16 py-6">
      {/* Hero Header */}
      <section className="text-center max-w-2xl mx-auto space-y-4">
        <span className="inline-flex rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-400 uppercase tracking-wider">
          Our Vision
        </span>
        <h1 className="text-3xl sm:text-5xl font-black uppercase text-slate-100 tracking-tight">
          Who We Are
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          Tech Bazaar is a dedicated peer-to-peer marketplace created to simplify tech gadget discoveries and transactions. We connect buyers and sellers with secure escrow structures, search indexes, and visual statistics.
        </p>
      </section>

      {/* Core Values grid */}
      <section className="space-y-8">
        <h2 className="text-center text-xl sm:text-2xl font-black uppercase text-slate-200 tracking-tight">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((val, idx) => (
            <div key={idx} className="flex flex-col p-6 bg-slate-900/20 border border-slate-800/60 rounded-2xl">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl w-fit shadow-sm text-violet-400 mb-4">
                {val.icon}
              </div>
              <h3 className="font-bold text-slate-200 text-sm mb-2">{val.title}</h3>
              <p className="text-xs text-slate-450 leading-relaxed">{val.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="bg-slate-900/10 border border-slate-900 rounded-3xl p-8 sm:p-12 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl font-black uppercase text-slate-200 tracking-tight">Our Journey</h2>
          <p className="text-xs text-slate-500">Key milestones in the building of Tech Bazaar.</p>
        </div>

        <div className="relative border-l border-slate-800/80 ml-4 md:ml-32 space-y-8">
          {/* Milestone 1 */}
          <div className="relative pl-6 md:pl-8">
            <div className="absolute -left-2 top-1.5 h-4 w-4 bg-violet-600 rounded-full border-4 border-slate-950" />
            <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-4">
              <span className="text-xs font-bold text-violet-400 uppercase tracking-widest md:-ml-32 md:w-24 md:text-right block">2024</span>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-slate-200">Bazaar Conception</h3>
                <p className="text-xs text-slate-450 leading-relaxed">
                  Platform initialized as a prototype listing site for local developers to trade hardware gadgets.
                </p>
              </div>
            </div>
          </div>

          {/* Milestone 2 */}
          <div className="relative pl-6 md:pl-8">
            <div className="absolute -left-2 top-1.5 h-4 w-4 bg-violet-600 rounded-full border-4 border-slate-950" />
            <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-4">
              <span className="text-xs font-bold text-violet-400 uppercase tracking-widest md:-ml-32 md:w-24 md:text-right block">2025</span>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-slate-200">Escrow Launch</h3>
                <p className="text-xs text-slate-450 leading-relaxed">
                  Introduced payment holding structures, user reviews, and fast shipping logistics in Bangladesh.
                </p>
              </div>
            </div>
          </div>

          {/* Milestone 3 */}
          <div className="relative pl-6 md:pl-8">
            <div className="absolute -left-2 top-1.5 h-4 w-4 bg-violet-600 rounded-full border-4 border-slate-950" />
            <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-4">
              <span className="text-xs font-bold text-violet-400 uppercase tracking-widest md:-ml-32 md:w-24 md:text-right block">2026</span>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-slate-200">Full TypeScript Upgrade</h3>
                <p className="text-xs text-slate-450 leading-relaxed">
                  Re-coded the frontend and backend architectures in type-safe TypeScript, integrating Recharts dashboards and Next.js middlewares.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team grid */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl font-black uppercase text-slate-200 tracking-tight">Meet Our Team</h2>
          <p className="text-xs text-slate-500">The minds behind the Tech Bazaar platform operations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {team.map((member, idx) => (
            <div key={idx} className="group bg-slate-900/30 border border-slate-800 rounded-2xl overflow-hidden hover:border-violet-500/30 transition duration-300">
              <div className="aspect-square w-full overflow-hidden bg-slate-950">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-103"
                />
              </div>
              <div className="p-5 space-y-2">
                <div>
                  <h3 className="font-bold text-slate-200 text-sm">{member.name}</h3>
                  <span className="text-[10px] text-violet-400 uppercase font-bold tracking-wider">{member.role}</span>
                </div>
                <p className="text-xs text-slate-450 leading-relaxed">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
