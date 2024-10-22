'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon, ChevronDownIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
];

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
  {
    name: 'More',
    items: [
      { name: 'Services', href: '/services' },
      { name: 'Portfolio', href: '/portfolio' },
      { name: 'Blog', href: '/blog' },
    ],
  },
];

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { isSignedIn } = useUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const changeLanguage = (lang: string) => {
    console.log(`Switching to language: ${lang}`);
  };

  return (
    <nav className="bg-gradient-to-r from-sapphire-100 to-sapphire-200 dark:from-sapphire-800 dark:to-sapphire-900 border-b border-sapphire-300 dark:border-sapphire-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-sapphire-800 dark:text-sapphire-100 hover:text-sapphire-600 dark:hover:text-sapphire-300 transition-colors duration-200">MedCheck</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              {navItems.map((item) => 
                item.items ? (
                  <DropdownMenu key={item.name}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="text-sapphire-700 dark:text-sapphire-300 hover:bg-sapphire-200 dark:hover:bg-sapphire-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sapphire-500 focus:ring-offset-2 dark:focus:ring-offset-sapphire-800 transition-all duration-200">
                        {item.name} <ChevronDownIcon className="ml-1 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-sapphire-50 dark:bg-sapphire-800 rounded-md shadow-lg border border-sapphire-200 dark:border-sapphire-600">
                      {item.items.map((subItem) => (
                        <DropdownMenuItem key={subItem.name} className="hover:bg-sapphire-100 dark:hover:bg-sapphire-700 rounded-md focus:bg-sapphire-200 dark:focus:bg-sapphire-600 focus:outline-none">
                          <Link href={subItem.href} className="w-full text-sapphire-700 dark:text-sapphire-300 hover:text-sapphire-900 dark:hover:text-sapphire-100">
                            {subItem.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      pathname === item.href
                        ? 'bg-sapphire-300 text-sapphire-900 dark:bg-sapphire-600 dark:text-sapphire-100'
                        : 'text-sapphire-700 dark:text-sapphire-300 hover:bg-sapphire-200 dark:hover:bg-sapphire-700 hover:text-sapphire-900 dark:hover:text-sapphire-100'
                    } focus:outline-none focus:ring-2 focus:ring-sapphire-500 focus:ring-offset-2 dark:focus:ring-offset-sapphire-800`}
                  >
                    {item.name}
                  </Link>
                )
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-sapphire-100 dark:bg-sapphire-800 text-sapphire-700 dark:text-sapphire-300 border-sapphire-300 dark:border-sapphire-600 hover:bg-sapphire-200 dark:hover:bg-sapphire-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sapphire-500 focus:ring-offset-2 dark:focus:ring-offset-sapphire-800 transition-all duration-200">Language</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-sapphire-50 dark:bg-sapphire-800 rounded-md shadow-lg border border-sapphire-200 dark:border-sapphire-600">
                {languages.map((lang) => (
                  <DropdownMenuItem key={lang.code} onClick={() => changeLanguage(lang.code)} className="hover:bg-sapphire-100 dark:hover:bg-sapphire-700 rounded-md focus:bg-sapphire-200 dark:focus:bg-sapphire-600 focus:outline-none">
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-sapphire-700 dark:text-sapphire-300 hover:bg-sapphire-200 dark:hover:bg-sapphire-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sapphire-500 focus:ring-offset-2 dark:focus:ring-offset-sapphire-800 transition-all duration-200"
            >
              {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </Button>

            {!isSignedIn && (
              <SignInButton mode="modal">
                <Button variant="outline" className="bg-sapphire-100 dark:bg-sapphire-800 text-sapphire-700 dark:text-sapphire-300 border-sapphire-300 dark:border-sapphire-600 hover:bg-sapphire-200 dark:hover:bg-sapphire-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sapphire-500 focus:ring-offset-2 dark:focus:ring-offset-sapphire-800 transition-all duration-200">Sign In</Button>
              </SignInButton>
            )}

            {isSignedIn && (
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10 rounded-full border-2 border-sapphire-300 dark:border-sapphire-600 hover:border-sapphire-500 dark:hover:border-sapphire-400 transition-all duration-200"
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}