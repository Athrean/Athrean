"use client"

interface FileFolder3DProps {
  title: string
  description: string
}

export function FileFolder3D({ title, description }: FileFolder3DProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="file group relative w-60 h-40 cursor-pointer origin-bottom z-50 mb-6" style={{ perspective: "1500px" }}>
        {/* Main folder container */}
        <div className="work-5 bg-zinc-700 w-full h-full origin-top rounded-2xl rounded-tl-none group-hover:shadow-[0_20px_40px_rgba(0,0,0,.4)] transition-all ease duration-300 relative after:absolute after:content-[''] after:bottom-[99%] after:left-0 after:w-20 after:h-4 after:bg-zinc-700 after:rounded-t-2xl before:absolute before:content-[''] before:-top-[15px] before:left-[75.5px] before:w-4 before:h-4 before:bg-zinc-700 before:[clip-path:polygon(0_35%,0%_100%,50%_100%)]"></div>

        {/* Layered papers */}
        <div className="work-4 absolute inset-1 bg-zinc-600 rounded-2xl transition-all ease duration-300 origin-bottom select-none group-hover:[transform:rotateX(-20deg)]"></div>
        <div className="work-3 absolute inset-1 bg-zinc-500 rounded-2xl transition-all ease duration-300 origin-bottom group-hover:[transform:rotateX(-30deg)]"></div>
        <div className="work-2 absolute inset-1 bg-zinc-400 rounded-2xl transition-all ease duration-300 origin-bottom group-hover:[transform:rotateX(-38deg)]"></div>

        {/* Top paper */}
        <div className="work-1 absolute bottom-0 bg-gradient-to-t from-zinc-600 to-zinc-500 w-full h-[156px] rounded-2xl rounded-tr-none after:absolute after:content-[''] after:bottom-[99%] after:right-0 after:w-[146px] after:h-[16px] after:bg-zinc-500 after:rounded-t-2xl before:absolute before:content-[''] before:-top-[10px] before:right-[142px] before:size-3 before:bg-zinc-500 before:[clip-path:polygon(100%_14%,50%_100%,100%_100%)] transition-all ease duration-300 origin-bottom flex items-end group-hover:shadow-[inset_0_20px_40px_#71717a,_inset_0_-20px_40px_#3f3f46] group-hover:[transform:rotateX(-46deg)_translateY(1px)]"></div>
      </div>

      <h3 className="text-xl font-semibold text-zinc-200 mb-2 text-center">{title}</h3>
      <p className="text-zinc-500 text-sm text-center max-w-md">{description}</p>
    </div>
  )
}
