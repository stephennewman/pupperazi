import { NextRequest, NextResponse } from 'next/server';

// Simple admin password (in production, this should be hashed and stored securely)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Simple token generation (in production, use JWT or similar)
function generateToken(): string {
  return Buffer.from(`${Date.now()}:${Math.random()}`).toString('base64');
}

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    // Check password
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken();

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      token: token
    });

  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
