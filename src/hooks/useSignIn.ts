import supabaseClient from "@/lib/supabase";
import { Provider } from "@supabase/gotrue-js";
import { useMutation } from "react-query";

interface UseSignInOptions {
  redirectTo?: string;
  scopes?: string;
}

const useSignIn = (supabaseOptions?: UseSignInOptions) => {
  return useMutation((provider: Provider) => {
    return supabaseClient.auth.signIn(
      {
        provider,
      },
      supabaseOptions
    );
  });
};

export default useSignIn;
