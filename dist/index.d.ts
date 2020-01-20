/** Options for constructing a ByondClient */
export interface ByondClientOpts {
    /** IP Address to communicate with. */
    address?: string;
    /** Port to use with the IP Address. Must match the port the game server is running on. */
    port: string | number;
    /** The timeout value to use for the socket. This is the minimum time that a request will take. */
    timeout?: number;
}
/** Class that handles byond connections */
export default class ByondClient {
    private readonly address;
    private readonly port;
    private readonly timeout;
    constructor(opts: ByondClientOpts);
    /** Async communication with BYOND gameservers. */
    call(req: string): Promise<number | string | undefined>;
}
