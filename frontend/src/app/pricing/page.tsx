"use client"

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 }
  };

const PricingCard = ({ title, price, features, highlighted = false }: { title: string, price: string, features: string[], highlighted?: boolean }) => (
  <div className={`p-10 bg-white dark:bg-slate-900 rounded-xl flex flex-col gap-8 relative border-2 ${highlighted ? 'border-primary shadow-xl shadow-primary/5' : 'border-outline-variant dark:border-slate-800'}`}>
    {highlighted && (
      <span className="absolute top-0 right-8 -translate-y-1/2 bg-primary text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full">
        Most Popular
      </span>
    )}
    <div>
      <h3 className="text-xl font-bold mb-1 text-slate-900 dark:text-white">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm">For {title === 'Starter' ? 'small projects' : title === 'Pro' ? 'growing teams' : 'large scale'}.</p>
    </div>
    <div className="flex items-baseline gap-1">
      <span className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">{price}</span>
      {price !== 'Custom' && <span className="text-slate-400 text-sm">/mo</span>}
    </div>
    <ul className="flex flex-col gap-4 flex-grow">
      {features.map((feature, i) => (
        <li key={i} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
          <CheckCircle2 size={18} className={highlighted ? 'text-primary' : 'text-secondary'} />
          {feature}
        </li>
      ))}
    </ul>
    <button className={`w-full py-3.5 rounded-lg font-medium transition-all active:scale-95 border ${highlighted ? 'bg-primary text-white border-primary hover:bg-primary-light' : 'bg-transparent text-slate-800 dark:text-slate-200 border-outline-variant dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
      {title === 'Enterprise' ? 'Contact sales' : 'Start for free'}
    </button>
  </div>
);

export default function Pricing() {
    return (
        <section id="pricing" className="max-w-7xl mx-auto px-6 py-32">
          <motion.div {...fadeInUp} className="text-center mb-20">
            <h2 className="text-4xl font-bold tracking-tight mb-4 text-slate-900 dark:text-white">Pricing for builders.</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400">Simple, transparent pricing that scales with you.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PricingCard title="Starter" price="$0" features={['Up to 3 members', '2 projects', 'Community support']} />
            <PricingCard title="Pro" price="$19" features={['Unlimited members', 'Unlimited projects', 'Advanced analytics', 'Priority support']} highlighted={true} />
            <PricingCard title="Enterprise" price="Custom" features={['SSO & Audit logs', 'Dedicated success manager', 'Custom integrations']} />
          </div>
        </section>
    );
}