"use client";

import { Button } from "@/Components/ui/button";
import { useModal } from "@/hooks/use-modal-service-categories";

const CategoriesAddNew = () => {
  const { onOpen } = useModal();

  return (
    <Button
      variant="default"
      size="lg"
      className="md:w-max"
      onClick={() => onOpen("serviceCategoriesModal")}
    >
      Add New Category
    </Button>
  );
};

export default CategoriesAddNew;
