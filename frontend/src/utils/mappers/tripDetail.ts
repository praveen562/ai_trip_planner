import type { JournalEntry, Expense, ExpenseCategory, PackingItem, SavedPlace } from '../../types/tripDetail';
import type {
  JournalResponseDto,
  ExpenseResponseDto,
  BackendExpenseCategory,
  PackingItemResponseDto,
  BackendPackingCategory,
  TripPlaceResponseDto
} from '../../types/api/dto';

export function mapJournalResponse(dto: JournalResponseDto): JournalEntry {
  return {
    id: dto.id,
    date: dto.journal_date,
    title: dto.title,
    note: dto.description,
    location: dto.location ?? undefined
  };
}

const EXPENSE_CATEGORY_MAP: Record<BackendExpenseCategory, ExpenseCategory> = {
  FOOD: 'food',
  HOTEL: 'hotel',
  TRANSPORT: 'transport',
  SHOPPING: 'shopping',
  ENTERTAINMENT: 'entertainment',
  ACTIVITIES: 'activities',
  MEDICAL: 'medical',
  MISCELLANEOUS: 'miscellaneous'
};

export function mapExpenseResponse(dto: ExpenseResponseDto): Expense {
  return {
    id: dto.id,
    date: dto.expense_date,
    category: EXPENSE_CATEGORY_MAP[dto.category],
    label: dto.title,
    amount: Number(dto.amount),
    currency: dto.currency
  };
}

const PACKING_CATEGORY_LABEL: Record<BackendPackingCategory, string> = {
  CLOTHING: 'Clothing',
  FOOTWEAR: 'Footwear',
  ELECTRONICS: 'Electronics',
  DOCUMENTS: 'Documents',
  MEDICINE: 'Medicine',
  TOILETRIES: 'Toiletries',
  ACCESSORIES: 'Accessories',
  FOOD: 'Food',
  OTHER: 'Other'
};

export function mapPackingItemResponse(dto: PackingItemResponseDto): PackingItem {
  return {
    id: dto.id,
    label: dto.item_name,
    category: PACKING_CATEGORY_LABEL[dto.category],
    packed: dto.is_packed
  };
}

export function mapTripPlaceResponse(dto: TripPlaceResponseDto): SavedPlace {
  return {
    id: dto.id,
    name: dto.name,
    category: dto.kind ?? 'Place',
    imageUrl: dto.image_url ?? undefined
  };
}
