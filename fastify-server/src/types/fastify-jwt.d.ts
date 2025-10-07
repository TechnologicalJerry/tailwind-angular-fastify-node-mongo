declare module 'fastify-jwt' {
  import { FastifyPluginAsync } from 'fastify';
  
  interface FastifyJWTOptions {
    secret: string | Buffer | { private: string; public: string };
    sign?: any;
    verify?: any;
    decode?: any;
    messages?: {
      badRequestErrorMessage?: string;
      noAuthorizationInHeaderMessage?: string;
      authorizationTokenExpiredMessage?: string;
      authorizationTokenInvalid?: string;
    };
  }
  
  const fastifyJwt: FastifyPluginAsync<FastifyJWTOptions>;
  export default fastifyJwt;
}

