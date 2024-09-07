import Image from "next/image";
import profitLogo from "~/public/profitLogo.png";
import userLogo from "~/public/userLogo.png";
import guestLogo from "~/public/guestLogo.png";
import expensesLogo from "~/public/expensesLogo.png";
import { statValues } from "~/lib/dummyOrders";
import { ordersService } from "~/modules";

const titles = ["Today's profit", "Today's expenses", "User", "Booked Guests"];
const logos = [profitLogo, expensesLogo, userLogo, guestLogo];

const StatCard = async () => {

  const [totalCustomersThisWeek, totalBookingsThisWeek, totalSalesToday] = await Promise.all([
    ordersService.getTotalCustomers(),
    ordersService.getTotalBookings(),
    ordersService.getTotalSalesToday(),
    ordersService.getWeeklySales()
  ])
  if (totalCustomersThisWeek) {
    statValues[2] = {
      type: "number",
      value: totalCustomersThisWeek.users,
      change: totalCustomersThisWeek.percent
    }
  }
  if (totalBookingsThisWeek) {
    statValues[3] = {
      type: "number",
      value: totalBookingsThisWeek.users,
      change: totalBookingsThisWeek.percent
    }
  }
  if (totalSalesToday) {
    statValues[0] = {
      type: "price",
      value: totalSalesToday.totalSales,
      change: totalSalesToday.percent
    }
  }

  return (
    <>
      {statValues.map((stat, index) => (
        <div
          key={index}
          className="flex flex-col p-6 bg-white rounded-lg shadow relative"
        >
          <h2 className="text-gray-700 text-base font-semibold mb-8">
            {titles[index]}
          </h2>
          <p className="text-2xl font-bold">
          {
          stat.type === "price" 
          ? new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(stat.value)
          : new Intl.NumberFormat('en-US').format(stat.value)
  }
          </p>
          <p className="text-stone-400 text-sm">
            {stat.change > 0 && "+"}{(stat.change * 100).toFixed(2)}% {index === 0 ? "from yesterday" : "from last week"}
          </p>
          <div className="absolute top-4 right-4">
            <Image
              src={logos[index]}
              alt={`${titles[index]} logo`}
              width={22}
              height={22}
            />
          </div>
        </div>
      ))}
    </>
  );
};

export default StatCard;
