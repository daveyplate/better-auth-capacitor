import { App, type URLOpenListenerEvent } from "@capacitor/app"
import type { AuthClient } from "./types/auth-client"
import type { FetchError } from "./types/fetch-error"

export interface SetupBetterAuthCapacitorOptions {
    authClient: AuthClient
    debugLogs?: boolean
    onError?: (error: FetchError) => void
    onRequest?: (href: string) => void
    onSuccess?: (callbackURL?: string | null) => void
}

export const setupBetterAuthCapacitor = ({
    authClient,
    debugLogs,
    onError,
    onRequest,
    onSuccess
}: SetupBetterAuthCapacitorOptions) => {
    App.addListener("appUrlOpen", ({ url }: URLOpenListenerEvent) => {
        const newURL = new URL(url)
        const href = url.replace(newURL.origin, "")
        const basePath = "/api/auth"
        const callbackURL = newURL.searchParams.get("callbackURL")

        if (!href.startsWith(basePath)) return

        if (debugLogs) {
            console.log("[BetterAuth Capacitor] Fetching URL", url)
        }

        onRequest?.(href)
        authClient.$fetch(`${href.replace(basePath, "")}`).then(({ error }) => {
            if (error) {
                if (debugLogs) {
                    console.error("[BetterAuth Capacitor] Error", error)
                }

                onError?.(error)
                return
            }

            if (debugLogs) {
                console.log("[BetterAuth Capacitor] Success", url)
            }

            onSuccess?.(callbackURL)
        })
    })

    return () => {
        App.removeAllListeners()
    }
}
