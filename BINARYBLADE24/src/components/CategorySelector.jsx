/**
 * CategorySelector Component - 3-Level Hierarchical Selection
 * 
 * Matches the user's exact 3-column design but fetches data from backend.
 * 
 * Structure:
 * - Column 1: Main Categories (Area of Expertise)
 * - Column 2: Subcategories (Specific Role)
 * - Column 3: Items (Key Tasks)
 * 
 * Usage:
 * <CategorySelector 
 *   selectedPath={selectedPath}
 *   onSelect={(mainName, subName, subId) => {...}}
 * />
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { getCategories } from '../api';

// Custom CSS for the component
const customStyles = `
    .category-scroll::-webkit-scrollbar {
        width: 4px;
    }
    .category-scroll::-webkit-scrollbar-thumb {
        background-color: #e5e7eb; /* gray-200 */
        border-radius: 2px;
    }
    .dropdown-shadow {
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
`;

const CategorySelector = ({ selectedPath = '', onSelect, label = 'Select Category' }) => {
    // State management for the dropdown UI
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [categoriesData, setCategoriesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredMainIndex, setHoveredMainIndex] = useState(null);
    const [hoveredSubIndex, setHoveredSubIndex] = useState(null);

    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    // Fetch categories from backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await getCategories();
                setCategoriesData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // --- Interaction Handlers ---

    const toggleDropdown = useCallback(() => {
        setIsDropdownOpen(prev => !prev);
        // Reset hover state when closing
        if (isDropdownOpen) {
            setHoveredMainIndex(null);
            setHoveredSubIndex(null);
        }
    }, [isDropdownOpen]);

    const handleMainHover = (index) => {
        setHoveredMainIndex(index);
        setHoveredSubIndex(null);
    };

    const handleSubHover = (subIndex) => {
        setHoveredSubIndex(subIndex);
    };

    const handleFinalSelect = (mainName, subName, subId) => {
        const fullPath = `${mainName} / ${subName}`;
        onSelect && onSelect(mainName, subName, subId);
        toggleDropdown();
    };

    // --- Rendering Logic ---

    // 1. Get current subcategories based on hover
    const currentMainCategory = categoriesData[hoveredMainIndex] || null;
    const subcategories = currentMainCategory ? currentMainCategory.subcategories : [];

    // 2. Get current items based on hover
    const currentSubCategory = (hoveredMainIndex !== null && hoveredSubIndex !== null)
        ? categoriesData[hoveredMainIndex].subcategories[hoveredSubIndex]
        : null;
    const items = currentSubCategory ? (currentSubCategory.items || []) : [];

    // --- Effects ---

    // Effect to handle outside click to close the dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                isDropdownOpen &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                toggleDropdown();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen, toggleDropdown]);

    // Set initial hover state to the first category on open
    useEffect(() => {
        if (isDropdownOpen && hoveredMainIndex === null && categoriesData.length > 0) {
            setHoveredMainIndex(0);
        }
    }, [isDropdownOpen, hoveredMainIndex, categoriesData]);

    if (loading) {
        return (
            <div className="relative inline-block w-full">
                <div className="w-full text-left py-3 px-4 border border-gray-300 bg-gray-50 rounded-lg text-gray-500">
                    Loading categories...
                </div>
            </div>
        );
    }

    return (
        <>
            <style>{customStyles}</style>

            {/* Category Selector Input */}
            <div className="relative inline-block w-full">
                <button
                    ref={buttonRef}
                    className="w-full text-left py-3 px-4 border border-gray-300 bg-white rounded-lg text-gray-700 hover:border-sky-600500 focus:outline-none focus:ring-2 focus:ring-sky-600500 transition duration-150 flex justify-between items-center"
                    aria-haspopup="true"
                    aria-expanded={isDropdownOpen}
                    onClick={toggleDropdown}
                    type="button">
                    <span>
                        {selectedPath || label}
                    </span>
                    <svg className="w-4 h-4 ml-2 -mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>

                {/* Dropdown Menu Container */}
                <div
                    ref={dropdownRef}
                    className={`${isDropdownOpen ? 'block' : 'hidden'} absolute z-10 mt-2 w-full md:w-[600px] bg-white rounded-xl shadow-xl dropdown-shadow border border-gray-200 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100 transition-all duration-300 origin-top-left`}
                    role="menu"
                    aria-orientation="horizontal">

                    {/* Column 1: Main Categories */}
                    <div className="p-2 category-scroll max-h-96 overflow-y-auto">
                        <h3 className="text-xs font-bold uppercase text-sky-600 px-2 py-1 mb-1">Area of Expertise</h3>
                        <div>
                            {categoriesData.map((category, index) => (
                                <button
                                    key={category.id}
                                    className={`w-full text-left p-2 rounded-md transition duration-150 focus:outline-none text-gray-700 ${hoveredMainIndex === index ? 'bg-sky-600100 text-sky-600800' : 'hover:bg-sky-60050 hover:text-sky-600700'}`}
                                    onMouseEnter={() => handleMainHover(index)}
                                    onClick={() => handleMainHover(index)}
                                    role="menuitem"
                                    type="button">
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Subcategories */}
                    <div className="p-2 category-scroll max-h-96 overflow-y-auto bg-gray-50 md:bg-white">
                        <h3 className="text-xs font-bold uppercase text-sky-600 px-2 py-1 mb-1">Specific Role</h3>
                        <div>
                            {subcategories.length > 0 ? (
                                subcategories.map((sub, index) => (
                                    <button
                                        key={sub.id}
                                        className={`w-full text-left p-2 rounded-md transition duration-150 focus:outline-none text-gray-700 ${hoveredSubIndex === index ? 'bg-sky-60050 text-sky-600700' : 'hover:bg-sky-600100 hover:text-sky-600800'}`}
                                        onMouseEnter={() => handleSubHover(index)}
                                        onClick={() => handleFinalSelect(currentMainCategory.name, sub.name, sub.id)}
                                        role="menuitem"
                                        type="button">
                                        {sub.name}
                                    </button>
                                ))
                            ) : (
                                <p className="text-gray-400 p-2 text-sm">Hover over an Area of Expertise to see roles.</p>
                            )}
                        </div>
                    </div>

                    {/* Column 3: Items (Key Tasks) */}
                    <div className="p-2 category-scroll max-h-96 overflow-y-auto bg-gray-100 md:bg-gray-50">
                        <h3 className="text-xs font-bold uppercase text-sky-600 px-2 py-1 mb-1">Key Tasks</h3>
                        <div>
                            {items.length > 0 ? (
                                items.map((item, index) => (
                                    <div key={index} className="text-sm p-2 rounded-md text-gray-600 hover:text-gray-900 transition duration-150">
                                        <span className="text-sky-600500 mr-2">•</span>{item}
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400 p-2 text-sm">Select a Specific Role to see key tasks.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CategorySelector;
