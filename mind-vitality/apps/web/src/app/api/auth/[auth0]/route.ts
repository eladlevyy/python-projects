import { handleAuth, handleLogin, handleLogout, handleCallback } from '@auth0/nextjs-auth0';

/**
 * Auth0 API routes for Mind Vitality
 * Configured for senior-friendly passwordless authentication
 */

export const GET = handleAuth({
  /**
   * Custom login handler optimized for seniors
   * Configures passwordless authentication with clear instructions
   */
  login: handleLogin({
    authorizationParams: {
      // Request specific scopes for user profile information
      scope: 'openid profile email',
      
      // Configure for passwordless authentication
      // This will be handled by Auth0 Universal Login with passwordless connections
      connection: 'email', // Default to email passwordless
      
      // Additional parameters for senior-friendly experience
      prompt: 'login', // Always show login form for clarity
      
      // Custom parameters that can be used in Auth0 rules/actions
      // to customize the experience for seniors
      audience: process.env.AUTH0_AUDIENCE || undefined,
      
      // Language preference (can be configured based on user preference)
      ui_locales: 'en',
      
      // Custom parameters for senior-friendly UI
      screen_hint: 'senior-friendly',
    },
    
    // Return URL after successful login
    returnTo: '/',
  }),

  /**
   * Custom logout handler with senior-friendly redirect
   */
  logout: handleLogout({
    returnTo: '/',
    
    // Additional logout parameters
    logoutParams: {
      // Custom logout parameters can be added here
      // For example, to show a goodbye message
      hint: 'logout-success',
    },
  }),

  /**
   * Custom callback handler for post-authentication processing
   */
  callback: handleCallback({
    // After successful authentication, the user will be redirected
    // This can be customized to handle first-time users differently
    afterCallback: async (req, session, state) => {
      // Log successful authentication for monitoring
      console.log('User authenticated successfully:', {
        userId: session.user.sub,
        email: session.user.email,
        timestamp: new Date().toISOString(),
      });

      // You can add custom logic here for:
      // - First-time user onboarding
      // - User profile completion check
      // - Accessibility preference restoration
      // - Custom redirect logic based on user type

      // Check if this is a first-time login
      const isFirstTime = !session.user.last_login;
      if (isFirstTime) {
        // Could redirect to onboarding flow
        console.log('First-time user detected, consider onboarding flow');
      }

      return session;
    },
  }),

  /**
   * Optional: Custom signup handler
   * This would be used if you want to handle signup separately
   */
  signup: handleLogin({
    authorizationParams: {
      screen_hint: 'signup',
      scope: 'openid profile email',
      connection: 'email',
      ui_locales: 'en',
      
      // Custom parameters for signup flow
      prompt: 'login',
      
      // Additional context for Auth0 rules/actions
      signup_hint: 'senior-friendly',
    },
    returnTo: '/onboarding', // Redirect new users to onboarding
  }),
});

/**
 * Handle POST requests (currently not used but included for completeness)
 * This could be extended for custom authentication flows if needed
 */
export const POST = handleAuth();

