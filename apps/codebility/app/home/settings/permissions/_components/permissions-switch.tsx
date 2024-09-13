"use client"

import ToggleSwitch from '@/Components/ui/switch'
import { useState } from 'react'
import { SwitchProps } from '../_types/switch-props'
import { updateBooleanField } from '../action'

const Switch = ({ enabled, className, id, name }: SwitchProps) => {
  const [isEnabled, setIsEnabled] = useState(enabled)

  const handleClick = async () => {
    const newState = !isEnabled
    setIsEnabled(newState)

    try {
      await updateBooleanField(id, name, newState)
      console.log('Field updated successfully')
    } catch (error) {
      console.error('Error updating field:', error)
      setIsEnabled(enabled) // Revert to original state on error
    }
  }

  return (
    <div className={`items-center justify-center md:flex md:p-2 lg:p-4 ${className}`}>
         <ToggleSwitch onClick={handleClick} enabled={!isEnabled} />
       </div>
  )
}

export default Switch
