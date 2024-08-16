import Image from "next/image"

interface Props {
  icon?: string
  value?: string
  label?: string
  iconClassName?: string
}

const BoxInset = ({ icon, value, label, iconClassName }: Props) => {
  return (
    <div className="background-lightsmallbox_darksmallbox relative flex flex-row items-center gap-6 rounded-lg p-4">
      {icon && (
        <Image
          src={`/assets/svgs/icon-${icon}.svg`}
          width={15}
          height={15}
          className={`${iconClassName}`}
          alt={`${icon}`}
        />
      )}
      <div className="flex flex-col">
        <p className="text-2xl font-semibold">{value}</p>
        <p>{label}</p>
      </div>
    </div>
  )
}

export default BoxInset
