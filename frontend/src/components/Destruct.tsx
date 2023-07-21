import { trpc } from "@/utils/trpc";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import Loading from "./Loading";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "./ui/badge";
import { Loader2 } from "lucide-react";
const Destruct = () => {
  const id = useParams().id || "";
  const getNoteMutation = trpc.note.getNote.useMutation();
  const isNoteRead = trpc.note.isNoteRead.useQuery(
    { noteId: id },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );

  const handleReadNote = () => {
    getNoteMutation.mutate(
      { noteId: id },
      {
        onSuccess: (data) => {
          console.log(data);
        },
      }
    );
  };

  if (isNoteRead.isLoading) {
    return (
      <div className="sm:container sm:mx-auto flex items-center justify-center">
        <div className="flex flex-col items-center justify-center py-20">
          <Loading size={2} />
        </div>
      </div>
    );
  }

  if (isNoteRead.error) {
    return (
      <div className="sm:container sm:mx-auto flex items-center justify-center">
        <div className="flex flex-col items-center justify-center py-20">
          <h1 className="text-center text-5xl font-bold tracking-tighter leading-normal">
            {isNoteRead.error.message}
          </h1>
        </div>
      </div>
    );
  }

  if (isNoteRead.data) {
    return (
      <div className="sm:container sm:mx-auto flex items-center justify-center">
        <div className="flex flex-col items-center justify-center py-20">
          <h1 className="text-center text-5xl font-bold tracking-tighter leading-normal">
            This note has been already read !
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="sm:container sm:mx-auto flex items-center justify-center">
      <div className="flex flex-col items-center justify-center py-20">
        {getNoteMutation.data ? (
          <></>
        ) : (
          <>
            <h1 className="text-center text-5xl font-bold tracking-tighter leading-normal">
              This is a private note and it will self destruct after you read it
            </h1>
            <div className="flex mb-10">
              <Button
                variant="destructive"
                className=" text-xl  mt-10"
                size="lg"
                onClick={handleReadNote}
                disabled={getNoteMutation.isLoading}
              >
                {getNoteMutation.isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    <>Please wait</>
                  </>
                ) : (
                  <>Read the note</>
                )}
              </Button>
            </div>
          </>
        )}

        {getNoteMutation.isLoading ? (
          <Loading size={2} />
        ) : getNoteMutation.data ? (
          <Card className=" m-4">
            <CardHeader>
              <CardTitle>{getNoteMutation.data.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{getNoteMutation.data.content}</p>
            </CardContent>
            <CardFooter>
              <Badge variant="outline">
                created at :{" "}
                {new Date(getNoteMutation.data.createdAt).getFullYear()}
              </Badge>
            </CardFooter>
          </Card>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Destruct;
