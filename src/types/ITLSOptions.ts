/**
 * Options to start a service under https
 */
export interface ITLSOptions {
    /**
     * Certificate in pem format.
     */
    cert?: Buffer;
    /**
     * Key in pem format.
     */
    key?: Buffer;
}
