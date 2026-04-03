import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { MessageSquare, Plus, Send, Pencil, Trash2, X, Copy, Check, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from '../components/ui/dialog';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../components/ui/select';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_API_URL;

const TEMPLATE_CATEGORIES = ['First Contact', 'Follow-up', 'Meeting', 'Sales', 'Onboarding', 'General'];
const PLACEHOLDERS = ['{company}', '{team}', '{date}', '{city}', '{link}'];

export default function WeeklyMessages() {
    const { isAdmin } = useAuth();
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', message: '', category: 'General' });
    const [filter, setFilter] = useState('All');
    const [copied, setCopied] = useState(null);

    const fetchTemplates = useCallback(async () => {
        try {
            const res = await axios.get(`${API_URL}/api/templates`, { withCredentials: true });
            setTemplates(res.data);
        } catch (e) {
            toast.error('Failed to load templates');
        }
        setLoading(false);
    }, []);

    useEffect(() => { fetchTemplates(); }, [fetchTemplates]);

    const handleSave = async () => {
        if (!form.name.trim() || !form.message.trim()) {
            toast.error('Name and message are required');
            return;
        }
        try {
            if (editing) {
                await axios.put(`${API_URL}/api/templates/${editing}`, form, { withCredentials: true });
                toast.success('Template updated');
            } else {
                await axios.post(`${API_URL}/api/templates`, form, { withCredentials: true });
                toast.success('Template created');
            }
            setDialogOpen(false);
            setEditing(null);
            setForm({ name: '', message: '', category: 'General' });
            fetchTemplates();
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Failed to save template');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this template?')) return;
        try {
            await axios.delete(`${API_URL}/api/templates/${id}`, { withCredentials: true });
            toast.success('Template deleted');
            fetchTemplates();
        } catch (err) {
            toast.error('Failed to delete');
        }
    };

    const openEdit = (tmpl) => {
        setEditing(tmpl.id);
        setForm({ name: tmpl.name, message: tmpl.message, category: tmpl.category || 'General' });
        setDialogOpen(true);
    };

    const openNew = () => {
        setEditing(null);
        setForm({ name: '', message: '', category: 'General' });
        setDialogOpen(true);
    };

    const copyMessage = (msg, id) => {
        navigator.clipboard.writeText(msg);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
        toast.success('Copied to clipboard');
    };

    const sendWhatsApp = (msg, phone) => {
        const encoded = encodeURIComponent(msg);
        const url = phone ? `https://wa.me/${phone.replace(/\D/g, '')}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
        window.open(url, '_blank');
    };

    const categories = ['All', ...TEMPLATE_CATEGORIES];
    const filtered = filter === 'All' ? templates : templates.filter(t => t.category === filter);
    const grouped = {};
    filtered.forEach(t => {
        const cat = t.category || 'General';
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(t);
    });

    return (
        <div className="max-w-4xl mx-auto py-6 px-4" data-testid="templates-page">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                    <MessageSquare size={22} className="text-[#E8536A]" />
                    <h1 className="text-xl font-heading font-semibold text-gray-900">WhatsApp Templates</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Select value={filter} onValueChange={setFilter}>
                        <SelectTrigger className="w-[130px] h-8 text-[11px] rounded-[8px]" data-testid="template-filter">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    {isAdmin && (
                        <Button onClick={openNew} className="bg-[#E8536A] hover:bg-[#D43D54] text-white rounded-[8px] h-8 text-[11px] px-3" data-testid="add-template-btn">
                            <Plus size={14} className="mr-1" /> New Template
                        </Button>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-400 text-[13px]">Loading templates...</div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-[13px]">No templates found</div>
            ) : (
                <div className="space-y-5">
                    {Object.entries(grouped).map(([cat, tmpls]) => (
                        <div key={cat}>
                            <h2 className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-2">{cat}</h2>
                            <div className="space-y-2">
                                {tmpls.map(tmpl => (
                                    <TemplateCard
                                        key={tmpl.id}
                                        tmpl={tmpl}
                                        isAdmin={isAdmin}
                                        onEdit={() => openEdit(tmpl)}
                                        onDelete={() => handleDelete(tmpl.id)}
                                        onCopy={() => copyMessage(tmpl.message, tmpl.id)}
                                        onSend={() => sendWhatsApp(tmpl.message)}
                                        isCopied={copied === tmpl.id}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create/Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-[15px] font-heading">
                            {editing ? 'Edit Template' : 'New Template'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 pt-2">
                        <div>
                            <label className="text-[11px] font-medium text-gray-600">Template Name</label>
                            <Input
                                value={form.name}
                                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                                placeholder="e.g., Follow-up Reminder"
                                className="h-9 text-[13px] rounded-[8px] mt-1"
                                data-testid="template-name-input"
                            />
                        </div>
                        <div>
                            <label className="text-[11px] font-medium text-gray-600">Category</label>
                            <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v }))}>
                                <SelectTrigger className="h-9 text-[13px] rounded-[8px] mt-1" data-testid="template-category-select">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {TEMPLATE_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <label className="text-[11px] font-medium text-gray-600">Message</label>
                                <div className="flex gap-1">
                                    {PLACEHOLDERS.map(p => (
                                        <button
                                            key={p}
                                            onClick={() => setForm(prev => ({ ...prev, message: prev.message + p }))}
                                            className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 hover:bg-[#FFF5F5] hover:text-[#E8536A]"
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <Textarea
                                value={form.message}
                                onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                                placeholder="Type your WhatsApp message template..."
                                rows={5}
                                className="text-[13px] rounded-[8px] mt-1 resize-none"
                                data-testid="template-message-input"
                            />
                        </div>
                        <div className="flex justify-end gap-2 pt-1">
                            <Button variant="outline" onClick={() => setDialogOpen(false)} className="rounded-[8px] h-9 text-[12px]">Cancel</Button>
                            <Button onClick={handleSave} className="bg-[#E8536A] hover:bg-[#D43D54] text-white rounded-[8px] h-9 text-[12px] px-5" data-testid="save-template-btn">
                                {editing ? 'Update' : 'Create'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function TemplateCard({ tmpl, isAdmin, onEdit, onDelete, onCopy, onSend, isCopied }) {
    return (
        <div className="bg-white border border-gray-100 rounded-[10px] p-3 hover:border-gray-200 transition-colors" data-testid={`template-card-${tmpl.id}`}>
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-[13px] font-semibold text-gray-800">{tmpl.name}</h3>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{tmpl.category}</span>
                    </div>
                    <p className="text-[12px] text-gray-600 leading-relaxed whitespace-pre-wrap">{tmpl.message}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                    <button
                        onClick={onCopy}
                        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Copy"
                        data-testid={`copy-template-${tmpl.id}`}
                    >
                        {isCopied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    </button>
                    <button
                        onClick={onSend}
                        className="p-1.5 rounded-md hover:bg-green-50 text-green-500 hover:text-green-600 transition-colors"
                        title="Send via WhatsApp"
                        data-testid={`send-template-${tmpl.id}`}
                    >
                        <ExternalLink size={14} />
                    </button>
                    {isAdmin && (
                        <>
                            <button onClick={onEdit} className="p-1.5 rounded-md hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-colors" title="Edit" data-testid={`edit-template-${tmpl.id}`}>
                                <Pencil size={14} />
                            </button>
                            <button onClick={onDelete} className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors" title="Delete" data-testid={`delete-template-${tmpl.id}`}>
                                <Trash2 size={14} />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
