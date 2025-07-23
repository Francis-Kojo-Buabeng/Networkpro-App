// userAPI.ts

const API_BASE_URL = 'http://10.132.189.248:8092/api/v1/users'; // Updated to use your local IP address

export interface UserProfilePayload {
  firstName: string;
  lastName: string;
  headline?: string;
  summary?: string;
  location?: string;
  industry?: string;
  profilePictureUrl?: string;
  website?: string;
  phoneNumber?: string;
  skills?: string[];
}

export async function createUserProfile(payload: UserProfilePayload) {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to create user profile');
  }
  return response.json();
}

export async function fetchUserProfile(userId: string | number) {
  const response = await fetch(`${API_BASE_URL}/${userId}`);
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to fetch user profile');
  }
  return response.json();
} 