import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly keycloakBaseUrl = 'http://localhost:7890';
  private readonly keycloakRealm = 'toyota';
  private readonly keycloakClientId = 'factory-portal';
  private readonly scope = 'openid profile email';
  private readonly accessTokenKey = 'kc_access_token';
  private readonly refreshTokenKey = 'kc_refresh_token';
  private readonly idTokenKey = 'kc_id_token';
  private readonly expiresAtKey = 'kc_expires_at';
  private readonly stateKey = 'kc_oidc_state';
  private readonly nonceKey = 'kc_oidc_nonce';
  private readonly codeVerifierKey = 'kc_oidc_code_verifier';

  private base64UrlEncode(bytes: Uint8Array): string {
    const text = btoa(String.fromCharCode(...bytes));
    return text.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  private randomString(byteLength: number): string {
    const bytes = new Uint8Array(byteLength);
    crypto.getRandomValues(bytes);
    return this.base64UrlEncode(bytes);
  }

  private async sha256Base64Url(value: string): Promise<string> {
    const data = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return this.base64UrlEncode(new Uint8Array(digest));
  }

  isAuthenticated(): boolean {
    const token = sessionStorage.getItem(this.accessTokenKey);
    const expiresAt = Number(sessionStorage.getItem(this.expiresAtKey) || '0');
    return Boolean(token) && expiresAt > Date.now() + 5000;
  }

  async redirectToLogin(): Promise<void> {
    const state = this.randomString(24);
    const nonce = this.randomString(24);
    const codeVerifier = this.randomString(48);
    const codeChallenge = await this.sha256Base64Url(codeVerifier);

    sessionStorage.setItem(this.stateKey, state);
    sessionStorage.setItem(this.nonceKey, nonce);
    sessionStorage.setItem(this.codeVerifierKey, codeVerifier);

    const authUrl = new URL(
      `${this.keycloakBaseUrl}/realms/${encodeURIComponent(this.keycloakRealm)}/protocol/openid-connect/auth`,
    );
    authUrl.searchParams.set('client_id', this.keycloakClientId);
    authUrl.searchParams.set('redirect_uri', `${window.location.origin}/auth/callback`);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', this.scope);
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('nonce', nonce);
    authUrl.searchParams.set('code_challenge', codeChallenge);
    authUrl.searchParams.set('code_challenge_method', 'S256');
    window.location.assign(authUrl.toString());
  }

  async completeLoginFromCallback(queryString: string): Promise<boolean> {
    const params = new URLSearchParams(queryString);
    const code = params.get('code');
    const state = params.get('state');
    const storedState = sessionStorage.getItem(this.stateKey);
    const codeVerifier = sessionStorage.getItem(this.codeVerifierKey);

    if (!code || !state || !storedState || !codeVerifier || state !== storedState) {
      this.clearSession();
      return false;
    }

    const tokenUrl = `${this.keycloakBaseUrl}/realms/${encodeURIComponent(this.keycloakRealm)}/protocol/openid-connect/token`;
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: this.keycloakClientId,
      code,
      redirect_uri: `${window.location.origin}/auth/callback`,
      code_verifier: codeVerifier,
    });

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    if (!response.ok) {
      this.clearSession();
      return false;
    }

    const tokenResponse = (await response.json()) as {
      access_token: string;
      refresh_token?: string;
      id_token?: string;
      expires_in: number;
    };

    this.persistSession(tokenResponse);
    sessionStorage.removeItem(this.stateKey);
    sessionStorage.removeItem(this.nonceKey);
    sessionStorage.removeItem(this.codeVerifierKey);
    return true;
  }

  async refreshSession(): Promise<boolean> {
    const refreshToken = sessionStorage.getItem(this.refreshTokenKey);
    if (!refreshToken) return false;

    const tokenUrl = `${this.keycloakBaseUrl}/realms/${encodeURIComponent(this.keycloakRealm)}/protocol/openid-connect/token`;
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: this.keycloakClientId,
      refresh_token: refreshToken,
    });

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    if (!response.ok) {
      this.clearSession();
      return false;
    }

    const tokenResponse = (await response.json()) as {
      access_token: string;
      refresh_token?: string;
      id_token?: string;
      expires_in: number;
    };
    this.persistSession(tokenResponse);
    return true;
  }

  logout(): void {
    const idTokenHint = sessionStorage.getItem(this.idTokenKey);
    this.clearSession();

    const logoutUrl = new URL(
      `${this.keycloakBaseUrl}/realms/${encodeURIComponent(this.keycloakRealm)}/protocol/openid-connect/logout`,
    );
    logoutUrl.searchParams.set('client_id', this.keycloakClientId);
    logoutUrl.searchParams.set('post_logout_redirect_uri', `${window.location.origin}/login`);
    if (idTokenHint) logoutUrl.searchParams.set('id_token_hint', idTokenHint);
    // Use replace to prevent returning to protected page via Back history entry.
    window.location.replace(logoutUrl.toString());
  }

  private persistSession(response: {
    access_token: string;
    refresh_token?: string;
    id_token?: string;
    expires_in: number;
  }): void {
    const expiresAt = Date.now() + response.expires_in * 1000;
    sessionStorage.setItem(this.accessTokenKey, response.access_token);
    if (response.refresh_token) sessionStorage.setItem(this.refreshTokenKey, response.refresh_token);
    if (response.id_token) sessionStorage.setItem(this.idTokenKey, response.id_token);
    sessionStorage.setItem(this.expiresAtKey, String(expiresAt));
  }

  private clearSession(): void {
    sessionStorage.removeItem(this.accessTokenKey);
    sessionStorage.removeItem(this.refreshTokenKey);
    sessionStorage.removeItem(this.idTokenKey);
    sessionStorage.removeItem(this.expiresAtKey);
  }
}
