import { Skeleton } from "./ui/skeleton";

const Loading = (props: { size: number }) => {
  return (
    <>
      {[...Array(props.size)].map((_, i) => (
        <div className="flex items-center space-x-4 mr-5 mb-5">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </>
  );
};

export default Loading;
