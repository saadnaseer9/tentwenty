'use client'

import { useState, useEffect } from 'react'
import { Menu } from 'lucide-react'

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* Mobile View: Contact Button (left) */}
          <div className="md:hidden">
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors duration-200">
              <span className="text-gray-700 font-medium">Contact us</span>
              <svg
                className="w-4 h-4 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Desktop View: Center Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="nav-link">About</a>
            <a href="#" className="nav-link">News</a>
            <a href="#" className="nav-link">Services</a>
            <a href="#" className="nav-link">Our Team</a>
            <a href="#" className="nav-link">Make Enquiry</a>
          </div>

          {/* Right Side (always visible): */}
          <div className="flex items-center space-x-4">
            {/* Hamburger only on mobile */}
            <div className="md:hidden">
              <button>
                <Menu className="h-6 w-6 text-gray-700" />
              </button>
            </div>

            {/* Contact button only on desktop */}
            <div className="hidden md:block">
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors duration-200">
                <span className="text-gray-700 font-medium">Contact us</span>
                <svg
                  className="w-4 h-4 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
