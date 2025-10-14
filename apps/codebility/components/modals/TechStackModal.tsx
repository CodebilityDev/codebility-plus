import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { techstacks } from "@/constants/techstack";
import { useModal } from "@/hooks/use-modal";
import { useTechStackStore } from "@/hooks/use-techstack";
import { IconClose } from "@/public/assets/svgs";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@codevs/ui/tabs";

import ToggleSwitch from "../ui/switch";

const TechStackModal = () => {
  const { isOpen, onClose, type } = useModal();
  const { stack, nonTech, setNonTech, addRemoveStack } = useTechStackStore();

  const checkArray = (objectItem: string) => {
    const isObjectInArray = stack.some((obj) => {
      return JSON.stringify(obj) === JSON.stringify(objectItem);
    });
    return isObjectInArray;
  };

  const isModalOpen = isOpen && type === "techStackModal";

  const filterByCategory = (category: string) => {
    return techstacks.filter(
      (item) =>
        item.category && item.category.toLowerCase() === category.toLowerCase(),
    );
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={() => onClose()}>
      <DialogContent
        aria-describedby={undefined}
        className="bg-light-900 dark:bg-dark-100 w-[90%] max-w-md h-[600px] max-h-[85vh] py-4 sm:max-w-xl sm:px-6 sm:py-6 flex flex-col"
      >
        <button onClick={onClose} className="absolute right-4 top-4">
          <IconClose />
        </button>
        <DialogHeader>
          <DialogTitle className="text-sm mb-2 text-center text-black dark:text-white md:text-base">
            Select your Tech Stack
          </DialogTitle>
        </DialogHeader>
        {/* Tabs for grouping tech stacks by category */}
        <div className="flex flex-col flex-1 min-h-0">
        <Tabs defaultValue="all" className="w-full flex flex-col flex-1 min-h-0">
          <TabsList className="mb-3 flex flex-wrap justify-center flex-shrink-0 gap-1 h-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="frontend">Frontend</TabsTrigger>
            <TabsTrigger value="backend">Backend</TabsTrigger>
            <TabsTrigger value="mobile">Mobile</TabsTrigger>
            <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
            <TabsTrigger value="server">Server</TabsTrigger>
            <TabsTrigger value="cms">CMS</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
          </TabsList>

          {/* All */}
          <TabsContent value="all" className="flex-1 overflow-y-auto mt-0">
            <div className="grid w-full grid-cols-3 sm:grid-cols-4 gap-1 pb-2">
              {techstacks.map((stackItem, i) => (
                <div
                  key={`stack-item-all-${i}`}
                  className={`border-darkgray hover:text-black-500 dark:hover:text-black-100 flex cursor-pointer rounded border p-1.5 text-black hover:bg-white dark:text-white min-h-[32px] items-center text-xs ${
                    checkArray(stackItem.name.toLowerCase()) &&
                    "bg-customBlue-100 text-white"
                  } ${nonTech && "pointer-events-none saturate-0"}`}
                  onClick={() => addRemoveStack(stackItem.name.toLowerCase())}
                >
                  <div className="relative mx-auto h-4 w-4 sm:mx-0 sm:h-5 sm:w-5">
                    <Image
                      src={
                        stackItem.alias
                          ? `/assets/svgs/techstack/icon-${stackItem.alias.toLowerCase()}.svg`
                          : `/assets/svgs/techstack/icon-${stackItem.name.toLowerCase()}.svg`
                      }
                      alt={`${stackItem.name} icon`}
                      fill
                      sizes="(min-width: 640px) 24px, 20px"
                      title={stackItem.name}
                      className="object-contain"
                    />
                  </div>
                  <p className="hidden pl-2 sm:block text-xs">{stackItem.name}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Frontend */}
          <TabsContent value="frontend" className="flex-1 overflow-y-auto mt-0"
            <div className="grid w-full grid-cols-3 sm:grid-cols-4 gap-1 pb-2">
              {filterByCategory("Frontend").map((stackItem, i) => (
                <div
                  key={`stack-item-frontend-${i}`}
                  className={`border-darkgray hover:text-black-500 dark:hover:text-black-100 flex cursor-pointer rounded border p-1.5 text-black hover:bg-white dark:text-white min-h-[32px] items-center text-xs ${
                    checkArray(stackItem.name.toLowerCase()) &&
                    "bg-customBlue-100 text-white"
                  } ${nonTech && "pointer-events-none saturate-0"}`}
                  onClick={() => addRemoveStack(stackItem.name.toLowerCase())}
                >
                  <div className="relative mx-auto h-4 w-4 sm:mx-0 sm:h-5 sm:w-5">
                    <Image
                      src={
                        stackItem.alias
                          ? `/assets/svgs/techstack/icon-${stackItem.alias.toLowerCase()}.svg`
                          : `/assets/svgs/techstack/icon-${stackItem.name.toLowerCase()}.svg`
                      }
                      alt={`${stackItem.name} icon`}
                      fill
                      sizes="(min-width: 640px) 24px, 20px"
                      title={stackItem.name}
                      className="object-contain"
                    />
                  </div>
                  <p className="hidden pl-2 sm:block text-xs">{stackItem.name}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Backend */}
          <TabsContent value="backend" className="flex-1 overflow-y-auto mt-0">
            <div className="grid w-full grid-cols-3 sm:grid-cols-4 gap-1 pb-2">
              {filterByCategory("Backend").map((stackItem, i) => (
                <div
                  key={`stack-item-backend-${i}`}
                  className={`border-darkgray hover:text-black-500 dark:hover:text-black-100 flex cursor-pointer rounded border p-1.5 text-black hover:bg-white dark:text-white min-h-[32px] items-center text-xs ${
                    checkArray(stackItem.name.toLowerCase()) &&
                    "bg-customBlue-100 text-white"
                  } ${nonTech && "pointer-events-none saturate-0"}`}
                  onClick={() => addRemoveStack(stackItem.name.toLowerCase())}
                >
                  <div className="relative mx-auto h-4 w-4 sm:mx-0 sm:h-5 sm:w-5">
                    <Image
                      src={
                        stackItem.alias
                          ? `/assets/svgs/techstack/icon-${stackItem.alias.toLowerCase()}.svg`
                          : `/assets/svgs/techstack/icon-${stackItem.name.toLowerCase()}.svg`
                      }
                      alt={`${stackItem.name} icon`}
                      fill
                      sizes="(min-width: 640px) 24px, 20px"
                      title={stackItem.name}
                      className="object-contain"
                    />
                  </div>
                  <p className="hidden pl-2 sm:block text-xs">{stackItem.name}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Mobile */}
          <TabsContent value="mobile" className="flex-1 overflow-y-auto mt-0">
            <div className="grid w-full grid-cols-3 sm:grid-cols-4 gap-1 pb-2">
              {filterByCategory("Mobile").map((stackItem, i) => (
                <div
                  key={`stack-item-mobile-${i}`}
                  className={`border-darkgray hover:text-black-500 dark:hover:text-black-100 flex cursor-pointer rounded border p-1.5 text-black hover:bg-white dark:text-white min-h-[32px] items-center text-xs ${
                    checkArray(stackItem.name.toLowerCase()) &&
                    "bg-customBlue-100 text-white"
                  } ${nonTech && "pointer-events-none saturate-0"}`}
                  onClick={() => addRemoveStack(stackItem.name.toLowerCase())}
                >
                  <div className="relative mx-auto h-4 w-4 sm:mx-0 sm:h-5 sm:w-5">
                    <Image
                      src={
                        stackItem.alias
                          ? `/assets/svgs/techstack/icon-${stackItem.alias.toLowerCase()}.svg`
                          : `/assets/svgs/techstack/icon-${stackItem.name.toLowerCase()}.svg`
                      }
                      alt={`${stackItem.name} icon`}
                      fill
                      sizes="(min-width: 640px) 24px, 20px"
                      title={stackItem.name}
                      className="object-contain"
                    />
                  </div>
                  <p className="hidden pl-2 sm:block text-xs">{stackItem.name}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Blockchain */}
          <TabsContent value="blockchain" className="flex-1 overflow-y-auto mt-0">
            <div className="grid w-full grid-cols-3 sm:grid-cols-4 gap-1 pb-2">
              {filterByCategory("Blockchain").map((stackItem, i) => (
                <div
                  key={`stack-item-blockchain-${i}`}
                  className={`border-darkgray hover:text-black-500 dark:hover:text-black-100 flex cursor-pointer rounded border p-1.5 text-black hover:bg-white dark:text-white min-h-[32px] items-center text-xs ${
                    checkArray(stackItem.name.toLowerCase()) &&
                    "bg-customBlue-100 text-white"
                  } ${nonTech && "pointer-events-none saturate-0"}`}
                  onClick={() => addRemoveStack(stackItem.name.toLowerCase())}
                >
                  <div className="relative mx-auto h-4 w-4 sm:mx-0 sm:h-5 sm:w-5">
                    <Image
                      src={
                        stackItem.alias
                          ? `/assets/svgs/techstack/icon-${stackItem.alias.toLowerCase()}.svg`
                          : `/assets/svgs/techstack/icon-${stackItem.name.toLowerCase()}.svg`
                      }
                      alt={`${stackItem.name} icon`}
                      fill
                      sizes="(min-width: 640px) 24px, 20px"
                      title={stackItem.name}
                      className="object-contain"
                    />
                  </div>
                  <p className="hidden pl-2 sm:block text-xs">{stackItem.name}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Server */}
          <TabsContent value="server" className="flex-1 overflow-y-auto mt-0">
            <div className="grid w-full grid-cols-3 sm:grid-cols-4 gap-1 pb-2">
              {filterByCategory("Server").map((stackItem, i) => (
                <div
                  key={`stack-item-server-${i}`}
                  className={`border-darkgray hover:text-black-500 dark:hover:text-black-100 flex cursor-pointer rounded border p-1.5 text-black hover:bg-white dark:text-white min-h-[32px] items-center text-xs ${
                    checkArray(stackItem.name.toLowerCase()) &&
                    "bg-customBlue-100 text-white"
                  } ${nonTech && "pointer-events-none saturate-0"}`}
                  onClick={() => addRemoveStack(stackItem.name.toLowerCase())}
                >
                  <div className="relative mx-auto h-4 w-4 sm:mx-0 sm:h-5 sm:w-5">
                    <Image
                      src={
                        stackItem.alias
                          ? `/assets/svgs/techstack/icon-${stackItem.alias.toLowerCase()}.svg`
                          : `/assets/svgs/techstack/icon-${stackItem.name.toLowerCase()}.svg`
                      }
                      alt={`${stackItem.name} icon`}
                      fill
                      sizes="(min-width: 640px) 24px, 20px"
                      title={stackItem.name}
                      className="object-contain"
                    />
                  </div>
                  <p className="hidden pl-2 sm:block text-xs">{stackItem.name}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* CMS */}
          <TabsContent value="cms" className="flex-1 overflow-y-auto mt-0">
            <div className="grid w-full grid-cols-3 sm:grid-cols-4 gap-1 pb-2">
              {filterByCategory("CMS").map((stackItem, i) => (
                <div
                  key={`stack-item-cms-${i}`}
                  className={`border-darkgray hover:text-black-500 dark:hover:text-black-100 flex cursor-pointer rounded border p-1.5 text-black hover:bg-white dark:text-white min-h-[32px] items-center text-xs ${
                    checkArray(stackItem.name.toLowerCase()) &&
                    "bg-customBlue-100 text-white"
                  } ${nonTech && "pointer-events-none saturate-0"}`}
                  onClick={() => addRemoveStack(stackItem.name.toLowerCase())}
                >
                  <div className="relative mx-auto h-4 w-4 sm:mx-0 sm:h-5 sm:w-5">
                    <Image
                      src={
                        stackItem.alias
                          ? `/assets/svgs/techstack/icon-${stackItem.alias.toLowerCase()}.svg`
                          : `/assets/svgs/techstack/icon-${stackItem.name.toLowerCase()}.svg`
                      }
                      alt={`${stackItem.name} icon`}
                      fill
                      sizes="(min-width: 640px) 24px, 20px"
                      title={stackItem.name}
                      className="object-contain"
                    />
                  </div>
                  <p className="hidden pl-2 sm:block text-xs">{stackItem.name}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Design */}
          <TabsContent value="design" className="flex-1 overflow-y-auto mt-0"
            <div className="grid w-full grid-cols-3 sm:grid-cols-4 gap-1 pb-2">
              {filterByCategory("Design").map((stackItem, i) => (
                <div
                  key={`stack-item-design-${i}`}
                  className={`border-darkgray hover:text-black-500 dark:hover:text-black-100 flex cursor-pointer rounded border p-1.5 text-black hover:bg-white dark:text-white min-h-[32px] items-center text-xs ${
                    checkArray(stackItem.name.toLowerCase()) &&
                    "bg-customBlue-100 text-white"
                  } ${nonTech && "pointer-events-none saturate-0"}`}
                  onClick={() => addRemoveStack(stackItem.name.toLowerCase())}
                >
                  <div className="relative mx-auto h-4 w-4 sm:mx-0 sm:h-5 sm:w-5">
                    <Image
                      src={
                        stackItem.alias
                          ? `/assets/svgs/techstack/icon-${stackItem.alias.toLowerCase()}.svg`
                          : `/assets/svgs/techstack/icon-${stackItem.name.toLowerCase()}.svg`
                      }
                      alt={`${stackItem.name} icon`}
                      fill
                      sizes="(min-width: 640px) 24px, 20px"
                      title={stackItem.name}
                      className="object-contain"
                    />
                  </div>
                  <p className="hidden pl-2 sm:block text-xs">{stackItem.name}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        </div>

        <DialogFooter className="mt-4 flex w-full items-center justify-between gap-2 flex-shrink-0">
          <div className="flex flex-1 items-center gap-2">
            <ToggleSwitch enabled={!nonTech} onClick={() => setNonTech()} />
            <span>I&apos;m applying for a non-tech role. </span>
          </div>
          <Button
            onClick={() => onClose()}
            variant="default"
            className="mx-auto md:w-[100px]"
          >
            Ok
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TechStackModal;