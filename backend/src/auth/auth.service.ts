import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {
    console.log('AuthService initialized');
  }

  async register(email: string, password: string, name: string) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const user = await this.usersService.create(email, password, name);
    const { password: _, ...result } = user;
    
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);
    
    console.log('User registered:', email);
    console.log('  Token created:', token ? 'YES' : 'NO');
    
    return {
      access_token: token,
      user: result,
    };
  }

  async login(email: string, password: string) {
    console.log('Login attempt for:', email);
    
    const user = await this.usersService.findByEmail(email);
    
    if (!user) {
      console.log('User not found:', email);
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Invalid password for:', email);
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...result } = user;
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);
    
    console.log('Login successful:', email);
    console.log('  User ID:', user.id);
    console.log('  Token created:', token ? 'YES' : 'NO');
    
    return {
      access_token: token,
      user: result,
    };
  }
}