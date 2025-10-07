declare module 'fastify-cors' {
  import { FastifyPluginAsync } from 'fastify';
  
  interface FastifyCorsOptions {
    origin?: boolean | string | string[] | RegExp | ((origin: string, callback: (err: Error | null, allow?: boolean) => void) => void);
    credentials?: boolean;
    exposedHeaders?: string | string[];
    allowedHeaders?: string | string[];
    methods?: string | string[];
    maxAge?: number;
    preflightContinue?: boolean;
    optionsSuccessStatus?: number;
    preflight?: boolean;
    strictPreflight?: boolean;
    hideOptionsRoute?: boolean;
  }
  
  const fastifyCors: FastifyPluginAsync<FastifyCorsOptions>;
  export default fastifyCors;
}

