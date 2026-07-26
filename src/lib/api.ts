const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function fetchProfile(token: string) {
    const res = await fetch(`${API_URL}/api/profile`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
}