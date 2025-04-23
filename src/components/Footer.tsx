import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Instagram, Twitter, Facebook } from 'lucide-react';
import SiteButton from '@components/SiteButton';
import Logo from './Logo';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[var(--bg2)] w-full mt-[var(--section-top-padding)] flex flex-col items-center justify-center">
            {/* Main Footer Content */}
            <div className="w-[var(--section-width)] max-w-[var(--section-max-width)] mt-[var(--page-top-padding)] px-4 md:px-8 lg:px-0 mx-auto py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Column 1: About */}
                    <div className="flex flex-col gap-4">
                        <Logo />
                        <p className="text-[var(--body)] text-sm">
                            Your one-stop delivery platform for food, groceries, and Pharmacy on campus.
                            Order from your favorite shops and enjoy fast delivery, exclusive deals, and more.
                        </p>
                        <div className="flex gap-4 mt-2">
                            <Link href="https://instagram.com" className="text-[var(--accent)] hover:text-[var(--accent-dark)]">
                                <Instagram size={20} />
                            </Link>
                            <Link href="https://twitter.com" className="text-[var(--accent)] hover:text-[var(--accent-dark)]">
                                <Twitter size={20} />
                            </Link>
                            <Link href="https://facebook.com" className="text-[var(--accent)] hover:text-[var(--accent-dark)]">
                                <Facebook size={20} />
                            </Link>
                        </div>
                    </div>

                    {/* Column 2: Useful Links */}
                    <div>
                        <h5 className="font-semibold mb-4">Useful Links</h5>
                        <ul className="flex flex-col gap-2">
                            <li>
                                <Link href="/about" className="text-[var(--body)] hover:text-[var(--accent)]">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/careers" className="text-[var(--body)] hover:text-[var(--accent)]">
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link href="/join-us" className="text-[var(--body)] hover:text-[var(--accent)]">
                                    Join Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="text-[var(--body)] hover:text-[var(--accent)]">
                                    FAQs
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="text-[var(--body)] hover:text-[var(--accent)]">
                                    Blog
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Legal */}
                    <div>
                        <h5 className="font-semibold mb-4">Legal</h5>
                        <ul className="flex flex-col gap-2">
                            <li>
                                <Link href="/terms" className="text-[var(--body)] hover:text-[var(--accent)]">
                                    Terms & Conditions
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-[var(--body)] hover:text-[var(--accent)]">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/refund-policy" className="text-[var(--body)] hover:text-[var(--accent)]">
                                    Refund Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/shipping" className="text-[var(--body)] hover:text-[var(--accent)]">
                                    Shipping Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/cookies" className="text-[var(--body)] hover:text-[var(--accent)]">
                                    Cookie Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Contact & Newsletter */}
                    <div>
                        <h5 className="font-semibold mb-4">Contact Us</h5>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-start gap-2">
                                <MapPin size={18} className="text-[var(--accent)] mt-1 flex-shrink-0" />
                                <p className="text-sm">LUMS, Sector U, DHA Phase 3, Lahore, Pakistan</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone size={18} className="text-[var(--accent)] flex-shrink-0" />
                                <p className="text-sm">+92 300 123 4567</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail size={18} className="text-[var(--accent)] flex-shrink-0" />
                                <p className="text-sm">support@fleeto.pk</p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h5 className="font-semibold mb-2">Subscribe to our Newsletter</h5>
                            <div className="flex gap-2 mt-2">
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    className="p-2 text-sm border border-[var(--shadow)] rounded-[8px] focus:outline-none focus:border-[var(--accent)] w-full"
                                />
                                <SiteButton
                                    text="Join"
                                    variant="filled"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* App Download Section */}
                <div className="mt-10 border-t border-[var(--shadow)] pt-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <h5 className="font-semibold mb-2">Download the Fleeto App</h5>
                            <p className="text-sm text-[var(--body)]">Get the full experience on your mobile device</p>
                        </div>
                        <div className="flex gap-4">
                            <Link href="https://play.google.com">
                                <Image src="/google-play.png" alt="Google Play" width={135} height={40} />
                            </Link>
                            <Link href="https://apps.apple.com">
                                <Image src="/app-store.png" alt="App Store" width={135} height={40} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright Bar */}
            <div className="w-full max-w-[1440px] py-4">
                <div className="w-full px-4 md:px-8 lg:px-0 lg:w-[var(--section-width)] mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
                    <p className="text-sm text-[var(--body)]">
                        &copy; {currentYear} Fleeto. All rights reserved.
                    </p>
                    <div className="flex gap-4 text-sm">
                        <Link href="/sitemap" className="text-[var(--body)] hover:text-[var(--accent)]">
                            Sitemap
                        </Link>
                        <Link href="/accessibility" className="text-[var(--body)] hover:text-[var(--accent)]">
                            Accessibility
                        </Link>
                        <Link href="/help" className="text-[var(--body)] hover:text-[var(--accent)]">
                            Help Center
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;