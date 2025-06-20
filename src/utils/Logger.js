import { Query } from "mongoose";
import AsyncHandler from "./AsyncHandler.js";

// Logger middleware wrapped with AsyncHandler
const Logger = AsyncHandler(async (req, res, next) => {
  console.log({
    url: `${req.host}${req.originalUrl}`,
    method: req.method,
    param: req.params,
    time: new Date().toString(),
  });

  next();
});

export default Logger;
