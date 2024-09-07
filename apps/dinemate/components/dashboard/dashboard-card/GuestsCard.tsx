import { guestData } from "~/lib/dummyOrders";
import { ordersService } from "~/modules";

const GuestsCard = async () => {

  const totalBookings = await ordersService.getTotalBookingsToday()
  

  return (
    <div className="bg-orange-500 text-white rounded-lg shadow p-8 md:p-6 sm:p-4 flex flex-col justify-center items-center h-full">
      <h2 className="text-3xl md:text-2xl sm:text-xl font-bold mb-10 md:mb-6 sm:mb-4">
        Number of Guests
      </h2>
      <p className="text-6xl md:text-5xl sm:text-4xl font-bold mb-6 md:mb-4 sm:mb-2">
        {totalBookings?.bookings ?? "??"} Guests
      </p>
      <p className="text-2xl md:text-xl sm:text-lg">as of today</p>
    </div>
  );
};

export default GuestsCard;
