type RequestHeader = {
  Accept: string;
  Authorization?: string;
  DPoP?: string;
  'User-Agent': string;
  'X-Platform'?: string;
  'Content-Type'?: string;
};

type RequestBody = {
  id?: number;
  shipping_duration: number;
  shipping_payer: number;
  shipping_method: number;
  shipping_from_area: number;
  draft_category_id?: number;
  category_id?: number;
  exhibit_token: string;
  photo_1?: string;
  uploaded_by_photo_service?: boolean;
  sales_fee?: number;
  name?: string;
  price?: number;
  description?: string;
  item_condition?: number;
};

interface CustomFormData extends FormData {
  append(name: keyof RequestBody, value: string | number | boolean);
}

type ResponseBody = {
  result: string;
  data: {
    shipping_duration: { id: number };
    shipping_payer: { id: number };
    shipping_method: { id: number };
    shipping_from_area: { id: number };
    item_category: { id: number };
    checksum: string; //exhibit_token
    photos: [string];
    name: string;
    price: number;
    description: string;
    item_condition: { id: number };
  };
};

type DraftItem = { id: number; exhibit_token: string };

type DraftItems = {
  result: string;
  data: [DraftItem];
};
