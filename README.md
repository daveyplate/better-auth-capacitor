# Better Auth Capacitor Plugin

A client-side plugin for [Better Auth](https://better-auth.com) that provides seamless integration with [Capacitor](https://capacitorjs.com) applications, enabling OAuth and Magic Link authentication through Universal Links.

## Installation

```bash
# npm
npm install @daveyplate/better-auth-capacitor

# pnpm
pnpm add @daveyplate/better-auth-capacitor

# yarn
yarn add @daveyplate/better-auth-capacitor

# bun
bun add @daveyplate/better-auth-capacitor
```

## Prerequisites

This plugin requires:

- A configured [Better Auth](https://better-auth.com) client
- [Capacitor](https://capacitorjs.com) with the App plugin (`@capacitor/app`)
- Properly configured Universal Links for iOS/Android

## Client Setup

### Option 1: Standard JavaScript/TypeScript Setup

```typescript
import { setupBetterAuthCapacitor } from "@daveyplate/better-auth-capacitor";
import { authClient } from "@/lib/auth-client";

// Initialize in your app's entry point
const cleanup = setupBetterAuthCapacitor({
  authClient, // Your Better Auth client instance
  debugLogs: false, // Optional: Enable debug logs
  onRequest: (href) => {
    console.log("Auth request:", href);
  },
  onSuccess: (callbackURL) => {
    console.log("Auth successful, callback URL:", callbackURL);
    // Handle successful authentication, refetch the session
    if (callbackURL) {
      window.location.href = callbackURL;
    }
  },
  onError: (error) => {
    console.error("Auth error:", error);
    // Handle authentication error
  },
});

// Call cleanup when your app unmounts/closes to remove listeners
// cleanup();
```

### Option 2: React Setup

```typescript
import { useBetterAuthCapacitor } from "@daveyplate/better-auth-capacitor/react";
import { authClient } from "@/lib/auth-client";

function App() {
  const { isLoading, error } = useBetterAuthCapacitor({
    authClient,
    debugLogs: false,
    onRequest: (href) => {
      console.log("Auth request:", href);
    },
    onSuccess: (callbackURL) => {
      console.log("Auth successful")
      // Refetch the session

      if (callbackURL) {
        // Handle navigation
        // e.g. router.push(callbackURL)
      }
    },
    onError: (error) => {
      console.error("Auth error:", error);
      // Show error notification
    },
  });

  // You can use isLoading and error states in your UI
  if (isLoading) return <div>Authenticating...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    // Your app components
  );
}
```

## How It Works

This plugin enables seamless authentication in Capacitor apps by:

1. **Handling Universal Links**: Listens for authentication redirects through your app's universal links.
2. **Processing Auth Callbacks**: Automatically processes auth callback URLs and communicates with the Better Auth backend.
3. **Managing Authentication State**: Provides hooks and callbacks to update your app's UI based on authentication status.

The plugin will:
- Listen for `appUrlOpen` events
- Check if the URL is a Better Auth callback
- Make the necessary fetch request to complete the authentication
- Invoke the appropriate callback based on success or failure

## Configuration Options

| Option | Type | Description |
|--------|------|-------------|
| `authClient` | `AuthClient` | **Required**. Your Better Auth client instance |
| `debugLogs` | `boolean` | Optional. Enable verbose console logging for debugging |
| `onRequest` | `(href: string) => void` | Optional. Called when an auth request is initiated |
| `onSuccess` | `(callbackURL?: string \| null) => void` | Optional. Called on successful authentication |
| `onError` | `(error: FetchError) => void` | Optional. Called when authentication fails |

## License

MIT