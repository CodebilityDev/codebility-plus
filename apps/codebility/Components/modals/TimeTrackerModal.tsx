"use client"
import React, { useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@codevs/ui/dialog"
import { useModal } from "@/hooks/use-modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { Button } from "@/Components/ui/button"

function TimeTrackerModal() {
  const { isOpen, onClose, type } = useModal()
  const [selectedOption, setSelectedOption] = useState("");

  // TODO api call tickets data
  const options = ["op1", "op2", "op3", "op4"]

  const handleSelect = (option: any) => {
    setSelectedOption(option);
  };

  const handleStart = () => {
    // TODO save and send option
    onClose()
  }

  const isModalOpen = isOpen && type === "timeTrackerTicketModal"

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose} >
      <DialogContent className="h-[250px] background-dark-300" >
        <DialogTitle className="text-2xl">Select A Ticket</DialogTitle>
        <div className="h-10">
          <Select onValueChange={setSelectedOption}>
            <SelectTrigger >
              <SelectValue>{selectedOption}</SelectValue>
            </SelectTrigger>
            <SelectContent >
              {options.map((option, index) => (
                <SelectItem key={index} onClick={() => handleSelect(option)} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button onClick={() => handleStart()}>Start Timer</Button>
        </DialogFooter>
      </DialogContent >
    </Dialog >
  )
}

export default TimeTrackerModal