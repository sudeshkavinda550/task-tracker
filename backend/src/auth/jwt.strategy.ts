import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');
    
    console.log('JWT Strategy initialization:');
    console.log('  Secret exists:', secret ? 'YES' : 'NO');
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    console.log('JWT Token validated successfully');
    console.log('  User ID:', payload.sub);
    console.log('  Email:', payload.email);
    
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Invalid token payload');
    }
    
    return { userId: payload.sub, email: payload.email };
  }
}