declare module 'global' {
    export interface ExpressError extends Error {
        status?: number;
    }
}
