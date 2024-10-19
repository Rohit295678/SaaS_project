'use client'
import Heading from "@/components/Heading"
import { Bug, ImageIcon, MessageSquare } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState } from "react"

import { amountOptions, formSchema, resolutionOption } from "./constants"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Empty } from "@/components/Empty"
import { Loader } from "@/components/Loader"
import { cn } from "@/lib/utils"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


const Image = ()=>{
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            prompt: "",
            amount: "1",
            resolution: "512x512"
        }
    });

    const router = useRouter();
    const [images, setImages] = useState<string[]>([])
    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>)=>{
        try {
            setImages([]);
            console.log(values)
            const response = await axios.post("/api/image",values);
            const urls = response.data.map((image:{url:string})=>image.url);
            setImages(urls);
            form.reset();
        } catch (error: any) {
            console.log(error);
        }finally{
           router.refresh();
        }
    }
    return(
        <div>
           <Heading
           title="Image Generation"
           description="Turn Your Prompt into an Image"
           icon={ImageIcon}
           iconColor="text-pink-500"
           bgColor="bg-pink-500/10" />
           <div className="px-4 lg:px-8">
            <div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
                >
                  <FormField name="prompt" render={({field})=>(
                    <FormItem className="col-span-12 lg:col-span-6">
                       <FormControl className="m-0 p-0">
                           <Input className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent" disabled={isLoading} placeholder="Pictures Of Taj Mahal" {...field} />
                       </FormControl>
                    </FormItem>
                  )} />
                  <FormField
                   control={form.control} 
                   name="amount"
                   render={({field})=>(
                    <FormItem className="col-span-12 lg:col-span-2">
                      <Select disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                               <SelectValue defaultValue={field.value}/>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {amountOptions.map((option)=>(
                              <SelectItem
                              key={option.value}
                              value={option.value}>
                                    {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                      </Select>
                    </FormItem>
                   )}/>
                   <FormField
                   control={form.control} 
                   name="resolution"
                   render={({field})=>(
                    <FormItem className="col-span-12 lg:col-span-2">
                      <Select disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                               <SelectValue defaultValue={field.value}/>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {resolutionOption.map((option)=>(
                              <SelectItem
                              key={option.value}
                              value={option.value}>
                                    {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                      </Select>
                    </FormItem>
                   )}/>
                  <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}>
                    Generate
                  </Button>
                </form>
              </Form>
              </div>
              <div className="space-y-4 mt-4">
                {isLoading && (<div className="p-20">
                    <Loader />
                </div>)}
                 {images.length === 0 && !isLoading && (<Empty label="No Images Generated" />)}
                   <div>
                      Images Will be render
                   </div>
              </div>
           </div>
        </div>
    )
}
export default Image