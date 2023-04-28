import astify, { FastifyInstance } from "fastify";

async function userRoutes(server: FastifyInstance) { 

    server.post('/' registerUserHandler);
}

export default userRoutes;