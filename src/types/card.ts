export type CardCategory = 'sport' | 'manga' | 'autre';

export interface CollectionCard {
  id: string;
  photoUri: string;
  title: string;
  category: CardCategory;
  set?: string;
  condition?: string;
  notes?: string;
  favorite: boolean;
  createdAt: number;
}
