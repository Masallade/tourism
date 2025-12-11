import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    // Explicitly save to localStorage to ensure persistence
    localStorage.setItem('i18nextLng', langCode);
    setIsOpen(false);
    // All languages are LTR, so always set to ltr
    document.documentElement.setAttribute('dir', 'ltr');
    // Reload the app to ensure all translations are applied
    window.location.reload();
  };

  // Calculate dropdown position when opened
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: buttonRect.bottom + window.scrollY + 8,
        right: window.innerWidth - buttonRect.right + window.scrollX,
      });
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        buttonRef.current && 
        !buttonRef.current.contains(event.target) &&
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Set initial direction (all languages are LTR)
  useEffect(() => {
    document.documentElement.setAttribute('dir', 'ltr');
  }, [i18n.language]);

  const dropdownContent = isOpen && (
    <div 
      ref={dropdownRef}
      className="fixed w-48 bg-white rounded-xl shadow-2xl border border-green-200" 
      style={{ 
        zIndex: 10000,
        top: `${dropdownPosition.top}px`,
        right: `${dropdownPosition.right}px`,
      }}
    >
      <div>
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-green-50 transition-colors first:rounded-t-xl last:rounded-b-xl ${
              i18n.language === lang.code ? 'bg-green-50 text-green-700 font-semibold' : 'text-gray-700'
            }`}
          >
            <span className="text-xl flex-shrink-0">{lang.flag}</span>
            <span className="flex-1 text-left">{lang.name}</span>
            {i18n.language === lang.code && (
              <svg className="w-4 h-4 ml-auto text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-green-700 hover:text-green-500 font-medium transition-all duration-200 hover:bg-green-50 rounded-lg text-sm border border-transparent hover:border-green-200"
        aria-label="Change language"
        aria-expanded={isOpen}
      >
        <span className="text-lg flex-shrink-0">{currentLanguage.flag}</span>
        <span className="hidden sm:inline">{currentLanguage.code.toUpperCase()}</span>
        <svg
          className={`w-4 h-4 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {typeof document !== 'undefined' && createPortal(dropdownContent, document.body)}
    </div>
  );
};

export default LanguageSwitcher;

