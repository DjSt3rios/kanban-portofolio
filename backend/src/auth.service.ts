import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserEntity } from './persistence/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  logger = new Logger('AuthService');
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    private jwtService: JwtService
  ) {}

  async register(username: string, pass: string) {
    const existingUser = await this.userRepo.findOneBy({ username });
    if (existingUser) {
      throw new ConflictException('This username is already taken');
    }

    const saltOrRounds = 2; // Keeping it simple
    const hashedPassword = await bcrypt.hash(pass, saltOrRounds);

    const userEntity = this.userRepo.create({
      username,
      password: hashedPassword
    });

    const newUser = await userEntity.save();
    return this.generateToken(newUser);
  }

  async login(username: string, pass: string) {
    const user = await this.userRepo.findOneBy({ username });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.generateToken(user);
  }

  private async generateToken(user: UserEntity) {
    const payload = { sub: user.id, username: user.username };

    return {
      access_token: await this.jwtService.signAsync(payload, { expiresIn: '10y' }),
    };
  }
}