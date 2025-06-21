import { NextRequest, NextResponse } from 'next/server'
import { getServerStripe } from '@/lib/stripe'
import { supabaseServer } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  console.log('=== API ROUTE CALLED ===')
  
  try {
    const stripe = await getServerStripe()  // Added 'await' here
    const { storyId, userId } = await request.json()

    console.log('Received request:', { storyId, userId })

    // Get story details
    const { data: story, error: storyError } = await supabaseServer
      .from('stories')
      .select('*')
      .eq('id', storyId)
      .single()

    console.log('Story query result:', { story: story?.title, storyError })

    if (storyError || !story) {
      console.error('Story error:', storyError)
      return NextResponse.json({ error: 'Story not found' }, { status: 404 })
    }

    // Get user details by ID (using service role client)
    console.log('Querying user with service role client...')
    
    const { data: user, error: userError } = await supabaseServer
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    console.log('User query result:', { 
      user: user ? { id: user.id, email: user.email } : null, 
      userError: userError
    })

    if (userError || !user) {
      console.error('User not found:', userError)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    console.log('Both story and user found, creating Stripe session...')

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: story.title,
              description: `By ${story.author} - ${story.total_chapters} chapters delivered daily`,
            },
            unit_amount: story.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/`,
      customer_email: user.email,
      metadata: {
        storyId: story.id,
        userId: user.id,
        storyTitle: story.title,
      },
    })

    console.log('Stripe session created successfully:', session.id)
    return NextResponse.json({ sessionId: session.id })
    
  } catch (error) {
    console.error('=== API ERROR ===')
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}