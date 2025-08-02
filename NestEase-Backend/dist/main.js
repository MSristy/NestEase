"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    // Enable CORS with specific configuration
    app.enableCors({
        origin: 'http://localhost:3000', // Your frontend URL
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    // Serve static files from the uploads directory
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'uploads'), {
        prefix: '/uploads/',
    });
    // Also serve from the root uploads directory for compatibility
    app.useStaticAssets((0, path_1.join)(process.cwd(), 'uploads'), {
        prefix: '/uploads/',
    });
    await app.listen(3001);
    console.log(`Application is running on: ${await app.getUrl()}`);
    console.log(`Static files served from: ${(0, path_1.join)(process.cwd(), 'uploads')}`);
}
bootstrap();
//# sourceMappingURL=main.js.map