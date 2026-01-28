'use client'
import {use, useState} from 'react'
import {zodResolver} from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form'
import * as z from 'zod'
import Link from 'next/link'
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { signUpSchema } from '@/schemas/signUpSchema'
import { set } from 'mongoose'
import axios, { AxiosError } from 'axios'
import { useEffect } from 'react'
import { ApiResponse } from '@/types/ApiResponse'
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { signInSchema } from '@/schemas/signInSchema'
import { signIn } from 'next-auth/react'


const page = () => {
    
    const router = useRouter()


  //zod

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      
      identifier: '',  
      password: '',
    }
  })
 


  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
       const result = await signIn('credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password, 
       })
       if (result?.error) {
        toast.error('Invalid credentials')
       }
       if (result?.url) {
        router.replace('/dashboard')
       }
  }
  
  return (
    <div className="flex justify-center item-center min-h-screen bg-gray-100">
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
        <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
          Join Mystery msg

        </h1>
        <p className='mb-4'>Sign in to start your anonymous adventureee</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-6'>
          
          <FormField
          control={form.control}
          name='identifier'
          render={({field}) => (
            <FormItem>
              <FormLabel>Email/username</FormLabel>
              <FormControl>
                <Input
                  placeholder='email/username'
                  {...field}
                  
                />
                
              </FormControl>
              
            </FormItem>
          )}
          />
          <FormField
          control={form.control}
          name='password'
          render={({field}) => (
            <FormItem>
              <FormLabel>password</FormLabel>
              <FormControl>
                <Input type='password'
                  placeholder='password'
                  {...field}
                  
                />
                
              </FormControl>
              
            </FormItem>
          )}
          />
          <Button type='submit' >
          Sign in 
            </Button>
          </form>
      </Form>
      <div className='text-center mt-4'>
        
      </div>
    </div>
  )
  
}

      

export default page
