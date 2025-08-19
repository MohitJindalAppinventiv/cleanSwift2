
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

export interface coordinates{
  lat:number| null;
  lng:number|null;
}


export interface Area {
  id: string;
  locationName: string;
  range?: number;
  address: string;
  lat: number | null; // ✅ these are fine (derived from coordinates)
  lng: number | null;
  isActive: boolean;  // ✅ use same as slice (maps from API.active)
}
