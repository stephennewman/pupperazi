import { createClient } from '@supabase/supabase-js';

const analyticsUrl = process.env.NEXT_PUBLIC_ANALYTICS_URL;
const analyticsKey = process.env.NEXT_PUBLIC_ANALYTICS_ANON_KEY;

export const analyticsClient = analyticsUrl && analyticsKey 
  ? createClient(analyticsUrl, analyticsKey)
  : null;

export async function trackConversion(sessionId: string) {
  if (!analyticsClient) {
    console.warn('Analytics client not configured');
    return;
  }

  try {
    // Mark session as converted
    await analyticsClient
      .from('sessions')
      .update({ converted: true, updated_at: new Date().toISOString() })
      .eq('session_id', sessionId);

    // Log conversion event
    const { data: session } = await analyticsClient
      .from('sessions')
      .select('client_id')
      .eq('session_id', sessionId)
      .single();

    if (session) {
      await analyticsClient
        .from('events')
        .insert({
          client_id: session.client_id,
          session_id: sessionId,
          event_type: 'conversion',
          url: '/api/booking',
          data: { converted_at: new Date().toISOString() }
        });
    }

    console.log('Conversion tracked:', sessionId);
  } catch (error) {
    console.error('Error tracking conversion:', error);
  }
}
