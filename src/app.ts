import fastify from 'fastify';
import userRoutes from './modules/users/user.routes';

const server = fastify()

server.get('/heakthcheck', async function () {
    return {
        status: "Health OK!"
    }
})

async function main() {
    server.register(userRoutes,{ prefix: 'api/isers'});
}

const PORT = 3000;

async function main() {
    try {
        await server.listen(PORT, '0.0.0.0');
        console.log(`Fastify server running on localhost post: ${PORT}`);

    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

main();