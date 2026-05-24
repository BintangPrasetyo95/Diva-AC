"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerFormModal = CustomerFormModal;
var react_1 = require("react");
var react_2 = require("@inertiajs/react");
var lucide_react_1 = require("lucide-react");
var sonner_1 = require("sonner");
var input_1 = require("@/components/ui/input");
var ModalShell_1 = require("@/components/ui/ModalShell");
var use_language_1 = require("@/hooks/use-language");
function CustomerFormModal(_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, editingCustomer = _a.editingCustomer;
    var t = (0, use_language_1.useLanguage)().t;
    var _b = (0, react_2.useForm)({
        nama_pelanggan: '',
        no_telp: '',
        email: '',
        jenis_kelamin: 'L',
        alamat: '',
    }), data = _b.data, setData = _b.setData, post = _b.post, put = _b.put, processing = _b.processing, errors = _b.errors, reset = _b.reset, clearErrors = _b.clearErrors;
    (0, react_1.useEffect)(function () {
        if (isOpen) {
            clearErrors();
            if (editingCustomer) {
                setData({
                    nama_pelanggan: editingCustomer.nama_pelanggan,
                    no_telp: editingCustomer.no_telp,
                    email: editingCustomer.email,
                    jenis_kelamin: editingCustomer.jenis_kelamin,
                    alamat: editingCustomer.alamat,
                });
            }
            else {
                reset();
            }
        }
    }, [isOpen, editingCustomer]);
    var handleSubmit = function (e) {
        e.preventDefault();
        if (editingCustomer) {
            put("/admin/customers/".concat(editingCustomer.id), {
                preserveScroll: true,
                onSuccess: function () {
                    onClose();
                    sonner_1.toast.success('Customer updated successfully');
                    reset();
                },
            });
        }
        else {
            post('/admin/customers', {
                preserveScroll: true,
                onSuccess: function () {
                    onClose();
                    sonner_1.toast.success('Customer added successfully');
                    reset();
                },
            });
        }
    };
    return (<ModalShell_1.ModalShell isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-2xl font-black tracking-tight text-[#1b1b18] uppercase dark:text-white">
                                {editingCustomer
            ? t('dash_edit_user')
            : t('dash_add_user')}
                            </h2>
                            <button onClick={onClose} className="rounded-full p-2 text-[#1b1b18]/40 hover:bg-[#1b1b18]/5 dark:text-white/40 dark:hover:bg-white/5">
                                <lucide_react_1.X className="size-6"/>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase">
                                        Full Name
                                    </label>
                                    <input_1.Input value={data.nama_pelanggan} onChange={function (e) {
            return setData('nama_pelanggan', e.target.value);
        }} className="h-12 rounded-2xl border-transparent bg-[#1b1b18]/5 dark:bg-white/5" placeholder="John Doe"/>
                                    {errors.nama_pelanggan && (<span className="text-xs text-red-600">
                                            {errors.nama_pelanggan}
                                        </span>)}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase">
                                        Phone Number
                                    </label>
                                    <input_1.Input value={data.no_telp} onChange={function (e) {
            return setData('no_telp', e.target.value);
        }} className="h-12 rounded-2xl border-transparent bg-[#1b1b18]/5 dark:bg-white/5" placeholder="08123456789"/>
                                    {errors.no_telp && (<span className="text-xs text-red-600">
                                            {errors.no_telp}
                                        </span>)}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase">
                                        Email Address
                                    </label>
                                    <input_1.Input type="email" value={data.email} onChange={function (e) {
            return setData('email', e.target.value);
        }} className="h-12 rounded-2xl border-transparent bg-[#1b1b18]/5 dark:bg-white/5" placeholder="john@example.com"/>
                                    {errors.email && (<span className="text-xs text-red-600">
                                            {errors.email}
                                        </span>)}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase">
                                        Gender
                                    </label>
                                    <select value={data.jenis_kelamin} onChange={function (e) {
            return setData('jenis_kelamin', e.target.value);
        }} className="flex h-12 w-full rounded-2xl border border-transparent bg-[#1b1b18]/5 px-3 py-2 text-sm text-[#1b1b18] ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b1b18] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white/5 dark:text-white dark:ring-offset-[#1b1b18] dark:focus-visible:ring-white">
                                        <option value="L">Laki-laki (Male)</option>
                                        <option value="P">Perempuan (Female)</option>
                                    </select>
                                    {errors.jenis_kelamin && (<span className="text-xs text-red-600">
                                            {errors.jenis_kelamin}
                                        </span>)}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase">
                                        Address
                                    </label>
                                    <textarea value={data.alamat} onChange={function (e) {
            return setData('alamat', e.target.value);
        }} className="flex min-h-[80px] w-full rounded-2xl border border-transparent bg-[#1b1b18]/5 px-3 py-2 text-sm text-[#1b1b18] ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b1b18] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white/5 dark:text-white dark:ring-offset-[#1b1b18] dark:focus-visible:ring-white" placeholder="Full address"/>
                                    {errors.alamat && (<span className="text-xs text-red-600">
                                            {errors.alamat}
                                        </span>)}
                                </div>
                            </div>
                            <button disabled={processing} className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#1b1b18] text-sm font-black tracking-widest text-white uppercase shadow-xl transition-all hover:bg-black disabled:opacity-50 dark:bg-white dark:text-[#1b1b18]">
                                {processing ? (<lucide_react_1.Loader2 className="size-5 animate-spin"/>) : (<>
                                        <lucide_react_1.Users className="size-5"/>
                                        {t('dash_save_changes')}
                                    </>)}
                            </button>
                        </form>
        </ModalShell_1.ModalShell>);
}
