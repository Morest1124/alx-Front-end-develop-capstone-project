import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getSearchSuggestions } from '../api';

const PredictiveSearchBar = ({
    onSearch,
    placeholder,
    allowedTypes = ['user', 'project', 'category']
}) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const navigate = useNavigate();
    const location = useLocation(); // Better than window.location
    const wrapperRef = useRef(null);

    // Close suggestions when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    // Debounce fetch suggestions
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.length < 2) {
                setSuggestions([]);
                return;
            }
            try {
                const response = await getSearchSuggestions(query);
                // Filter suggestions based on allowedTypes
                const filtered = response.data.filter(item => allowedTypes.includes(item.type));
                setSuggestions(filtered);
                setShowSuggestions(true); // Ensure it opens when data arrives
            } catch (error) {
                console.error("Error fetching suggestions:", error);
            }
        };

        const delayDebounceFn = setTimeout(() => {
            if (query.length >= 2) fetchSuggestions();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query, allowedTypes]);

    const handleSearch = (e) => {
        e.preventDefault();
        setShowSuggestions(false);
        if (onSearch) {
            onSearch(query);
        } else {
            // Default fallback navigation
            navigate(`/find-work?search=${query}`);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion.text);
        setShowSuggestions(false);

        // 1. If it's a Project, always go straight to details (it's a specific resource)
        if (suggestion.type === 'project') {
            navigate(`/projects/${suggestion.id}`);
            return;
        }

        // 2. If it's a Freelancer (User) or Category
        // If the parent component provided an onSearch handler (like FindTalent/FindWork), use it.
        // This keeps the user on the current page ("silently reload") instead of navigating away.
        if (onSearch) {
            onSearch(suggestion.text);
            return;
        }

        // Fallback Navigation if no handler provided
        if (suggestion.type === 'user') {
            // Since /profile/:id doesn't exist yet, go to Find Talent with search
            navigate(`/find-talent?q=${suggestion.text}`);
            return;
        }

        if (suggestion.type === 'category') {
            navigate(`/find-work?search=${suggestion.text}`);
            return;
        }
    };

    const getIconForType = (type) => {
        switch (type) {
            case 'user':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                );
            case 'project':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                );
            case 'category':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                );
            default:
                return <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>;
        }
    };

    const getColorForType = (type) => {
        switch (type) {
            case 'user': return 'bg-blue-100 text-blue-600';
            case 'project': return 'bg-purple-100 text-purple-600';
            case 'category': return 'bg-orange-100 text-orange-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div ref={wrapperRef} className="relative w-full max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="relative flex items-center group">
                <input
                    type="text"
                    className="w-full px-6 py-4 rounded-full border-2 border-[var(--color-border)] focus:border-[var(--color-accent)] focus:ring-4 focus:ring-[var(--color-accent-light)] focus:outline-none transition-all text-lg shadow-sm placeholder-gray-400"
                    placeholder={placeholder || "Search freelancers, projects..."}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setShowSuggestions(true)}
                />

                {/* Search Button (Inside Input) */}
                <button
                    type="submit"
                    className="absolute right-2 top-2 bottom-2 px-6 rounded-full font-medium text-white transition-transform active:scale-95 bg-[var(--color-accent)] hover:opacity-90"
                >
                    Search
                </button>
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden ring-1 ring-black ring-opacity-5">
                    <ul>
                        {suggestions.map((item, index) => (
                            <li
                                key={`${item.type}-${item.id}-${index}`}
                                onClick={() => handleSuggestionClick(item)}
                                className="px-5 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-4 transition-colors border-b border-gray-50 last:border-none group"
                            >
                                <span className={`p-2 rounded-full ${getColorForType(item.type)}`}>
                                    {getIconForType(item.type)}
                                </span>
                                <div className="flex-1">
                                    <p className="text-gray-800 font-medium group-hover:text-[var(--color-accent)] transition-colors">
                                        {item.text}
                                    </p>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mt-0.5">
                                        {item.type === 'user' ? 'Freelancer' : item.type}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default PredictiveSearchBar;