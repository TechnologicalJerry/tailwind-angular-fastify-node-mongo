import Fastify from "fastify";
import fastifyCors from "fastify-cors";
import fastifyHelmet from "fastify-helmet";
import fastifySwagger from "fastify-swagger";
import fastifyJwt from "fastify-jwt";
import authPlugin from "./plugins/auth";
import indexRoutes from "./routes/index.routes";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import productRoutes from "./routes/product.routes";
import { RateLimitMiddleware } from "./middleware/rateLimit.middleware";

const app = Fastify({ logger: true });

// Initialize rate limiting
RateLimitMiddleware.init();

// Security & CORS
app.register(fastifyCors, {
  origin: true,
  credentials: true
});

app.register(fastifyHelmet, {
  contentSecurityPolicy: false
});

// JWT
app.register(fastifyJwt, { 
  secret: process.env.JWT_SECRET || "supersecret" 
});

// Auth plugin
app.register(authPlugin);

// Swagger API docs
app.register(fastifySwagger, {
  routePrefix: "/docs",
  swagger: {
    info: { 
      title: "Fastify API", 
      version: "1.0.0", 
      description: "A Fastify-based API with authentication and session management" 
    },
    host: "localhost:3000",
    schemes: ["http", "https"],
    consumes: ["application/json"],
    produces: ["application/json"],
    securityDefinitions: {
      bearerAuth: {
        type: "apiKey",
        name: "Authorization",
        in: "header",
        description: "Enter JWT token"
      }
    }
  },
  exposeRoute: true
});

// Routes
app.register(indexRoutes, { prefix: "/" });
app.register(authRoutes, { prefix: "/api/auth" });
app.register(userRoutes, { prefix: "/api/users" });
app.register(productRoutes, { prefix: "/api/products" });

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    RateLimitMiddleware.destroy();
    await app.close();
    process.exit(0);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
});

export default app;
