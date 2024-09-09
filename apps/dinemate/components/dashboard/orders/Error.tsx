"use client"
import { Button } from "@codevs/ui/button"
import { revalidate } from "~/lib/revalidate"


export default function Error({path}:{path:string}) {
  return (
    <div>
        <p>something went wrong</p>
        <Button variant={"link"} onClick={() => revalidate(path)}>
          reload
        </Button>
    </div>
  )
}