import { Head, useForm } from '@inertiajs/react';
import { m, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion';
import {
    Users,
    UserPlus,
    Shield,
    MoreVertical,
    Mail,
    Trash2,
    Edit2,
    X,
    CheckCircle2,
    Loader2,
    KeyRound,
    User as UserIcon,
} from 'lucide-react';
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
        transition: { staggerChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: 'spring' as const, stiffness: 100, damping: 12 },
    },
};

export default function UserManagement({ users }: Props) {
    const { t } = useLanguage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm({
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
                onError: (err) =>
                    toast.error(err.error || 'Failed to delete user'),
            });
        }
    };

    return (
        <LazyMotion features={domAnimation}>
            <Head title={t('dash_user_management')} />

            <m.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="mx-auto flex max-w-7xl flex-col gap-8 p-6 lg:p-8"
            >
                <m.div
                    variants={itemVariants}
                    className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
                >
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-[#1b1b18] uppercase dark:text-white">
                            User{' '}
                            <span className="text-red-600">Management</span>
                        </h1>
                        <p className="text-sm text-[#1b1b18]/50 dark:text-white/50">
                            {t('dash_user_management')} - Manage admin and staff
                            permissions
                        </p>
                    </div>

                    <button
                        onClick={openCreateModal}
                        className="flex h-12 items-center gap-2 rounded-full bg-red-600 px-8 text-sm font-black tracking-widest text-white uppercase shadow-lg shadow-red-600/20 transition-all hover:bg-red-700 active:scale-95"
                    >
                        <UserPlus className="size-4" />
                        {t('dash_add_user')}
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
                                    <th className="px-8 py-6 text-xs font-black tracking-[0.2em] text-[#1b1b18]/30 uppercase dark:text-white/30">
                                        {t('dash_user_details')}
                                    </th>
                                    <th className="px-8 py-6 text-xs font-black tracking-[0.2em] text-[#1b1b18]/30 uppercase dark:text-white/30">
                                        {t('dash_account_info')}
                                    </th>
                                    <th className="px-8 py-6 text-xs font-black tracking-[0.2em] text-[#1b1b18]/30 uppercase dark:text-white/30">
                                        Role
                                    </th>
                                    <th className="px-8 py-6 text-right text-xs font-black tracking-[0.2em] text-[#1b1b18]/30 uppercase dark:text-white/30">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1b1b18]/5 dark:divide-white/5">
                                {users.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="group transition-colors hover:bg-[#1b1b18]/1 dark:hover:bg-white/1"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="flex size-12 items-center justify-center rounded-2xl bg-red-600/10 font-black text-red-600">
                                                    {user.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-base font-black tracking-tight text-[#1b1b18] uppercase dark:text-white">
                                                        {user.name}
                                                    </span>
                                                    <span className="flex items-center gap-1.5 text-xs font-bold text-[#1b1b18]/40 dark:text-white/40">
                                                        <Mail className="size-3.5" />{' '}
                                                        {user.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black tracking-widest text-[#1b1b18]/60 uppercase dark:text-white/60">
                                                    @{user.username}
                                                </span>
                                                <span className="mt-1 text-[10px] font-bold text-[#1b1b18]/20 uppercase dark:text-white/20">
                                                    Joined{' '}
                                                    {new Date(
                                                        user.created_at,
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-black tracking-widest uppercase ${
                                                        user.role === 'admin'
                                                            ? 'bg-red-600/10 text-red-600'
                                                            : 'bg-blue-600/10 text-blue-600'
                                                    }`}
                                                >
                                                    <Shield className="size-3" />
                                                    {user.role}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                                <button
                                                    onClick={() =>
                                                        openEditModal(user)
                                                    }
                                                    className="flex size-10 items-center justify-center rounded-xl bg-[#1b1b18]/5 text-[#1b1b18]/40 transition-all hover:bg-[#1b1b18] hover:text-white"
                                                >
                                                    <Edit2 className="size-4" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(user.id)
                                                    }
                                                    className="flex size-10 items-center justify-center rounded-xl bg-red-600/5 text-red-600 transition-all hover:bg-red-600 hover:text-white"
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
                                <h2 className="text-2xl font-black tracking-tight text-[#1b1b18] uppercase dark:text-white">
                                    {editingUser
                                        ? t('dash_edit_user')
                                        : t('dash_add_user')}
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="rounded-full p-2 hover:bg-[#1b1b18]/5 dark:hover:bg-white/5"
                                >
                                    <X className="size-6 text-[#1b1b18]/20" />
                                </button>
                            </div>

                            <form onSubmit={submit} className="space-y-6 p-8">
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-2">
                                        <label className="ml-1 text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase">
                                            {t('dash_full_name')}
                                        </label>
                                        <div className="relative">
                                            <UserIcon className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#1b1b18]/20" />
                                            <input
                                                value={data.name}
                                                onChange={(e) =>
                                                    setData(
                                                        'name',
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-14 w-full rounded-2xl border-none bg-[#1b1b18]/5 pr-4 pl-12 text-sm font-bold focus:ring-2 focus:ring-red-600/20 dark:bg-white/5"
                                                placeholder="e.g. John Doe"
                                            />
                                        </div>
                                        {errors.name && (
                                            <p className="ml-1 text-[10px] font-bold text-red-600 uppercase">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="ml-1 text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase">
                                                {t('auth_email')}
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#1b1b18]/20" />
                                                <input
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) =>
                                                        setData(
                                                            'email',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-14 w-full rounded-2xl border-none bg-[#1b1b18]/5 pr-4 pl-12 text-sm font-bold focus:ring-2 focus:ring-red-600/20 dark:bg-white/5"
                                                    placeholder="john@example.com"
                                                />
                                            </div>
                                            {errors.email && (
                                                <p className="ml-1 text-[10px] font-bold text-red-600 uppercase">
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="ml-1 text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase">
                                                {t('auth_username')}
                                            </label>
                                            <div className="relative">
                                                <span className="absolute top-1/2 left-4 -translate-y-1/2 text-sm font-bold text-[#1b1b18]/20">
                                                    @
                                                </span>
                                                <input
                                                    value={data.username}
                                                    onChange={(e) =>
                                                        setData(
                                                            'username',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-14 w-full rounded-2xl border-none bg-[#1b1b18]/5 pr-4 pl-10 text-sm font-bold focus:ring-2 focus:ring-red-600/20 dark:bg-white/5"
                                                    placeholder="johndoe"
                                                />
                                            </div>
                                            {errors.username && (
                                                <p className="ml-1 text-[10px] font-bold text-red-600 uppercase">
                                                    {errors.username}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="ml-1 text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase">
                                            {t('dash_system_role')}
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {(
                                                [
                                                    'admin',
                                                    'staff',
                                                    'kasir',
                                                ] as const
                                            ).map((role) => (
                                                <button
                                                    key={role}
                                                    type="button"
                                                    onClick={() =>
                                                        setData('role', role)
                                                    }
                                                    className={`h-14 rounded-2xl border-2 text-xs font-black tracking-widest uppercase transition-all ${
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
                                            <label className="ml-1 text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase">
                                                {editingUser
                                                    ? t('dash_password') +
                                                      ' (Optional)'
                                                    : t('dash_password')}
                                            </label>
                                            <div className="relative">
                                                <KeyRound className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#1b1b18]/20" />
                                                <input
                                                    type="password"
                                                    value={data.password}
                                                    onChange={(e) =>
                                                        setData(
                                                            'password',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-14 w-full rounded-2xl border-none bg-[#1b1b18]/5 pr-4 pl-12 text-sm font-bold focus:ring-2 focus:ring-red-600/20 dark:bg-white/5"
                                                />
                                            </div>
                                            {errors.password && (
                                                <p className="ml-1 text-[10px] font-bold text-red-600 uppercase">
                                                    {errors.password}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="ml-1 text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase">
                                                {t('dash_confirm_password')}
                                            </label>
                                            <div className="relative">
                                                <KeyRound className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#1b1b18]/20" />
                                                <input
                                                    type="password"
                                                    value={
                                                        data.password_confirmation
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            'password_confirmation',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-14 w-full rounded-2xl border-none bg-[#1b1b18]/5 pr-4 pl-12 text-sm font-bold focus:ring-2 focus:ring-red-600/20 dark:bg-white/5"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="h-14 flex-1 rounded-full bg-[#1b1b18]/5 text-sm font-black tracking-widest text-[#1b1b18]/40 uppercase transition-all hover:bg-[#1b1b18]/10"
                                    >
                                        {t('dash_cancel')}
                                    </button>
                                    <button
                                        disabled={processing}
                                        className="flex h-14 flex-2 items-center justify-center gap-2 rounded-full bg-red-600 text-sm font-black tracking-widest text-white uppercase shadow-lg shadow-red-600/20 transition-all hover:bg-red-700 disabled:opacity-50"
                                    >
                                        {processing ? (
                                            <Loader2 className="size-4 animate-spin" />
                                        ) : (
                                            <CheckCircle2 className="size-4" />
                                        )}
                                        {editingUser
                                            ? t('dash_update_user')
                                            : t('dash_create_user')}
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
