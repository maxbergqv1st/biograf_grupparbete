import typography from "@tailwindcss/typography";

const config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [typography],
};

export default config;
