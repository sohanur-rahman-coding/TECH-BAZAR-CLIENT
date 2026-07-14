export interface Review {
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Specification {
  key: string;
  value: string;
}

export interface Product {
  _id: string;
  title: string;
  category: string;
  brand: string;
  price: number;
  shortDescription: string;
  description: string;
  imageUrl: string;
  location: string;
  rating: number;
  condition: "new" | "used" | "refurbished";
  specifications: Specification[];
  userId: string;
  userName: string;
  createdAt: string;
  views: number;
  reviews: Review[];
  status?: "available" | "sold";
}

export interface CategoryStat {
  category: string;
  count: number;
  avgPrice: number;
}

export interface ConditionStat {
  condition: string;
  count: number;
  avgPrice: number;
}

export interface AnalyticsData {
  myStats: {
    totalListed: number;
    totalViews: number;
    totalValue: number;
  };
  categoryStats: CategoryStat[];
  conditionStats: ConditionStat[];
}
