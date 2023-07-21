import "./App.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Root from "./components/Root";
import Home from "./components/Home";
import Intro from "./components/Intro";

import Login from "./components/Login";
import Signup from "./components/Signup";
import Protected from "./components/Protected";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import { trpc } from "./utils/trpc";
import Note from "./components/Note";
import Destruct from "./components/Destruct";
import AuthContext from "./contexts/AuthContext";
import PublicOnly from "./components/PublicOnly";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("token") ? true : false
  );
  console.log(import.meta.env.VITE_API_URL);
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${import.meta.env.VITE_API_URL}/trpc`,
          // You can pass any HTTP headers you wish here
          async headers() {
            return {
              token: localStorage.getItem("token") || "",
            };
          },
        }),
      ],
    })
  );

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />}>
        <Route element={<PublicOnly />}>
          <Route index path="/" element={<Intro />} />
        </Route>
        <Route element={<Protected />}>
          <Route path="home" element={<Home />} />
        </Route>
        <Route path="login" element={<Login />}></Route>
        <Route path="signup" element={<Signup />}></Route>
        <Route path="user/note/:id" element={<Note />}></Route>
        <Route path="destruct/:id" element={<Destruct />}></Route>
      </Route>
    )
  );

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </trpc.Provider>
    </AuthContext.Provider>
  );
}

export default App;
