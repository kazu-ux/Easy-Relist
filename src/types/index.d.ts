export interface Item {
  additional_services: any[];
  application_attributes: ApplicationAttributes;
  buyer: Buyer;
  checksum: string;
  colors: any[];
  comments: any[];
  created: number;
  description: string;
  has_additional_service: boolean;
  has_like_list: boolean;
  hash_tags: any[];
  id: string;
  is_anonymous_shipping: boolean;
  is_cancelable: boolean;
  is_dynamic_shipping_fee: boolean;
  is_offerable: boolean;
  is_offerable_v2: boolean;
  is_organizational_user: boolean;
  is_shop_item: string;
  is_stock_item: boolean;
  is_web_visible: boolean;
  item_category: ItemCategory;
  item_condition: ItemCondition;
  liked: boolean;
  name: string;
  num_comments: number;
  num_likes: number;
  organizational_user_status: string;
  pager_id: number;
  photo_paths: string[];
  photos: string[];
  price: number;
  sales_fee: SalesFee;
  seller: Seller;
  shipped_by_worker: boolean;
  shipping_class: ShippingClass;
  shipping_duration: ShippingDuration;
  shipping_from_area: ShippingFromArea;
  shipping_method: ShippingMethod;
  shipping_payer: ShippingPayer;
  status: string;
  thumbnails: string[];
  transaction_evidence: TransactionEvidence;
  updated: number;
}

export interface ApplicationAttributes {}

export interface Buyer {
  id: number;
  name: string;
  photo_thumbnail_url: string;
  photo_url: string;
  register_sms_confirmation: string;
  register_sms_confirmation_at: string;
}

export interface ItemCategory {
  brand_group_id: number;
  display_order: number;
  id: number;
  name: string;
  parent_category_id: number;
  parent_category_name: string;
  root_category_id: number;
  root_category_name: string;
}

export interface ItemCondition {
  id: number;
  name: string;
}

export interface SalesFee {
  fee: number;
  message: string;
  parameters: Parameter[];
  version: string;
}

export interface Parameter {
  category_id?: number;
  extra_message?: string;
  fixed_fee: number;
  help_url?: string;
  max_price: number;
  message: string;
  min_price: number;
  rate: number;
  sales_fee_parameter_id: string;
}

export interface Seller {
  created: number;
  id: number;
  is_official: boolean;
  name: string;
  num_ratings: number;
  num_sell_items: number;
  photo_thumbnail_url: string;
  photo_url: string;
  quick_shipper: boolean;
  ratings: Ratings;
  register_sms_confirmation: string;
  register_sms_confirmation_at: string;
  score: number;
  star_rating_score: number;
}

export interface Ratings {
  bad: number;
  good: number;
  normal: number;
}

export interface ShippingClass {
  fee: number;
  icon_id: number;
  id: number;
  is_pickup: boolean;
  pickup_fee: number;
  shipping_fee: number;
  total_fee: number;
}

export interface ShippingDuration {
  id: number;
  max_days: number;
  min_days: number;
  name: string;
}

export interface ShippingFromArea {
  id: number;
  name: string;
}

export interface ShippingMethod {
  id: number;
  is_deprecated: string;
  name: string;
}

export interface ShippingPayer {
  code: string;
  id: number;
  name: string;
}

export interface TransactionEvidence {
  id: number;
  status: string;
}
