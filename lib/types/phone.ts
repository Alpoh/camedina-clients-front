export type PhoneType = "MOBILE" | "HOME" | "WORK" | "OTHER";

export type Phone = {
  id: string;
  clientId: string;
  number: string;
  type: PhoneType;
  primary: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PhoneInput = {
  number: string;
  type: PhoneType;
  primary?: boolean;
};
