import { Button } from '@codevs/ui/button'
import React from 'react'
import HomeCard from './_components/home-card'
import HomeAddCardModal from './_components/home-add-card-modal'

function CardsPage() {
  return (
    <div className="px-8">
      <div className="mt-4 flex justify-between">
        <h2>Cards</h2>
        <HomeAddCardModal />
      </div>
    </div>
  )
}

export default CardsPage
