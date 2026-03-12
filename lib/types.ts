export type BenefitFrequency = 'monthly' | 'annual' | 'once';
export type BenefitCategory =
  | 'travel'
  | 'dining'
  | 'entertainment'
  | 'shopping'
  | 'credit'
  | 'insurance'
  | 'other';
export type CardHolder = 'me' | 'spouse' | 'both';

export interface BenefitUsage {
  period: string; // "2026-03" for monthly, "2026" for annual, "used" for once
  usedDate: string;
  notes?: string;
}

export interface Benefit {
  id: string;
  name: string;
  description: string;
  value: number;
  frequency: BenefitFrequency;
  category: BenefitCategory;
  usage: BenefitUsage[];
}

export interface CreditCard {
  id: string;
  name: string;
  issuer: string;
  holder: CardHolder;
  annualFee: number;
  benefits: Benefit[];
  color: string;
  lastUpdated?: string;
  officialBenefitsUrl: string;
  lastFourDigits?: string;
}

export interface CardTemplate {
  name: string;
  issuer: string;
  annualFee: number;
  color: string;
  officialBenefitsUrl: string;
  benefits: Omit<Benefit, 'id' | 'usage'>[];
}
