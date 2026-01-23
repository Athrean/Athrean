export function Divider(): React.ReactElement {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-zinc-700" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="bg-[#0f0f14] px-4 text-zinc-500">Or</span>
      </div>
    </div>
  )
}
