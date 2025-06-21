import { NextResponse } from 'next/server'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  return NextResponse.json({ 
    success: true,
    env_debug: {
      url: supabaseUrl || 'MISSING',
      key_length: supabaseKey?.length || 0,
      url_length: supabaseUrl?.length || 0
    }
  })
}
