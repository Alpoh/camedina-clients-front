export type AddressType = "HOME" | "WORK" | "BILLING" | "SHIPPING" | "OTHER";

export type Address = {
  id: string;
  clientId: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  type: AddressType;
  primary: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AddressInput = {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  type: AddressType;
  primary?: boolean;
};
