import { useEffect, useState } from "react"
import { setupBetterAuthCapacitor } from "../setup-better-auth-capacitor"
import type { AuthClient } from "../types/auth-client"
import type { FetchError } from "../types/fetch-error"

export interface UseBetterAuthCapacitorOptions {
    authClient: AuthClient
    debugLogs?: boolean
    onError?: (error: FetchError) => void
    onRequest?: (href: string) => void
    onSuccess?: (callbackURL?: string | null) => void
}

export const useBetterAuthCapacitor = ({
    authClient,
    debugLogs = false,
    onError,
    onRequest,
    onSuccess
}: UseBetterAuthCapacitorOptions) => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<FetchError | null>(null)

    useEffect(() => {
        return setupBetterAuthCapacitor({
            authClient,
            debugLogs,
            onRequest: (href) => {
                setIsLoading(true)
                setError(null)
                onRequest?.(href)
            },
            onError: (err) => {
                setIsLoading(false)
                setError(err)
                onError?.(err)
            },
            onSuccess: (callbackURL) => {
                setIsLoading(false)
                setError(null)
                onSuccess?.(callbackURL)
            }
        })
    }, [authClient, debugLogs, onError, onRequest, onSuccess])

    return {
        isLoading,
        error
    }
}
