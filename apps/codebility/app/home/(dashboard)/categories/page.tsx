"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Box from "@/Components/shared/dashboard/Box"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { H1 } from "@/Components/shared/dashboard"

interface Category {
  id: number
  name: string
  topCodevs: {
    rank: number
    codev_name: string
    points: number
  }[]
}

// Number of rows to display per category
const ROWS_PER_CATEGORY = 10

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log("Fetching categories...")

        // First, get all categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from("skill_category")
          .select("id, name")

        if (categoriesError) {
          console.error("Error fetching categories:", categoriesError)
          setError(`Error fetching categories: ${categoriesError.message}`)
          setLoading(false)
          return
        }

        if (!categoriesData || categoriesData.length === 0) {
          console.log("No categories found")
          setCategories([])
          setLoading(false)
          return
        }

        console.log(`Found ${categoriesData.length} categories`)

        // For each category, get the top 10 codevs
        const categoriesWithTopCodevs = await Promise.all(
          categoriesData.map(async (category) => {
            console.log(`Fetching top codevs for category ${category.name}...`)

            try {
              // Get points data - limit to 10
              const { data: topCodevsData, error: topCodevsError } = await supabase
                .from("codev_points")
                .select(`
                  points,
                  codev_id,
                  skill_category_id
                `)
                .eq("skill_category_id", category.id)
                .order("points", { ascending: false })
                .limit(ROWS_PER_CATEGORY)

              if (topCodevsError) {
                console.error(`Error fetching top codevs for category ${category.name}:`, topCodevsError)
                return {
                  id: category.id,
                  name: category.name,
                  topCodevs: Array(ROWS_PER_CATEGORY)
                    .fill(null)
                    .map((_, index) => ({
                      rank: index + 1,
                      codev_name: "",
                      points: 0,
                    })),
                }
              }

              if (!topCodevsData || topCodevsData.length === 0) {
                console.log(`No top codevs found for category ${category.name}`)
                return {
                  id: category.id,
                  name: category.name,
                  topCodevs: Array(ROWS_PER_CATEGORY)
                    .fill(null)
                    .map((_, index) => ({
                      rank: index + 1,
                      codev_name: "",
                      points: 0,
                    })),
                }
              }

              console.log(`Found ${topCodevsData.length} top codevs for category ${category.name}`)

              // Get all codev_ids
              const codevIds = topCodevsData.map((item) => item.codev_id).filter(Boolean)

              if (codevIds.length === 0) {
                console.log(`No valid codev IDs for category ${category.name}`)
                return {
                  id: category.id,
                  name: category.name,
                  topCodevs: Array(ROWS_PER_CATEGORY)
                    .fill(null)
                    .map((_, index) => ({
                      rank: index + 1,
                      codev_name: "",
                      points: 0,
                    })),
                }
              }

              // Fetch codev names
              const { data: codevsData, error: codevsError } = await supabase
                .from("codev")
                .select("id, first_name")
                .in("id", codevIds)

              if (codevsError) {
                console.error(`Error fetching codev names for category ${category.name}:`, codevsError)
                // Continue with what we have
              }

              // Create a map of codev_id to first_name
              const codevMap = new Map()
              if (codevsData && codevsData.length > 0) {
                codevsData.forEach((codev) => {
                  codevMap.set(codev.id, codev.first_name)
                })
                console.log(`Mapped ${codevsData.length} codev names`)
              } else {
                console.log(`No codev names found for category ${category.name}`)
              }

              // Transform the data
              const transformedCodevs = topCodevsData.map((item, index) => ({
                rank: index + 1,
                codev_name: codevMap.get(item.codev_id) || "Unknown",
                points: item.points,
              }))

              // Ensure we have exactly ROWS_PER_CATEGORY rows
              const paddedCodevs = [...transformedCodevs]

              // Add empty rows if we have fewer than ROWS_PER_CATEGORY
              while (paddedCodevs.length < ROWS_PER_CATEGORY) {
                paddedCodevs.push({
                  rank: paddedCodevs.length + 1,
                  codev_name: "",
                  points: 0,
                })
              }

              return {
                id: category.id,
                name: category.name,
                topCodevs: paddedCodevs,
              }
            } catch (error) {
              console.error(`Error processing category ${category.name}:`, error)
              return {
                id: category.id,
                name: category.name,
                topCodevs: Array(ROWS_PER_CATEGORY)
                  .fill(null)
                  .map((_, index) => ({
                    rank: index + 1,
                    codev_name: "",
                    points: 0,
                  })),
              }
            }
          }),
        )

        console.log("Setting categories state...")
        setCategories(categoriesWithTopCodevs)
        setLoading(false)
      } catch (error) {
        console.error("Error in fetchCategories:", error)
        setError(`Error fetching data: ${error instanceof Error ? error.message : String(error)}`)
        setLoading(false)
      }
    }

    fetchCategories()
  }, [supabase])

  if (error) {
    return (
      <Box>
        <div className="flex justify-center items-center h-40">
          <p className="text-xl text-red-500">Error: {error}</p>
        </div>
      </Box>
    )
  }

  if (loading) {
    return (
      <div className="grid grid-cols-8 gap-8">
        <H1 className="col-span-8">Leaderboards by Category</H1>

        {/* Skeleton for two categories */}
        {[1, 2, 3, 4].map((skeleton) => (
          <Box key={`skeleton-${skeleton}`} className="col-span-4">
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <div className="h-8 w-40 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-10 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>

              <Table>
                <TableHeader className="bg-[#1e1f26]">
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array(10)
                    .fill(0)
                    .map((_, index) => (
                      <TableRow key={`skeleton-row-${index}`}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-12 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </Box>
        ))}
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <Box>
        <div className="flex justify-center items-center h-40">
          <p className="text-xl">No categories found</p>
        </div>
      </Box>
    )
  }

  return (
    <div className="grid grid-cols-8 gap-8">
      <H1 className="text-3xl font-bold col-span-8 text-light-900 my-8">Leaderboards by Category </H1>

      {categories.map((category) => (
        <Box key={category.id} className="col-span-4">
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <p className="text-2xl">{category.name} &nbsp; <small className="text-[#9c813b]">(top 10)</small></p>
              <Link
                href={`/home/categories/${category.id}`}
                className="px-4 py-2 border-2 dark:bg-[#1e1f26] hover:bg-[#2a2b33] hover:text-light-900 rounded-md transition-colors"
              >
                View All
              </Link>
            </div>

            <Table>
              <TableHeader className="bg-[#1e1f26]">
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {category.topCodevs.map((codev) => (
                  <TableRow
                    key={`${category.id}-${codev.rank}`}
                    className={codev.points > 0 ? getRowStyle(codev.rank) : ""}
                  >
                    <TableCell>{codev.rank}</TableCell>
                    <TableCell>{codev.points > 0 ? codev.codev_name : ""}</TableCell>
                    <TableCell>{codev.points > 0 ? codev.points : ""}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Box>
      ))}
    </div>
  )
}

const getRowStyle = (rank: number) => {
  const styles = {
    1: "bg-gradient-to-r from-[#9c813b] to-[#ecc258] text-white",
    2: "bg-gradient-to-r from-[#464646] to-[#a8a8a8] text-white",
    3: "bg-gradient-to-r from-[#563c1e] to-[#ba8240] text-white",
  } as const

  return styles[rank as keyof typeof styles] || ""
}

