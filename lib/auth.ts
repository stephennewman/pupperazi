import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Admin password from environment
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Secret for signing tokens (use ADMIN_PASSWORD as base)
const TOKEN_SECRET = process.env.ADMIN_PASSWORD || 'pupperazi-admin-secret-2024';

// Token expiration time (24 hours in milliseconds)
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000;

// Generate a signed token (works in serverless - no server-side storage needed)
export function generateToken(): string {
  const timestamp = Date.now();
  const data = `admin:${timestamp}`;
  const signature = crypto
    .createHmac('sha256', TOKEN_SECRET)
    .update(data)
    .digest('hex')
    .substring(0, 16); // Short signature
  
  // Token format: base64(timestamp:signature)
  const token = Buffer.from(`${timestamp}:${signature}`).toString('base64');
  return token;
}

// Validate admin password
export function validatePassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

// Validate token (stateless - works in serverless)
export function validateToken(token: string | null): boolean {
  if (!token) return false;
  
  try {
    // Decode the token
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [timestampStr, signature] = decoded.split(':');
    const timestamp = parseInt(timestampStr, 10);
    
    if (isNaN(timestamp)) return false;
    
    // Check if token is expired
    if (Date.now() - timestamp > TOKEN_EXPIRY) {
      return false;
    }
    
    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', TOKEN_SECRET)
      .update(`admin:${timestamp}`)
      .digest('hex')
      .substring(0, 16);
    
    return signature === expectedSignature;
  } catch {
    return false;
  }
}

// Middleware to check authentication
export function requireAuth(handler: (request: NextRequest) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    // Get token from Authorization header
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '') || null;
    
    // Validate token
    if (!validateToken(token)) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid or expired token' },
        { status: 401 }
      );
    }
    
    // Token is valid, proceed with request
    return handler(request);
  };
}
