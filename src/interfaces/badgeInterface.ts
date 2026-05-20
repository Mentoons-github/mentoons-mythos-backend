export interface CriteriaType {
  action: string;
  field: string;
  operator: string;
  value: number | string;
}

export interface IBadge {
  name: string;
  description: string;
  criteria: CriteriaType;
  animation: string;
  image: string;
  xp: number;
}
