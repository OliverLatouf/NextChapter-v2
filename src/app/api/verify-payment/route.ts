import { NextRequest, NextResponse } from 'next/server'
import { getServerStripe } from '@/lib/stripe'
import { supabaseServer } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  console.log('=== VERIFY PAYMENT API CALLED ===')
  
  try {
    const stripe = getServerStripe()
    const url = new URL(request.url)
    const sessionId = url.searchParams.get('session_id')

    console.log('Session ID extracted:', sessionId)

    if (!sessionId) {
      return NextResponse.json({ 
        error: 'No session ID provided'
      }, { status: 400 })
    }

    console.log('Retrieving Stripe session for:', sessionId)
    
    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    console.log('Stripe session:', {
      id: session.id,
      payment_status: session.payment_status,
      metadata: session.metadata
    })

    if (session.payment_status === 'paid') {
      console.log('Payment confirmed, checking for existing subscription...')
      
      // Check if subscription already exists
      const { data: existingSubscription } = await supabaseServer
        .from('subscriptions')
        .select('*')
        .eq('user_id', session.metadata?.userId)
        .eq('story_id', session.metadata?.storyId)
        .single()

      if (existingSubscription) {
        console.log('Subscription already exists:', existingSubscription.id)
        return NextResponse.json({
          success: true,
          storyTitle: session.metadata?.storyTitle,
          amount: session.amount_total,
          subscription: [existingSubscription],
          message: 'Subscription already exists'
        })
      }

      // Create new subscription
      const { data: subscription, error: subscriptionError } = await supabaseServer
        .from('subscriptions')
        .insert([
          {
            user_id: session.metadata?.userId,
            story_id: session.metadata?.storyId,
            status: 'active',
            stripe_payment_id: session.payment_intent,
            current_chapter: 0,
          }
        ])
        .select()

      console.log('Subscription creation result:', {
        subscription,
        subscriptionError
      })

      if (subscriptionError) {
        console.error('Error creating subscription:', subscriptionError)
        return NextResponse.json({
          success: true,
          storyTitle: session.metadata?.storyTitle,
          amount: session.amount_total,
          warning: 'Payment succeeded but subscription creation failed',
          error: subscriptionError
        })
      }

      console.log('New subscription created successfully!')
      return NextResponse.json({
        success: true,
        storyTitle: session.metadata?.storyTitle,
        amount: session.amount_total,
        subscription: subscription
      })
    }

    console.log('Payment not completed, status:', session.payment_status)
    return NextResponse.json({ 
      error: 'Payment not completed', 
      payment_status: session.payment_status 
    }, { status: 400 })
    
  } catch (error) {
    console.error('=== VERIFY PAYMENT ERROR ===')
    console.error('Error details:', error)
    return NextResponse.json(
      { 
        error: 'Failed to verify payment',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
