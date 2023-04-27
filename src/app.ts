import fastify from 'fastify';

const server = fastify()

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