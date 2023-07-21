import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

import { useNavigate } from "react-router-dom";

const Intro = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="text-center text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
          Send private self destructing notes
        </h1>
        <p className="mt-6 text-center   text-gray-400"></p>
        <div className="flex">
          <Button
            variant="secondary"
            className=" text-xl  mr-4"
            size="lg"
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </Button>
          <Button
            size="lg"
            className="text-xl"
            onClick={() => {
              navigate("/signup");
            }}
          >
            Signup
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Intro;
