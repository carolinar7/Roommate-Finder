import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

import { useProfile } from "../context/ProfileContext";
import path from "../data/path";
import { authenticateUser } from "../request/mutate";
import { ErrorResponse } from "../types/error.type";
import { clearAuthSession, storeAuthSession } from "../utils/storage";

export default function UseAuthRedirect() {
  const router = useRouter();
  const { setProfilePicture } = useProfile();

  const { refetch } = useQuery({
    queryKey: ["refreshToken", "accessToken", "userId"],
    queryFn: authenticateUser,
    refetchOnMount: true,
    onSuccess: (data) => {
      storeAuthSession(data);
      console.log(data.user?.image);
      setProfilePicture(data.user?.image || null); // Save the profile link to the context
      if (data.user && !data.user.is_verified) {
        if (!router.pathname.startsWith(path.auth)) {
          void router.push({
            pathname: "/auth/confirmEmail",
            query: { email: data.user?.email },
          });
        }
      } else if (
        data.user &&
        !data.user.is_setup &&
        !router.pathname.startsWith("/setup")
      ) {
        void router.push(path.setup);
      } else if (router.pathname.startsWith(path.auth)) {
        void router.push(path.explore);
      }
    },
    onError: (error: ErrorResponse) => {
      if (error.cause?.code === 401) {
        clearAuthSession();
        if (!router.pathname.startsWith(path.auth)) {
          toast(
            "You haven't logged in yet or your session has expired. Please log in again."
          );
          void router.push(path.auth);
        }
      } else {
        // If an unknown error occurs,
        // try to refetch every second until we can verify that either the user is authenticated or not
        setTimeout(() => {
          void refetch();
        }, 1000);
      }
    },
    retry: false,
  });
}
