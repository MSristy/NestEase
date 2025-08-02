// add-swap.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddSwap } from '../entities/add-swap.entity';
import { CreateAddSwapDto } from './add-swap.controller';

@Injectable()
export class AddSwapService {
  constructor(
    @InjectRepository(AddSwap)
    private readonly addSwapRepository: Repository<AddSwap>,
  ) {}

  async create(createAddSwapDto: CreateAddSwapDto): Promise<AddSwap> {
    const newSwap = this.addSwapRepository.create(createAddSwapDto);
    return await this.addSwapRepository.save(newSwap);
  }

  
 

}
