import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar } from 'lucide-react';

const MilestoneManager = ({ milestones, setMilestones, totalBudget }) => {
    const [newMilestone, setNewMilestone] = useState({
        title: '',
        description: '',
        amount: '',
        due_date: ''
    });

    const handleAddMilestone = () => {
        if (!newMilestone.title || !newMilestone.amount || !newMilestone.due_date) return;

        setMilestones([...milestones, { ...newMilestone, id: Date.now() }]);
        setNewMilestone({ title: '', description: '', amount: '', due_date: '' });
    };

    const handleRemoveMilestone = (id) => {
        setMilestones(milestones.filter(m => m.id !== id));
    };

    const totalMilestoneAmount = milestones.reduce((sum, m) => sum + parseFloat(m.amount || 0), 0);
    const remainingBudget = totalBudget - totalMilestoneAmount;

    return (
        <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900">Project Milestones</h3>
            <p className="text-sm text-gray-500">Break down your project into payable milestones.</p>

            {/* List of Milestones */}
            <div className="space-y-3">
                {milestones.map((milestone, index) => (
                    <div key={milestone.id} className="flex items-center justify-between bg-white p-3 rounded shadow-sm">
                        <div className="flex-1">
                            <h4 className="font-medium text-gray-800">{index + 1}. {milestone.title}</h4>
                            <p className="text-sm text-gray-600">{milestone.description}</p>
                            <div className="flex items-center text-xs text-gray-500 mt-1 space-x-3">
                                <span className="flex items-center"><Calendar size={12} className="mr-1" /> {milestone.due_date}</span>
                                <span className="font-semibold text-indigo-600">${milestone.amount}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => handleRemoveMilestone(milestone.id)}
                            className="text-red-500 hover:text-red-700 p-2"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Add New Milestone Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 bg-white p-3 rounded border">
                <input
                    type="text"
                    placeholder="Milestone Title"
                    className="border p-2 rounded w-full"
                    value={newMilestone.title}
                    onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Amount ($)"
                    className="border p-2 rounded w-full"
                    value={newMilestone.amount}
                    onChange={(e) => setNewMilestone({ ...newMilestone, amount: e.target.value })}
                />
                <input
                    type="date"
                    className="border p-2 rounded w-full"
                    value={newMilestone.due_date}
                    onChange={(e) => setNewMilestone({ ...newMilestone, due_date: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Description (Optional)"
                    className="border p-2 rounded w-full"
                    value={newMilestone.description}
                    onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                />
                <button
                    type="button"
                    onClick={handleAddMilestone}
                    className="col-span-1 md:col-span-2 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 flex items-center justify-center"
                >
                    <Plus size={16} className="mr-2" /> Add Milestone
                </button>
            </div>

            {/* Budget Summary */}
            <div className="flex justify-between items-center text-sm font-medium pt-2 border-t">
                <span>Total Budget: ${totalBudget}</span>
                <span className={remainingBudget < 0 ? "text-red-600" : "text-green-600"}>
                    Remaining: ${remainingBudget.toFixed(2)}
                </span>
            </div>
        </div>
    );
};

export default MilestoneManager;
