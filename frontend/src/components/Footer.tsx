import Link from "next/link";
import { Globe, Mail, Users2 } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t border-outline-variant dark:border-slate-800 bg-white dark:bg-slate-950 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-2 md:col-span-1 flex flex-col gap-6">
            <Link href="/" className="text-2xl font-bold text-primary tracking-tight">Forge</Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
              The high-performance project management tool for builders.
            </p>
          </div>
          {[
            { title: 'Product', links: ['Features', 'Enterprise', 'Security', 'Integrations'] },
            { title: 'Resources', links: ['Documentation', 'Changelog', 'Guides', 'API'] },
            { title: 'Company', links: ['About Us', 'Contact', 'Privacy Policy', 'Terms of Service'] }
          ].map((col) => (
            <div key={col.title} className="flex flex-col gap-6">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{col.title}</h4>
              <ul className="flex flex-col gap-4">
                {col.links.map(link => (
                  <li key={link}><Link href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-colors">{link}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-6 border-t border-outline-variant dark:border-slate-800 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-slate-400">© 2024 Forge PM. All rights reserved. Built for builders.</p>
          <div className="flex items-center gap-6 text-slate-400">
            <Link href="#" className="hover:text-primary dark:hover:text-white transition-colors"><Globe size={18} /></Link>
            <Link href="#" className="hover:text-primary dark:hover:text-white transition-colors"><Mail size={18} /></Link>
            <Link href="#" className="hover:text-primary dark:hover:text-white transition-colors"><Users2 size={18} /></Link>
          </div>
        </div>
      </footer>
    )
}