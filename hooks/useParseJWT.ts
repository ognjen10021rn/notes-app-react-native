export function useParseJwt(token: string): any | undefined {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

        const paddedBase64 = base64.padEnd(
            base64.length + ((4 - (base64.length % 4)) % 4),
            "="
        );

        return JSON.parse(atob(paddedBase64));
    } catch (e) {
        console.log(e, "Homepage err: ", token);
    }
}