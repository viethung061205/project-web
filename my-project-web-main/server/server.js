require('dotenv').config({
      path: require('path').resolve(__dirname, './.env')
});  

const app = require("./app");

console.log(
  "DB_USER =", process.env.DB_USER,
  "| DB_PASSWORD =", process.env.DB_PASSWORD
); 

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
