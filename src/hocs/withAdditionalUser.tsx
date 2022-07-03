import { AdditionalUser } from "@/types";
import { getUser, supabaseClient, User } from "@supabase/auth-helpers-nextjs";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  PreviewData,
} from "next";
import { ParsedUrlQuery } from "querystring";

export type GetServerSidePropsWithUser<
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData
> = (
  context: GetServerSidePropsContext<Q, D>,
  user: AdditionalUser
) => Promise<GetServerSidePropsResult<P>>;

interface WithAdditionalUserOptions {
  getServerSideProps?: GetServerSidePropsWithUser;
}

type WithAdditionalUserResult = {
  props: {
    user: AdditionalUser;
    [key: string]: any;
  };
  [key: string]: any;
};

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

      let initialResult: WithAdditionalUserResult = {
        props: {
          user: additionalUser,
        },
      };

      const serverSideResult = await options?.getServerSideProps?.(
        ctx,
        additionalUser
      );

      if (serverSideResult) {
        initialResult = {
          ...serverSideResult,
          props: {
            user: additionalUser,
            ...("props" in serverSideResult && serverSideResult.props),
          },
        };
      }

      return initialResult;
    } catch (error) {
      console.log(error);

      return {
        redirect: {
          statusCode: 302,
          destination: "/login",
        },
      };
    }
  };

export default withAdditionalUser;
