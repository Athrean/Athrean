"use client";

import { Heart, Tag, Plane } from "lucide-react";
import { useState } from "react";

export default function Flow01() {
    const [isLiked, setIsLiked] = useState(false);

    return (
        <div className="w-[390px] rounded-[2.5rem] bg-white p-4 shadow-2xl">
            {/* Image Container */}
            <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-[2rem]">
                <img
                    src="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=2832&auto=format&fit=crop"
                    alt="San Francisco Golden Gate Bridge"
                    className="h-full w-full object-cover"
                />
            </div>

            {/* Title and Subtitle */}
            <div className="mb-3">
                <h2 className="mb-0.5 text-[2rem] font-bold leading-none text-gray-900">
                    San Francisco
                </h2>
                <p className="text-[15px] text-gray-400">Premium economy</p>
            </div>

            {/* Price and Airport Info */}
            <div className="mb-4 flex items-center gap-5">
                <div className="flex items-center gap-2 text-gray-700">
                    <Tag className="h-[17px] w-[17px] text-gray-400" />
                    <span className="text-[15px] font-normal">
                        from <span className="font-bold text-gray-900">$240</span>
                    </span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                    <Plane className="h-[17px] w-[17px] text-gray-400" />
                    <span className="text-[15px] font-semibold text-gray-900">SFO</span>
                </div>
            </div>

            {/* CTA Button and Heart */}
            <div className="flex items-center gap-3">
                <button className="flex-1 rounded-full bg-[#1a1a1a] px-8 py-[15px] text-[15px] font-medium text-white transition-all hover:bg-gray-800">
                    Search flight
                </button>
                <button
                    onClick={() => setIsLiked(!isLiked)}
                    className="flex h-[54px] w-[54px] items-center justify-center rounded-full border border-gray-200 bg-white transition-all hover:border-red-200"
                >
                    <Heart
                        className={`h-5 w-5 transition-colors ${isLiked
                            ? "fill-red-500 text-red-500"
                            : "text-gray-300 hover:text-red-400"
                            }`}
                    />
                </button>
            </div>
        </div>
    );
}
