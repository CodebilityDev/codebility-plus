import Image from "next/image";
import Switch from "@/app/home/settings/permissions/_components/PermissionsSwitch";
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { techstacks } from "@/constants/techstack";
import { useModal } from "@/hooks/use-modal";
import { useTechStackStore } from "@/hooks/use-techstack";
import { IconClose } from "@/public/assets/svgs";
import React from "react";

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
        className="bg-light-900 dark:bg-dark-100 h-auto w-[90%] max-w-md overflow-y-auto py-8 sm:max-w-2xl sm:px-12 sm:py-16"
      >
        <button onClick={onClose} className="absolute right-4 top-4">
          <Image 
            src={IconClose}
            alt="Close"
            width={24}
            height={24}
            className="object-contain"
          />
        </button>
        <DialogHeader>
          <DialogTitle className="text-md mb-4 text-center text-black dark:text-white md:text-xl">
            Select your Tech Stack
          </DialogTitle>
        </DialogHeader>
        {/* Tabs for grouping tech stacks by category */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-12 flex flex-wrap justify-center ">
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
          <TabsContent value="all">
            <div className="grid w-full grid-cols-3 gap-2">
              {techstacks.map((stackItem, i) => (
                <div
                  key={`stack-item-all-${i}`}
                  className={`border-darkgray hover:text-black-500 dark:hover:text-black-100 flex cursor-pointer rounded-md border p-2 text-black hover:bg-white dark:text-white ${
                    checkArray(stackItem.name.toLowerCase()) &&
                    "bg-blue-100 text-white"
                  } ${nonTech && "pointer-events-none saturate-0"}`}
                  onClick={() => addRemoveStack(stackItem.name.toLowerCase())}
                >
                  <div className="relative mx-auto h-5 w-5 sm:mx-0 sm:h-6 sm:w-6">
                    <Image
                      src={
                        stackItem.alias
                          ? `/assets/svgs/icon-${stackItem.alias.toLowerCase()}.svg`
                          : `/assets/svgs/icon-${stackItem.name.toLowerCase()}.svg`
                      }
                      alt={`${stackItem.name} icon`}
                      fill
                      title={stackItem.name}
                      className="object-cover"
                    />
                  </div>
                  <p className="hidden pl-4 sm:block">{stackItem.name}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Frontend */}
          <TabsContent value="frontend">
            <div className="grid w-full grid-cols-3 gap-2">
              {filterByCategory("Frontend").map((stackItem, i) => (
                <div
                  key={`stack-item-frontend-${i}`}
                  className={`border-darkgray hover:text-black-500 dark:hover:text-black-100 flex cursor-pointer rounded-md border p-2 text-black hover:bg-white dark:text-white ${
                    checkArray(stackItem.name.toLowerCase()) &&
                    "bg-blue-100 text-white"
                  } ${nonTech && "pointer-events-none saturate-0"}`}
                  onClick={() => addRemoveStack(stackItem.name.toLowerCase())}
                >
                  <div className="relative mx-auto h-5 w-5 sm:mx-0 sm:h-6 sm:w-6">
                    <Image
                      src={
                        stackItem.alias
                          ? `/assets/svgs/icon-${stackItem.alias.toLowerCase()}.svg`
                          : `/assets/svgs/icon-${stackItem.name.toLowerCase()}.svg`
                      }
                      alt={`${stackItem.name} icon`}
                      fill
                      title={stackItem.name}
                      className="object-cover"
                    />
                  </div>
                  <p className="hidden pl-4 sm:block">{stackItem.name}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Backend */}
          <TabsContent value="backend">
            <div className="grid w-full grid-cols-3 gap-2">
              {filterByCategory("Backend").map((stackItem, i) => (
                <div
                  key={`stack-item-backend-${i}`}
                  className={`border-darkgray hover:text-black-500 dark:hover:text-black-100 flex cursor-pointer rounded-md border p-2 text-black hover:bg-white dark:text-white ${
                    checkArray(stackItem.name.toLowerCase()) &&
                    "bg-blue-100 text-white"
                  } ${nonTech && "pointer-events-none saturate-0"}`}
                  onClick={() => addRemoveStack(stackItem.name.toLowerCase())}
                >
                  <div className="relative mx-auto h-5 w-5 sm:mx-0 sm:h-6 sm:w-6">
                    <Image
                      src={
                        stackItem.alias
                          ? `/assets/svgs/icon-${stackItem.alias.toLowerCase()}.svg`
                          : `/assets/svgs/icon-${stackItem.name.toLowerCase()}.svg`
                      }
                      alt={`${stackItem.name} icon`}
                      fill
                      title={stackItem.name}
                      className="object-cover"
                    />
                  </div>
                  <p className="hidden pl-4 sm:block">{stackItem.name}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Mobile */}
          <TabsContent value="mobile">
            <div className="grid w-full grid-cols-3 gap-2">
              {filterByCategory("Mobile").map((stackItem, i) => (
                <div
                  key={`stack-item-mobile-${i}`}
                  className={`border-darkgray hover:text-black-500 dark:hover:text-black-100 flex cursor-pointer rounded-md border p-2 text-black hover:bg-white dark:text-white ${
                    checkArray(stackItem.name.toLowerCase()) &&
                    "bg-blue-100 text-white"
                  } ${nonTech && "pointer-events-none saturate-0"}`}
                  onClick={() => addRemoveStack(stackItem.name.toLowerCase())}
                >
                  <div className="relative mx-auto h-5 w-5 sm:mx-0 sm:h-6 sm:w-6">
                    <Image
                      src={
                        stackItem.alias
                          ? `/assets/svgs/icon-${stackItem.alias.toLowerCase()}.svg`
                          : `/assets/svgs/icon-${stackItem.name.toLowerCase()}.svg`
                      }
                      alt={`${stackItem.name} icon`}
                      fill
                      title={stackItem.name}
                      className="object-cover"
                    />
                  </div>
                  <p className="hidden pl-4 sm:block">{stackItem.name}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Blockchain */}
          <TabsContent value="blockchain">
            <div className="grid w-full grid-cols-3 gap-2">
              {filterByCategory("Blockchain").map((stackItem, i) => (
                <div
                  key={`stack-item-blockchain-${i}`}
                  className={`border-darkgray hover:text-black-500 dark:hover:text-black-100 flex cursor-pointer rounded-md border p-2 text-black hover:bg-white dark:text-white ${
                    checkArray(stackItem.name.toLowerCase()) &&
                    "bg-blue-100 text-white"
                  } ${nonTech && "pointer-events-none saturate-0"}`}
                  onClick={() => addRemoveStack(stackItem.name.toLowerCase())}
                >
                  <div className="relative mx-auto h-5 w-5 sm:mx-0 sm:h-6 sm:w-6">
                    <Image
                      src={
                        stackItem.alias
                          ? `/assets/svgs/icon-${stackItem.alias.toLowerCase()}.svg`
                          : `/assets/svgs/icon-${stackItem.name.toLowerCase()}.svg`
                      }
                      alt={`${stackItem.name} icon`}
                      fill
                      title={stackItem.name}
                      className="object-cover"
                    />
                  </div>
                  <p className="hidden pl-4 sm:block">{stackItem.name}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Server */}
          <TabsContent value="server">
            <div className="grid w-full grid-cols-3 gap-2">
              {filterByCategory("Server").map((stackItem, i) => (
                <div
                  key={`stack-item-server-${i}`}
                  className={`border-darkgray hover:text-black-500 dark:hover:text-black-100 flex cursor-pointer rounded-md border p-2 text-black hover:bg-white dark:text-white ${
                    checkArray(stackItem.name.toLowerCase()) &&
                    "bg-blue-100 text-white"
                  } ${nonTech && "pointer-events-none saturate-0"}`}
                  onClick={() => addRemoveStack(stackItem.name.toLowerCase())}
                >
                  <div className="relative mx-auto h-5 w-5 sm:mx-0 sm:h-6 sm:w-6">
                    <Image
                      src={
                        stackItem.alias
                          ? `/assets/svgs/icon-${stackItem.alias.toLowerCase()}.svg`
                          : `/assets/svgs/icon-${stackItem.name.toLowerCase()}.svg`
                      }
                      alt={`${stackItem.name} icon`}
                      fill
                      title={stackItem.name}
                      className="object-cover"
                    />
                  </div>
                  <p className="hidden pl-4 sm:block">{stackItem.name}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* CMS */}
          <TabsContent value="cms">
            <div className="grid w-full grid-cols-3 gap-2">
              {filterByCategory("CMS").map((stackItem, i) => (
                <div
                  key={`stack-item-cms-${i}`}
                  className={`border-darkgray hover:text-black-500 dark:hover:text-black-100 flex cursor-pointer rounded-md border p-2 text-black hover:bg-white dark:text-white ${
                    checkArray(stackItem.name.toLowerCase()) &&
                    "bg-blue-100 text-white"
                  } ${nonTech && "pointer-events-none saturate-0"}`}
                  onClick={() => addRemoveStack(stackItem.name.toLowerCase())}
                >
                  <div className="relative mx-auto h-5 w-5 sm:mx-0 sm:h-6 sm:w-6">
                    <Image
                      src={
                        stackItem.alias
                          ? `/assets/svgs/icon-${stackItem.alias.toLowerCase()}.svg`
                          : `/assets/svgs/icon-${stackItem.name.toLowerCase()}.svg`
                      }
                      alt={`${stackItem.name} icon`}
                      fill
                      title={stackItem.name}
                      className="object-cover"
                    />
                  </div>
                  <p className="hidden pl-4 sm:block">{stackItem.name}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Design */}
          <TabsContent value="design">
            <div className="grid w-full grid-cols-3 gap-2">
              {filterByCategory("Design").map((stackItem, i) => (
                <div
                  key={`stack-item-design-${i}`}
                  className={`border-darkgray hover:text-black-500 dark:hover:text-black-100 flex cursor-pointer rounded-md border p-2 text-black hover:bg-white dark:text-white ${
                    checkArray(stackItem.name.toLowerCase()) &&
                    "bg-blue-100 text-white"
                  } ${nonTech && "pointer-events-none saturate-0"}`}
                  onClick={() => addRemoveStack(stackItem.name.toLowerCase())}
                >
                  <div className="relative mx-auto h-5 w-5 sm:mx-0 sm:h-6 sm:w-6">
                    <Image
                      src={
                        stackItem.alias
                          ? `/assets/svgs/icon-${stackItem.alias.toLowerCase()}.svg`
                          : `/assets/svgs/icon-${stackItem.name.toLowerCase()}.svg`
                      }
                      alt={`${stackItem.name} icon`}
                      fill
                      title={stackItem.name}
                      className="object-cover"
                    />
                  </div>
                  <p className="hidden pl-4 sm:block">{stackItem.name}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4 flex w-full items-center justify-between gap-2">
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
