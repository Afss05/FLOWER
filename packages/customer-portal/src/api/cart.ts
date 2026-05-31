import apiClient from './client'

export interface CartItem {
  product_id: number
  quantity: number
}

export interface AddToCartRequest {
  product_id: number
  quantity: number
}

export async function getCart() {
  const response = await apiClient.get('/cart')
  return response.data
}

export async function addToCart(item: AddToCartRequest) {
  const response = await apiClient.post('/cart/items', item)
  return response.data
}

export async function updateCartItem(itemId: number, quantity: number) {
  const response = await apiClient.put(`/cart/items/${itemId}`, { quantity })
  return response.data
}

export async function removeFromCart(itemId: number) {
  const response = await apiClient.delete(`/cart/items/${itemId}`)
  return response.data
}

export async function clearCart() {
  const response = await apiClient.delete('/cart')
  return response.data
}
