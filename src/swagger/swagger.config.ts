import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function swaggerSetup(app: INestApplication): void {
    const config = new DocumentBuilder()
        .setTitle('Task API')
        .setDescription('Test task for network group')
        .setVersion('1.0')
        .addSecurity('basic', {
            type: 'http',
            scheme: 'basic',
        })
        .addSecurity('bearer', {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
        })
        .addCookieAuth('refreshToken', {
            name: 'refreshToken',
            type: 'http',
            in: 'Header',
            scheme: 'Bearer',
        })
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
}
