import { Head, router, useForm } from '@inertiajs/react';
import { format, addDays, startOfDay } from 'date-fns';
import { id, enUS } from 'date-fns/locale';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    Clock,
    Car,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    XCircle,
    Wrench,
    Plus,
    Loader2,
} from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchableSelect } from '@/components/ui/searchable-select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { useLanguage } from '@/hooks/use-language';

interface Booking {
    id: number;
    customer_name: string;
    customer_phone: string;
    car_model: string;
    booking_date: string;
    booking_time: string;
    service_type: string;
    notes: string | null;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    queue_order: number;
}

interface Props {
    bookings: Booking[];
}

export default function BookingQueue({ bookings }: Props) {
    const { t, language } = useLanguage();
    const [startDate, setStartDate] = useState(startOfDay(new Date()));
    const [confirmCancelId, setConfirmCancelId] = useState<number | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const daysToShow = 7;

    const dates = useMemo(() => {
        return Array.from({ length: daysToShow }).map((_, i) => addDays(startDate, i));
    }, [startDate]);

    const bookingsByDate = useMemo(() => {
        const grouped: Record<string, Booking[]> = {};
        dates.forEach((date) => {
            const dateStr = format(date, 'yyyy-MM-dd');
            grouped[dateStr] = bookings
                .filter((b) => b.booking_date === dateStr)
                .sort((a, b) => a.queue_order - b.queue_order);
        });

        return grouped;
    }, [bookings, dates]);

    const handleStatusUpdate = (id: number, status: string) => {
        if (status === 'cancelled' && confirmCancelId !== id) {
            setConfirmCancelId(id);

            return;
        }

        router.patch(`/admin/booking-queue/${id}/status`, { status }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Status updated');
                setConfirmCancelId(null);
            },
        });
    };

    const handleReschedule = (booking: Booking, days: number) => {
        const currentSelectedDate = new Date(booking.booking_date);
        const newDate = format(addDays(currentSelectedDate, days), 'yyyy-MM-dd');
        router.patch(`/admin/booking-queue/${booking.id}/reschedule`, {
            booking_date: newDate,
            queue_order: booking.queue_order,
        }, {
            preserveScroll: true,
            onSuccess: () => toast.success('Booking moved'),
        });
    };

    const { data, setData, post, processing, errors, reset } = useForm({
        customer_name: '',
        customer_phone: '',
        car_model: '',
        booking_date: new Date().toISOString().split('T')[0],
        booking_time: '09:00',
        service_type: 'inspection',
        notes: '',
    });

    const handleCreateBooking = (e: React.FormEvent) => {
        e.preventDefault();
        post('/booking', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setIsCreateOpen(false);
                toast.success('Booking created successfully');
            },
        });
    };

    return (
        <LazyMotion features={domAnimation}>
            <Head title={t('dash_booking_queue')} />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between shrink-0">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight uppercase text-[#1b1b18] dark:text-white">
                            {t('dash_booking_queue')}
                        </h1>
                        <p className="text-sm text-[#1b1b18]/60 dark:text-white/60">
                            {t('dash_booking_desc') || 'Monitor antrean booking dan atur jadwal pelanggan secara visual.'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            className="h-9 rounded-xl bg-red-600 text-white font-black uppercase tracking-widest px-4 text-[10px] shadow-lg shadow-red-600/20 hover:bg-red-700 flex items-center gap-1.5"
                            onClick={() => setIsCreateOpen(true)}
                        >
                            <Plus className="size-4" />
                            {t('dash_create_booking')}
                        </Button>
                        <div className="flex items-center gap-1 rounded-2xl bg-[#1b1b18]/5 p-1 dark:bg-white/5">
                            <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-9 w-9 rounded-xl"
                                onClick={() => setStartDate(addDays(startDate, -7))}
                            >
                                <ChevronLeft className="size-4" />
                            </Button>
                            <Button 
                                variant="ghost" 
                                className="h-9 rounded-xl text-[10px] font-black uppercase tracking-widest px-4"
                                onClick={() => setStartDate(startOfDay(new Date()))}
                            >
                                Today
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-9 w-9 rounded-xl"
                                onClick={() => setStartDate(addDays(startDate, 7))}
                            >
                                <ChevronRight className="size-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto pb-4" style={{ height: 'calc(100vh - 200px)' }}>
                    <div className="flex gap-4 min-w-[1200px] h-full items-stretch">
                        {dates.map((date) => {
                            const dateStr = format(date, 'yyyy-MM-dd');
                            const dayBookings = bookingsByDate[dateStr] || [];
                            const isToday = format(new Date(), 'yyyy-MM-dd') === dateStr;

                            return (
                                <div 
                                    key={dateStr}
                                    className={`flex-1 m-1 min-w-[280px] max-w-[320px] rounded-3xl p-4 flex flex-col overflow-hidden bg-[#1b1b18]/2 border border-[#1b1b18]/5 dark:bg-white/2 dark:border-white/5 shrink-0 ${
                                        isToday ? 'ring-2 ring-red-600 ring-offset-2 ring-offset-white dark:ring-offset-black' : ''
                                    }`}
                                >
                                    <div className="flex items-center justify-between border-b border-[#1b1b18]/5 pb-3 mb-4 dark:border-white/5">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40">
                                                {format(date, 'EEEE', { locale: language === 'id' ? id : enUS })}
                                            </span>
                                            <span className="text-sm font-black text-[#1b1b18] dark:text-white mt-0.5">
                                                {format(date, 'dd MMM yyyy', { locale: language === 'id' ? id : enUS })}
                                            </span>
                                        </div>
                                        <Badge className="bg-red-500 text-white border-transparent text-[10px] font-black rounded-full px-2 py-0.5">
                                            {dayBookings.length}
                                        </Badge>
                                    </div>

                                    <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                                        {dayBookings.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-20 text-[#1b1b18]/20 dark:text-white/20">
                                                <Calendar className="size-8" />
                                                <span className="text-[10px] font-black uppercase tracking-wider mt-2">{t('dash_no_bookings') || 'No Bookings'}</span>
                                            </div>
                                        ) : (
                                            dayBookings.map((booking) => (
                                                <m.div
                                                    key={booking.id}
                                                    layoutId={`booking-${booking.id}`}
                                                    className="rounded-2xl border border-[#1b1b18]/5 bg-white p-4 shadow-sm space-y-4 hover:shadow-md transition-all dark:border-white/5 dark:bg-[#121212]"
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex flex-col gap-0.5">
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="size-3 text-red-600" />
                                                                <span className="text-[11px] font-black uppercase tracking-widest text-red-600">
                                                                    {booking.booking_time.slice(0, 5)}
                                                                </span>
                                                            </div>
                                                            <h4 className="text-sm font-black text-[#1b1b18] dark:text-white leading-tight mt-1">
                                                                {booking.customer_name}
                                                            </h4>
                                                        </div>
                                                        <Badge
                                                            className={`text-[8px] font-black uppercase tracking-widest rounded-full px-2 py-0.5 ${
                                                                booking.status === 'confirmed' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                                booking.status === 'cancelled' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                                booking.status === 'completed' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                                'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                                            }`}
                                                        >
                                                            {booking.status}
                                                        </Badge>
                                                    </div>

                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex items-center gap-3 rounded-xl bg-[#1b1b18]/2 p-2 dark:bg-white/2">
                                                            <Car className="size-4 text-[#1b1b18]/40 dark:text-white/40" />
                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] font-bold text-[#1b1b18]/40 dark:text-white/40 leading-none">Vehicle</span>
                                                                <span className="text-xs font-bold">{booking.car_model}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3 rounded-xl bg-[#1b1b18]/2 p-2 dark:bg-white/2">
                                                            <Wrench className="size-4 text-[#1b1b18]/40 dark:text-white/40" />
                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] font-bold text-[#1b1b18]/40 dark:text-white/40 leading-none">Service</span>
                                                                <span className="text-xs font-bold capitalize">{booking.service_type}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {booking.notes && (
                                                        <p className="text-[10px] text-[#1b1b18]/50 dark:text-white/50 bg-[#1b1b18]/5 dark:bg-white/5 p-2 rounded-lg line-clamp-2 italic">
                                                            {booking.notes}
                                                        </p>
                                                    )}

                                                    <div className="flex items-center justify-between border-t border-[#1b1b18]/5 pt-4 dark:border-white/5">
                                                        <div className="flex gap-2">
                                                            {booking.status === 'pending' && (
                                                                <button
                                                                    onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                                                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10 text-green-500 transition-colors hover:bg-green-500 hover:text-white"
                                                                >
                                                                    <CheckCircle2 className="size-4" />
                                                                </button>
                                                            )}
                                                            {booking.status !== 'cancelled' && (
                                                                <button
                                                                    onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                                                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10 text-red-500 transition-colors hover:bg-red-500 hover:text-white"
                                                                >
                                                                    <XCircle className="size-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <button 
                                                                onClick={() => handleReschedule(booking, -1)}
                                                                className="flex h-8 w-8 items-center justify-center rounded-full text-[#1b1b18]/20 hover:bg-[#1b1b18]/5 hover:text-red-600 dark:text-white/20 dark:hover:bg-white/5"
                                                            >
                                                                <ChevronLeft className="size-4" />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleReschedule(booking, 1)}
                                                                className="flex h-8 w-8 items-center justify-center rounded-full text-[#1b1b18]/20 hover:bg-[#1b1b18]/5 hover:text-red-600 dark:text-white/20 dark:hover:bg-white/5"
                                                            >
                                                                <ChevronRight className="size-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </m.div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Create Booking Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={(open) => {
                setIsCreateOpen(open);
                if (!open) reset();
            }}>
                <DialogContent className="max-w-md rounded-4xl border-none p-8 bg-white dark:bg-[#121212]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black uppercase tracking-tight text-[#1b1b18] dark:text-white">
                            {t('dash_create_booking')}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-[#1b1b18]/50 dark:text-white/50">
                            {t('dash_create_booking_desc') || 'Isi formulir di bawah untuk menambahkan pesanan booking ke antrean.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateBooking} className="mt-4 space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 dark:text-white/60 uppercase">
                                {t('booking_form_customer_name')}
                            </label>
                            <Input
                                value={data.customer_name}
                                onChange={(e) => setData('customer_name', e.target.value)}
                                className="h-11 rounded-xl bg-[#1b1b18]/5 dark:bg-white/5"
                                required
                            />
                            {errors.customer_name && <span className="text-xs text-red-600">{errors.customer_name}</span>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 dark:text-white/60 uppercase">
                                {t('booking_form_customer_phone')}
                            </label>
                            <Input
                                value={data.customer_phone}
                                onChange={(e) => setData('customer_phone', e.target.value)}
                                className="h-11 rounded-xl bg-[#1b1b18]/5 dark:bg-white/5"
                                required
                            />
                            {errors.customer_phone && <span className="text-xs text-red-600">{errors.customer_phone}</span>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 dark:text-white/60 uppercase">
                                {t('booking_form_car_model')}
                            </label>
                            <Input
                                value={data.car_model}
                                onChange={(e) => setData('car_model', e.target.value)}
                                className="h-11 rounded-xl bg-[#1b1b18]/5 dark:bg-white/5"
                                placeholder={t('booking_placeholder_car_model') || 'Contoh: Daihatsu Ayla 2022'}
                                required
                            />
                            {errors.car_model && <span className="text-xs text-red-600">{errors.car_model}</span>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 dark:text-white/60 uppercase">
                                    {t('booking_form_date')}
                                </label>
                                <Input
                                    type="date"
                                    value={data.booking_date}
                                    onChange={(e) => setData('booking_date', e.target.value)}
                                    className="h-11 rounded-xl bg-[#1b1b18]/5 dark:bg-white/5"
                                    required
                                />
                                {errors.booking_date && <span className="text-xs text-red-600">{errors.booking_date}</span>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 dark:text-white/60 uppercase">
                                    {t('booking_form_time')}
                                </label>
                                <Input
                                    type="time"
                                    value={data.booking_time}
                                    onChange={(e) => setData('booking_time', e.target.value)}
                                    className="h-11 rounded-xl bg-[#1b1b18]/5 dark:bg-white/5"
                                    required
                                />
                                {errors.booking_time && <span className="text-xs text-red-600">{errors.booking_time}</span>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 dark:text-white/60 uppercase">
                                {t('booking_form_service_type')}
                            </label>
                            <SearchableSelect
                                value={data.service_type}
                                onChange={(val) => setData('service_type', val)}
                                options={[
                                    { value: 'inspection', label: t('service_opt_inspection') || 'Inspection' },
                                    { value: 'cleaning', label: t('service_opt_cleaning') || 'AC Cleaning' },
                                    { value: 'freon', label: t('service_opt_freon') || 'Freon Refill' },
                                    { value: 'repair', label: t('service_opt_repair') || 'Major Repair' },
                                    { value: 'other', label: t('service_opt_other') || 'Other' },
                                ]}
                            />
                            {errors.service_type && <span className="text-xs text-red-600">{errors.service_type}</span>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 dark:text-white/60 uppercase">
                                {t('booking_form_notes')}
                            </label>
                            <textarea
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                className="flex min-h-[60px] w-full rounded-xl border border-transparent bg-[#1b1b18]/5 px-3 py-2 text-sm text-[#1b1b18] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b1b18] dark:bg-white/5 dark:text-white"
                                placeholder={t('booking_placeholder_notes') || 'Opsional'}
                            />
                            {errors.notes && <span className="text-xs text-red-600">{errors.notes}</span>}
                        </div>

                        <DialogFooter className="pt-4 flex gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setIsCreateOpen(false)}
                                className="h-12 flex-1 rounded-xl font-bold uppercase tracking-widest"
                            >
                                {t('dash_cancel')}
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="h-12 flex-1 rounded-xl bg-red-600 text-white font-black uppercase tracking-widest hover:bg-red-700 disabled:opacity-50"
                            >
                                {processing ? (
                                    <Loader2 className="size-4 animate-spin" />
                                ) : (
                                    t('booking_form_submit')
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={confirmCancelId !== null} onOpenChange={() => setConfirmCancelId(null)}>
                <DialogContent className="rounded-4xl border-none p-8 dark:bg-[#121212]">
                    <DialogHeader className="space-y-4">
                        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-red-500/10 text-red-600">
                            <XCircle className="size-10" />
                        </div>
                        <div className="space-y-2 text-center">
                            <DialogTitle className="text-2xl font-black uppercase tracking-tight">
                                {t('dash_cancel_booking') || 'Batalkan Booking?'}
                            </DialogTitle>
                            <DialogDescription className="text-sm font-medium text-[#1b1b18]/50 dark:text-white/50">
                                {t('dash_cancel_booking_desc') || 'Apakah Anda yakin ingin membatalkan booking ini? Tindakan ini tidak dapat dibatalkan.'}
                            </DialogDescription>
                        </div>
                    </DialogHeader>
                    <DialogFooter className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <Button
                            variant="ghost"
                            onClick={() => setConfirmCancelId(null)}
                            className="h-12 flex-1 rounded-2xl font-bold uppercase tracking-widest"
                        >
                            Tidak, Kembali
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => confirmCancelId && handleStatusUpdate(confirmCancelId, 'cancelled')}
                            className="h-12 flex-1 rounded-2xl bg-red-600 font-black uppercase tracking-widest shadow-lg shadow-red-600/20 hover:bg-red-700"
                        >
                            Ya, Batalkan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </LazyMotion>
    );
}

BookingQueue.layout = (page: any) => <AppLayout children={page} />;
