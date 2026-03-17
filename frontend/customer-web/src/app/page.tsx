import { getRestaurants } from "@/lib/api";
import RestaurantBrowser from "@/components/restaurant-browser";

export default async function Home() {
  const restaurants = await getRestaurants();

  return <RestaurantBrowser restaurants={restaurants} />;
}