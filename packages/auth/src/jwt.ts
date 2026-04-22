/**
 * JWT issuance & verification.
 *
 * Two tokens, two concerns:
 *  - ACCESS  — short-lived (15m), carries the user's role keys so the API
 *              doesn't need a DB round-trip for permission checks.
 *  - REFRESH — long-lived (30d), opaque to the client (it contains a session
 *              reference); rotating a refresh token revokes the old session
 *              row in the database.
 *
 * We use EdDSA (Ed25519) keys — smaller than RSA, fast, and the private key
 * never leaves the API process. Keys are loaded from env at boot and
 * rotated via a signing-kid header so in-flight tokens keep verifying while
 * new tokens are issued under the new key.
 */
import { errors, jwtVerify, SignJWT } from 'jose';

import { UnauthenticatedError } from '@hha/shared/errors';

import type { RoleKey } from '@hha/shared/permissions';

export interface AccessTokenClaims {
  sub: string;
  sid: string;
  sch: string;
  roles: RoleKey[];
  mfa: boolean;
}

export interface RefreshTokenClaims {
  sub: string;
  sid: string;
  typ: 'refresh';
}

export interface JwtSigner {
  signAccess(claims: AccessTokenClaims, ttlSeconds?: number): Promise<string>;
  signRefresh(claims: RefreshTokenClaims, ttlSeconds?: number): Promise<string>;
  verifyAccess(token: string): Promise<AccessTokenClaims>;
  verifyRefresh(token: string): Promise<RefreshTokenClaims>;
}

export interface JwtConfig {
  issuer: string;
  audience: string;
  privateKey: CryptoKey;
  publicKey: CryptoKey;
  kid: string;
  accessTtlSeconds?: number;
  refreshTtlSeconds?: number;
}

const DEFAULT_ACCESS_TTL = 15 * 60;
const DEFAULT_REFRESH_TTL = 30 * 24 * 60 * 60;

export function createJwtSigner(cfg: JwtConfig): JwtSigner {
  const accessTtl = cfg.accessTtlSeconds ?? DEFAULT_ACCESS_TTL;
  const refreshTtl = cfg.refreshTtlSeconds ?? DEFAULT_REFRESH_TTL;

  async function sign(
    payload: Record<string, unknown>,
    ttlSeconds: number,
    headerTyp: string,
  ): Promise<string> {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: 'EdDSA', kid: cfg.kid, typ: headerTyp })
      .setIssuedAt()
      .setIssuer(cfg.issuer)
      .setAudience(cfg.audience)
      .setExpirationTime(`${ttlSeconds}s`)
      .sign(cfg.privateKey);
  }

  async function verify<T extends Record<string, unknown>>(token: string, typ: string): Promise<T> {
    try {
      const { payload, protectedHeader } = await jwtVerify(token, cfg.publicKey, {
        issuer: cfg.issuer,
        audience: cfg.audience,
      });
      if (protectedHeader.typ !== typ) {
        throw new UnauthenticatedError(`Wrong token type: expected ${typ}`);
      }
      return payload as unknown as T;
    } catch (err) {
      if (err instanceof errors.JOSEError) {
        throw new UnauthenticatedError(`Token rejected: ${err.code}`);
      }
      throw err;
    }
  }

  return {
    signAccess: (claims, ttl = accessTtl) =>
      sign(claims as unknown as Record<string, unknown>, ttl, 'at+jwt'),
    signRefresh: (claims, ttl = refreshTtl) =>
      sign(claims as unknown as Record<string, unknown>, ttl, 'rt+jwt'),
    verifyAccess: (token) => verify<AccessTokenClaims>(token, 'at+jwt'),
    verifyRefresh: (token) => verify<RefreshTokenClaims>(token, 'rt+jwt'),
  };
}
