"use client";

import { motion } from "framer-motion";

function Bear() {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 405 370"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
        {/* Bear body - using zinc-400 for visibility */}
        <path d="M0 0 C11.40617806 5.97993801 17.81237105 13.33381139 23 25 C26.70447647 24.35457397 30.04000261 23.30356366 33.5625 22 C39.81904983 19.91196161 45.42837013 19.18313224 52 19 C52.79229004 18.96358398 53.58458008 18.92716797 54.40087891 18.88964844 C66.16659272 18.37366541 76.40084819 18.90762955 87.56640625 22.80859375 C90.40062763 23.79202665 93.04984048 24.507363 96 25 C96.70962891 23.62328125 96.70962891 23.62328125 97.43359375 22.21875 C101.58922545 14.4048418 105.6253236 8.18727238 113 3 C114.01707031 2.21302734 114.01707031 2.21302734 115.0546875 1.41015625 C123.34601557 -3.91576801 134.55553924 -3.28166687 144 -2 C148.60714045 -0.66635408 152.12799101 1.1971729 156 4 C157.22396484 4.8353125 157.22396484 4.8353125 158.47265625 5.6875 C166.05741517 11.56283913 171.1222687 20.10574604 172.53515625 29.59375 C172.85051229 41.98861339 170.24738255 52.58568379 162 62 C154.85976628 69.07011686 154.85976628 69.07011686 151 71 C152.35591161 74.71546368 154.09028402 77.7596911 156.25 81.0625 C161.22774858 89.42802736 163.51433808 98.65280338 166 108 C166.19795166 108.68529785 166.39590332 109.3705957 166.59985352 110.07666016 C169.55102528 120.71768982 169.58056707 133.87021548 165 144 C164.32130859 145.51787109 164.32130859 145.51787109 163.62890625 147.06640625 C151.37725405 171.95165664 124.9648193 188.0038531 101.25 200.4375 C100.15018799 201.01677246 99.05037598 201.59604492 97.91723633 202.19287109 C91.17535746 205.6459428 84.42172361 208.42790714 77.23144531 210.81347656 C72.82888179 212.43001167 68.80792326 214.58322256 64.71875 216.86328125 C60.96922447 218.4309708 58.06867464 218.80154816 54.20361328 217.30395508 C52.2037762 216.34406407 50.25930384 215.31321123 48.3125 214.25 C43.85778459 211.91354722 39.54564247 209.69061386 34.75 208.125 C20.08563972 203.08964737 6.53223525 195.01615517 -6 186 C-7.56814453 184.89011719 -7.56814453 184.89011719 -9.16796875 183.7578125 C-15.55429674 179.11471246 -21.46724032 174.10062516 -27.18359375 168.66796875 C-28.91277258 167.02992556 -30.67045993 165.42062942 -32.47265625 163.86328125 C-41.18511237 156.01758749 -47.36376203 144.52589631 -48.14941406 132.76293945 C-48.80771266 119.34168248 -47.57519709 107.6359552 -43 95 C-42.59265625 93.86820312 -42.1853125 92.73640625 -41.765625 91.5703125 C-39.44780509 85.65535651 -36.56860396 80.30326762 -33.13671875 74.9609375 C-31.83282942 73.08938047 -31.83282942 73.08938047 -32 71 C-33.32021932 70.1138664 -34.68366594 69.29185128 -36.0625 68.5 C-43.9957869 63.37330045 -49.06675956 54.89434197 -52 46 C-54.09882868 35.57724532 -54.26125306 26.21635151 -48.88671875 16.8203125 C-37.75664036 0.18280402 -19.36469781 -8.62692699 0 0 Z " fill="#a1a1aa" transform="translate(158,78)"/>
        
        {/* Face/snout area */}
        <path d="M0 0 C1.72950862 1.62468992 3.36137301 3.28580526 5 5 C9.1958876 9.28396921 13.3803105 13.53529118 17.9375 17.4375 C19.29228641 18.6242929 20.646407 19.81184614 22 21 C22.84046875 21.71414062 23.6809375 22.42828125 24.546875 23.1640625 C32.96580956 30.81084626 37.01613213 39.58372746 37.625 51 C37.14151204 61.04580536 33.29826504 71.8933743 26 79 C16.41235261 87.05894105 7.34465172 90.8176664 -5.24609375 90.44921875 C-14.97824741 89.28460099 -24.19523834 84.523764 -30.64453125 77.109375 C-36.67054358 68.87128219 -41.06406888 58.09305992 -40.47265625 47.78125 C-38.62975006 36.93704167 -33.82501789 29.48527622 -26 22 C-25.42862305 21.45166504 -24.85724609 20.90333008 -24.26855469 20.33837891 C-19.90134197 16.16387087 -15.46277206 12.07182673 -11 8 C-10.04480469 7.11828125 -9.08960938 6.2365625 -8.10546875 5.328125 C-2.25775709 0 -2.25775709 0 0 0 Z " fill="#d4d4d8" transform="translate(219,184)"/>
        
        {/* Nose/mouth details */}
        <path d="M0 0 C3.16545415 1.37628441 4.4709792 2.0909532 5.875 5.25 C5.69935094 9.11427931 5.22064894 10.85131498 2.66015625 13.8046875 C1.31244141 14.95324219 1.31244141 14.95324219 -0.0625 16.125 C-0.95839844 16.90617187 -1.85429687 17.68734375 -2.77734375 18.4921875 C-5.125 20.25 -5.125 20.25 -7.125 20.25 C-7.03791331 21.70945288 -6.92973093 23.16765868 -6.8125 24.625 C-6.75449219 25.43710938 -6.69648438 26.24921875 -6.63671875 27.0859375 C-6.29509472 29.62921338 -6.29509472 29.62921338 -3.125 31.25 C0.42078685 31.41025399 0.42078685 31.41025399 3.875 30.25 C5.88541003 27.31550592 5.88541003 27.31550592 6.875 24.25 C8.195 24.58 9.515 24.91 10.875 25.25 C10.39653935 29.55614589 9.21573619 31.49880549 5.875 34.25 C2.31028609 35.43823797 -0.3808336 35.51274852 -4.125 35.25 C-4.82625 34.71375 -5.5275 34.1775 -6.25 33.625 C-6.86875 33.17125 -7.4875 32.7175 -8.125 32.25 C-10.51763407 32.91771183 -12.34597385 33.47097385 -14.125 35.25 C-18.77745475 35.64427583 -21.28089018 35.63368628 -25.5625 33.6875 C-28.78869248 30.61868276 -28.95712371 28.61478343 -29.125 24.25 C-27.25 24.4375 -27.25 24.4375 -25.125 25.25 C-23.875 27.8125 -23.875 27.8125 -23.125 30.25 C-17.90851897 30.69308651 -17.90851897 30.69308651 -13.125 29.125 C-11.60183382 26.26906341 -11.6947712 24.45539832 -12.125 21.25 C-14.0759716 19.12835517 -15.83612816 17.45899451 -18.0625 15.6875 C-23.84688278 11.01371871 -23.84688278 11.01371871 -25.109375 7.546875 C-25.125 5.25 -25.125 5.25 -23.4375 3.0625 C-16.74047749 -2.18651765 -8.10867964 -1.94469405 0 0 Z " fill="#52525b" transform="translate(227.125,219.75)"/>
        
        {/* Eyes */}
        <path d="M0 0 C3.5 0.25 3.5 0.25 5.5 2.25 C5.80078125 5.18359375 5.80078125 5.18359375 5.8125 8.6875 C5.82925781 9.84121094 5.84601563 10.99492187 5.86328125 12.18359375 C5.5 15.25 5.5 15.25 4.13671875 17.13671875 C1.78805712 18.73425709 0.2767015 18.66650522 -2.5 18.25 C-4.13671875 17.13671875 -4.13671875 17.13671875 -5.5 15.25 C-5.86328125 12.18359375 -5.86328125 12.18359375 -5.8125 8.6875 C-5.80863281 7.53121094 -5.80476562 6.37492188 -5.80078125 5.18359375 C-5.34860526 0.77340973 -4.37661923 0.31261566 0 0 Z " fill="#18181b" transform="translate(177.5,177.75)"/>
        <path d="M0 0 C2.77809395 2.77809395 2.29955703 4.56755203 2.3125 8.4375 C2.32925781 9.59121094 2.34601563 10.74492187 2.36328125 11.93359375 C2 15 2 15 0.63671875 16.88671875 C-1.71194288 18.48425709 -3.2232985 18.41650522 -6 18 C-7.640625 16.85546875 -7.640625 16.85546875 -9 15 C-9.328125 12.15234375 -9.328125 12.15234375 -9.25 8.9375 C-9.23453125 7.87402344 -9.2190625 6.81054688 -9.203125 5.71484375 C-9 3 -9 3 -8 1 C-5.03104944 0.01034981 -3.0913386 -0.23779528 0 0 Z " fill="#18181b" transform="translate(261,178)"/>
    </svg>
  );
}

function Tree() {
  return (
    <svg 
        width="50" 
        height="80" 
        viewBox="0 0 50 80" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
    >
        {/* Tree trunk */}
        <rect x="20" y="50" width="10" height="30" fill="#71717a" />
        
        {/* Tree foliage - triangular layers */}
        <polygon points="25,0 45,30 5,30" fill="#52525b" />
        <polygon points="25,15 50,50 0,50" fill="#52525b" />
    </svg>
  )
}

function Cloud() {
    return (
        <svg width="60" height="30" viewBox="0 0 60 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="20" cy="20" rx="15" ry="10" fill="#3f3f46"/>
            <ellipse cx="35" cy="15" rx="18" ry="12" fill="#3f3f46"/>
            <ellipse cx="50" cy="20" rx="12" ry="8" fill="#3f3f46"/>
        </svg>
    )
}

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <div className="relative w-full max-w-[300px] h-36 flex items-end justify-center mb-6 overflow-hidden">
        
        {/* Clouds */}
        <motion.div
            className="absolute top-2"
            initial={{ x: 300, opacity: 0.7 }}
            animate={{ x: -100, opacity: 0.7 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
            <Cloud />
        </motion.div>
        
        <motion.div
            className="absolute top-8"
            initial={{ x: 350, opacity: 0.5 }}
            animate={{ x: -150, opacity: 0.5 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 5 }}
        >
            <Cloud />
        </motion.div>

        {/* Ground Line */}
        <div className="absolute bottom-[2px] left-0 right-0 h-[2px] bg-zinc-700 w-full" />

        {/* Bear Container - positioned left, bouncing as it "runs" */}
        <div className="absolute left-8 bottom-[4px] z-10">
            <motion.div
                animate={{ 
                    y: [0, -8, 0],
                    rotate: [0, 2, 0, -2, 0]
                }}
                transition={{ 
                    duration: 0.4, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                }}
            >
                <Bear />
            </motion.div>
        </div>

        {/* Trees coming from the right */}
        <motion.div 
            className="absolute bottom-[4px]"
            initial={{ x: 350 }}
            animate={{ x: -100 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
            <Tree />
        </motion.div>
        
        <motion.div 
            className="absolute bottom-[4px]"
            initial={{ x: 500 }}
            animate={{ x: -100 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 2 }}
        >
            <Tree />
        </motion.div>

        {/* Overlay Gradients to fade edges */}
        <div className="absolute inset-y-0 left-0 w-16 bg-linear-to-r from-zinc-950 to-transparent z-20" />
        <div className="absolute inset-y-0 right-0 w-16 bg-linear-to-l from-zinc-950 to-transparent z-20" />
        
      </div>
      
      <h3 className="text-zinc-200 font-medium mb-2">What shall we build?</h3>
      <p className="text-sm text-zinc-500 max-w-xs leading-relaxed mb-6">
        Describe your component or app idea, and I'll generate the code for you instantly.
      </p>

      {/* Prompt Suggestions */}
      <PromptSuggestions />
    </div>
  );
}

// ============================================================================
// PROMPT SUGGESTIONS
// ============================================================================

const SUGGESTIONS = [
  {
    label: "Landing page",
    prompt: "Create a modern SaaS landing page with a hero section, features grid, pricing table, and footer. Use a dark theme with gradient accents.",
  },
  {
    label: "Dashboard",
    prompt: "Build an analytics dashboard with a sidebar navigation, stats cards, a line chart, and a recent activity table. Dark mode with clean design.",
  },
  {
    label: "Auth flow",
    prompt: "Create a complete authentication flow with login, signup, and forgot password pages. Include form validation and social login buttons.",
  },
  {
    label: "E-commerce",
    prompt: "Build a product listing page with a search bar, filter sidebar, product cards with images, and a shopping cart drawer.",
  },
]

function PromptSuggestions(): React.ReactElement {
  return (
    <div className="flex flex-wrap gap-2 justify-center max-w-sm">
      {SUGGESTIONS.map((suggestion) => (
        <SuggestionChip key={suggestion.label} {...suggestion} />
      ))}
    </div>
  )
}

function SuggestionChip({
  label,
  prompt,
}: {
  label: string
  prompt: string
}): React.ReactElement {
  // Dispatch a custom event that the ChatInput can listen to
  const handleClick = (): void => {
    window.dispatchEvent(
      new CustomEvent('athrean:suggestion', { detail: { prompt } })
    )
  }

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="px-3 py-1.5 text-xs font-medium text-zinc-400 bg-zinc-800/50 hover:bg-zinc-800 hover:text-zinc-200 rounded-full border border-zinc-700/50 hover:border-zinc-600 transition-colors"
    >
      {label}
    </motion.button>
  )
}
