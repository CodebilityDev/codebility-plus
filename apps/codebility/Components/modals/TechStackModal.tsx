import Image from "next/image";
import { Button } from "@/Components/ui/button";
import { techstacks } from "@/constants";
import { useModal } from "@/hooks/use-modal";
import { useTechStackStore } from "@/hooks/use-techstack";
import { IconClose } from "@/public/assets/svgs";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@codevs/ui/dialog";

const TechStackModal = () => {
  const { isOpen, onClose, type } = useModal();
  const { stack, addRemoveStack } = useTechStackStore();
  const checkArray = (objectItem: string) => {
    const isObjectInArray = stack.some((obj) => {
      return JSON.stringify(obj) === JSON.stringify(objectItem);
    });
    return isObjectInArray;
  };

  const isModalOpen = isOpen && type === "techStackModal";

  return (
    <Dialog open={isModalOpen} onOpenChange={() => onClose()}>
      <DialogContent className="bg-black-100 h-auto max-w-md overflow-y-auto py-8 sm:max-w-2xl sm:px-12 sm:py-16">
        <button onClick={onClose} className="absolute right-4 top-4">
          <IconClose />
        </button>
        <DialogHeader>
          <DialogTitle className="text-md mb-4 text-center text-white md:text-xl">
            Select your Tech Stack
          </DialogTitle>
        </DialogHeader>

        <div className="grid w-full grid-cols-3 gap-2">
          {techstacks?.map((stack, i) => (
            <div
              className={`border-darkgray hover:text-black-500 flex cursor-pointer rounded-md border p-2 text-white hover:bg-black hover:bg-white ${
                checkArray(stack.name.toLowerCase()) && "bg-blue-100"
              }`}
              key={`stack-item-${i}`}
              onClick={() => addRemoveStack(stack.name.toLowerCase())}
            >
              <div className="relative mx-auto h-5 w-5 sm:mx-0 sm:h-6 sm:w-6">
                <Image
                  src={
                    stack.alias
                      ? `/assets/svgs/icon-${stack.alias.toLowerCase()}.svg`
                      : `/assets/svgs/icon-${stack.name.toLowerCase()}.svg`
                  }
                  alt={`${stack.name} icon`}
                  fill
                  title={stack.name}
                  className="object-cover"
                />
              </div>
              <p className="hidden pl-4 sm:block">{stack.name}</p>
            </div>
          ))}
        </div>

        <DialogFooter className="mt-4 flex w-full justify-end gap-2">
          <Button
            onClick={() => onClose()}
            variant="default"
            className="mx-auto w-[100px] sm:mx-0 sm:w-[150px]"
          >
            Ok
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TechStackModal;
