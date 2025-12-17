import Link from "next/link"

interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps): React.ReactElement {
  return (
    <div className="flex h-screen w-full">
      <div className="flex flex-1 flex-col px-6 py-12 lg:px-16 xl:px-24 bg-white">
        <div className="mx-auto w-full max-w-[520px] flex-grow flex flex-col justify-center">
          {children}
        </div>

        <div className="mx-auto w-full max-w-[520px] flex items-center justify-center gap-8 text-[13px] text-gray-400 pb-6">
          <Link href="/help" className="hover:text-gray-600 transition-colors">
            Help
          </Link>
          <Link href="/terms" className="hover:text-gray-600 transition-colors">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-gray-600 transition-colors">
            Privacy
          </Link>
        </div>
      </div>

      <div className="hidden lg:block lg:flex-1 relative overflow-hidden bg-gray-100">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop"
          alt="Mountain landscape"
          className="absolute inset-0 h-full w-full object-cover grayscale"
        />
      </div>
    </div>
  )
}
