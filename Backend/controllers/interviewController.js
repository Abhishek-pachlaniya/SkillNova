import Interview from '../models/Interview.js'; // .js extension zaroori hai ESM mein

export const sendRequest = async (req, res) => {
  try {
    const { engineerId, message } = req.body;
    const clientId = req.user.id; 

    const existing = await Interview.findOne({ client: clientId, engineer: engineerId });
    if (existing) {
      return res.status(400).json({ msg: "Aapne pehle hi request bhej di hai!" });
    }

    const newRequest = new Interview({
      client: clientId,
      engineer: engineerId,
      message
    });

    await newRequest.save();
    res.json({ msg: "Interview Request bhej di gayi hai! 🚀" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};