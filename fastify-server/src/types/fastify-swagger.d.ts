declare module 'fastify-swagger' {
  import { FastifyPluginAsync } from 'fastify';
  
  interface FastifySwaggerOptions {
    routePrefix?: string;
    swagger?: any;
    exposeRoute?: boolean;
  }
  
  const fastifySwagger: FastifyPluginAsync<FastifySwaggerOptions>;
  export default fastifySwagger;
}
