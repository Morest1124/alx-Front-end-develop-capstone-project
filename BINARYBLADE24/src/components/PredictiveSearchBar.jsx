
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PredictiveSearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const navigate = useNavigate();
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
                const response = await axios.get(`http://127.0.0.1:8000/api/users/search/suggest/?q=${query}`);
                setSuggestions(response.data);
            } catch (error) {
                console.error("Error fetching suggestions:", error);
            }
        };

        const delayDebounceFn = setTimeout(() => {
            if (query.length >= 2) fetchSuggestions();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleSearch = (e) => {
        e.preventDefault();
        setShowSuggestions(false);
        if (onSearch) {
            onSearch(query);
        } else {
            navigate(`/find-talent?q=${query}`);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        if (suggestion.type === 'user') {
            // Navigate directly to profile? Or just search for them?
            // Let's search for now to keep it consistent
            setQuery(suggestion.text.split('(')[0].trim());
            setShowSuggestions(false);
            if (onSearch) onSearch(suggestion.text.split('(')[0].trim());
            else navigate(`/find-talent?q=${suggestion.text.split('(')[0].trim()}`);
        } else {
            setQuery(suggestion.text);
            setShowSuggestions(false);
            if (onSearch) onSearch(suggestion.text);
            else navigate(`/find-talent?q=${suggestion.text}`);
        }
    };

    return (
        <div ref={wrapperRef} className="relative w-full max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="relative flex items-center">
                <input
                    type="text"
                    className="w-full px-6 py-4 rounded-full border-2 border-gray-200 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all text-lg shadow-sm"
                    placeholder="Search for skills (e.g. Python, Design)..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                />
                <button
                    type="submit"
                    className="absolute right-2 top-2 bottom-2 bg-green-600 hover:bg-green-700 text-white px-6 rounded-full font-medium transition-colors"
                >
                    Search
                </button>
            </form>

            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                    <ul>
                        {suggestions.map((item, index) => (
                            <li
                                key={index}
                                onClick={() => handleSuggestionClick(item)}
                                className="px-6 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors border-b border-gray-50 last:border-none"
                            >
                                {item.type === 'user' ? (
                                    <span className="bg-blue-100 text-blue-600 p-2 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                ) : (
                                    <span className="bg-green-100 text-green-600 p-2 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                )}
                                <div>
                                    <p className="text-gray-800 font-medium">{item.text}</p>
                                    <p className="text-xs text-gray-500 capitalize">{item.type}</p>
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
