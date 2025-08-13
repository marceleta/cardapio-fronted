import { restaurant, menuData } from './mockData';

// Simulate an API call
export async function getRestaurantData() {
  return Promise.resolve(restaurant);
}

export async function getMenuData() {
  return Promise.resolve(menuData);
}
