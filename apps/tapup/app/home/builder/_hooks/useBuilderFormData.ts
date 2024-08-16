"use client";

import { useContext } from "react";
import { BuilderFormContext } from "../_components/builder-form-context";

export default function useBuilderFormData() {
    const { updateProfileDatas, profileDatas } = useContext(BuilderFormContext);

    return { updateProfileDatas, profileDatas: JSON.parse(profileDatas) };
}