import apiClient from './client'

export interface GetProductsParams {
  page?: number
  limit?: number
  search?: string
  category_id?: number
  min_price?: number
  max_price?: number
}

export async function getProducts(params?: GetProductsParams) {
  const response = await apiClient.get('/products', { params })
  return response.data
}

export async function getProductById(id: number) {
  const response = await apiClient.get(`/products/${id}`)
  return response.data
}

export async function getCategories() {
  const response = await apiClient.get('/products/categories')
  return response.data
}

export async function getFeaturedProducts() {
  const response = await apiClient.get('/products/trending')
  return response.data
}

export async function getFestivalSpecials() {
  const response = await apiClient.get('/products/festival-specials')
  return response.data
}

export async function searchProducts(query: string) {
  const response = await apiClient.get('/products/search', { params: { q: query } })
  return response.data
}
