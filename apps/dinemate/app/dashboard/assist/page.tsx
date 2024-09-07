import {format} from "date-fns"
import { assistService } from "@/modules"
import Error from "@/components/dashboard/orders/Error"
import AssistButton from "@/components/dashboard/AssistButton"
import AssistRefresher from "@/components/dashboard/AssistRefresher"

export default async function AssistPage() {

  const assistList = await assistService.getAssistList()

  if (!assistList) {
    return <Error path="/dashboard/assist" />
  }

  assistList.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="w-full flex-grow py-12">
      <h1 className="text-3xl">User in need of assistance</h1>
      <div className="w-full flex flex-col gap-y-2 py-8">
        {
          assistList.map((a) => {
            const {_id, userName, message, tableNumber, status, createdAt} = a

            return (
              <div key={_id} className="flex flex-col gap-y-2 w-full max-w-[800px] border-b border-custom-secondary pb-6 bg-white p-3 rounded-lg shadow-md">
                <div className="flex flex-row items-center justify-between">
                  <p className="font-bold text-lg">
                    {userName}
                  </p>
                  <p className="text-black/70">{format(new Date(createdAt), "hh:mm a")}</p>
                </div>
                <div className="flex flex-row items-center justify-between">
                  <p>table# {tableNumber}</p>
                  <AssistButton id={_id} status={status} />
                </div>
                <p className="px-4 font-semibold">{message}</p>
              </div>
            )
          })
        }
      </div>
      <AssistRefresher />
    </div>
  )
}