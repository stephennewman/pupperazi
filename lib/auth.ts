import { NextRequest, NextResponse } from 'next/server';

// Admin password from environment
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// In-memory token store (in production, use Redis or database)
const validTokens = new Set<string>();

// Token expiration time (24 hours)
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000;

interface TokenData {
  token: string;
  createdAt: number;
}

// Store tokens with expiration
const tokenStore = new Map<string, TokenData>();

// Generate secure token
export function generateToken(): string {
  const token = Buffer.from(`${Date.now()}:${Math.random()}:${Math.random()}`).toString('base64');
  const tokenData: TokenData = {
    token,
    createdAt: Date.now()
  };
  tokenStore.set(token, tokenData);
  return token;
}

// Validate admin password
export function validatePassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

// Validate token
export function validateToken(token: string | null): boolean {
  if (!token) return false;
  
  const tokenData = tokenStore.get(token);
  if (!tokenData) return false;
  
  // Check if token is expired
  if (Date.now() - tokenData.createdAt > TOKEN_EXPIRY) {
    tokenStore.delete(token);
    return false;
  }
  
  return true;
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

// Clean up expired tokens periodically
setInterval(() => {
  const now = Date.now();
  for (const [token, data] of tokenStore.entries()) {
    if (now - data.createdAt > TOKEN_EXPIRY) {
      tokenStore.delete(token);
    }
  }
}, 60 * 60 * 1000); // Run every hour

