import { describe, expect, it, vi } from 'vitest';
// The static page and tests use the same browser-safe auth policy.
// @ts-expect-error Static JavaScript module has no declaration file.
import { MIN_PASSWORD_LENGTH, passwordValidationMessage, authErrorMessage, runAuthAttempt } from '../../public/econods-auth-policy.js';

describe('Registration password rules', () => {
  it('accepts exactly six digits for local length validation', () => {
    expect(MIN_PASSWORD_LENGTH).toBe(6);
    expect(passwordValidationMessage('482917')).toBe('');
  });
  it('rejects fewer than six characters', () => {
    expect(passwordValidationMessage('48291')).not.toBe('');
  });
  it('does not trim password characters', () => {
    expect(passwordValidationMessage(' abcd ')).toBe('');
  });
  it('distinguishes leaked passwords from length rejection', () => {
    const leaked = authErrorMessage({ code: 'weak_password', reasons: ['pwned'] });
    const length = authErrorMessage({ message: 'Password should be at least 8 characters' });
    expect(leaked).not.toBe(length);
  });
  it('always releases submission after a network failure', async () => {
    const setLoading = vi.fn();
    const onError = vi.fn();
    const onResult = vi.fn();
    await runAuthAttempt({ request: () => Promise.reject(new TypeError('Failed to fetch')), onResult, onError, setLoading });
    expect(setLoading.mock.calls).toEqual([[true], [false]]);
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onResult).not.toHaveBeenCalled();
  });
  it('does not declare successful registration after a service rejection', async () => {
    const onResult = vi.fn();
    const onError = vi.fn();
    await runAuthAttempt({ request: async () => ({ data: null, error: { code: 'weak_password', reasons: ['pwned'] } }), onResult, onError, setLoading: vi.fn() });
    expect(onResult).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledTimes(1);
  });
});