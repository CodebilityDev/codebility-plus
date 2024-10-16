
interface IOrderListItem {
  amount: number;
  name: string;
  total: number;
}

export default function OrderListItem({amount, name, total}:IOrderListItem) {
  return (
    <div className="flex flex-row items-start justify-between bg-[#F3F5F7] rounded-2xl px-6 py-4 border border-custom-secondary">
      <div className="flex flex-row items-start gap-x-2 basis-3/4">
        <p>{amount}x</p>
        <p>{name}</p>
      </div>
      <p className="basis-1/4 text-end">₱ {total.toLocaleString()}</p>
    </div>
  )
}