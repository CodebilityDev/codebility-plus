"use client";

import { useContext } from "react";
import { ProfileContext } from "../components/profile-context";

export default function useProfile() {
    const { updateProfileDatas, profileDatas } = useContext(ProfileContext);
    
    if (!profileDatas) throw new Error("using useProfile hook outside profile context provider!");

    return { updateProfileDatas, profileDatas: JSON.parse(profileDatas) };
}