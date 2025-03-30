// "use client";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { loginSchema } from "@/schemas/loginSchema";
// import React, { useState } from "react";
// import { useForm } from "react-hook-form";

// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { signIn, useSession } from "next-auth/react";
// import { toast } from "sonner";
// import Link from "next/link";

// const Login = () => {
//   const [isSubmitting, setisSubmitting] = useState(false);
//   const { data: session } = useSession();
//   const router = useRouter();
//   const form = useForm<z.infer<typeof loginSchema>>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: {
//       identifier: "",
//       password: "",
//     },
//   });
//   async function onSubmit(values: z.infer<typeof loginSchema>) {
//     setisSubmitting(true);
//     const result = await signIn("credentials", {
//       redirect: false,
//       email: values.identifier,
//       password: values.password,
//     }).catch(() => {
//       setisSubmitting(false);
//     });
//     setisSubmitting(false);
//     if (result?.error) {
//       if (result.error === "CredentialsSignin") {
//         toast(
//           "Login Failed",
//           {
//             description: "Incorrect username or password",
//           }
//           //   variant: "destructive",
//         );
//       } else {
//         toast("Error", { description: result.error });
//       }
//       setisSubmitting(false);
//     }

//     if (result?.url) {
//       router.replace("/");
//     }
//     console.log(values);
//   }
//   return (
//     <div className="w-fit mx-auto my-10 border-2 p-5 text-white">
//           <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 text-white">
//          Login into LangCorp
//         </h1>
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 text-white">
//           <FormField
//             control={form.control}
//             name="identifier"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Email</FormLabel>
//                 <FormControl>
//                   <Input placeholder="Your Email id" {...field} type="email" className="text-white" />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="password"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Password</FormLabel>
//                 <FormControl>
//                   <Input
//                     placeholder="Your Password"
//                     {...field}
//                     type="password"
//                     className="text-white"
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <div className="flex justify-between">
//             <Link href={"/register"}>
//               <Button type="button">Register</Button>
//             </Link>
//             <Button type="submit">
//               {isSubmitting ? "Loading...." : "Login"}
//             </Button>
//           </div>
//         </form>
//       </Form>
//     </div>
//   );
// };

// export default Login;

"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas/loginSchema";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import Link from "next/link";
import { Lock, Mail } from "lucide-react";

const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      redirect: false,
      email: values.identifier,
      password: values.password,
    }).catch(() => setIsSubmitting(false));

    setIsSubmitting(false);
    if (result?.error) {
      toast("Login Failed", {
        description:
          result.error === "CredentialsSignin"
            ? "Incorrect username or password"
            : result.error,
      });
    }
    if (result?.url) {
      router.replace("/");
    }
  }

  return (
    <div className="w-full max-w-md mx-auto mt-10 p-6 rounded-xl bg-black/20 border border-white/10 shadow-md text-white backdrop-blur-lg animate-fade-in">
      <h1 className="text-3xl font-extrabold text-center mb-6 bg-gradient-to-br from-[#4299E1] to-[#90CDF4] text-transparent bg-clip-text">
        Login to LangCorp
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your Email ID"
                    {...field}
                    type="email"
                    className="bg-black/30 border border-white/10 text-white rounded-xl px-4 py-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Lock className="w-4 h-4" /> Password
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your Password"
                    {...field}
                    type="password"
                    className="bg-black/30 border border-white/10 text-white rounded-xl px-4 py-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between">
            <Link href="/register">
              <Button
                variant="outline"
                className="text-black hover:font-semibold"
              >
                Register
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Loading..." : "Login"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Login;
