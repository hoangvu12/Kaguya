const getEnvironmentVariable = (environmentVariable: string): string => {
  const unvalidatedEnvironmentVariable = process.env[environmentVariable];
  if (!unvalidatedEnvironmentVariable) {
    throw new Error(
      `Couldn't find environment variable: ${environmentVariable}`
    );
  }

  return unvalidatedEnvironmentVariable;
};

const config = {
  supabaseKey: getEnvironmentVariable("NEXT_PUBLIC_SUPABASE_KEY"),
  supabaseUrl: getEnvironmentVariable("NEXT_PUBLIC_SUPABASE_URL"),
};

export default config;
