import { getUser, supabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, GetServerSidePropsContext } from "next";

interface WithAdditionalUserOptions {
  getServerSideProps?: GetServerSideProps;
}

const withAdditionalUser =
  (options?: WithAdditionalUserOptions) =>
  async (ctx: GetServerSidePropsContext) => {
    try {
      const { user } = await getUser(ctx);

      if (!user) {
        throw new Error("User not found");
      }

      const { data: additionalUser, error } = await supabaseClient
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        throw error;
      }

      const serverSideProps = await options.getServerSideProps?.(ctx);

      return {
        ...serverSideProps,
        props: {
          user: additionalUser,
          ...("props" in serverSideProps && serverSideProps.props),
        },
      };
    } catch (_) {
      return {
        redirect: {
          statusCode: 302,
          destination: "/login",
        },
      };
    }
  };

export default withAdditionalUser;
