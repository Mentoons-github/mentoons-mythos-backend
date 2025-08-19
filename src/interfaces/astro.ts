export interface AstroApiResponse {
  report: {
    nakshatra: {
      id: number;
      name: string;
      lord: { id: number; name: string; vedic_name: string };
      pada: number;
    };
    chandra_rasi: {
      id: number;
      name: string;
      lord: { id: number; name: string; vedic_name: string };
    };
    zodiac: { id: number; name: string };
    additional_info: {
      deity: string;
      ganam: string;
      symbol: string;
      animal_sign: string;
      nadi: string;
      color: string;
      best_direction: string;
      syllables: string;
      birth_stone: string;
      gender: string;
      planet: string;
      enemy_yoni: string;
    };
  };
}
