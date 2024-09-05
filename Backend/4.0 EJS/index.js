import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    // const today = new Date();
    const today = new Date("June 24, 2023 11:13:00");
    const day = today.getDay();
  
    // console.log(day);
    let type = "a weekday";
    let adv = "You need to work!";
  
    if (day === 0 || day === 6) {
      type = "a weekend";
      adv = "You need to rest too!";
    }
  
    res.render("./index.ejs", { dayType: type, advice: adv });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});