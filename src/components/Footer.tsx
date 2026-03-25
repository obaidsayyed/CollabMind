import { motion } from 'framer-motion';
import { Sparkles, Instagram, Linkedin, Github } from 'lucide-react';
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#0B1120] border-t border-indigo-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Column 1 - Brand */}
          <div className="space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="h-12 flex items-center">
  <img
    src="collabmindbg.jpeg"
    className="h-full object-contain"
  />
</div>
              <span className="text-2xl font-bold text-white">Collab Mind</span>
            </div>
            
            {/* Tagline */}
            <p className="text-gray-400 text-sm leading-relaxed">
              Connecting real problems with real solutions.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <motion.a
                href="#"
                className="w-10 h-10 rounded-xl border border-indigo-500/30 flex items-center justify-center text-gray-400 hover:text-white hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 transition-all cursor-hover"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Instagram className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="#"
                className="w-10 h-10 rounded-xl border border-indigo-500/30 flex items-center justify-center text-gray-400 hover:text-white hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 transition-all cursor-hover"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Linkedin className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="#"
                className="w-10 h-10 rounded-xl border border-indigo-500/30 flex items-center justify-center text-gray-400 hover:text-white hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 transition-all cursor-hover"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github className="w-5 h-5" />
              </motion.a>
            </div>
          </div>

          {/* Column 2 - Platform Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Platform
            </h3>
            <div className="w-12 h-px bg-indigo-500/30 mb-6" />
            <nav className="flex flex-col gap-3">
              <Link to="/dashboard/browse-ideas" className="text-gray-400 hover:text-[#8B5CF6] transition-colors cursor-hover text-sm">
  Browse Projects
</Link>
              <Link to="/dashboard/my-ideas" className="text-gray-400 hover:text-[#8B5CF6] transition-colors cursor-hover text-sm">
  Post a Problem
</Link>
              <Link to="/#how-it-works" className="text-gray-400 hover:text-[#8B5CF6] transition-colors cursor-hover text-sm">
  How it Works
</Link>
            </nav>
          </div>

          {/* Column 3 - Resources */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Resources
            </h3>
            <div className="w-12 h-px bg-indigo-500/30 mb-6" />
            <nav className="flex flex-col gap-3">
              <a
                href="#"
                className="text-gray-400 hover:text-[#8B5CF6] transition-colors cursor-hover text-sm"
              >
                Documentation
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#8B5CF6] transition-colors cursor-hover text-sm"
              >
                Community
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#8B5CF6] transition-colors cursor-hover text-sm"
              >
                Blog
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#8B5CF6] transition-colors cursor-hover text-sm"
              >
                FAQ
              </a>
            </nav>
          </div>
          {/* Column 4 - Company */}
<div>
  <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
    Company
  </h3>
  <div className="w-12 h-px bg-indigo-500/30 mb-6" />
  <nav className="flex flex-col gap-3">
    <a href="/#about" className="text-gray-400 hover:text-[#8B5CF6] transition-colors text-sm">
      About Us
    </a>
    <a href="#" className="text-gray-400 hover:text-[#8B5CF6] transition-colors text-sm">
      Contact
    </a>
    <a href="#" className="text-gray-400 hover:text-[#8B5CF6] transition-colors text-sm">
      Privacy Policy
    </a>
    <a href="#" className="text-gray-400 hover:text-[#8B5CF6] transition-colors text-sm">
      Terms of Service
    </a>
  </nav>
</div>

</div>
    


        {/* Bottom Footer Bar */}
        <div className="mt-12 pt-8 border-t border-indigo-500/20">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 Collab Mind. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm italic">
              Empowering students to build solutions that matter.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
