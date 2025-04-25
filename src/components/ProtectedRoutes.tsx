"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => { 
        const checkAuth = async () => {
            // Get user role
            const userRole = localStorage.getItem('role');
            
            // Skip authentication check for public pages
            if (pathname === '/' || pathname === '/login' || pathname === '/signup' || pathname === '/admin/login' || pathname === '/shop/login' || pathname === '/shop/signup' || pathname === '/shop/dashboard' || pathname === '/signupVerify') {
                setIsAuthenticated(true);
                setIsLoading(false);
                return;
            }

            // Handle admin routes
            if (pathname.startsWith('/admin')) {
                if (userRole === 'admin') {
                    setIsAuthenticated(true);
                    setIsLoading(false);
                    return;
                } else {
                    await router.replace('/admin/login');
                    setIsLoading(false);
                    return;
                }
            }

            // Handle vendor/shop routes
            if (pathname.startsWith('/shop')) {
                if (userRole === 'vendor') {
                    setIsAuthenticated(true);
                    setIsLoading(false);
                    return;
                } else {
                    await router.replace('/shop/login');
                    setIsLoading(false);
                    return;
                }
            }

            // Handle user routes
            const token = localStorage.getItem('token');
            if (!token && userRole !== 'admin' && userRole !== 'vendor') {
                await router.replace('/login');
            } else {
                setIsAuthenticated(true);
            }
            
            setIsLoading(false);
        };

        checkAuth();
    }, [router, pathname]);

    // Show loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent)]"></div>
            </div>
        );
    }

    // Return null while redirecting
    if (!isAuthenticated && 
        pathname !== '/login' && 
        pathname !== '/admin/login' &&
        pathname !== '/shop/login') {
        return null;
    }

    // Render children if authenticated or on public page
    return children;
}