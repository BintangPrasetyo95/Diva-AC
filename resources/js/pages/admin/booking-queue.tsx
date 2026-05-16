import { Head, router } from '@inertiajs/react';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    Clock,
    User,
    Car,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    XCircle,
    ArrowRightLeft,
    Search,
    Filter,
    Wrench,
} from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { format, addDays, startOfDay, isSameDay } from 'date-fns';
import { id } from 'date-fns/locale';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';


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
    const [startDate, setStartDate] = useState(startOfDay(new Date()));
    const [confirmCancelId, setConfirmCancelId] = useState<number | null>(null);
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

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, scale: 0.95 }
    };

    return (
        <LazyMotion features={domAnimation}>
            <Head title="Booking Queue" />
            <div className="flex flex-col gap-6 p-6 h-screen overflow-hidden">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between shrink-0">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight uppercase text-[#1b1b18] dark:text-white">
                            Booking Queue
                        </h1>
                        <p className="text-sm text-[#1b1b18]/60 dark:text-white/60">
                            Monitor antrean booking dan atur jadwal pelanggan secara visual.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
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

                <div className="flex flex-1 gap-6 overflow-x-auto pb-6 custom-scrollbar snap-x">
                    {dates.map((date) => {
                        const dateStr = format(date, 'yyyy-MM-dd');
                        const dayBookings = bookingsByDate[dateStr] || [];
                        const isToday = isSameDay(date, new Date());

                        return (
                            <div key={dateStr} className="flex min-w-[320px] w-[320px] flex-col gap-4 snap-start">
                                <div className={`flex flex-col gap-1 rounded-3xl p-5 transition-all ${isToday ? 'bg-red-600 text-white shadow-[0_10px_30px_rgba(220,38,38,0.3)]' : 'bg-white border border-[#1b1b18]/5 dark:bg-[#121212] dark:border-white/5'}`}>
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-70">
                                            {format(date, 'EEEE', { locale: id })}
                                        </h3>
                                        <Badge variant={isToday ? 'secondary' : 'outline'} className="rounded-full px-2 py-0 h-5 text-[10px] font-black">
                                            {dayBookings.length}
                                        </Badge>
                                    </div>
                                    <p className="text-lg font-black tracking-tight">
                                        {format(date, 'd MMMM yyyy', { locale: id })}
                                    </p>
                                </div>

                                <div className="flex-1 space-y-4 overflow-y-auto rounded-[2rem] bg-[#1b1b18]/2 p-3 dark:bg-white/2 custom-scrollbar border border-transparent hover:border-[#1b1b18]/5 dark:hover:border-white/5 transition-colors">
                                    <AnimatePresence mode="popLayout">
                                        {dayBookings.length === 0 ? (
                                            <m.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="flex h-40 flex-col items-center justify-center text-[#1b1b18]/20 dark:text-white/20"
                                            >
                                                <Calendar className="size-12 mb-3 opacity-10" />
                                                <p className="text-[10px] font-black uppercase tracking-[0.3em]">Antrean Kosong</p>
                                            </m.div>
                                        ) : (
                                            dayBookings.map((booking) => (
                                                <m.div
                                                    layout
                                                    key={booking.id}
                                                    variants={itemVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="exit"
                                                    className="group relative flex flex-col gap-4 rounded-[1.5rem] border border-[#1b1b18]/5 bg-white p-5 shadow-sm transition-all hover:border-red-600/30 hover:shadow-xl dark:border-white/5 dark:bg-[#1b1b1b]"
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
                                                            "{booking.notes}"
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
                                    </AnimatePresence>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <Dialog open={confirmCancelId !== null} onOpenChange={() => setConfirmCancelId(null)}>
                <DialogContent className="rounded-4xl border-none p-8 dark:bg-[#121212]">
                    <DialogHeader className="space-y-4">
                        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-red-500/10 text-red-600">
                            <XCircle className="size-10" />
                        </div>
                        <div className="space-y-2 text-center">
                            <DialogTitle className="text-2xl font-black uppercase tracking-tight">
                                Batalkan Booking?
                            </DialogTitle>
                            <DialogDescription className="text-sm font-medium text-[#1b1b18]/50 dark:text-white/50">
                                Apakah Anda yakin ingin membatalkan booking ini? Tindakan ini tidak dapat dibatalkan.
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
