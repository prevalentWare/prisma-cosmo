interface CosmoOptions {
    federated?: boolean;
}
declare const cosmo: (options?: CosmoOptions) => Promise<void>;
export { cosmo };
