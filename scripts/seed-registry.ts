#!/usr/bin/env bun
/**
 * Registry Seed Script
 * Seeds the registry_items table with AI lego components from the generated registry.
 * Usage: bun db:seed-registry
 * 
 * Prerequisites:
 * 1. Run migration 003_component_library_refactor.sql first
 * 2. Run bun generate:registry to generate the registry files
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

// Load env from apps/web/.env
const envPath = join(import.meta.dir, '../apps/web/.env')
if (existsSync(envPath)) {
    const envContent = readFileSync(envPath, 'utf-8')
    for (const line of envContent.split('\n')) {
        const [key, ...valueParts] = line.split('=')
        if (key && valueParts.length > 0) {
            const value = valueParts.join('=').trim()
            process.env[key.trim()] = value.replace(/^["']|["']$/g, '')
        }
    }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing environment variables!')
    console.error('   Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
    console.error('   Make sure apps/web/.env file exists and contains these variables.')
    process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false }
})

async function seedRegistry(): Promise<void> {
    console.log('🧱 Seeding registry items...\n')

    // Check if registry.json exists
    const registryPath = join(import.meta.dir, '../apps/web/public/r/registry.json')
    if (!existsSync(registryPath)) {
        console.error('❌ Registry file not found!')
        console.error('   Run `bun generate:registry` first in apps/web/')
        process.exit(1)
    }

    // Load registry
    const registry = JSON.parse(readFileSync(registryPath, 'utf-8'))
    console.log(`📦 Found ${registry.items.length} items in registry\n`)

    // Transform registry items to database format
    const items = registry.items.map((item: any) => ({
        name: item.name,
        type: item.type,
        title: item.title,
        description: item.description || null,
        author: item.author,
        category_id: item.categories?.[0] || null,
        registry_dependencies: item.registryDependencies || [],
        dependencies: item.dependencies ? Object.fromEntries(
            (item.dependencies as string[]).map(d => [d, 'latest'])
        ) : {},
        dev_dependencies: item.devDependencies ? Object.fromEntries(
            (item.devDependencies as string[]).map(d => [d, 'latest'])
        ) : {},
        files: item.files || [],
        iframe_height: '400px',
        is_pro: false,
        is_featured: true,
        tags: item.categories || [],
    }))

    // Clear existing items
    const { error: deleteError } = await supabase
        .from('registry_items')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000')

    if (deleteError) {
        console.error('⚠️  Could not clear existing items:', deleteError.message)
    }

    // Insert new items
    const { data, error } = await supabase
        .from('registry_items')
        .insert(items)
        .select()

    if (error) {
        console.error('❌ Failed to seed:', error.message)
        console.error('   Details:', error.details)
        console.error('\n   Make sure you have run the migration first!')
        console.error('   Migration file: supabase/migrations/003_component_library_refactor.sql')
        process.exit(1)
    }

    console.log(`✅ Seeded ${data.length} registry items:\n`)
    data.forEach((item: any) => console.log(`   • ${item.name} - ${item.title}`))
    console.log('\n🎉 Registry seeding complete!')
}

seedRegistry()
