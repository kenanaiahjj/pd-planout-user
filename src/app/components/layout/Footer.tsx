/**
 * @file Footer.tsx
 * @description Minimal site footer with copyright and legal links.
 */

import React from 'react';

export function Footer() {
  return (
    <footer className="mt-20 pb-10 border-t border-gray-100 pt-10">
      <div className="flex flex-col items-center gap-4 px-4 text-center">
        <p className="text-[#94a3b8] text-sm">
          &copy; 2025 PlanOut Sports. All rights reserved.
        </p>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-[#177564] text-xs font-medium">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
          <a href="#" className="hover:underline">Contact Us</a>
        </div>
      </div>
    </footer>
  );
}
