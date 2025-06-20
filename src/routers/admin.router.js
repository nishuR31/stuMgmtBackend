import express from "express";
import {
  adminSignup,
  adminDel,
  adminSignin,
  adminToken,
  adminUser,
  adminEdit,
} from "../controllers/admin.controller.js";

let AdminRouter = express.Router();

AdminRouter.post("/signup", adminSignup);
AdminRouter.post("/signin", adminSignin);
AdminRouter.get("/:username", adminUser);
AdminRouter.get("/:username?edit=true", adminEdit);
AdminRouter.get("/:username/token", adminToken);
AdminRouter.post("/del/:id", adminDel);

export default AdminRouter;
