'use server'

import { AwaitedReactNode } from 'react'
import { getCards } from '../actions'
import HomeCard from './home-card'
import type Card from '~/types/cards'

async function HomeCardsContainer(): Promise<AwaitedReactNode> {
  try {
    const cards = (await getCards()) as Card[]

    if (!cards || cards.length === 0)
      return <div>You don't have any card yet...</div>

    return (
      <div className="flex flex-wrap justify-between gap-2">
        {cards.map((card: Card) => {
          return <HomeCard key={card.id} card={card} />
        })}
      </div>
    )
  } catch (e) {
    return <div>Oop's looks like an error is erroring</div>
  }
}

export default HomeCardsContainer
