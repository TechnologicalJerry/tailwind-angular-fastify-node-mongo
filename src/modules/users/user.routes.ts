import astify, { FastifyInstance } from "fastify";
import { registerUserHandler } from './user.controllers'

async function userRoutes(server: FastifyInstance) {

    server.post('/', registerUserHandler);
}

export default userRoutes;