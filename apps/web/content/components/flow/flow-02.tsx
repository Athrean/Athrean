"use client";

import { Heart, Tag, Plane } from "lucide-react";
import { useState } from "react";

export default function Flow02() {
    const [isLiked, setIsLiked] = useState(false);

    return (
        <div className="relative h-[550px] w-[390px] overflow-hidden rounded-[2.5rem] bg-white shadow-xl">
            {/* Background Image */}
            <img
                src="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop"
                alt="New York City"
                className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Bottom Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Heart Icon */}
            <button
                onClick={() => setIsLiked(!isLiked)}
                className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/20 backdrop-blur-md transition-all hover:bg-white/30"
            >
                <Heart
                    className={`h-5 w-5 transition-colors ${isLiked ? "fill-red-500 text-red-500" : "text-white"
                        }`}
                />
            </button>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 z-10 p-6">
                {/* Title and Subtitle */}
                <div className="mb-4">
                    <h2 className="mb-0.5 text-[2.5rem] font-bold leading-none text-white">
                        New York
                    </h2>
                    <p className="text-base text-white/70">Economy</p>
                </div>

                {/* Price and Airport Info */}
                <div className="mb-5 flex items-center gap-6">
                    <div className="flex items-center gap-2 text-white">
                        <Tag className="h-[18px] w-[18px] text-white/80" />
                        <span className="text-base font-normal">
                            from <span className="font-bold">$120</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-white">
                        <Plane className="h-[18px] w-[18px] text-white/80" />
                        <span className="text-base font-semibold">JFK</span>
                    </div>
                </div>

                {/* CTA Button */}
                <button className="w-full rounded-full bg-white py-[15px] text-base font-semibold text-gray-900 transition-all hover:bg-gray-100">
                    Search flight
                </button>
            </div>
        </div>
    );
}
