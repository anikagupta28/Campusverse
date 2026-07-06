import express from "express";
import TalkNest from "../models/TalkNest.js";
import User from "../models/User.js";

const router = express.Router();

const BAD_WORDS = [
  "fuck", "shit", "bitch", "bastard", "asshole", "ass", "crap", "damn",
  "hell", "cunt", "dick", "piss", "cock", "whore", "slut", "idiot",
  "stupid", "moron", "retard", "nigger", "nigga", "faggot", "fag",
  "motherfucker", "motherfucking", "fucker", "bullshit", "wtf", "stfu",
  "dumbass", "jackass", "loser", "jerk", "prick", "twat", "wanker",
  "arsehole", "arse", "bollocks", "bugger", "bloody hell",
  "madarchod", "behenchod", "behen ke lode", "bhen ka loda",
  "bhosadike", "bhosadi", "bhosda", "chutiya", "chutiye", "chut",
  "lund", "lode", "loda", "gaand", "gandu", "haramzada", "haramzadi",
  "harami", "kamina", "kamini", "randi", "randwa", "maderchod",
  "mc", "bc", "bkl", "bsdke", "bsdk",
  "saala", "saali", "sala", "sali",
  "kutte", "kutta", "kuttiya", "kutiya", "suar", "suwar",
  "ullu ka pattha", "ullu", "bakwaas", "bakwas",
  "teri maa ki", "teri maa", "teri behen ki",
  "jhant", "jhatu", "jhaatu", "hijra", "chakka",
  "chodu", "chodna", "chodne",
  "randi ka bacha", "randi ke", "randike",
  "maa ki aankh", "maa ki", "tatte", "tatti",
  "gaandu", "gadha", "gadhe", "nalayak", "nikamma"
];

const containsProfanity = (text) => {
  const lowercaseText = text.toLowerCase();
  return BAD_WORDS.some((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "i");
    return regex.test(lowercaseText);
  });
};

router.put("/:postId/reply/:replyId/like", async (req, res) => {
  const { userId } = req.body;

  const post = await TalkNest.findById(req.params.postId);
  const reply = post.replies.id(req.params.replyId);

  if (!reply) return res.status(404).json({ error: "Reply not found" });

  const alreadyLiked = reply.likes.includes(userId);

  if (alreadyLiked) {
    reply.likes = reply.likes.filter(id => id !== userId);
  } else {
    reply.likes.push(userId);
  }

  await post.save();

  res.json(reply);
});

router.put("/:postId/reply/:replyId/fire", async (req, res) => {
  const { userId } = req.body;

  const post = await TalkNest.findById(req.params.postId);
  const reply = post.replies.id(req.params.replyId);

  if (!reply) return res.status(404).json({ error: "Reply not found" });

  const alreadyFired = reply.fires.includes(userId);

  if (alreadyFired) {
    reply.fires = reply.fires.filter(id => id !== userId);
  } else {
    reply.fires.push(userId);
  }

  await post.save();

  res.json(reply);
});

router.put("/:id/reply", async (req, res) => {
  const { text, userId } = req.body;

  try {
    const post = await TalkNest.findById(req.params.id);

    if (!post) return res.status(404).json({ error: "Post not found" });

  const newReply = {
  text,
  author: userId   // ✅ store real user
};

    post.replies.push(newReply);

    await post.save();

    res.json(post); // send updated post

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error adding reply" });
  }
});
router.delete("/:postId/reply/:replyId", async (req, res) => {
  try {
    const post = await TalkNest.findById(req.params.postId);

    if (!post) return res.status(404).json({ error: "Post not found" });

    post.replies = post.replies.filter(
      r => r._id.toString() !== req.params.replyId
    );

    await post.save();

    res.json({ success: true });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete reply" });
  }
});
router.get("/", async (req, res) => {
  const posts = await TalkNest.find();
  res.json(posts);
});

router.post("/", async (req, res) => {
  const { text,  userId  } = req.body;
  // author: userId   // ✅ store real user
  if (!text || !userId) {
    return res.status(400).json({ error: "Text and author are required" });
  }
  console.log("BODY:", req.body);

  const isFlagged = containsProfanity(text);
  
  const newPost = new TalkNest({
    text: isFlagged ? text : text, // store raw text
    author: userId,
    status: isFlagged ? "flagged" : "approved",
  });

  await newPost.save();
  res.json({ success: true, post: newPost });
});

router.put("/:id/approve", async (req, res) => {
  try {
    const post = await TalkNest.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    res.json({ message: "Post approved", post });
  } catch (error) {
    res.status(500).json({ error: "Failed to approve post" });
  }
});

router.delete("/:id", async (req, res) => {
  await TalkNest.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

router.put("/:id/like", async (req, res) => {
  const { userId } = req.body;

  try {
    const post = await TalkNest.findById(req.params.id);

    if (!post) return res.status(404).json({ error: "Post not found" });

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter(id => id !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.json({
      likes: post.likes,
      liked: !alreadyLiked
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error liking post" });
  }
});

router.put("/:id/fire", async (req, res) => {
  const { userId } = req.body;

  try {
    const post = await TalkNest.findById(req.params.id);

    if (!post) return res.status(404).json({ error: "Post not found" });

    const alreadyFired = post.fires.includes(userId);

    if (alreadyFired) {
     post.fires = post.fires.filter(id => id !== userId);
    } else {
      post.fires.push(userId);
    }

    await post.save();

  res.json({
  fires: post.fires   // ✅ array
});

  } catch (err) {
    res.status(500).json({ error: "Error firing post" });
  }
});

router.get("/user-stats/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const allPosts = await TalkNest.find();

    let totalLikes = 0;
    let totalFires = 0;
    let solved = 0;

    allPosts.forEach(p => {
      p.replies?.forEach(r => {
        if (r.author === userId) {
          solved++;   // ✅ count replies

          totalLikes += r.likes?.length || 0;   // ✅ ONLY reply likes
          totalFires += r.fires?.length || 0;   // ✅ ONLY reply fires
        }
      });
    });

    res.json({
      solved,
      totalLikes,
      totalFires
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error fetching stats" });
  }
});

export default router;
