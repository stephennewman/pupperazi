import { NextRequest, NextResponse } from 'next/server';

// Admin password from environment
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Secret for signing tokens
const TOKEN_SECRET = process.env.ADMIN_PASSWORD || 'pupperazi-admin-2024';

// Token expiration time (24 hours in milliseconds)
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000;

// Simple hash function (works in all environments)
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

// Generate a signed token (stateless - works in serverless)
export function generateToken(): string {
  const timestamp = Date.now();
  const signature = simpleHash(`admin:${timestamp}:${TOKEN_SECRET}`);
  
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
    const parts = decoded.split(':');
    if (parts.length !== 2) return false;
    
    const [timestampStr, signature] = parts;
    const timestamp = parseInt(timestampStr, 10);
    
    if (isNaN(timestamp)) return false;
    
    // Check if token is expired
    if (Date.now() - timestamp > TOKEN_EXPIRY) {
      return false;
    }
    
    // Verify signature
    const expectedSignature = simpleHash(`admin:${timestamp}:${TOKEN_SECRET}`);
    
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
