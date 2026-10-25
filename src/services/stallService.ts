import { ForbiddenError } from '../errors/ForbiddenError.ts';
import type { TokenPayload } from './tokenService.ts';
import { NotFoundError } from '../errors/NotFoundError.ts';
import { MenuItemRepository } from '../repositories/menuItemRepository.ts';
import {
  StallRepository,
  type CreateStallInput,
  type FindAllParams,
} from '../repositories/stallRepository.ts';
import type { StallResponseDto } from '../dtos/stallDto.ts';

type StallRow = NonNullable<Awaited<ReturnType<StallRepository['findById']>>>;

export class StallService {
  constructor(
  private stallRepository: StallRepository = new StallRepository(),
  private menuItemRepository: MenuItemRepository = new MenuItemRepository(),
) {}

  private toDto(row: StallRow): StallResponseDto {
    const avgRating = Number(row.avgRating);
    return {
      id: row.id,
      ownerId: row.ownerId,
      name: row.name,
      category: row.category,
      location: row.location,
      description: row.description,
      avgRating,
      reviewCount: row.reviewCount,
      isPopular: avgRating >= 4.7,
    };
  }

  async getAllStalls(params: FindAllParams) {
    const { rows, total } = await this.stallRepository.findAll(params);
    return { data: rows.map((row) => this.toDto(row)), total };
  }

  async getStallById(id: number): Promise<StallResponseDto> {
    const row = await this.stallRepository.findById(id);
    if (!row) throw new NotFoundError('Data warung tidak ditemukan');
    return this.toDto(row);
  }

    async createStall(input: Omit<CreateStallInput, 'ownerId'>, ownerId: number): Promise<StallResponseDto> {
    const row = await this.stallRepository.create({ ...input, ownerId });
    if (!row) throw new NotFoundError('Data warung tidak ditemukan');
    return this.toDto(row);
  }

  async updateStall(id: number, input: Partial<CreateStallInput>, user: TokenPayload): Promise<StallResponseDto> {
    const stall = await this.stallRepository.findById(id);
    if (!stall) throw new NotFoundError('Data warung tidak ditemukan');
    if (user.role === 'owner' && stall.ownerId !== user.userId) {
      throw new ForbiddenError('Kamu hanya boleh mengubah warung milikmu sendiri');
    }
    const row = await this.stallRepository.update(id, input);
    if (!row) throw new NotFoundError('Data warung tidak ditemukan');
    return this.toDto(row);
  }

  async deleteStall(id: number): Promise<StallResponseDto> {
    const row = await this.stallRepository.remove(id);
    if (!row) throw new NotFoundError('Data warung tidak ditemukan');
    return this.toDto(row);
  }

  async getStallMenus(id: number) {
    const stall = await this.stallRepository.findById(id);
    if (!stall) throw new NotFoundError('Data warung tidak ditemukan');

    const rows = await this.menuItemRepository.findByStallId(id);
    return rows.map((row) => ({
      id: row.id,
      stallId: row.stallId,
      name: row.name,
      price: row.price,
      isAvailable: Boolean(row.isAvailable),
    }));
  }
}
