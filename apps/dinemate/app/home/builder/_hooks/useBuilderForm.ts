"use client";

import { useContext } from "react";
import { BuilderFormContext } from "../_components/builder-form-context";

export default function useBuilderForm() {
    const { current, updateForm } = useContext(BuilderFormContext);

    return { current, updateForm };
}