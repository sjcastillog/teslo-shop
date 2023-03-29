import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports:[
    ConfigModule,
    
    TypeOrmModule.forFeature([
      User
    ]),
    PassportModule.register({ defaultStrategy:'jwt'}),

    JwtModule.registerAsync({
      imports: [ ConfigModule ],
      inject:  [ ConfigService ],
      useFactory: ( configService:ConfigService ) => {
        return {
            secret: configService.get("JTW_SECRET"),
            signOptions:{
              expiresIn:'1h'
          }
        }
      }
    })

  ],
  exports:[
    TypeOrmModule //exporta el type y todas las entidades definidas arriba
  ]
})
export class AuthModule {}
