import { MenuItemRepository, type CreateMenuItemInput, type FindAllParams } from '../repositories/menuItemRepository.ts';
import { StallRepository } from '../repositories/stallRepository.ts';
import type { MenuItemResponseDto } from '../dtos/menuItemDto.ts';

type MenuItemRow = NonNullable<Awaited<ReturnType<MenuItemRepository['findById']>>>;

export class MenuItemService {
  private menuItemRepository: MenuItemRepository;
  private stallRepository: StallRepository;

  constructor(
    menuItemRepository: MenuItemRepository = new MenuItemRepository(),
    stallRepository: StallRepository = new StallRepository(),
  ) {
    this.menuItemRepository = menuItemRepository;
    this.stallRepository = stallRepository;
  }

  private async toDto(row: MenuItemRow): Promise<MenuItemResponseDto> {
    const stall = await this.stallRepository.findById(row.stallId);
    return {
      id: row.id,
      stallId: row.stallId,
      name: row.name,
      price: row.price,
      isAvailable: row.isAvailable,
      stallName: stall?.name ?? null,
    };
  }

  async getAllMenuItems(params: FindAllParams) {
    const { rows, total } = await this.menuItemRepository.findAll(params);
    return { data: await Promise.all(rows.map((row) => this.toDto(row))), total };
  }

  async getMenuItemById(id: number): Promise<MenuItemResponseDto> {
    const row = await this.menuItemRepository.findById(id);
    if (!row) throw new Error('MENU_ITEM_NOT_FOUND');
    return this.toDto(row);
  }

  async createMenuItem(input: CreateMenuItemInput): Promise<MenuItemResponseDto> {
    const stall = await this.stallRepository.findById(input.stallId);
    if (!stall) throw new Error('STALL_NOT_FOUND');

    const row = await this.menuItemRepository.create(input);
    if (!row) throw new Error('MENU_ITEM_NOT_FOUND');
    return this.toDto(row);
  }

  async updateMenuItem(id: number, input: Partial<CreateMenuItemInput>): Promise<MenuItemResponseDto> {
    const row = await this.menuItemRepository.update(id, input);
    if (!row) throw new Error('MENU_ITEM_NOT_FOUND');
    return this.toDto(row);
  }

  async deleteMenuItem(id: number): Promise<MenuItemResponseDto> {
    const row = await this.menuItemRepository.remove(id);
    if (!row) throw new Error('MENU_ITEM_NOT_FOUND');
    return this.toDto(row);
  }
}