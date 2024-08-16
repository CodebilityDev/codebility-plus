import { useModal } from "@/hooks/use-modal-services"
import { IconClose } from "@/public/assets/svgs"
import Image from "next/image"
import { Dialog, DialogContent } from "@codevs/ui/dialog"

const ServicesModal = () => {
  const { isOpen, modalContent, closeModal } = useModal()

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent
        hasButton
        className="h-auto w-[95%] max-w-lg overflow-x-auto overflow-y-auto bg-black-100 dark:bg-black-500 lg:h-auto"
      >
        <div>
          <button onClick={closeModal} className="absolute right-4 top-4">
            <IconClose />
          </button>
          {modalContent && (
            <div className="flex flex-col items-center gap-4 p-2 text-gray">
              <Image
                alt={modalContent.title}
                src={`/assets/svgs/${modalContent.icon}.svg`}
                width={30}
                height={30}
                className="h-10 w-10 lg:h-12 lg:w-12"
              />
              <h3 className="text-xl text-white w-full text-center">{modalContent.title}</h3>
              <p className="text-center" >{modalContent.desc}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ServicesModal
