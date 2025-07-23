
export interface Area {
  id: string;
  name: string;
  city: string;
  postalCodes: string[];
  isActive: boolean;
}

export interface AreaConfig {
  areas: Area[];
  isActive: boolean;
}
