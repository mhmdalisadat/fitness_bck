import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // فعال کردن CORS برای اتصال فرانت‌اند
  app.enableCors({
    origin: true, // یا آدرس خاص فرانت‌اند مثل: 'http://localhost:3000'
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(3000);
  console.log('🚀 سرور در پورت 3000 اجرا شد');
  console.log('📱 API در دسترس: http://localhost:3000');
  console.log('👥 ماژول یوزر: http://localhost:3000/users');
}
bootstrap();
