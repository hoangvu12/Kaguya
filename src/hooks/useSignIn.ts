import { supabaseClient as supabase } from "@supabase/auth-helpers-nextjs";
import { Provider } from "@supabase/gotrue-js";
import { useMutation } from "react-query";

interface UseSignInOptions {
  redirectTo?: string;
  scopes?: string;
}

const useSignIn = (supabaseOptions?: UseSignInOptions) => {
  return useMutation((provider: Provider) => {
    return supabase.auth.signIn(
      {
        provider,
      },
      supabaseOptions
    );
  });
};

export default useSignIn;
