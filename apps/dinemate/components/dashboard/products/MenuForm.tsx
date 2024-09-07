"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useMemo, useState, useRef } from "react"
import Image from "next/image"
import { ImagePlus, Loader, CircleMinus } from "lucide-react"
import { menuService } from "@/modules"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { ToastAction } from "@/components/ui/toast"
import { AddMenuDto } from "@/modules/menu/menu.types"
import { revalidate } from "@/lib/revalidate"
import { categories } from "@/util/categories"

const formSchema = z.object({
  name: z.string().min(1, "required"),
  description: z.string().min(1,"required"),
  price: z.number().positive("must be a positive number"),
  imageUri: z.string().min(1,"required"),
  category: z.string().min(1,"required"),
  prepareTime: z.number().positive("must be a positive number").optional(),
  calories: z.number().nonnegative("must be non negative number").optional(),
  ingredients: z.array(z.string()).optional(),  
  quantity: z.number().nonnegative("must be a non negative number").optional(),
})

interface IMenuForm {
  type: "new"|"update"
  menuForm?: AddMenuDto;
  menuId?: string
}

export default function MenuForm({
  type,
  menuId,
  menuForm = {
    name: "",
    description: "",
    price: 0,
    imageUri: "",
    category: "",
    prepareTime: undefined,
    calories: undefined,
    ingredients: undefined,
    quantity: undefined
  },
}: IMenuForm) {
  const [totalIngredients, setTotalIngredients] = useState(menuForm?.ingredients?.length ?? 0)
  const [isLoading, setIsLoading] = useState(false)
  const {toast} = useToast()
  const router = useRouter()
  const submitRef = useRef<HTMLButtonElement>(null)

  const ingedientsArr = useMemo(() => Array.from({length: totalIngredients}), [totalIngredients])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: menuForm
  })
  

  const onSubmit = async(values: z.infer<typeof formSchema>) => {
    console.log({
      menuId
    })
    try {
      setIsLoading(true)
      const res = type==="new" ? await menuService.addMenu(values) : await menuService.updateMenu(menuId as string, values)
      if (res) {
        toast({
          title: "New menu added successfully!"
        })        
        revalidate("/dashbaord/products")
        router.back()
        return
      }
      toast({
        variant: "destructive",
        title: "Something went wrong",
        action: <ToastAction altText="Retry" onClick={() => {
          if (submitRef.current) {
            submitRef.current.click()
          }
        }}>
          Retry
        </ToastAction>  
      })
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Something went wrong",
        action: <ToastAction altText="Retry" onClick={() => {
          if (submitRef.current) {
            submitRef.current.click()
          }
        }}>
          Retry
        </ToastAction>  
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}
      className="max-w-[500px] flex flex-col items-center gap-y-4"
      >
      <FormField
          control={form.control}
          name="imageUri"
          render={({field}) => (
            <FormItem className="w-full">
              <div className="flex flex-col items-center relative w-[500px] h-[300px]">
                <ImagePlus size={64} className={`z-30 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 ${field.value ? "stroke-custom-primary/0" : "stroke-custom-primary/70"} pointer-events-none`} />
                <Image src={field.value || "/food-placeholder.png"} width={500} height={300} alt="food" className={`pointer-events-none w-full h-full rounded-xl shadow-lg ${field.value ? "object-contain" : "object-cover"}`} />
                <FormControl>
                  <Input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" 
                  className={`absolute top-0 left-0 w-full h-full ${field.value ? "opacity-0" : "bg-white/60"}`}
                  onChange={(e) => {
                    const files = e.currentTarget.files;
                    if (!files) return;
                    const reader = new FileReader();

                    reader.onloadend = () => {
                      field.onChange(reader.result);  // This will set the data URL to the field value
                    };

                    if (files[0]) {
                      reader.readAsDataURL(files[0]);
                    }
                  }}
                  />
                </FormControl>                  
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({field}) => (
            <FormItem className="w-full">
              <FormLabel>Menu Name</FormLabel>
              <FormControl>
                <Input {...field} className="shadow-md" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({field}) => (
            <FormItem className="w-full">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} className="shadow-md" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />         
          <FormField // TODO: this is select
          control={form.control}
          name="category"
          render={({field}) => (
            <FormItem className="w-full">
              <FormLabel>Category</FormLabel>
              <FormControl>
              <Select onValueChange={(v) => field.onChange(v)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Categories" />
                </SelectTrigger>
                <SelectContent>
                  {
                    categories.filter(c => c.value !== "all").map(c => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
          <FormField
          control={form.control}
          name="price"
          render={({field}) => (
            <FormItem className="w-full">
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input  type="number"  className="shadow-md" {...field}  
                  onChange={(e) => field.onChange(e.currentTarget.valueAsNumber)} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />       
        <FormField
          control={form.control}
          name="prepareTime"
          render={({field}) => (
            <FormItem className="w-full">
              <FormLabel>Prepare time in minutes (optional)</FormLabel>
              <FormControl>
                <Input  {...field} type="number" className="shadow-md" 
                  onChange={(e) => field.onChange(e.currentTarget.valueAsNumber)} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="calories"
          render={({field}) => (
            <FormItem className="w-full">
              <FormLabel>Calories (optional)</FormLabel>
              <FormControl>
                <Input  {...field} type="number" className="shadow-md" 
                  onChange={(e) => field.onChange(e.currentTarget.valueAsNumber)} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
          <FormField
          control={form.control}
          name="quantity"
          render={({field}) => (
            <FormItem className="w-full">
              <FormLabel>Stock (optional)</FormLabel>
              <FormControl>
                <Input  {...field} type="number" className="shadow-md" 
                  onChange={(e) => field.onChange(e.currentTarget.valueAsNumber)} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ingredients"
          render={({field}) => (
            <FormItem className="w-full">
              <FormLabel>Ingredients (optional)</FormLabel>
              <FormControl>
                <div className="flex flex-col gap-y-2">
                  {
                    ingedientsArr.map((_,i) => {
                      const v = Array.isArray(field.value) ? field.value[i] : ""
                      return (
                        <div key={i} className="flex flex-row items-start gap-x-2" >
                          <p>{i+1}.</p>
                          <Input 
                            type="string" 
                            value={v} 
                            className="shadow-md"
                              onChange={(e) => {
                              const text = e.currentTarget.value
                              const newValue = field.value!.map((f,idx) => {
                                if (idx === i) {
                                  return text
                                }
                                return f
                              })
                              field.onChange(newValue)
                            }}  
                          />
                          <button type="button" className="self-center" onClick={() => {
                            const newValue = field.value?.filter((_,idx) =>  i !== idx)
                            if (typeof newValue == undefined) {
                              field.onChange(undefined)
                            }
                            else if (newValue?.length === 0) {
                              field.onChange(undefined)
                            } else {
                              field.onChange(newValue)
                            }
                            setTotalIngredients(t => t-1)
                          }}>
                            <CircleMinus size={24}/>
                          </button>
                        </div>
                    )
                    })
                  }
                <Button 
                type="button"
                className="w-36 bg-custom-green ms-5 hover:bg-custom-green/80"
                onClick={() => {
                  const newValue = Array.isArray(field.value) ? [...field.value, ""] : [""]
                  form.setValue("ingredients", newValue)
                  setTotalIngredients(t => t+1)
                }}
                >Add Ingredient</Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="py-4 w-full">
          <Button
          disabled={isLoading}
          ref={submitRef} 
          type="submit" 
          className="relative w-full font-bold text-xl shadow-lg disabled:opacity-50">
              { isLoading ? 
              <Loader className="fill-white animate-spin" size={24} /> :
              "Save Menu"
            }
          </Button>
        </div>
      </form>
    </Form>
  )
}