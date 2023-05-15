import express, { NextFunction, Request, Response } from "express";
import router from "./router";

const app = express(); 
const PORT = 3000; 
const cors = require('cors');

app.use(express.json());
app.use(cors());
app.use("/api", router); 

//* HTTP method - GET
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Server start");
});

app.listen(PORT, () => {
  console.log(`
        #############################################
            🛡️ Server listening on port: ${PORT} 🛡️
        #############################################
    `);
}); 
