"use client"
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface CategoryPillProps {
  label: string;
  value: string;
}

export default function CategoryPill({ label, value }: CategoryPillProps) {
  const searchParams = useSearchParams()
  const category = searchParams.get("category")

  const isAllSelected = (category === null || category === "") && value === "all" ? "bg-custom-primary text-custom-background" : "bg-custom-pill"
  const isSelected = category === value ? "bg-custom-primary text-custom-background" : "bg-custom-pill"

  return (
    <Link
    href={{pathname: 'menu', query:{category: value}}}
    className={`text-sm py-2 px-5 font-medium ${isAllSelected} ${isSelected} hover:bg-custom-secondary shadow-md shadow-custom-secondary/60 rounded-3xl active:scale-95`}
    >
      {label}
    </Link>
  )
}