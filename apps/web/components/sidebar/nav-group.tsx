interface NavGroupProps {
    title: string
    children: React.ReactNode
    hidden?: boolean
}

export function NavGroup({ title, children, hidden }: NavGroupProps): React.ReactElement {
    return (
        <div className="mb-4">
            {!hidden && (
                <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
                    {title}
                </p>
            )}
            <div className="space-y-1">{children}</div>
        </div>
    )
}
