'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { signupSchema } from "@/schema/signupSchema"
import { useState } from "react"

const [issubmitting, setissubmitting] = useState(false)

export default function page() {
const form  = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues:{
        name : "",
        email : "",
        password : "",
    }
})

const onsubmit = async (data: z.infer<typeof signupSchema>) => {
    setissubmitting(true)
    try {
        
    } catch (error) {
        
    }
}
  return (
    <div>page</div>
  )
}
