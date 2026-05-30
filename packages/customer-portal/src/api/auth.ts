import apiClient from './client'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  phone: string
  password: string
  password_confirmation: string
}

export async function login(credentials: LoginRequest) {
  const response = await apiClient.post('/auth/login', credentials)
  return response.data
}

export async function register(data: RegisterRequest) {
  const response = await apiClient.post('/auth/register', data)
  return response.data
}

export async function logout() {
  const response = await apiClient.post('/auth/logout')
  return response.data
}

export async function getCurrentUser() {
  const response = await apiClient.get('/auth/me')
  return response.data
}

export async function refreshToken() {
  const response = await apiClient.post('/auth/refresh')
  return response.data
}
