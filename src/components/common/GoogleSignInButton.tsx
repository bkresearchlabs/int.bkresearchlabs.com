import React, { useEffect, useState } from 'react';
import { GoogleAuthSettings, UserProfile, UserRole } from '../../types';
import { api } from '../../lib/supabase';
import { ShieldCheck, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

interface GoogleSignInButtonProps {
  googleSettings?: GoogleAuthSettings;
  onSuccess: (user: UserProfile) => void;
  onError?: (error: string) => void;
  text?: string;
  className?: string;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  googleSettings,
  onSuccess,
  onError,
  text = 'Sign in with Google',
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [gisScriptLoaded, setGisScriptLoaded] = useState(false);

  const clientId = googleSettings?.client_id || '661881308022-applet-bkrl.apps.googleusercontent.com';
  const isEnabled = googleSettings?.enabled ?? true;

  // Load Google Identity Services GIS script dynamically
  useEffect(() => {
    if ((window as any).google?.accounts?.id) {
      setGisScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setGisScriptLoaded(true);
    };
    script.onerror = () => {
      console.warn('Google Identity Services script failed to load directly.');
    };
    document.head.appendChild(script);
  }, []);

  // Initialize GIS client when loaded
  useEffect(() => {
    if (!gisScriptLoaded || !isEnabled || !clientId) return;

    try {
      if ((window as any).google?.accounts?.id) {
        (window as any).google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Prompt One-Tap if configured
        if (googleSettings?.one_tap_enabled) {
          (window as any).google.accounts.id.prompt();
        }
      }
    } catch (err) {
      console.warn('GIS Init notice:', err);
    }
  }, [gisScriptLoaded, clientId, isEnabled, googleSettings?.one_tap_enabled]);

  // Handle Google Credential JWT response
  const handleCredentialResponse = async (response: any) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (!response.credential) {
        throw new Error('No credential token returned from Google.');
      }

      // Decode JWT token payload
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const googleUser = JSON.parse(jsonPayload);

      // Validate Domain restrictions if defined in settings
      if (googleSettings?.allowed_domains && googleSettings.allowed_domains.trim() !== '') {
        const allowed = googleSettings.allowed_domains
          .split(',')
          .map((d) => d.trim().toLowerCase())
          .filter(Boolean);

        const userDomain = googleUser.email.split('@')[1]?.toLowerCase();
        if (allowed.length > 0 && (!userDomain || !allowed.includes(userDomain))) {
          const domainErr = `Access restricted: Email domain '@${userDomain}' is not authorized. Allowed domains: ${googleSettings.allowed_domains}`;
          setErrorMessage(domainErr);
          if (onError) onError(domainErr);
          setIsLoading(false);
          return;
        }
      }

      // Authenticate with system API
      const user = await api.signInWithGoogleToken(
        {
          email: googleUser.email,
          given_name: googleUser.given_name || googleUser.name?.split(' ')[0],
          family_name: googleUser.family_name || googleUser.name?.split(' ').slice(1).join(' '),
          picture: googleUser.picture,
          sub: googleUser.sub,
        },
        googleSettings?.default_user_role || 'customer'
      );

      setIsLoading(false);
      onSuccess(user);
    } catch (err: any) {
      console.error('Google Auth Processing Error:', err);
      const msg = err.message || 'Failed to authenticate with Google. Please try standard sign-in.';
      setErrorMessage(msg);
      if (onError) onError(msg);
      setIsLoading(false);
    }
  };

  // Trigger Google Identity Sign-In prompt
  const handleGoogleSignInClick = () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      if ((window as any).google?.accounts?.id) {
        (window as any).google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            setIsLoading(false);
          }
        });
      } else {
        throw new Error('Google Identity Services is initializing. Please try again in a moment.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Google Sign-In prompt failed.');
      setIsLoading(false);
    }
  };

  if (!isEnabled) {
    return (
      <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-md text-amber-300 text-xs font-medium flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
        <span>Google Sign-In is currently disabled by Admin.</span>
      </div>
    );
  }

  // Get button styling based on theme settings
  const buttonTheme = googleSettings?.button_theme || 'filled_blue';
  const buttonShape = googleSettings?.button_shape || 'rectangular';

  let bgClass = 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300';
  if (buttonTheme === 'filled_blue') {
    bgClass = 'bg-[#1a73e8] hover:bg-[#1557b0] text-white border border-transparent shadow-sm';
  } else if (buttonTheme === 'filled_black') {
    bgClass = 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 shadow-sm';
  }

  let roundedClass = 'rounded-md';
  if (buttonShape === 'pill') roundedClass = 'rounded-full';
  if (buttonShape === 'rectangular') roundedClass = 'rounded-none';

  return (
    <div className="space-y-2 w-full">
      {errorMessage && (
        <div className="p-2.5 bg-red-950/70 border border-red-800 text-red-300 text-xs rounded font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <button
        type="button"
        onClick={handleGoogleSignInClick}
        disabled={isLoading}
        className={`w-full py-2.5 px-4 font-sans font-bold text-xs transition-all flex items-center justify-center gap-3 cursor-pointer shadow-sm ${bgClass} ${roundedClass} ${className}`}
      >
        {isLoading ? (
          <RefreshCw className="w-4 h-4 animate-spin text-current" />
        ) : (
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        )}
        <span>{isLoading ? 'Authenticating Google Profile...' : text}</span>
      </button>

      <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 font-mono">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          Google Identity OAuth 2.0
        </span>
        <span className="text-slate-500">
          Client: {clientId.substring(0, 16)}...
        </span>
      </div>
    </div>
  );
};
