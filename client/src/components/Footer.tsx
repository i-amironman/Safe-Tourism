import { Separator } from "@/components/ui/separator";
import { MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, Globe } from "lucide-react";
import { Link } from "wouter"; 

export function Footer() {
  return (
    <footer className="bg-muted/30 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-6 w-6 text-primary" />
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
                <Link href="/map">
                  <a className="hover:text-foreground transition-colors">Safety Maps</a>
                </Link>
              </li>
              <li>
                <Link href="/trips">
                  <a className="hover:text-foreground transition-colors">Trip Planning</a>
                </Link>
              </li>
              <li>
                <Link href="/features">
                  <a className="hover:text-foreground transition-colors">Features</a>
                </Link>
              </li>
              <li>
                <Link href="/pricing">
                  <a className="hover:text-foreground transition-colors">Pricing</a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/travel-guide">
                  <a className="hover:text-foreground transition-colors">Travel Guide</a>
                </Link>
              </li>
              <li>
                <Link href="/safety-tips">
                  <a className="hover:text-foreground transition-colors">Safety Tips</a>
                </Link>
              </li>
              <li>
                <Link href="/emergency-contacts">
                  <a className="hover:text-foreground transition-colors">Emergency Contacts</a>
                </Link>
              </li>
              <li>
                <Link href="/api-docs">
                  <a className="hover:text-foreground transition-colors">API Documentation</a>
                </Link>
              </li>
              <li>
                <Link href="/blog">
                  <a className="hover:text-foreground transition-colors">Blog</a>
                </Link>
              </li>
              <li>
                <Link href="/faq">
                  <a className="hover:text-foreground transition-colors">FAQ</a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about">
                  <a className="hover:text-foreground transition-colors">About Us</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="hover:text-foreground transition-colors">Contact</a>
                </Link>
              </li>
              <li>
                <Link href="/careers">
                  <a className="hover:text-foreground transition-colors">Careers</a>
                </Link>
              </li>
              <li>
                <Link href="/press">
                  <a className="hover:text-foreground transition-colors">Press</a>
                </Link>
              </li>
              <li>
                <Link href="/partners">
                  <a className="hover:text-foreground transition-colors">Partners</a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy">
                  <a className="hover:text-foreground transition-colors">Privacy Policy</a>
                </Link>
              </li>
              <li>
                <Link href="/terms">
                  <a className="hover:text-foreground transition-colors">Terms of Service</a>
                </Link>
              </li>
              <li>
                <Link href="/cookies">
                  <a className="hover:text-foreground transition-colors">Cookie Policy</a>
                </Link>
              </li>
              <li>
                <Link href="/gdpr">
                  <a className="hover:text-foreground transition-colors">GDPR Compliance</a>
                </Link>
              </li>
              <li>
                <Link href="/accessibility">
                  <a className="hover:text-foreground transition-colors">Accessibility</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div>
            <h4 className="font-semibold mb-3">Contact Us</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:support@safetravel.com" className="hover:text-foreground transition-colors">
                  support@safetravel.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href="tel:+442012345678" className="hover:text-foreground transition-colors">
                  +44 20 1234 5678
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>Available 24/7 Worldwide</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Subscribe to get travel safety tips and updates
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 text-sm border rounded-md bg-background"
              />
              <button className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

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
