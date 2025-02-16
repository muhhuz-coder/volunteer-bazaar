
  // src/dto/create-event.dto.ts
  export class createEventDto {
    title: string;
    event_type_id: number;
    start_date: Date;
    end_date: Date;
    start_time: string;
    end_time: string;
    city_id: number;
    organization_id: number;
    rating: number;
  }
  