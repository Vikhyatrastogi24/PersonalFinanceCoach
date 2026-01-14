import daisyui from "daisyui";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // <— Must include all src files!
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
};
