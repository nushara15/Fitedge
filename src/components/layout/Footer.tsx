
"use client"
import Link from 'next/link';
import { Dumbbell } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Footer() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container py-12 px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="flex flex-col items-start col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <Dumbbell className="h-8 w-8 text-primary" />
              <span className="font-bold font-headline text-2xl">FitEdge</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Your edge in fitness and performance.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 col-span-1 md:col-span-3 gap-8">
            <div>
              <h4 className="font-headline font-semibold">Navigate</h4>
              <ul className="mt-4 space-y-2">
                <li><Link href="/about" className="text-sm hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="/services" className="text-sm hover:text-primary transition-colors">Services</Link></li>
                <li><Link href="/contact" className="text-sm hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-headline font-semibold">Services</h4>
              <ul className="mt-4 space-y-2">
                <li><Link href="/services#workouts" className="text-sm hover:text-primary transition-colors">Workout Plans</Link></li>
                <li><Link href="/services#meals" className="text-sm hover:text-primary transition-colors">Meal Plans</Link></li>
                <li><Link href="/services#coaching" className="text-sm hover:text-primary transition-colors">1-on-1 Coaching</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-headline font-semibold">Follow Us</h4>
              <div className="flex mt-4 space-x-4">
                <Link href="https://web.facebook.com/fitedge.lk/" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </Link>
                <Link href="https://www.instagram.com/fitedgefitness?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" aria-label="Instagram" target='_blank' rel='noopener noreferrer'> 
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} FitEdge. All rights reserved. | <Link href="/admin/login" className="hover:text-primary">Admin Login</Link></p>
        </div>
      </div>
    </footer>
  );
}
