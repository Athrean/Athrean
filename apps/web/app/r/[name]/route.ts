import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

/**
 * API Route: GET /r/[name].json
 *
 * Serves individual registry items for shadcn CLI compatibility.
 * Users can install components using:
 *   npx shadcn@latest add https://athrean.com/r/ai-01.json
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params

  // Remove .json extension if present
  const itemName = name.replace(/\.json$/, '')

  try {
    // Try to read from the generated registry files
    const registryPath = path.join(process.cwd(), 'public', 'r', `${itemName}.json`)
    const content = await fs.readFile(registryPath, 'utf-8')
    const registryItem = JSON.parse(content)

    return NextResponse.json(registryItem, {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    // If file not found, return 404
    return NextResponse.json(
      { error: 'Registry item not found' },
      { status: 404 }
    )
  }
}
