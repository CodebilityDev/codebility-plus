import Image from "next/image"

type SettingsCardProps = {
  imageName: string
  imageAlt: string
  title: string
  description: string
}

const SettingsCard = ({ imageName, imageAlt, title, description }: SettingsCardProps) => {
  return (
    <div
      className="z-10 h-full w-full rounded-lg bg-light-900 p-4
     dark:bg-dark-100 lg:h-72 "
    >
      <div className="flex h-full w-full flex-row justify-evenly gap-3 lg:flex-col">
        <div className="flex justify-center">
          <Image
            src={`/assets/svgs/${imageName}.svg`}
            alt={imageAlt}
            width={20}
            height={112}
            priority
            className="h-auto w-20  object-center"
          />
        </div>
        <div className="flex w-full flex-col justify-center  gap-3 ">
          <h3 className="text-lg text-black-100 dark:text-white">{title}</h3>
          <p className="text-gray">{description}</p>
        </div>
      </div>
    </div>
  )
}

export default SettingsCard