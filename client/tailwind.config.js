/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "main-gray": "#34495E",
        "second-gray": "#BDC3C7",
        "focus-blue": "#2980B9",
        "dark-blue": "#071952",
        "money-blue": "#4B70F5",
        "positive-green": "#059212",
        "background-gray": "#F5F5F5",
        "main-text": "#2C3E50",
        "secondary-text": "#7F8C8D",
      },
      fontFamily: {
        "header-poppins": ["Poppins", "sans - serif"],
        "main-open-sans": ["Open Sans", "sans-serif"],
      },
      backgroundImage: {
        "login-page":
          "url('https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExN2J5ZHR5ZnJuYmE1djd4Y2F1Nno4YTliY2FrcnBxcXJ3ZTZ3MDZiYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LXd5YtB6mjLHkXQOhd/giphy.webp')",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
