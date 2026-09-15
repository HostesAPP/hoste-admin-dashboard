// src/lib/api-client.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL;


export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
        credentials: "include",
    });
    
    if (!response.ok) {
        throw new Error("Request failed");
    }
  return response.json();
}