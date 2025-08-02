"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveAndSwapService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const save_and_swap_entity_1 = require("./entities/save-and-swap.entity");
let SaveAndSwapService = class SaveAndSwapService {
    constructor(saveAndSwapRepository) {
        this.saveAndSwapRepository = saveAndSwapRepository;
    }
    async create(createSaveAndSwapDto) {
        const saveAndSwap = this.saveAndSwapRepository.create(createSaveAndSwapDto);
        return this.saveAndSwapRepository.save(saveAndSwap);
    }
    async findAll() {
        return this.saveAndSwapRepository.find({
            relations: ['user', 'property'],
        });
    }
    async findOne(id) {
        const saveAndSwap = await this.saveAndSwapRepository.findOne({
            where: { id },
            relations: ['user', 'property'],
        });
        if (!saveAndSwap) {
            throw new common_1.NotFoundException(`Save and Swap with ID ${id} not found`);
        }
        return saveAndSwap;
    }
    async update(id, updateSaveAndSwapDto) {
        const saveAndSwap = await this.findOne(id);
        Object.assign(saveAndSwap, updateSaveAndSwapDto);
        return this.saveAndSwapRepository.save(saveAndSwap);
    }
    async remove(id) {
        const saveAndSwap = await this.findOne(id);
        await this.saveAndSwapRepository.remove(saveAndSwap);
    }
    async completeSaveAndSwap(id) {
        const saveAndSwap = await this.findOne(id);
        saveAndSwap.isCompleted = true;
        return this.saveAndSwapRepository.save(saveAndSwap);
    }
    async getSaveAndSwapsByUser(userId) {
        return this.saveAndSwapRepository.find({
            where: { user: { id: userId } },
            relations: ['user', 'property'],
        });
    }
    async getSaveAndSwapsByProperty(propertyId) {
        return this.saveAndSwapRepository.find({
            where: { property: { id: propertyId } },
            relations: ['user', 'property'],
        });
    }
};
exports.SaveAndSwapService = SaveAndSwapService;
exports.SaveAndSwapService = SaveAndSwapService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(save_and_swap_entity_1.SaveAndSwap)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SaveAndSwapService);
//# sourceMappingURL=save-and-swap.service.js.map