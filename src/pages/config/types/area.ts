
// export interface Area {
//   id: string;
//   name: string;
//   city: string;
//   postalCodes: string[];
//   isActive: boolean;
// }

export interface AreaConfig {
  areas: Area[];
  isActive: boolean;
}


export interface Area{
  storeName: string;
  serviceAreaKm?: number;
  address: string;
  lat: number | null;
  lng: number | null;
}
