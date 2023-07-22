import { useLocation, useNavigate, useParams } from "react-router-dom";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { trpc } from "@/utils/trpc";
import CopyToClipboard from "react-copy-to-clipboard";
import { useState } from "react";
import { Loader2, Terminal } from "lucide-react";

const Note = () => {
  const [noteData, setNoteData] = useState(useLocation().state);
  const noteId = useParams().id || "";
  const navigate = useNavigate();
  const [isCopied, setIsCopied] = useState(false);
  const noteDeleteMutation = trpc.note.deleteNote.useMutation();

  const getNoteDataQuery = trpc.note.getUserNote.useQuery(
    { noteId },
    {
      enabled: noteData ? false : true,
      onSuccess: (data) => {
        setNoteData(data);
      },
    }
  );

  //todo : if user not coming from home fetch note data from the server

  const handleDelete = () => {
    noteDeleteMutation.mutate(
      { noteId: noteData.id },
      {
        onSuccess: () => {
          navigate("/home");
        },
      }
    );
  };
  if (!noteData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin mr-2 h-4 w-4" />
      </div>
    );
  }
  console.log(noteData);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Button
        className=" fixed bottom-10 left-10"
        size="lg"
        onClick={() => {
          navigate("/home");
        }}
      >
        Back
      </Button>
      <div className="container items-center flex flex-col justify-center">
        <Card className=" m-4 w-fit min-w-[200px] min-w-200">
          <CardHeader>
            <CardTitle>{noteData.title}</CardTitle>
            <CardDescription>
              {noteData.read ? (
                <Badge variant="destructive" className=" mt-3">
                  read
                </Badge>
              ) : (
                <Badge className=" mt-3">unread</Badge>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>{noteData.content}</p>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="flex mb-4">
              <Button
                className="m-3"
                variant="destructive"
                onClick={handleDelete}
                disabled={noteDeleteMutation.isLoading}
              >
                {noteDeleteMutation.isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    <>Please wait</>
                  </>
                ) : (
                  <>Delete</>
                )}
              </Button>
              {noteData.read ? (
                <></>
              ) : (
                <CopyToClipboard
                  text={`${import.meta.env.VITE_FRONTEND_URL}/destruct/${
                    noteData.id
                  }`}
                  onCopy={() => {
                    setIsCopied(true);
                  }}
                >
                  <Button className="m-3">Copy Link</Button>
                </CopyToClipboard>
              )}
            </div>

            <div className="flex">
              <Badge variant="outline">
                created at : {new Date(noteData.createdAt).getFullYear()}
              </Badge>
            </div>
          </CardFooter>
        </Card>
        {isCopied ? (
          <Alert className="  w-fit text-left">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Link Copied!</AlertTitle>
            <AlertDescription>You can send it to anyone.</AlertDescription>
          </Alert>
        ) : (
          <></>
        )}
      </div>
    </motion.div>
  );
};

export default Note;
