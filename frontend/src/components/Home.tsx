import { Button } from "@/components/ui/button";

import { motion } from "framer-motion";
import { trpc } from "@/utils/trpc";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

import { Input } from "./ui/input";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Textarea } from "./ui/textarea";
import Loading from "./Loading";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(2).max(50),
  content: z.string().min(2).max(500),
});

const Home = () => {
  const notesQuery = trpc.note.getUserNotes.useQuery();
  const navigate = useNavigate();
  const [newNoteFormOpen, setNewNoteFormOpen] = useState<boolean>(false);
  const newNoteMutation = trpc.note.createNote.useMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    newNoteMutation.mutate(values, {
      onSuccess: () => {
        form.reset();
        setNewNoteFormOpen(false);
        notesQuery.refetch();
      },
    });
    console.log(values);
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Button
        className=" fixed bottom-10 left-10  z-50"
        size="lg"
        onClick={() => {
          setNewNoteFormOpen(!newNoteFormOpen);
        }}
      >
        Add Note
      </Button>
      <Dialog open={newNoteFormOpen} onOpenChange={setNewNoteFormOpen}>
        <DialogTrigger></DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create new note</DialogTitle>
            <DialogDescription>
              create a self destructing note by filling the form below
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="title" {...field} />
                    </FormControl>
                    <FormDescription>This is your note title.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea placeholder="content" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your note content.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={newNoteMutation.isLoading}
                className="w-full"
              >
                {newNoteMutation.isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    <>Please wait</>
                  </>
                ) : (
                  <>Submit</>
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col items-center justify-center  py-12">
        <h1 className="text-center text-6xl font-bold tracking-tighter mb-10">
          Your notes
        </h1>

        {notesQuery.isLoading ? (
          <div className="sm:container sm:mx-auto flex flex-row flex-wrap">
            <Loading size={10}></Loading>
          </div>
        ) : (
          <div className="sm:container sm:mx-auto flex flex-row flex-wrap">
            {notesQuery.data?.map((note) => (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Card
                  className=" m-4"
                  onClick={() => {
                    navigate(`/user/note/${note.id}`, {
                      state: {
                        id: note.id,
                        title: note.title,
                        content: note.content,
                        read: note.read,
                        createdAt: note.createdAt,
                      },
                    });
                  }}
                >
                  <CardHeader>
                    <CardTitle>{note.title}</CardTitle>
                    <CardDescription>
                      {note.read ? (
                        <Badge variant="destructive">read</Badge>
                      ) : (
                        <Badge>unread</Badge>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{note.content}</p>
                  </CardContent>
                  <CardFooter>
                    <Badge variant="outline">
                      created at : {new Date(note.createdAt).getFullYear()}
                    </Badge>
                  </CardFooter>
                </Card>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Home;
