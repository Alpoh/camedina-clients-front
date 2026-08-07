import "server-only";
import { apiGet, apiGetOrNull, apiPost, apiPut, apiDelete } from "@/lib/api/http";
import type { Phone, PhoneInput } from "@/lib/types/phone";
import type { Page } from "@/lib/types/pagination";

export async function getPhonesByClientId(clientId: string): Promise<Phone[]> {
  const page = await apiGet<Page<Phone>>(
    `/api/v1/clients/${clientId}/phones?page=0&size=100`,
  );
  return page.content;
}

export async function getPhoneById(
  clientId: string,
  phoneId: string,
): Promise<Phone | null> {
  return apiGetOrNull<Phone>(`/api/v1/clients/${clientId}/phones/${phoneId}`);
}

export async function createPhone(
  clientId: string,
  input: PhoneInput,
): Promise<Phone> {
  return apiPost<Phone>(`/api/v1/clients/${clientId}/phones`, input);
}

export async function updatePhone(
  clientId: string,
  phoneId: string,
  input: PhoneInput,
): Promise<Phone> {
  return apiPut<Phone>(`/api/v1/clients/${clientId}/phones/${phoneId}`, input);
}

export async function deletePhone(
  clientId: string,
  phoneId: string,
): Promise<void> {
  return apiDelete(`/api/v1/clients/${clientId}/phones/${phoneId}`);
}
