import dotenv from "dotenv";
import mongoose from "mongoose";
import Knowledge from "../models/Knowledge.js";

dotenv.config({ path: "../.env" });

await mongoose.connect(process.env.MONGO_URI);

async function saveKnowledge(question, answer, keywords = []) {
  await Knowledge.create({
    question,
    answer,
    keywords
  });

  console.log("Knowledge stored:", question);
}

await saveKnowledge(
  "Guest House at Banasthali",
  "Accommodation facility for visitors and parents.Provides comfortable stay for official guests and short-term campus visits.",
  ["Guest House", "Atithi grah"]
);
await saveKnowledge(
  "Medical Shops Facilities",
  "Pharmacies providing medicines and healthcare essentials.",
  ["medical", "medicines"]
);
await saveKnowledge(
  "Archery ground at campus?",
  "Dedicated ground for practicing archery where students train to improve focus, precision, and competitive shooting skills.",
  ["archery", "archrie"]
);
await saveKnowledge(
  "Badminton Court Facilities",
  "Banasthali Vidyapith has a strong badminton culture with proper training facilities and has been a consistent participant in the West Zone Inter-University Championships, showcasing its excellence in sports.",
  ["Badminton court", "badminton complex"]
);
await saveKnowledge(
  "Boys School at banasthali",
  "Banasthali Vidyapith also has a well-structured boy's school up to Class 12 that provides quality education with a disciplined and value-based environment, modern academic facilities, sports and extracurricular opportunities, ensuring overall development in a safe, structured and growth-oriented campus setting.",
  ["boys school", "boy area"]
);
await saveKnowledge(
  "Cricket Ground Facilities",
  "Banasthali Vidyapith promotes cricket with professional coaching by experienced trainers, well-maintained grounds and strong sports infrastructure, and recently hosting the West Zone Inter-University Girls Cricket Tournament, which highlighted its excellence in organizing and encouraging high-level competitive sports.",
  ["cricket ground", "cricket"]
);
await saveKnowledge(
  "Avaiation at banasthali Facilities",
  "Banasthali Vidyapith is one of the very few universities in India to offer flying training through its own fully equipped aviation program, where students receive professional pilot training with dedicated instructors and flying hours on campus, and notable alumni like Avani Chaturvedi, Bhawana Kanth and Mohana Singh have achieved remarkable success in the Indian Air Force, with students typically requiring around 18–24 months of rigorous ground training and 200+ flying hours to reach a professional level of flying expertise.",
  ["flying", "avaiation","flying club"]
);
await saveKnowledge(
  "Banasthali is which tier college? ",
  "Banasthali Vidyapith: A Top Tier 2 University for Women.",
  ["tier"]
);
await saveKnowledge(
  "Avaiation at banasthali Facilities",
  "Banasthali Vidyapith is one of the very few universities in India to offer flying training through its own fully equipped aviation program, where students receive professional pilot training with dedicated instructors and flying hours on campus, and notable alumni like Avani Chaturvedi, Bhawana Kanth and Mohana Singh have achieved remarkable success in the Indian Air Force, with students typically requiring around 18–24 months of rigorous ground training and 200+ flying hours to reach a professional level of flying expertise.",
  ["flying", "avaiation","flying club"]
);
await saveKnowledge(
  "Football ground at banasthali Facilities",
  "Banasthali Vidyapith actively promotes football under the mentorship of Sana Ma’am by providing spacious and well-maintained grounds along with structured coaching sessions, where students engage in regular practice matches and tournaments; this continuous exposure helps in building teamwork, leadership skills and strategic thinking while also improving stamina and confidence, ultimately shaping disciplined and competitive players ready to perform at higher levels.",
  ["football", "football ground","football area"]
);



process.exit();