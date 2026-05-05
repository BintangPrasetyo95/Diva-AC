import { Head, useForm } from '@inertiajs/react';
import { m, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, Shield, MoreVertical, Mail, Trash2, Edit2, X, CheckCircle2, Loader2, KeyRound, User as UserIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { toast } from 'sonner';

interface User {
    id: number;
    name: string;
    email: string;
    username: string;
    role: 'admin' | 'staff' | 'kasir';
    created_at: string;
}

interface Props {
    users: User[];
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring" as const, stiffness: 100, damping: 12 }
    }
};

export default function UserManagement({ users }: Props) {
    const { t } = useLanguage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        username: '',
        password: '',
        password_confirmation: '',
        role: 'staff' as 'admin' | 'staff' | 'kasir',
    });

    const openCreateModal = () => {
        reset();
        clearErrors();
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const openEditModal = (user: User) => {
        clearErrors();
        setEditingUser(user);
        setData({
            name: user.name,
            email: user.email,
            username: user.username,
            role: user.role,
            password: '',
            password_confirmation: '',
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            put(`/admin/users/${editingUser.id}`, {
                onSuccess: () => {
                    toast.success('User updated successfully');
                    closeModal();
                },
            });
        } else {
            post('/admin/users', {
                onSuccess: () => {
                    toast.success('User created successfully');
                    closeModal();
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this user?')) {
            destroy(`/admin/users/${id}`, {
                onSuccess: () => toast.success('User deleted successfully'),
                onError: (err) => toast.error(err.error || 'Failed to delete user'),
            });
        }
    };

    return (
        <LazyMotion features={domAnimation}>
            <Head title="User Management" />

            <m.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="flex flex-col gap-8 p-6 lg:p-8 max-w-7xl mx-auto"
            >
                <m.div variants={itemVariants} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-[#1b1b18] dark:text-white uppercase">
                            User <span className="text-red-600">Management</span>
                        </h1>
                        <p className="text-sm text-[#1b1b18]/50 dark:text-white/50">Manage admin and staff permissions</p>
                    </div>

                    <button 
                        onClick={openCreateModal}
                        className="flex h-12 items-center gap-2 rounded-full bg-red-600 px-8 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-red-600/20 transition-all hover:bg-red-700 active:scale-95"
                    >
                        <UserPlus className="size-4" />
                        Add New User
                    </button>
                </m.div>

                <m.div
                    variants={itemVariants}
                    className="overflow-hidden rounded-[2.5rem] border border-[#1b1b18]/5 bg-white shadow-sm dark:border-white/5 dark:bg-[#121212]"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#1b1b18]/2 dark:bg-white/2">
                                <tr>
                                    <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em] text-[#1b1b18]/30 dark:text-white/30">User Details</th>
                                    <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em] text-[#1b1b18]/30 dark:text-white/30">Account Info</th>
                                    <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em] text-[#1b1b18]/30 dark:text-white/30">Role</th>
                                    <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em] text-[#1b1b18]/30 dark:text-white/30 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1b1b18]/5 dark:divide-white/5">
                                {users.map((user) => (
                                    <tr key={user.id} className="group transition-colors hover:bg-[#1b1b18]/1 dark:hover:bg-white/1">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="flex size-12 items-center justify-center rounded-2xl bg-red-600/10 text-red-600 font-black">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-base font-black text-[#1b1b18] dark:text-white uppercase tracking-tight">{user.name}</span>
                                                    <span className="flex items-center gap-1.5 text-xs font-bold text-[#1b1b18]/40 dark:text-white/40">
                                                        <Mail className="size-3.5" /> {user.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-[#1b1b18]/60 dark:text-white/60 uppercase tracking-widest">@{user.username}</span>
                                                <span className="text-[10px] font-bold text-[#1b1b18]/20 dark:text-white/20 uppercase mt-1">Joined {new Date(user.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${
                                                    user.role === 'admin' ? 'bg-red-600/10 text-red-600' : 'bg-blue-600/10 text-blue-600'
                                                }`}>
                                                    <Shield className="size-3" />
                                                    {user.role}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => openEditModal(user)}
                                                    className="size-10 rounded-xl bg-[#1b1b18]/5 text-[#1b1b18]/40 flex items-center justify-center hover:bg-[#1b1b18] hover:text-white transition-all"
                                                >
                                                    <Edit2 className="size-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(user.id)}
                                                    className="size-10 rounded-xl bg-red-600/5 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"
                                                >
                                                    <Trash2 className="size-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </m.div>
            </m.div>

            {/* Modal Overlay */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <m.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="absolute inset-0 bg-[#1b1b18]/40 backdrop-blur-sm"
                        />
                        <m.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-xl overflow-hidden rounded-[2.5rem] bg-white shadow-2xl dark:bg-[#121212]"
                        >
                            <div className="flex items-center justify-between border-b border-[#1b1b18]/5 p-8 dark:border-white/5">
                                <h2 className="text-2xl font-black uppercase tracking-tight text-[#1b1b18] dark:text-white">
                                    {editingUser ? 'Edit' : 'Add New'} <span className="text-red-600">User</span>
                                </h2>
                                <button onClick={closeModal} className="rounded-full p-2 hover:bg-[#1b1b18]/5 dark:hover:bg-white/5">
                                    <X className="size-6 text-[#1b1b18]/20" />
                                </button>
                            </div>

                            <form onSubmit={submit} className="p-8 space-y-6">
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40 ml-1">Full Name</label>
                                        <div className="relative">
                                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#1b1b18]/20" />
                                            <input 
                                                value={data.name}
                                                onChange={e => setData('name', e.target.value)}
                                                className="w-full h-14 rounded-2xl bg-[#1b1b18]/5 dark:bg-white/5 border-none pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-red-600/20"
                                                placeholder="e.g. John Doe"
                                            />
                                        </div>
                                        {errors.name && <p className="text-[10px] font-bold text-red-600 ml-1 uppercase">{errors.name}</p>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40 ml-1">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#1b1b18]/20" />
                                                <input 
                                                    type="email"
                                                    value={data.email}
                                                    onChange={e => setData('email', e.target.value)}
                                                    className="w-full h-14 rounded-2xl bg-[#1b1b18]/5 dark:bg-white/5 border-none pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-red-600/20"
                                                    placeholder="john@example.com"
                                                />
                                            </div>
                                            {errors.email && <p className="text-[10px] font-bold text-red-600 ml-1 uppercase">{errors.email}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40 ml-1">Username</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#1b1b18]/20">@</span>
                                                <input 
                                                    value={data.username}
                                                    onChange={e => setData('username', e.target.value)}
                                                    className="w-full h-14 rounded-2xl bg-[#1b1b18]/5 dark:bg-white/5 border-none pl-10 pr-4 text-sm font-bold focus:ring-2 focus:ring-red-600/20"
                                                    placeholder="johndoe"
                                                />
                                            </div>
                                            {errors.username && <p className="text-[10px] font-bold text-red-600 ml-1 uppercase">{errors.username}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40 ml-1">System Role</label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {(['admin', 'staff', 'kasir'] as const).map(role => (
                                                <button
                                                    key={role}
                                                    type="button"
                                                    onClick={() => setData('role', role)}
                                                    className={`h-14 rounded-2xl border-2 transition-all text-xs font-black uppercase tracking-widest ${
                                                        data.role === role 
                                                        ? 'border-red-600 bg-red-600/5 text-red-600' 
                                                        : 'border-[#1b1b18]/5 bg-[#1b1b18]/2 text-[#1b1b18]/40 hover:border-[#1b1b18]/10'
                                                    }`}
                                                >
                                                    {role}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40 ml-1">
                                                {editingUser ? 'New Password (Optional)' : 'Password'}
                                            </label>
                                            <div className="relative">
                                                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#1b1b18]/20" />
                                                <input 
                                                    type="password"
                                                    value={data.password}
                                                    onChange={e => setData('password', e.target.value)}
                                                    className="w-full h-14 rounded-2xl bg-[#1b1b18]/5 dark:bg-white/5 border-none pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-red-600/20"
                                                />
                                            </div>
                                            {errors.password && <p className="text-[10px] font-bold text-red-600 ml-1 uppercase">{errors.password}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40 ml-1">Confirm Password</label>
                                            <div className="relative">
                                                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#1b1b18]/20" />
                                                <input 
                                                    type="password"
                                                    value={data.password_confirmation}
                                                    onChange={e => setData('password_confirmation', e.target.value)}
                                                    className="w-full h-14 rounded-2xl bg-[#1b1b18]/5 dark:bg-white/5 border-none pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-red-600/20"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex items-center gap-3">
                                    <button 
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 h-14 rounded-full bg-[#1b1b18]/5 text-[#1b1b18]/40 text-sm font-black uppercase tracking-widest hover:bg-[#1b1b18]/10 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        disabled={processing}
                                        className="flex-[2] h-14 rounded-full bg-red-600 text-white text-sm font-black uppercase tracking-widest shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {processing ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                                        {editingUser ? 'Update User' : 'Create User'}
                                    </button>
                                </div>
                            </form>
                        </m.div>
                    </div>
                )}
            </AnimatePresence>
        </LazyMotion>
    );
}
