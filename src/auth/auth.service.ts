import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin-dto';
import { FileService } from 'src/file/file.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private fileService: FileService,
  ) {}

  async signUp(
    createAdminDto: CreateAdminDto,
    profilePicture: string,
  ): Promise<void> {
    const { username, password, firstName, lastName, age, phoneNumber, email } =
      createAdminDto;

    const user = new User();
    user.username = username;
    user.age = age;
    user.firstName = firstName;
    user.lastName = lastName;
    user.phoneNumber = phoneNumber;
    user.email = email;
    user.profilePicture = profilePicture;

    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already taken');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, email, password } = authCredentialsDto;
    const user = await this.userRepository.findOne({
      where: { username, email },
    });
    if (!(user && (await user.validatePassword(password)))) {
      throw new UnauthorizedException('InvalidCredentials');
    }

    const payload: JwtPayload = { username, email };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  async find(): Promise<User> {
    return await this.userRepository.findOneBy({
      username: 'admin',
    });
  }

  async update(
    updateAdminDto: UpdateAdminDto,
    profilePicture: string,
  ): Promise<void> {
    const { username, firstName, lastName, age, phoneNumber } = updateAdminDto;
    const user: User = await this.userRepository.findOneBy({ username });
    user.age = age;
    user.firstName = firstName;
    user.lastName = lastName;
    user.phoneNumber = phoneNumber;
    if (profilePicture) {
      await this.fileService.deleteFile(user.profilePicture, 'images');
      user.profilePicture = profilePicture;
    }

    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already taken');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
