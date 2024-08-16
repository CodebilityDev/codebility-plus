import { Box } from "@/Components/shared/dashboard"

const TokenPoints = () => {
  return (
    <Box className="flex w-full flex-1 flex-col gap-4">
      <p className="text-2xl">Token Points</p>
      <div className="flex flex-col gap-4 md:flex-row lg:flex-col xl:flex-row">
        <div className="flex w-full flex-col items-center gap-6 rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
          <p className="text-4xl text-teal">55</p>
          <p className="text-xl text-gray">Front-End Points</p>
        </div>
        <div className="flex w-full flex-col items-center gap-6 rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
          <p className="text-4xl text-teal">50</p>
          <p className="text-xl text-gray">Back-End Points</p>
        </div>
        <div className="flex w-full flex-col items-center gap-6 rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
          <p className="text-4xl">9</p>
          <p className="text-xl text-gray">UI/UX Points</p>
        </div>
      </div>
    </Box>
  )
}

export default TokenPoints
