import "server-only";
import { apiGet, apiGetOrNull, apiPost, apiPut, apiDelete } from "@/lib/api/http";
import type { Address, AddressInput } from "@/lib/types/address";
import type { Page } from "@/lib/types/pagination";

export async function getAddressesByClientId(
  clientId: string,
): Promise<Address[]> {
  const page = await apiGet<Page<Address>>(
    `/api/v1/clients/${clientId}/addresses?page=0&size=100`,
  );
  return page.content;
}

export async function getAddressById(
  clientId: string,
  addressId: string,
): Promise<Address | null> {
  return apiGetOrNull<Address>(
    `/api/v1/clients/${clientId}/addresses/${addressId}`,
  );
}

export async function createAddress(
  clientId: string,
  input: AddressInput,
): Promise<Address> {
  return apiPost<Address>(`/api/v1/clients/${clientId}/addresses`, input);
}

export async function updateAddress(
  clientId: string,
  addressId: string,
  input: AddressInput,
): Promise<Address> {
  return apiPut<Address>(
    `/api/v1/clients/${clientId}/addresses/${addressId}`,
    input,
  );
}

export async function deleteAddress(
  clientId: string,
  addressId: string,
): Promise<void> {
  return apiDelete(`/api/v1/clients/${clientId}/addresses/${addressId}`);
}
