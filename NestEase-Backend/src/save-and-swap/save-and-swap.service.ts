import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SaveAndSwap } from './entities/save-and-swap.entity';

@Injectable()
export class SaveAndSwapService {
  constructor(
    @InjectRepository(SaveAndSwap)
    private saveAndSwapRepository: Repository<SaveAndSwap>,
  ) {}

  async create(createSaveAndSwapDto: Partial<SaveAndSwap>): Promise<SaveAndSwap> {
    const saveAndSwap = this.saveAndSwapRepository.create(createSaveAndSwapDto);
    return this.saveAndSwapRepository.save(saveAndSwap);
  }

  async findAll(): Promise<SaveAndSwap[]> {
    return this.saveAndSwapRepository.find({
      relations: ['user', 'property'],
    });
  }

  async findOne(id: number): Promise<SaveAndSwap> {
    const saveAndSwap = await this.saveAndSwapRepository.findOne({
      where: { id },
      relations: ['user', 'property'],
    });
    if (!saveAndSwap) {
      throw new NotFoundException(`Save and Swap with ID ${id} not found`);
    }
    return saveAndSwap;
  }

  async update(id: number, updateSaveAndSwapDto: Partial<SaveAndSwap>): Promise<SaveAndSwap> {
    const saveAndSwap = await this.findOne(id);
    Object.assign(saveAndSwap, updateSaveAndSwapDto);
    return this.saveAndSwapRepository.save(saveAndSwap);
  }

  async remove(id: number): Promise<void> {
    const saveAndSwap = await this.findOne(id);
    await this.saveAndSwapRepository.remove(saveAndSwap);
  }

  async completeSaveAndSwap(id: number): Promise<SaveAndSwap> {
    const saveAndSwap = await this.findOne(id);
    saveAndSwap.isCompleted = true;
    return this.saveAndSwapRepository.save(saveAndSwap);
  }

  async getSaveAndSwapsByUser(userId: number): Promise<SaveAndSwap[]> {
    return this.saveAndSwapRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'property'],
    });
  }

  async getSaveAndSwapsByProperty(propertyId: string): Promise<SaveAndSwap[]> {
    return this.saveAndSwapRepository.find({
      where: { property: { id: propertyId } },
      relations: ['user', 'property'],
    });
  }
} 