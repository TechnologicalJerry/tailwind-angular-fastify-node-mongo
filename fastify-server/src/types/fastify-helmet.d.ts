declare module 'fastify-helmet' {
  import { FastifyPluginAsync } from 'fastify';
  
  interface FastifyHelmetOptions {
    contentSecurityPolicy?: boolean | Record<string, any>;
    dnsPrefetchControl?: boolean | Record<string, any>;
    expectCt?: boolean | Record<string, any>;
    frameguard?: boolean | Record<string, any>;
    hidePoweredBy?: boolean | Record<string, any>;
    hsts?: boolean | Record<string, any>;
    ieNoOpen?: boolean;
    noSniff?: boolean;
    permittedCrossDomainPolicies?: boolean | Record<string, any>;
    referrerPolicy?: boolean | Record<string, any>;
    xssFilter?: boolean;
    global?: boolean;
  }
  
  const fastifyHelmet: FastifyPluginAsync<FastifyHelmetOptions>;
  export default fastifyHelmet;
}

