declare module "@material-tailwind/react/utils/withMT" {
  import type { Config } from "tailwindcss";

  const withMT: (config: Config) => Config;
  export default withMT;
}
