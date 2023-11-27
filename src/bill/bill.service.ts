import { Injectable } from '@nestjs/common';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { Bill } from './entities/bill.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';

@Injectable()
export class BillService {
  constructor(
    @InjectRepository(Bill)
    private billRepository: Repository<Bill>,
  ) {}

  async create(createBillDto: CreateBillDto) {
    const bill = new Bill();
    bill.title = createBillDto.title;
    bill.description = createBillDto.description;
    bill.amount = createBillDto.amount;
    bill.type = createBillDto.type;
    bill.sender = createBillDto.sender;
    bill.receiver = createBillDto.receiver;
    bill.paymentMethod = createBillDto.paymentMethod;
    bill.date = createBillDto.date;
    bill.status = createBillDto.status;

    return await bill.save();
  }

  async findAll() {
    return await this.billRepository.find();
  }

  async findOne(id: number) {
    return await this.billRepository.findOneBy({ id });
  }

  async getBillsSum(nbMonths: number, type: string): Promise<number> {
    if (nbMonths === 0) {
      const withdrawals = await this.billRepository.find({
        where: { type },
      });
      return withdrawals.reduce((sum, bill) => sum + +bill.amount, 0);
    } else {
      const monthsAgo = new Date();
      monthsAgo.setMonth(monthsAgo.getMonth() - nbMonths);
      const withdrawals = await this.billRepository.find({
        where: { type, date: Between(monthsAgo, new Date()) },
      });
      return withdrawals.reduce((sum, bill) => sum + +bill.amount, 0);
    }
  }

  async update(id: number, updateBillDto: UpdateBillDto) {
    const bill = await this.billRepository.findOneBy({ id });
    if (bill) {
      bill.title = updateBillDto.title;
      bill.description = updateBillDto.description;
      bill.amount = updateBillDto.amount;
      bill.type = updateBillDto.type;
      bill.sender = updateBillDto.sender;
      bill.receiver = updateBillDto.receiver;
      bill.paymentMethod = updateBillDto.paymentMethod;
      bill.date = updateBillDto.date;
      bill.status = updateBillDto.status;
    }
    return await bill.save();
  }

  async remove(id: number) {
    return await this.billRepository.delete({ id });
  }
}
