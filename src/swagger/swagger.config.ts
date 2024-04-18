import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function swaggerSetup(app: INestApplication) {
    const config = new DocumentBuilder()
        .setTitle('Telegiv')
        .setDescription('The cats API description')
        .setVersion('1.0')
        .addApiKey(
            {
                type: 'apiKey',
                name: 'Bearer token manager',
                in: 'header',
                description: "Manager's token",
            },
            'Bearer token manager',
        )
        .addApiKey(
            {
                type: 'apiKey',
                name: 'customer-token',
                in: 'header',
                description: 'Customer token',
            },
            'Bearer token customer',
        )
        .addSecurity('basic', {
            type: 'http',
            scheme: 'basic',
        })
        .addSecurity('bearer', {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
        })
        .addCookieAuth('refresh-token')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
}
