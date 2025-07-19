module.exports = {
  plugins: {
    _tailwindcss: {},
    get tailwindcss() {
      return this._tailwindcss;
    },
    set tailwindcss(value) {
      this._tailwindcss = value;
    },
    tailwindcss: {},
    autoprefixer: {},
  },
}
// export default {
//   plugins: ["@tailwindcss/postcss"],
// };