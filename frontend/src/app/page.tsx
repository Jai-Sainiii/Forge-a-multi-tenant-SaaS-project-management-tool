'use client';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Terminal, 
  Users, 
  Layout, 
  TrendingUp, 
  Database, 
  ShieldCheck
} from 'lucide-react';
import { ElementType } from 'react';

const FeatureCard = ({ icon: Icon, title, description }: { icon: ElementType, title: string, description: string }) => (
  <motion.div 
    whileHover={{ borderColor: 'var(--color-primary)' }}
    className="p-8 bg-white dark:bg-slate-900 border border-outline-variant dark:border-slate-800 rounded-xl flex flex-col gap-4 transition-colors"
  >
    <div className="w-12 h-12 bg-primary/5 dark:bg-primary/10 flex items-center justify-center rounded-lg">
      <Icon className="text-primary" size={24} />
    </div>
    <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">{title}</h3>
    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{description}</p>
  </motion.div>
);



const TestimonialCard = ({ quote, author, role, avatar }: { quote: string, author: string, role: string, avatar: string }) => (
  <div className="p-8 bg-white dark:bg-slate-900 border border-outline-variant dark:border-slate-800 rounded-xl flex flex-col gap-6">
    <p className="text-lg leading-relaxed italic text-slate-700 dark:text-slate-300">&quot;{quote}&quot;</p>
    <div className="flex items-center gap-4 pt-6 border-t border-outline-variant dark:border-slate-800">
      <img src={avatar} alt={author} className="w-10 h-10 rounded-full object-cover grayscale" />
      <div>
        <p className="text-sm font-bold text-slate-900 dark:text-white">{author}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{role}</p>
      </div>
    </div>
  </div>
);

export default function App() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen overflow-x-hidden">

      <main>
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 pt-32 pb-20 md:pt-48 md:pb-32 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-start gap-8"
          >
            <span className="inline-flex items-center rounded-full bg-secondary-light/30 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-secondary">
              Now in public beta
            </span>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              Ship projects faster.<br />Your whole team, one workspace.
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed">
              A high-performance project management tool built for modern teams. Stop juggling tabs and start building.
            </p>
            <div className="flex flex-wrap gap-4 w-full sm:w-auto">
              <button className="bg-primary hover:bg-primary-light text-white font-semibold px-8 py-4 rounded-xl flex items-center justify-center gap-2 group transition-all active:scale-95 shadow-lg shadow-primary/10">
                Start for free <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-white dark:bg-slate-900 border border-outline-variant dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold px-8 py-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95">
                See how it works
              </button>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <img 
                    key={i} 
                    src={`https://i.pravatar.cc/100?img=${i + 10}`} 
                    className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 object-cover grayscale active:grayscale-0 transition-all cursor-pointer" 
                    alt="User"
                  />
                ))}
              </div>
              <span className="text-xs font-medium text-slate-400">Joined by 10,000+ builders</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white dark:bg-slate-900 border border-outline-variant dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-black/40">
              <div className="bg-slate-50 dark:bg-slate-950 px-4 py-3 flex items-center gap-3 border-b border-outline-variant dark:border-slate-800">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                </div>
                <div className="bg-white dark:bg-slate-900 border border-outline-variant dark:border-slate-700 px-3 py-1 rounded text-[10px] text-slate-400 font-medium flex items-center gap-2 flex-grow max-w-xs">
                  <ShieldCheck size={12} className="text-slate-300 dark:text-slate-600" /> app.forge.pm/workspace
                </div>
              </div>
              <div className="p-8 grid grid-cols-3 gap-6 min-h-[400px]">
                {['To Do', 'In Progress', 'Done'].map((col) => (
                  <div key={col} className="flex flex-col gap-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{col}</span>
                    <div className={`p-4 rounded-lg border flex flex-col gap-3 ${col === 'In Progress' ? 'border-primary bg-primary/[0.02] dark:bg-primary/5' : 'border-outline-variant dark:border-slate-700'}`}>
                      <div className={`h-2 rounded w-3/4 ${col === 'In Progress' ? 'bg-primary/20' : 'bg-slate-100 dark:bg-slate-800'}`} />
                      <div className={`h-2 rounded w-1/2 ${col === 'In Progress' ? 'bg-primary/10' : 'bg-slate-50 dark:bg-slate-700'}`} />
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex -space-x-1.5">
                           <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 border border-white dark:border-slate-900" />
                           {col === 'In Progress' && <div className="w-5 h-5 rounded-full bg-primary/20 border border-white dark:border-slate-900" />}
                        </div>
                        <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-tighter ${col === 'In Progress' ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                          {col === 'In Progress' ? 'Sprint 1' : 'High'}
                        </span>
                      </div>
                    </div>
                    {col === 'To Do' && (
                       <div className="p-4 rounded-lg border border-outline-variant dark:border-slate-700 flex flex-col gap-3 opacity-60">
                        <div className="h-2 rounded w-full bg-slate-100 dark:bg-slate-800" />
                        <div className="h-2 rounded w-2/3 bg-slate-50 dark:bg-slate-700" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>


        <section className="border-y border-outline-variant dark:border-slate-800 bg-white/30 dark:bg-slate-900/30 py-10">
          <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-10">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 whitespace-nowrap">Trusted by teams at</span>
            <div className="flex flex-wrap justify-center lg:justify-between items-center gap-12 lg:flex-grow opacity-30 grayscale contrast-125">
              {['STARK', 'LUMEN', 'ACME', 'GLOBEX', 'OCP', 'SOYLENT'].map(logo => (
                <span key={logo} className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">{logo}</span>
              ))}
            </div>
          </div>
        </section>

        
        <section id="product" className="max-w-7xl mx-auto px-6 py-32">
          <motion.div {...fadeInUp} className="text-center mb-20">
            <h2 className="text-4xl font-bold tracking-tight mb-4 text-slate-900 dark:text-white">Everything you need to ship.</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              No fluff. Just the essentials, refined for maximum performance.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard icon={Layout} title="Multi-tenant Flow" description="Switch seamlessly between organizations and projects without ever losing context." />
            <FeatureCard icon={Users} title="Real-time Sync" description="Every change is broadcast instantly. Collaborative editing as fast as your thoughts." />
            <FeatureCard icon={Terminal} title="Keyboard First" description="A command palette for everything. Never touch your mouse unless you want to." />
            <FeatureCard icon={TrendingUp} title="Advanced Analytics" description="Velocity tracking, burndown charts, and cycle time metrics out of the box." />
            <FeatureCard icon={Database} title="API Access" description="Robust GraphQL and REST APIs to connect Forge with your existing stack." />
            <FeatureCard icon={ShieldCheck} title="Enterprise Security" description="SSO, audit logs, and granular permissions for peace of mind at any scale." />
          </div>
        </section>

        
        <section className="bg-slate-50/50 dark:bg-slate-950/50 border-y border-outline-variant dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-6 py-32 flex flex-col gap-32">
            {[
              {
                tag: 'ARCHITECTURE',
                title: 'Organize with Kanban.',
                desc: 'Visualize your workflow with highly customizable boards. Drag, drop, and automate your way to the finish line.',
                img: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=1200&grayscale=1',
                reverse: false
              },
              {
                tag: 'COLLABORATION',
                title: 'Manage Members.',
                desc: 'Unified member management for multi-tenant environments. Assign roles, teams, and departments with ease.',
                img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1200&grayscale=1',
                reverse: true
              },
              {
                tag: 'TRANSPARENCY',
                title: 'Activity Logs.',
                desc: 'Track every change with granular activity logs. See who did what, when, and revert to any state in seconds.',
                img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200&grayscale=1',
                reverse: false
              }
            ].map((block, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center`}
              >
                <div className={`flex flex-col gap-6 ${block.reverse ? 'lg:order-2' : ''}`}>
                  <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase">{block.tag}</span>
                  <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">{block.title}</h2>
                  <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">{block.desc}</p>
                </div>
                <div className={`border border-outline-variant dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 p-3 shadow-xl shadow-slate-200/40 dark:shadow-black/30 ${block.reverse ? 'lg:order-1' : ''}`}>
                  <img src={block.img} alt={block.title} className="rounded-xl w-full h-auto aspect-video object-cover" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        
        <section className="max-w-7xl mx-auto px-6 py-32 border-t border-outline-variant dark:border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <TestimonialCard quote="Forge changed the way we build. The speed of the interface is unmatched." author="David Chen" role="CTO at Lumen" avatar="https://i.pravatar.cc/100?img=11" />
            <TestimonialCard quote="Finally, a tool that respects our workflow instead of forcing a new one." author="Sarah Jenkins" role="Design Lead at Acme" avatar="https://i.pravatar.cc/100?img=32" />
            <TestimonialCard quote="Keyboard shortcuts alone saved us hours every week. It's built for power users." author="Marcus Thorne" role="Engineer at Stark" avatar="https://i.pravatar.cc/100?img=53" />
          </div>
        </section>

       
        <section className="max-w-7xl mx-auto px-6 py-32">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-primary rounded-3xl p-12 md:p-24 flex flex-col items-center text-center gap-8 relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            <h2 className="text-4xl md:text-5xl font-bold text-white relative z-10 tracking-tight max-w-2xl">
              Ready to build the future? Create your workspace today.
            </h2>
            <p className="text-slate-300 text-lg relative z-10">Join 10,000+ teams shipping faster with Forge.</p>
            <button className="bg-white text-primary hover:bg-slate-50 font-bold px-10 py-4 rounded-xl relative z-10 flex items-center gap-2 group transition-all active:scale-95">
              Create your workspace <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </section>
      </main>

    </div>
  );
}
