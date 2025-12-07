import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PropertiesModule } from './properties/properties.module';
import { ServiceProviderModule } from './service-providers/service-provider.module';
import { SaveAndSwapModule } from './save-and-swap/save-and-swap.module';
import { AdminModule } from './admin/admin.module';
import { BookingsModule } from './bookings/bookings.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ContactMessagesModule } from './contact-messages/contact-messages.module';
import { User } from './users/entities/user.entity';
import { Address } from './users/entities/address.entity';
import { ConnectedAccount } from './users/entities/connected-account.entity';
import { Notification } from './users/entities/notification.entity';
import { Property } from './properties/property.entity';
import { PropertyBooking } from './properties/property-booking.entity';
import { ServiceProvider } from './service-providers/entities/service-provider.entity';
import { SaveAndSwap } from './save-and-swap/entities/save-and-swap.entity';
import { Booking } from './bookings/entities/booking.entity';
import { ContactMessage } from './contact-messages/entities/contact-message.entity';
import { join } from 'path';
import { AddSwapModule } from './add-swap/add-swap.module';
import { AddSwap } from './add-swap/entities/add-swap.entity';
import { SellModule } from './sell/sell.module';
import { UploadModule } from './upload/upload.module';
import { SellProduct } from './sell/sell.entity';
import { OfferModule } from './offer/offer.module';
import { ItemOffer } from './offer/entities/item-offer.entity';
import { ExchangeModule } from './exchange/exchange.module';
import { ExchangeProduct } from './exchange/entities/exchange-product.entity';
import { PropertyPurchase } from './properties/entities/property-purchase.entity';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { CareersModule } from './careers/careers.module';
import { JobApplication } from './careers/entities/job-application.entity';
import { ApplinkModule } from './applink/applink.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'nestease',
      entities: [
        User,
        Address,
        ConnectedAccount,
        Notification,
        Property,
        PropertyBooking,
        ServiceProvider,
        SaveAndSwap,
        AddSwap,
        SellProduct,
        ItemOffer,
        ExchangeProduct,
        Booking,
        PropertyPurchase,
        JobApplication,
        ContactMessage,
      ],
      migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
      migrationsRun: false,
      synchronize: true,
      autoLoadEntities: false,
    }),
    AuthModule,
    UsersModule,
    PropertiesModule,
    ServiceProviderModule,
    SaveAndSwapModule,
    AdminModule,
    BookingsModule,
    NotificationsModule,
    ContactMessagesModule,
    AddSwapModule,
    SellModule,
    UploadModule,
    OfferModule,
    ExchangeModule,
    RecommendationsModule,
    CareersModule,
    ApplinkModule,
  ],
})
export class AppModule {}