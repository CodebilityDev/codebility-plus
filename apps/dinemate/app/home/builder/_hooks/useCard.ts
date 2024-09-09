"use client";

import { useContext } from "react";
import { BuilderFormContext } from "../_components/builder-form-context";

export default function useCard() {
    const { cardData } = useContext(BuilderFormContext);

    return { cardData };
}