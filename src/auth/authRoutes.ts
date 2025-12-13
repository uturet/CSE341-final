// src/auth/auth.routes.ts
import { Router } from "express";
import passport from "passport";
import { googleCallback } from "./authController";

const router = Router();

// Google OAuth login route
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

// Google OAuth callback route
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleCallback // Handle the callback and generate token
);

export default router;