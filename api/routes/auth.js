import { Router } from "express";
import { employeeDao } from "ponto-certo/bin";

const authRouter = Router();

authRouter.get("/", async (req, res) => {
  const USERS = await employeeDao.get();
  const session = req.cookies.session;

  if (!session) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  // In a real app you would verify a signed cookie or JWT
  const user = USERS.find((u) => u.id.value() === Number(session));
  if (!user) {
    return res.status(401).json({ error: "Invalid session" });
  }

  req.user = user;
});

authRouter.post("/", async (req, res) => {
  const USERS = await employeeDao.get();

  const { name, password } = req.body;

  const user = USERS.find((u) => u.name.value() === name && u.password.value() === password);

  if (!user) {
    return res.redirect(303, "/html/erro.html");
  }

  // Set a cookie storing the user ID
  res.cookie("session", user.id.value(), {
    httpOnly: true, // cannot be accessed by JS (recommended)
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  });

  return res.redirect(303, "/");
});

authRouter.post("/logout", (req, res) => {
  res.clearCookie("session");
  res.json({ ok: true });
});

export { authRouter };
