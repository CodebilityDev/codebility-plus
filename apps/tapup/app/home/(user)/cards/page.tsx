import React from "react";

import HomeAddCardModal from "./_components/home-add-card-modal";
import HomeCardsContainer from "./_components/home-cards-container";

function CardsPage() {
  return (
    <div className="flex flex-col gap-y-7 px-12">
      <div className="mt-4 flex justify-between">
        <h2>Cards</h2>
        <HomeAddCardModal />
      </div>
      <div className="flex justify-center">
        <HomeCardsContainer />
      </div>
    </div>
  );
}

export default CardsPage;
