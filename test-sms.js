// Quick test script to send SMS via SlickText API
const API_KEY = 'e3171f531d78387a95e4979f5cc3fb171677cb53e656543684ad2a3d7644f092b11489';
const BRAND_ID = '11489';
const BASE_URL = 'https://dev.slicktext.com/v1';

// Test sending SMS to existing contact
async function testSMS() {
  try {
    console.log('Testing SMS to existing contact...');

    const response = await fetch(`${BASE_URL}/brands/${BRAND_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contact_id: 37910017, // Stephen's contact ID from API
        body: '🚀 Test SMS from Pupperazi Lead Form! 🐾',
        channel: 'sms'
      }),
    });

    const result = await response.text();
    console.log('Response status:', response.status);
    console.log('Response:', result);

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testSMS();
