"use client";

export default function ComingSoonModal() {
    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center rounded-lg">
            {/* Backdrop with blur */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

            {/* Modal Content */}
            <div className="relative z-10 mx-4 flex max-w-lg flex-col items-center gap-6 rounded-2xl border border-white/10 bg-gray-900/80 px-10 py-14 text-center shadow-2xl backdrop-blur-xl">
                {/* Decorative glow */}
                <div className="from-customBlue-500/30 absolute -top-20 left-1/2 h-40 w-80 -translate-x-1/2 rounded-full bg-gradient-to-r to-purple-500/30 blur-3xl" />

                {/* Icon */}
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 ring-1 ring-white/10">
                    <svg
                        className="h-10 w-10 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.42 15.17l-5.384 3.03 1.42-5.59L2.61 8.462l5.722-.493L11.42 3l3.09 4.97 5.722.493-4.847 4.149 1.42 5.589z"
                        />
                    </svg>
                </div>

                {/* Title */}
                <h2 className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-4xl font-bold tracking-wider text-transparent">
                    COMING SOON
                </h2>

                {/* Subtitle */}
                <p className="max-w-sm text-base font-light leading-relaxed text-gray-300">
                    We&apos;re working hard to bring you this feature. Stay tuned for
                    updates!
                </p>

                {/* Animated progress dots */}
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 animate-pulse rounded-full bg-purple-400" style={{ animationDelay: "300ms" }} />
                    <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400" style={{ animationDelay: "600ms" }} />
                </div>
            </div>
        </div>
    );
}
