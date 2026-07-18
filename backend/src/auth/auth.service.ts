import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserEntity } from '../persistence/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthenticationDTO } from '../shared/dto/auth.dto';

@Injectable()
export class AuthService {
  logger = new Logger('AuthService');

  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async register(data: AuthenticationDTO) {
    const existingUser = await this.userRepo.findOneBy({ username: data.username });
    if (existingUser) {
      throw new ConflictException('This username is already taken');
    }

    const saltOrRounds = 2; // Keeping it simple
    const hashedPassword = await bcrypt.hash(data.password, saltOrRounds);

    const userEntity = this.userRepo.create({
      username: data.username,
      password: hashedPassword,
    });

    const newUser = await this.userRepo.insert(userEntity);
    userEntity.id = newUser.identifiers[0]?.id;
    return this.getAccessToken(userEntity);
  }

  async login(data: AuthenticationDTO) {
    const user = await this.userRepo.findOne({
      where: { username: data.username },
      select: {
        username: true,
        id: true,
        password: true,
      },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.getAccessToken(user);
  }

  private async getAccessToken(user: UserEntity) {
    const payload = { sub: user.id, username: user.username };

    return {
      token: await this.jwtService.signAsync(payload, { expiresIn: '10y' }),
    };
  }
}
