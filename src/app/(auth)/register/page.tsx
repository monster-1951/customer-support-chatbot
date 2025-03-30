"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { registerSchema } from "@/schemas/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Selectt from "@/components/custom/Selectt";
import { Mail, Lock, User, Phone, ShieldCheck } from "lucide-react";

const Register = () => {
  const [Submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      UserName: "",
      email: "",
      MobileNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setSubmitting(true);
    try {
      const response = await axios.post("/api/register", values);
      toast("Success", { description: response.data.message });
      await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });
      router.replace("/");
    } catch (error) {
      console.error("Error during sign-up:", error);
      toast("Sign Up Failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto my-10 p-6 rounded-xl shadow-lg backdrop-blur-lg bg-black/20 border border-white/10">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-[#4299E1] to-[#90CDF4] ">
          Register to LangCorp
        </h1>
     
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-2">
          <FormField control={form.control} name="UserName" render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-white"><User className="h-4 w-4 text-blue-300" /> Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} className="text-white"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="Gender" render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-white"><ShieldCheck className="h-4 w-4 text-blue-300" /> Gender</FormLabel>
              <FormControl>
                <Selectt value={field.value} onChange={field.onChange} options={["Male", "Female", "Prefer not to say"]} placeHolder="Gender" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-white"><Mail className="h-4 w-4 text-blue-300" /> Email</FormLabel>
              <FormControl>
                <Input placeholder="Email address" {...field} className="text-white"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="MobileNumber" render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-white"><Phone className="h-4 w-4 text-blue-300" /> Mobile Number</FormLabel>
              <FormControl>
                <Input placeholder="Mobile Number" {...field} type="number" className="text-white"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="password" render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-white"><Lock className="h-4 w-4 text-blue-300" /> Create Password</FormLabel>
              <FormControl>
                <Input placeholder="Password" {...field} type="password" className="text-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="confirmPassword" render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-white"><Lock className="h-4 w-4 text-blue-300" /> Confirm Password</FormLabel>
              <FormControl>
                <Input placeholder="Confirm Password" {...field} type="password" className="text-white"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <div className="flex justify-between items-center">
            <Link href="/login" className="text-blue-400 hover:underline">Already have an account?</Link>
            <Button type="submit" disabled={Submitting} className="bg-gradient-to-br from-[#4299E1] to-[#90CDF4] text-white">
              {Submitting ? "Registering..." : "Register"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Register;
