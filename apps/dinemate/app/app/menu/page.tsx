import Categories from "~/components/home/Categories";
import Greetings from "~/components/home/Greetings";
import ProductTiles from "~/components/home/ProductTiles";
import SearchBar from "~/components/home/SearchBar";
import NotificationButton from "~/components/NotificationButton";
import { menuService } from "~/modules";

const MenuPage = async ({
  searchParams,
}: {
  searchParams: { search?: string; category?: string };
}) => {
  const search = searchParams?.search;
  const category = searchParams?.category;

  const menus = await menuService.getMenus(category, search);
  return (
    <>
      <div className="flex justify-between mt-3 text-white">
        <Greetings />
        <NotificationButton />
      </div>

      <main className="flex-1 h-full overflow-y-scroll ">
        <SearchBar />
        <Categories />
        <ProductTiles menus={menus} />
      </main>
    </>
  );
};

export default MenuPage;
