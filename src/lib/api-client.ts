export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

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

  const data = await response.json().catch(() => null);
  console.log(data);

  if (!response.ok) {
    throw new ApiError(
      data?.message ||
        data?.error?.message ||
        `Request failed with status ${response.status}`,
      response.status,
      data?.code || data?.error?.code
    );
  }

  return data as T;
}