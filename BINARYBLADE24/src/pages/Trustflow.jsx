import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import {
    getEscrowContracts,
    fundMilestone,
    submitEscrowWork,
    requestEscrowRevision,
    releaseEscrow,
    getUserProfile,
    createEscrowContract,
    sendMessage,
    getConversations,
    getMessages
} from '../api';
import {
    MessageSquare,
    Wallet,
    Briefcase,
    Send,
    CheckCircle,
    ShieldCheck,
    DollarSign,
    Share2,
    ExternalLink,
    FileText,
    Link as LinkIcon,
    Eye,
    Paperclip,
    File as FileIcon,
    X,
    UploadCloud,
    Lock,
    Unlock,
    ChevronRight,
    AlertTriangle,
    RotateCcw,
    RefreshCcw
} from 'lucide-react';

const PLATFORM_FEE_PERCENT = 0.10;

const Trustflow = () => {
    const { user } = useContext(AuthContext);
    const [contracts, setContracts] = useState([]);
    const [messages, setMessages] = useState([]);
    const [wallets, setWallets] = useState({ client: 0, freelancer: 0, escrow: 0, platform: 0 });
    const [submissionModal, setSubmissionModal] = useState(null);
    const [viewSubmission, setViewSubmission] = useState(null);
    const [revisionModal, setRevisionModal] = useState(null);
    const [copySuccess, setCopySuccess] = useState(false);
    const [cancelConfirm, setCancelConfirm] = useState(null);
    const [loading, setLoading] = useState(true);

    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);
    const chatEndRef = useRef(null);

    const currentUserRole = user.role?.toLowerCase() || 'client';

    useEffect(() => {
        fetchData();
    }, [user]);

    const fetchData = async () => {
        if (!user.userId) return;
        setLoading(true);
        try {
            const [contractsData, profileData] = await Promise.all([
                getEscrowContracts(),
                getUserProfile(user.userId)
            ]);
            setContracts(contractsData);

            // Calculate wallets based on current user profile and escrow totals
            const balance = parseFloat(profileData.profile?.wallet_balance || 0);
            const escrowTotal = contractsData.reduce((acc, con) => {
                return acc + con.milestones.reduce((mAcc, m) => (m.status === 'funded' || m.status === 'submitted') ? mAcc + parseFloat(m.amount) : mAcc, 0);
            }, 0);

            setWallets({
                client: currentUserRole === 'client' ? balance : 0,
                freelancer: currentUserRole === 'freelancer' ? balance : 0,
                escrow: escrowTotal,
                platform: 0 // In a real system this would come from an admin API
            });
        } catch (err) {
            console.error("Error fetching trustflow data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const addMessage = async (sender, text, attachment = null) => {
        // This is a simplified mock for the project-specific project room
        const newMessage = {
            id: Date.now(),
            sender,
            uid: user.userId,
            text,
            attachment,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, newMessage]);
    };

    const handleFileUpload = async (files) => {
        if (!files || files.length === 0) return;
        setIsUploading(true);

        setTimeout(async () => {
            const file = files[0];
            const mockUrl = `https://binaryblade-storage.cdn/files/${Math.random().toString(36).substring(7)}/${file.name}`;

            await addMessage(currentUserRole, `Sent a file: ${file.name}`, {
                name: file.name,
                size: (file.size / 1024).toFixed(1) + ' KB',
                url: mockUrl
            });

            setIsUploading(false);
            setIsDragging(false);
        }, 1200);
    };

    const sendProjectOffer = async (title, budget) => {
        try {
            const amount = parseFloat(budget);
            // This is a simplification; in real app you'd select a freelancer
            const newContract = await createEscrowContract({
                title,
                total_budget: amount,
                freelancer: 1, // Mock freelancer ID
                client: user.userId,
                status: 'pending'
            });
            await addMessage('system', `New project proposal: ${title} for $${budget}`);
            fetchData();
        } catch (err) {
            console.error("Error creating contract:", err);
        }
    };

    const handleFundMilestone = async (contractId, mIdx) => {
        const contract = contracts.find(c => c.id === contractId);
        const milestone = contract.milestones[mIdx];
        try {
            await fundMilestone(contractId, milestone.id);
            await addMessage('system', `Escrow Guard: $${milestone.amount} has been secured for Milestone ${mIdx + 1}. Freelancer may begin work.`);
            fetchData();
        } catch (err) {
            alert(err.message || "Funding failed");
        }
    };

    const handleReleaseFunds = async (contractId, mIdx) => {
        const contract = contracts.find(c => c.id === contractId);
        const milestone = contract.milestones[mIdx];
        try {
            const response = await releaseEscrow(contractId, milestone.id);
            await addMessage('system', `Escrow Released: $${response.net_paid} credited to specialist. Platform fee collected.`);
            fetchData();
        } catch (err) {
            alert(err.message || "Release failed");
        }
    };

    const handleRequestRevision = async (contractId, mIdx, feedback) => {
        const contract = contracts.find(c => c.id === contractId);
        const milestone = contract.milestones[mIdx];
        try {
            await requestEscrowRevision(contractId, milestone.id, feedback);
            setRevisionModal(null);
            setViewSubmission(null);
            await addMessage('client', `Revision Requested for Milestone ${mIdx + 1}: ${feedback}`);
            await addMessage('system', `Escrow remains locked. Milestone ${mIdx + 1} status reverted to "Active" for re-submission.`);
            fetchData();
        } catch (err) {
            alert(err.message || "Revision request failed");
        }
    };

    const handleSubmitWork = async (contractId, mIdx, note, url) => {
        const contract = contracts.find(c => c.id === contractId);
        const milestone = contract.milestones[mIdx];
        try {
            await submitEscrowWork(contractId, milestone.id, note, url);
            setSubmissionModal(null);
            await addMessage('freelancer', `Official delivery submitted for Milestone ${mIdx + 1}. Awaiting client approval to release escrowed funds.`);
            fetchData();
        } catch (err) {
            alert(err.message || "Submission failed");
        }
    };

    if (loading) return <div className="h-screen bg-slate-950 flex flex-col items-center justify-center text-green-500 font-mono"><div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>SECURE_HANDSHAKE_INIT...</div>;

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-100">

            {/* CANCELLATION MODAL */}
            {cancelConfirm && (
                <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full p-8 animate-in zoom-in duration-150">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
                                <AlertTriangle size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black tracking-tight">Cancel Project?</h3>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Escrow Protection Protocol</p>
                            </div>
                        </div>
                        <p className="text-slate-600 text-sm font-medium leading-relaxed mb-8">
                            This will stop the project immediately. Any funds currently held in <span className="text-orange-600 font-black">Escrow</span> for this project will be returned to the Employer.
                        </p>
                        <div className="flex gap-4">
                            <button onClick={() => setCancelConfirm(null)} className="flex-1 py-4 font-black text-xs uppercase tracking-widest bg-slate-100 rounded-2xl hover:bg-slate-200 transition">Go Back</button>
                            <button onClick={() => setCancelConfirm(null)} className="flex-1 py-4 font-black text-xs uppercase tracking-widest bg-red-600 text-white rounded-2xl hover:bg-red-700 shadow-xl shadow-red-100 transition">Confirm Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* REVISION MODAL */}
            {revisionModal && (
                <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full p-8 animate-in zoom-in duration-150">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600"><RefreshCcw size={24} /></div>
                            <div>
                                <h3 className="text-xl font-black tracking-tight">Request Revision</h3>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Milestone: {revisionModal.m.description}</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1">What needs fixing?</label>
                                <textarea id="rev-note" className="w-full h-40 p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:border-orange-400 outline-none transition font-bold text-sm" placeholder="Be specific about the changes required..."></textarea>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8">
                            <button onClick={() => setRevisionModal(null)} className="flex-1 py-4 font-black text-xs uppercase tracking-widest bg-slate-100 rounded-2xl hover:bg-slate-200 transition">Back to Review</button>
                            <button onClick={() => handleRequestRevision(revisionModal.cId, revisionModal.idx, document.getElementById('rev-note').value)} className="flex-1 py-4 font-black text-xs uppercase tracking-widest bg-orange-600 text-white rounded-2xl hover:bg-orange-700 shadow-xl shadow-orange-100 transition">Send Request</button>
                        </div>
                    </div>
                </div>
            )}

            {/* DELIVERY MODALS */}
            {submissionModal && (
                <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full p-8 animate-in zoom-in duration-150">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100"><UploadCloud size={24} /></div>
                            <div>
                                <h3 className="text-xl font-black tracking-tight">Final Delivery</h3>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Formal Escrow Settlement</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1">Asset Link (Secure Cloud)</label>
                                <div className="relative">
                                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input id="sub-url" type="url" placeholder="Paste delivery URL here..." className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none transition font-bold text-sm" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1">Message to Employer</label>
                                <textarea id="sub-note" className="w-full h-32 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none transition font-bold text-sm" placeholder="Summarize the work completed..."></textarea>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8">
                            <button onClick={() => setSubmissionModal(null)} className="flex-1 py-4 font-black text-xs uppercase tracking-widest bg-slate-100 rounded-2xl hover:bg-slate-200 transition">Cancel</button>
                            <button onClick={() => handleSubmitWork(submissionModal.cId, submissionModal.mIdx, document.getElementById('sub-note').value, document.getElementById('sub-url').value)} className="flex-1 py-4 font-black text-xs uppercase tracking-widest bg-blue-600 text-white rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-100 transition">Submit Work</button>
                        </div>
                    </div>
                </div>
            )}

            {viewSubmission && (
                <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full p-8 animate-in slide-in-from-bottom-8 duration-200">
                        <div className="flex justify-between items-start mb-8 border-b pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600"><CheckCircle size={20} /></div>
                                <div>
                                    <h3 className="text-xl font-black tracking-tight">Review Work</h3>
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Escrow Hold: ${viewSubmission.m.amount}</p>
                                </div>
                            </div>
                            <button onClick={() => setViewSubmission(null)} className="p-2 hover:bg-slate-100 rounded-full transition"><X size={20} /></button>
                        </div>

                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 mb-6 overflow-y-auto max-h-40">
                            <p className="text-sm text-slate-600 leading-relaxed font-medium italic">"{viewSubmission.m.deliveryNote || 'No notes provided.'}"</p>
                        </div>

                        {viewSubmission.m.deliveryUrl && (
                            <a href={viewSubmission.m.deliveryUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-5 bg-blue-50 border-2 border-blue-100 rounded-3xl text-blue-700 font-black text-xs uppercase tracking-widest mb-8 hover:bg-blue-100 transition group">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <FileText size={20} className="shrink-0" />
                                    <span className="truncate">{viewSubmission.m.deliveryUrl}</span>
                                </div>
                                <ExternalLink size={18} className="shrink-0 group-hover:translate-x-1 transition-transform" />
                            </a>
                        )}

                        {currentUserRole === 'client' ? (
                            <div className="flex flex-col gap-3">
                                <div className="flex gap-4">
                                    <button onClick={() => setRevisionModal(viewSubmission)} className="flex-1 py-4 font-black text-xs uppercase tracking-widest bg-orange-50 text-orange-600 border-2 border-orange-100 rounded-2xl hover:bg-orange-100 transition flex items-center justify-center gap-2"><RefreshCcw size={14} /> Request Revisions</button>
                                    <button onClick={() => { handleReleaseFunds(viewSubmission.cId, viewSubmission.idx); setViewSubmission(null); }} className="flex-1 py-4 font-black text-xs uppercase tracking-widest bg-green-600 text-white rounded-2xl shadow-xl shadow-green-100 hover:bg-green-700 transition">Release Funds</button>
                                </div>
                                <p className="text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">Releasing funds confirms project completion</p>
                            </div>
                        ) : (
                            <button onClick={() => setViewSubmission(null)} className="w-full py-4 font-black text-xs uppercase tracking-widest bg-slate-900 text-white rounded-2xl">Close Preview</button>
                        )}
                    </div>
                </div>
            )}

            {/* TOP NAV is excluded here as it should be part of the main layout, but kept for standalone feel if needed */}
            <nav className="bg-white border-b sticky top-0 z-40 px-6">
                <div className="max-w-7xl mx-auto h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-xl">
                            <ShieldCheck className="text-green-500" size={24} />
                        </div>
                        <h1 className="font-black text-xl tracking-tighter">TRUSTFLOW</h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-2xl">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Mode:</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">{currentUserRole}</span>
                        </div>
                        <button
                            onClick={handleShare}
                            className={`p-3 rounded-xl border transition-all ${copySuccess ? 'bg-green-50 border-green-200 text-green-600' : 'bg-white hover:bg-slate-50 text-slate-400 shadow-sm'}`}
                        >
                            {copySuccess ? <CheckCircle size={18} /> : <Share2 size={18} />}
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-12 gap-8">

                {/* LEFT PANEL: WALLETS & CONTRACTS */}
                <div className="col-span-12 lg:col-span-8 space-y-8">

                    {/* STATS TILES */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm relative overflow-hidden group">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 relative z-10">Available Funds</p>
                            <p className="text-3xl font-black tracking-tighter relative z-10">${(currentUserRole === 'client' ? wallets.client : wallets.freelancer).toLocaleString()}</p>
                            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-slate-400">
                                <Wallet size={12} />
                                {currentUserRole === 'client' ? 'Ready to Escrow' : 'Withdrawable'}
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm relative overflow-hidden group">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-50 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 relative z-10">In Escrow</p>
                            <p className="text-3xl font-black tracking-tighter text-orange-600 relative z-10">${wallets.escrow.toLocaleString()}</p>
                            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-orange-400">
                                <Lock size={12} />
                                Locked Protection
                            </div>
                        </div>
                        <div className="bg-slate-900 p-6 rounded-[2rem] shadow-xl relative overflow-hidden">
                            <div className="absolute right-0 top-0 w-32 h-32 bg-green-500/5 blur-3xl rounded-full"></div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Platform Revenue</p>
                            <p className="text-3xl font-black tracking-tighter text-white">${wallets.platform.toLocaleString()}</p>
                            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-green-500/60">
                                <ShieldCheck size={12} />
                                Trust Fees
                            </div>
                        </div>
                    </div>

                    {/* PROJECT CREATOR */}
                    {currentUserRole === 'client' && (
                        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-dashed border-slate-200 hover:border-blue-300 transition-all shadow-sm">
                            <h3 className="font-black text-lg flex items-center gap-2 tracking-tight mb-6"><DollarSign className="text-blue-600" size={20} /> Deploy New Contract</h3>
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                <div className="md:col-span-7">
                                    <input id="j-title" placeholder="e.g. 3D Model Character Design" className="w-full bg-slate-50 px-6 py-4 rounded-2xl border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none font-bold text-sm transition-all" />
                                </div>
                                <div className="md:col-span-3">
                                    <input id="j-budget" type="number" placeholder="Budget ($)" className="w-full bg-slate-50 px-6 py-4 rounded-2xl border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none font-bold text-sm transition-all" />
                                </div>
                                <div className="md:col-span-2">
                                    <button onClick={() => {
                                        const t = document.getElementById('j-title').value;
                                        const b = document.getElementById('j-budget').value;
                                        if (t && b) { sendProjectOffer(t, parseFloat(b)); document.getElementById('j-title').value = ''; document.getElementById('j-budget').value = ''; }
                                    }} className="w-full h-full bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center">
                                        <ChevronRight size={24} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ESCROW CONTRACT LIST */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 px-2">
                            <h2 className="font-black text-xs uppercase tracking-[0.3em] text-slate-400">Active Escrow Contracts</h2>
                            <div className="h-px bg-slate-200 flex-1"></div>
                        </div>

                        {contracts.length === 0 && (
                            <div className="text-center py-24 bg-white rounded-[3rem] border border-slate-200/60 shadow-sm border-b-4 border-b-slate-200">
                                <Briefcase size={32} className="mx-auto mb-4 text-slate-200" />
                                <p className="text-slate-400 font-black text-xs uppercase tracking-widest">No contracts deployed to the ledger</p>
                            </div>
                        )}

                        {contracts.map(con => (
                            <div key={con.id} className={`bg-white rounded-[2.5rem] border shadow-sm overflow-hidden border-b-4 transition-all ${con.status === 'cancelled' ? 'opacity-50 border-slate-200' : 'border-slate-200/60 hover:border-blue-200'}`}>
                                <div className="p-8 flex flex-col md:flex-row md:items-center justify-between bg-slate-50/40 border-b gap-4">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-900 shadow-sm">
                                            <div className="text-center">
                                                <p className="text-[8px] font-black text-slate-400">ID</p>
                                                <p className="text-sm font-black">{con.id}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-black tracking-tight leading-none mb-2">{con.title}</h4>
                                            <div className="flex gap-2">
                                                <span className={`text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider ${con.status === 'completed' ? 'bg-green-100 text-green-700' : con.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{con.status}</span>
                                                {con.status !== 'cancelled' && <span className="text-[9px] font-black px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 uppercase tracking-wider">Escrow Guard Active</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Contract Total</p>
                                            <p className="text-3xl font-black tracking-tighter">${parseFloat(con.total_budget).toLocaleString()}</p>
                                        </div>
                                        {con.status !== 'completed' && con.status !== 'cancelled' && (
                                            <button
                                                onClick={() => setCancelConfirm(con.id)}
                                                className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                title="Cancel Project"
                                            >
                                                <RotateCcw size={20} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="p-8 space-y-4">
                                    {(con.milestones || []).map((m, idx) => (
                                        <div key={m.id || idx} className={`p-5 rounded-[2rem] border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${m.status === 'released' ? 'bg-slate-50 border-transparent opacity-60' : con.status === 'cancelled' ? 'bg-slate-50 border-transparent opacity-40' : 'bg-white border-slate-100 hover:border-blue-100 hover:shadow-lg'}`}>
                                            <div className="flex items-center gap-5">
                                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs shadow-sm ${m.status === 'released' ? 'bg-blue-600 text-white' : m.status === 'funded' ? 'bg-green-600 text-white' : 'bg-white border-2 border-slate-100 text-slate-400'}`}>
                                                    {m.status === 'released' ? <Unlock size={18} /> : m.status === 'funded' ? <Lock size={18} /> : idx + 1}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black tracking-tight">{m.description}</p>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">${parseFloat(m.amount).toLocaleString()} Allocation</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                {con.status !== 'cancelled' && (
                                                    <>
                                                        {/* EMPLOYER ACTIONS */}
                                                        {currentUserRole === 'client' && m.status === 'pending' && (
                                                            <button onClick={() => handleFundMilestone(con.id, idx)} className="bg-slate-900 text-white text-[10px] font-black px-6 py-3 rounded-xl hover:bg-blue-600 transition-all shadow-lg active:scale-95 uppercase tracking-[0.2em]">Fund into Escrow</button>
                                                        )}
                                                        {m.status === 'submitted' && (
                                                            <button onClick={() => setViewSubmission({ m, cId: con.id, idx })} className="bg-blue-600 text-white text-[10px] font-black px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-all animate-pulse uppercase tracking-[0.2em] shadow-xl"><Eye size={16} /> View Delivery</button>
                                                        )}

                                                        {/* FREELANCER ACTIONS */}
                                                        {currentUserRole === 'freelancer' && m.status === 'funded' && (
                                                            <button onClick={() => setSubmissionModal({ cId: con.id, mIdx: idx })} className="bg-blue-600 text-white text-[10px] font-black px-6 py-3 rounded-xl hover:bg-blue-700 transition-all shadow-xl active:scale-95 uppercase tracking-[0.2em] flex items-center gap-2"><UploadCloud size={16} /> Ship Work</button>
                                                        )}
                                                    </>
                                                )}

                                                {/* GLOBAL STATUSES */}
                                                {m.status === 'released' && <span className="text-[9px] font-black text-blue-600 bg-white border border-blue-100 px-4 py-2.5 rounded-xl uppercase tracking-[0.2em]">Escrow Settled</span>}
                                                {con.status === 'cancelled' && <span className="text-[9px] font-black text-red-600 bg-red-50 px-4 py-2.5 rounded-xl uppercase tracking-[0.2em]">Project Nullified</span>}
                                                {con.status !== 'cancelled' && (
                                                    <>
                                                        {m.status === 'funded' && currentUserRole === 'client' && <span className="text-[9px] font-black text-green-600 bg-green-50 px-4 py-2.5 rounded-xl uppercase tracking-[0.2em] flex items-center gap-2"><Lock size={12} /> Locked in Guard</span>}
                                                        {m.status === 'submitted' && currentUserRole === 'freelancer' && <span className="text-[9px] font-black text-orange-600 bg-orange-50 px-4 py-2.5 rounded-xl uppercase tracking-[0.2em]">Awaiting Release</span>}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT PANEL: CHAT / FEED / FILE DROP */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    <div
                        className={`bg-white rounded-[2.5rem] border-2 shadow-2xl h-[720px] flex flex-col overflow-hidden transition-all relative ${isDragging ? 'border-blue-500 scale-[1.02]' : 'border-slate-100'}`}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => { e.preventDefault(); handleFileUpload(e.dataTransfer.files); }}
                    >
                        {/* FILE DROP OVERLAY */}
                        {isDragging && (
                            <div className="absolute inset-0 bg-blue-600/5 backdrop-blur-[2px] z-50 flex items-center justify-center pointer-events-none">
                                <div className="bg-white p-10 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 border-2 border-blue-100 animate-in zoom-in duration-200">
                                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-600"><UploadCloud size={40} /></div>
                                    <span className="font-black text-xs uppercase tracking-[0.3em] text-blue-700">Drop Draft Files</span>
                                </div>
                            </div>
                        )}

                        {/* UPLOADING STATE */}
                        {isUploading && (
                            <div className="absolute inset-0 bg-white/90 backdrop-blur-md z-50 flex flex-col items-center justify-center">
                                <div className="w-12 h-12 border-[6px] border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>
                                <span className="font-black text-[10px] uppercase tracking-[0.4em] text-slate-400 animate-pulse">Syncing with secure vault...</span>
                            </div>
                        )}

                        <div className="p-7 border-b bg-slate-50/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg"><MessageSquare size={20} /></div>
                                <div>
                                    <h5 className="font-black text-sm tracking-tight">Project Room</h5>
                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                        <span className="w-1 h-1 rounded-full bg-green-500 block"></span>
                                        <span>End-to-End Encrypted</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-[#fcfdfe]">
                            {messages.map(m => (
                                <div key={m.id} className={`flex ${m.sender === 'system' ? 'justify-center' : m.uid === user.userId ? 'justify-end' : 'justify-start'}`}>
                                    {m.sender === 'system' ? (
                                        <div className="text-[8px] font-black text-slate-400 bg-white px-4 py-2 rounded-full border border-slate-100 uppercase tracking-widest shadow-sm flex items-center gap-2">
                                            <ShieldCheck size={10} className="text-blue-500" />
                                            {m.text}
                                        </div>
                                    ) : (
                                        <div className={`max-w-[85%] p-5 rounded-[2rem] shadow-sm relative group ${m.uid === user.userId ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-200'}`}>
                                            <p className={`text-[8px] font-black uppercase mb-1.5 ${m.uid === user.userId ? 'opacity-50 text-white' : 'text-blue-600'}`}>{m.sender}</p>
                                            <p className="font-bold text-sm leading-relaxed break-words">{m.text}</p>
                                            {m.attachment && (
                                                <div className={`mt-4 p-4 rounded-3xl flex items-center gap-4 border transition-all ${m.uid === user.userId ? 'bg-blue-700/50 border-blue-400/30' : 'bg-slate-50 border-slate-100'}`}>
                                                    <div className={`p-3 rounded-2xl ${m.uid === user.userId ? 'bg-blue-500 text-white' : 'bg-white border text-slate-400 shadow-sm'}`}>
                                                        <FileIcon size={20} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[10px] font-black truncate">{m.attachment.name}</p>
                                                        <p className="text-[8px] font-black opacity-40 uppercase tracking-tighter">{m.attachment.size}</p>
                                                    </div>
                                                    <a href={m.attachment.url} target="_blank" rel="noopener noreferrer" className={`p-2.5 rounded-xl transition-all hover:scale-110 shadow-lg ${m.uid === user.userId ? 'bg-white text-blue-600' : 'bg-slate-900 text-white'}`}>
                                                        <ExternalLink size={16} />
                                                    </a>
                                                </div>
                                            )}
                                            <p className="text-[7px] font-black mt-3 text-right opacity-30 uppercase tracking-widest">{m.timestamp}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>

                        <div className="p-6 bg-white border-t">
                            <div className="flex gap-3 items-center">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={(e) => handleFileUpload(e.target.files)}
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-3.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all active:scale-90"
                                >
                                    <Paperclip size={24} />
                                </button>
                                <div className="relative flex-1">
                                    <input
                                        id="chat-msg"
                                        autoComplete="off"
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') {
                                                addMessage(currentUserRole, e.target.value);
                                                e.target.value = '';
                                            }
                                        }}
                                        placeholder="Type or drop files..."
                                        className="w-full px-6 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-500 outline-none text-sm font-bold transition-all"
                                    />
                                </div>
                                <button onClick={() => { const i = document.getElementById('chat-msg'); if (i.value) { addMessage(currentUserRole, i.value); i.value = ''; } }} className="p-3.5 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-100 hover:scale-105 active:scale-95 transition-all">
                                    <Send size={24} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* SYSTEM STATUS */}
                    <div className="bg-slate-950 rounded-[2.5rem] p-8 text-slate-500 font-mono text-[9px] shadow-2xl border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[80px] rounded-full pointer-events-none"></div>
                        <h6 className="text-blue-500 font-black mb-6 border-b border-white/5 pb-3 uppercase tracking-[0.4em] flex items-center justify-between">
                            <span>LEDGER_MONITOR</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                        </h6>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center group">
                                <span className="group-hover:text-slate-300 transition-colors uppercase tracking-widest">Global Escrow Pool:</span>
                                <span className="text-white font-black">${wallets.escrow}</span>
                            </div>
                            <div className="flex justify-between items-center group">
                                <span className="group-hover:text-slate-300 transition-colors uppercase tracking-widest">Active Contracts:</span>
                                <span className="text-white font-black">{contracts.length}</span>
                            </div>
                            <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
                                <span className="text-blue-400 font-black uppercase tracking-widest">// RECENT_EVENT:</span>
                                <div className="p-4 bg-black/40 rounded-2xl border border-white/5 leading-relaxed min-h-[60px] text-[10px] text-slate-400 font-medium">
                                    {messages[messages.length - 1]?.text || 'Standing by for activity...'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Trustflow;
