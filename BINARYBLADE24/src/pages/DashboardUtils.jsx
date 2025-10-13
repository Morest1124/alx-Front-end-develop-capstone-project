import React from 'react';
import { Link } from '../contexts/Routers';
import * as icons from 'lucide-react';

export const LucideIcon = ({ name, className, size }) => {
  const Icon = icons[name];
  return Icon ? <Icon className={className} size={size} /> : null;
};

export const DashboardCard = ({ title, value, icon, to, bgColor, textColor, children }) => (
    <div className={`p-6 rounded-xl shadow-lg border border-gray-100 ${bgColor}`}>
        <div className="flex justify-between items-start">
            <div className="flex flex-col">
                <p className="text-sm text-gray-500">{title}</p>
                <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
            </div>
            <div className={`p-3 rounded-full ${bgColor-100}`}>
                <LucideIcon name={icon} size={24} className={textColor} />
            </div>
        </div>
        <div className="mt-4">
            {children}
        </div>
        {to && (
            <div className="mt-4">
                <Link to={to} className="text-indigo-600 hover:text-indigo-800 transition">View Details</Link>
            </div>
        )}
    </div>
);