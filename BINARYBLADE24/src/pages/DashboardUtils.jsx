import React from 'react';
import { Link } from '../contexts/Routers';
import * as icons from 'lucide-react';

export const LucideIcon = ({ name, className, size }) => {
    const Icon = icons[name];
    return Icon ? <Icon className={className} size={size} /> : null;
};

export const DashboardCard = ({ title, value, icon, to, bgColor, textColor, className = "", children }) => {
    const isActionCard = !title && value === "Post a Job";

    const CardContent = (
        <div className={`p-6 rounded-xl shadow-lg border border-gray-100 transition-all duration-300 ${bgColor} ${className} ${to ? 'hover:shadow-xl cursor-pointer hover:scale-[1.02]' : ''}`}>
            <div className="flex justify-between items-start">
                <div className="flex flex-col">
                    {title && <p className="text-sm text-gray-500 mb-1">{title}</p>}
                    <p className={`text-2xl lg:text-3xl font-bold ${textColor}`}>{value}</p>
                </div>
                <div className={`p-3 rounded-full bg-black/5`}>
                    <LucideIcon name={icon} size={24} className={textColor} />
                </div>
            </div>
            <div className="mt-4">
                {children}
            </div>
            {to && !isActionCard && (
                <div className="mt-4">
                    <span className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition font-medium text-sm">View Details →</span>
                </div>
            )}
        </div>
    );

    if (to) {
        return (
            <Link to={to} className="block no-underline !p-0 !bg-transparent !border-0 text-left">
                {CardContent}
            </Link>
        );
    }

    return CardContent;
};