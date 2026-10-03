/**
 * Address API hooks (React Query)
 * GET /users/addresses, POST /users/addresses, PUT /users/addresses/{id},
 * DELETE /users/addresses/{id}, PATCH /users/addresses/{id}/default
 */
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiFetch } from "./client";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Address {
  id: number;
  contactName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  detailAddress: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressRequest {
  contactName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  detailAddress: string;
  latitude?: number;
  longitude?: number;
  isDefault?: boolean;
}

export interface UpdateAddressRequest extends Partial<CreateAddressRequest> {}

// ── API functions ──────────────────────────────────────────────────────────────

async function getMyAddressesApi(): Promise<Address[]> {
  return apiFetch<Address[]>("/users/addresses");
}

async function createAddressApi(data: CreateAddressRequest): Promise<Address> {
  return apiFetch<Address>("/users/addresses", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

async function updateAddressApi(id: number, data: UpdateAddressRequest): Promise<Address> {
  return apiFetch<Address>(`/users/addresses/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

async function deleteAddressApi(id: number): Promise<void> {
  return apiFetch<void>(`/users/addresses/${id}`, {
    method: "DELETE",
  });
}

async function setDefaultAddressApi(id: number): Promise<Address> {
  return apiFetch<Address>(`/users/addresses/${id}/default`, {
    method: "PATCH",
  });
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

export function useMyAddresses() {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: getMyAddressesApi,
    staleTime: 60_000,
  });
}

export function useCreateAddress() {
  return useMutation({
    mutationFn: (data: CreateAddressRequest) => createAddressApi(data),
  });
}

export function useUpdateAddress() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAddressRequest }) =>
      updateAddressApi(id, data),
  });
}

export function useDeleteAddress() {
  return useMutation({
    mutationFn: (id: number) => deleteAddressApi(id),
  });
}

export function useSetDefaultAddress() {
  return useMutation({
    mutationFn: (id: number) => setDefaultAddressApi(id),
  });
}
