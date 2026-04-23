import ThreeScene from '@/components/ThreeScene';
import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Welcome" />
            
            <div className="relative h-screen w-full overflow-hidden">
                <ThreeScene />

                {/* Navigation Overlay */}
                <nav className="absolute top-6 right-6 flex items-center gap-4 z-10">
                    {auth.user ? (
                        <Link
                            href={dashboard()}
                            className="inline-block rounded-full bg-white/10 px-6 py-2 text-sm font-medium text-white backdrop-blur-md transition-all hover:bg-white/20 border border-white/20"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={login()}
                                className="inline-block px-6 py-2 text-sm font-medium text-white transition-all hover:text-gray-300"
                            >
                                Log in
                            </Link>
                            {canRegister && (
                                <Link
                                    href={register()}
                                    className="inline-block rounded-full bg-white px-6 py-2 text-sm font-medium text-black transition-all hover:bg-gray-200"
                                >
                                    Register
                                </Link>
                            )}
                        </>
                    )}
                </nav>
            </div>
        </>
    );
}
