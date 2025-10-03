import express from "express";

const router = express.Router();

router.get("/send", (req, res) => {
    res.send("send messgage endpoint")
})

// router.get("/receive", (req, res) => {
//     res.send("send messgage endpoint")
// })

export default router;