import React from 'react'
import HomeAddCardModal from './_components/home-add-card-modal'
import HomeCardsContainer from './_components/home-cards-container'

function CardsPage() {
  return (
    <div className="px-8">
      <div className="mt-4 flex justify-between">
        <h2>Cards</h2>
        <HomeAddCardModal />
      </div>
      <HomeCardsContainer />
    </div>
  )
}

export default CardsPage
