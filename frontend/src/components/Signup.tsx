import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useContext } from "react";
import AuthContext from "@/contexts/AuthContext";
import { trpc } from "@/utils/trpc";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  username: z.string().min(2).max(100),
  password: z.string().min(2).max(100),
});

const Signup = () => {
  const auth = useContext(AuthContext);
  const tokenCreator = trpc.user.signup.useMutation();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    tokenCreator.mutate(values, {
      onSuccess: (data) => {
        localStorage.setItem("token", data);
        auth.setIsLoggedIn(true);
        navigate("/home");
      },
    });
  }

  return (
    <div className="sm:container sm:mx-auto flex items-center justify-center m-20">
      <motion.div
        initial={{ opacity: 0, scale: 1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-[250px] md:w-[400px] lg:w-[400px]">
          <h1 className="text-center text-6xl font-bold tracking-tighter">
            Signup
          </h1>
          <br />
          {tokenCreator.isError ? (
            <Alert className=" mb-5" variant="destructive">
              <AlertTitle className=" text-lg">Error!</AlertTitle>
              <AlertDescription className="  text-sm">
                {tokenCreator.error.message}
              </AlertDescription>
            </Alert>
          ) : (
            <></>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Username" {...field} />
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
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormDescription>
                By clicking Submit, you agree to keep private notes a frindly
                and safe place for everyone.
              </FormDescription>
              <Button
                type="submit"
                className=" w-full"
                disabled={tokenCreator.isLoading}
              >
                {tokenCreator.isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    <>Please wait</>
                  </>
                ) : (
                  <>Signup</>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
