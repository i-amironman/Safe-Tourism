import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, Globe } from "lucide-react";
import { Link } from 'react-router-dom';

export function GlobalFooter() {
  return (
    <footer className="bg-muted/30 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">SafeTravel</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Travel with confidence using real-time safety data and intelligent planning tools.
            </p>
            <div className="flex space-x-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/map" className="hover:text-foreground transition-colors">
                  Safety Maps
                </Link>
              </li>
              <li>
                <Link to="/trips" className="hover:text-foreground transition-colors">
                  Trip Planning
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-foreground transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/travel-guide" className="hover:text-foreground transition-colors">
                  Travel Guide
                </Link>
              </li>
              <li>
                <Link to="/safety-tips" className="hover:text-foreground transition-colors">
                  Safety Tips
                </Link>
              </li>
              <li>
                <Link to="/emergency-contacts" className="hover:text-foreground transition-colors">
                  Emergency Contacts
                </Link>
              </li>
              <li>
                <Link to="/api-docs" className="hover:text-foreground transition-colors">
                  API Documentation
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/about" className="hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-foreground transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/press" className="hover:text-foreground transition-colors">
                  Press
                </Link>
              </li>
              <li>
                <Link to="/partners" className="hover:text-foreground transition-colors">
                  Partners
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="hover:text-foreground transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/gdpr" className="hover:text-foreground transition-colors">
                  GDPR Compliance
                </Link>
              </li>
              <li>
                <Link to="/accessibility" className="hover:text-foreground transition-colors">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p>© 2025 SafeTravel. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="https://www.gov.uk/foreign-travel-advice" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                Official Travel Advice
              </a>
              <a href="https://www.who.int/health-topics/travel" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                WHO Travel Health
              </a>
            </div>
          </div>
          <p>Built with care for safer travels worldwide.</p>
        </div>
      </div>
    </footer>
  );
}