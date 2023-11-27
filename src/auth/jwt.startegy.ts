import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from './jwt-payload.interface';
import { UnauthorizedException } from '@nestjs/common';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'xxXHorizonDataXxx',
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { username, email } = payload;
    const user = await this.userRepository.findOne({
      where: { username, email },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
