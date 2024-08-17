"use client";

import { useContext } from "react";
import { ProfileContext } from "../components/profile-context";

export default function useProfile() {
    const { updateProfileDatas, profileDatas } = useContext(ProfileContext);

    return { updateProfileDatas, profileDatas: JSON.parse(profileDatas) };
}