/**
 * Format a date string into relative time like "4 min ago", "2 hours ago", "yesterday"
 */
export function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHour = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHour / 24)

    if (diffSec < 60) {
        return 'just now'
    }

    if (diffMin < 60) {
        return `${diffMin} min ago`
    }

    if (diffHour < 24) {
        return `${diffHour} hour${diffHour === 1 ? '' : 's'} ago`
    }

    if (diffDay === 1) {
        return 'yesterday'
    }

    if (diffDay < 7) {
        return `${diffDay} days ago`
    }

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/**
 * Get a label for when the project was created/updated
 */
export function getProjectTimeLabel(
    createdAt: string,
    updatedAt: string
): { text: string; type: 'created' | 'edited' } {
    const created = new Date(createdAt)
    const updated = new Date(updatedAt)

    if (updated.getTime() > created.getTime() + 60000) {
        return { text: `edited ${formatRelativeTime(updatedAt)}`, type: 'edited' }
    }

    return { text: formatRelativeTime(createdAt), type: 'created' }
}
