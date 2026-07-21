/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/**/*.html', './src/js/**/*.js'],
  theme: { extend: { colors: { ink: '#172033', brand: '#4f46e5', mist: '#f6f7fb' }, boxShadow: { card: '0 10px 35px rgba(23, 32, 51, .07)' } } },
  plugins: []
};
