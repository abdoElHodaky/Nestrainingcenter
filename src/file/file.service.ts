import * as fs from 'fs';
import * as path from 'path';
import {
  NotFoundException,
  InternalServerErrorException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class FileService {
  async deleteFile(fileName: string, folder: string): Promise<void> {
    const filePath = path.join(
      __dirname,
      '..',
      '..',
      'uploads',
      folder,
      fileName,
    );

    try {
      await fs.promises.access(filePath, fs.constants.F_OK);
    } catch (error) {
      throw new NotFoundException('File not found');
    }

    try {
      await fs.promises.unlink(filePath);
    } catch (error) {
      throw new InternalServerErrorException('Unable to delete file');
    }
  }
}
