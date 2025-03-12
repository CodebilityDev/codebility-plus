"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Box from "@/Components/shared/dashboard/Box"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { ArrowBigLeft } from "lucide-react"

interface TopCodev {
  rank: number
  name: string
  points: number
}

// Number of rows to display in the category detail page
const ROWS_PER_CATEGORY_DETAIL = 50

export default function CategoryLeaderboard() {
  const params = useParams()
  const router = useRouter()
  const categoryId = params.categoryId as string

  const [topCodevs, setTopCodevs] = useState<TopCodev[]>([])
  const [categoryName, setCategoryName] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        console.log(`Fetching data for category ID: ${categoryId}`)

        // First, get the category name
        const { data: categoryData, error: categoryError } = await supabase
          .from("skill_category")
          .select("name")
          .eq("id", categoryId)
          .single()

        if (categoryError) {
          console.error("Error fetching category:", categoryError)
          setError(`Error fetching category: ${categoryError.message}`)
          setLoading(false)
          return
        }

        if (categoryData) {
          console.log(`Category name: ${categoryData.name}`)
          setCategoryName(categoryData.name)
        } else {
          console.log("No category found with this ID")
          setError("Category not found")
          setLoading(false)
          return
        }

        // Then, get the top codevs for this category
        console.log("Fetching top codevs...")
        const { data, error } = await supabase
          .from("codev_points")
          .select(
            `
            points,
            codev_id
          `,
          )
          .eq("skill_category_id", categoryId)
          .order("points", { ascending: false })
          .limit(ROWS_PER_CATEGORY_DETAIL)

        if (error) {
          console.error("Error fetching top codevs:", error)
          setError(`Error fetching top codevs: ${error.message}`)
          setLoading(false)
          return
        }

        // Create empty array with ROWS_PER_CATEGORY_DETAIL rows
        let transformedData: TopCodev[] = Array(ROWS_PER_CATEGORY_DETAIL)
          .fill(null)
          .map((_, index) => ({
            rank: index + 1,
            name: "",
            points: 0,
          }))

        if (data && data.length > 0) {
          console.log(`Found ${data.length} top codevs`)

          // Get all codev_ids
          const codevIds = data.map((item) => item.codev_id).filter(Boolean)

          if (codevIds.length > 0) {
            // Fetch codev names
            console.log("Fetching codev names...")
            const { data: codevsData, error: codevsError } = await supabase
              .from("codev")
              .select("id, first_name")
              .in("id", codevIds)

            if (codevsError) {
              console.error("Error fetching codev names:", codevsError)
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
              console.log("No codev names found")
            }

            // Transform the data
            const filledData = data.map((item, index) => ({
              rank: index + 1,
              name: codevMap.get(item.codev_id) || "Unknown",
              points: item.points,
            }))

            // Replace the first N rows with actual data
            transformedData = [...filledData, ...transformedData.slice(filledData.length)]
          }
        } else {
          console.log("No top codevs found for this category")
        }

        console.log("Setting top codevs state...")
        setTopCodevs(transformedData)
        setLoading(false)
      } catch (error) {
        console.error("Error in fetchCategoryData:", error)
        setError(`Error fetching data: ${error instanceof Error ? error.message : String(error)}`)
        setLoading(false)
      }
    }

    if (categoryId) {
      fetchCategoryData()
    } else {
      setError("No category ID provided")
      setLoading(false)
    }
  }, [categoryId, router, supabase])

  if (error) {
    return (
      <Box>
        <div className="flex h-40 items-center justify-center">
          <p className="text-xl text-red-500">Error: {error}</p>
        </div>
      </Box>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center">
        <Box className="w-2/4 justify-center">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="h-8 w-16 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
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
                        <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                      </TableCell>
                    </TableRow>
                  ))}
                {/* Show a few more rows with larger gaps to indicate more data is loading */}
                {[15, 25, 35, 45].map((rank) => (
                  <TableRow key={`skeleton-row-${rank}`}>
                    <TableCell>{rank}</TableCell>
                    <TableCell>
                      <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Box>
      </div>
    )
  }

  return (
    <div className="flex justify-center">
      <Box className="w-2/4 justify-center">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="rounded-md border-2 dark:bg-[#1e1f26] hover:bg-[#2a2b33] hover:text-light-900 transition-colors py-1 px-2"
            >
              <ArrowBigLeft />
            </button>
            <p className="text-2xl">{categoryName} Leaderboard &nbsp; <small className="text-[#9c813b]">(top 50)</small></p>
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
              {topCodevs.map((codev) => (
                <TableRow key={codev.rank} className={codev.points > 0 ? getRowStyle(codev.rank) : ""}>
                  <TableCell>{codev.rank}</TableCell>
                  <TableCell>{codev.points > 0 ? codev.name : ""}</TableCell>
                  <TableCell>{codev.points > 0 ? codev.points : ""}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Box>
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

