import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { body, validationResult } from "express-validator";
import nodemailer from "nodemailer";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"], // Updated for Vite
  credentials: true
}));

app.use(morgan("combined"));
app.use(helmet());

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/online_voting";
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Environment check
if (!process.env.JWT_SECRET || process.env.JWT_SECRET === "supersecretkey") {
  console.error("❌ CRITICAL: Set a strong JWT_SECRET in production!");
  process.exit(1);
}

// Email configuration
const EMAIL_CONFIG = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
};

// Create email transporter
let emailTransporter;
if (EMAIL_CONFIG.auth.user && EMAIL_CONFIG.auth.pass) {
  emailTransporter = nodemailer.createTransport(EMAIL_CONFIG);
  
  // Verify email configuration
  emailTransporter.verify((error, success) => {
    if (error) {
      console.error('❌ Email configuration error:', error);
      console.log('⚠️  Email notifications will be disabled');
      emailTransporter = null;
    } else {
      console.log('✅ Email server is ready to send messages');
    }
  });
} else {
  console.log('⚠️  Email credentials not configured. Email notifications disabled.');
  console.log('💡 Set EMAIL_USER and EMAIL_PASSWORD in .env to enable email notifications');
}

// Email sending function
const sendApprovalEmail = async (userEmail, userName) => {
  if (!emailTransporter) {
    console.log('⚠️  Email not sent (transporter not configured)');
    return { success: false, message: 'Email service not configured' };
  }

  const mailOptions = {
    from: `"VoteSecure System" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: '🎉 Your VoteSecure Account Has Been Approved!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px 10px 0 0;
            text-align: center;
          }
          .content {
            background: #f9fafb;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .button {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
          }
          .info-box {
            background: white;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
          }
          .footer {
            text-align: center;
            color: #666;
            font-size: 12px;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🗳️ Welcome to VoteSecure!</h1>
        </div>
        <div class="content">
          <p>Dear <strong>${userName}</strong>,</p>
          
          <p>Great news! Your registration on the VoteSecure online voting platform has been <strong>approved by our administrator</strong>.</p>
          
          <div class="info-box">
            <h3>✅ What You Can Do Now:</h3>
            <ul>
              <li>Log in to your account</li>
              <li>View available elections for your eligibility group</li>
              <li>Cast your vote in active elections</li>
              <li>Nominate yourself as a candidate</li>
              <li>View election results after voting ends</li>
            </ul>
          </div>
          
          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" class="button">
              Login to Your Account
            </a>
          </div>
          
          <div class="info-box">
            <h3>📧 Your Account Details:</h3>
            <p><strong>Email:</strong> ${userEmail}</p>
            <p><strong>Status:</strong> ✅ Approved</p>
          </div>
          
          <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
          
          <p>Happy Voting!</p>
          <p><strong>The VoteSecure Team</strong></p>
        </div>
        <div class="footer">
          <p>This is an automated message from VoteSecure Online Voting System</p>
          <p>Please do not reply to this email</p>
        </div>
      </body>
      </html>
    `,
    text: `
Dear ${userName},

Great news! Your registration on the VoteSecure online voting platform has been approved by our administrator.

What You Can Do Now:
- Log in to your account
- View available elections for your eligibility group
- Cast your vote in active elections
- Nominate yourself as a candidate
- View election results after voting ends

Login here: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/login

Your Account Details:
Email: ${userEmail}
Status: Approved

If you have any questions or need assistance, please contact our support team.

Happy Voting!
The VoteSecure Team

---
This is an automated message from VoteSecure Online Voting System
Please do not reply to this email
    `
  };

  try {
    const info = await emailTransporter.sendMail(mailOptions);
    console.log('✅ Approval email sent to:', userEmail);
    console.log('📧 Message ID:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// MongoDB Connection (modern options)
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Schemas & Indexes
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, index: true },
  password: String,
  isAdmin: { type: Boolean, default: false },
  approved: { type: Boolean, default: false },
  eligibility: { type: String, default: "general" },
  createdAt: { type: Date, default: Date.now }
});

const candidateSchema = new mongoose.Schema({
  name: String,
  party: String,
  electionId: { type: mongoose.Schema.Types.ObjectId, index: true },
  photo: String,
  manifesto: String,
  pending: { type: Boolean, default: false, index: true },
  createdAt: { type: Date, default: Date.now }
});

const electionSchema = new mongoose.Schema({
  title: String,
  candidates: [{ type: mongoose.Schema.Types.ObjectId }],
  start: Date,
  end: Date,
  isActive: { type: Boolean, default: true, index: true },
  eligibility: { type: String, default: "general", index: true },
  createdAt: { type: Date, default: Date.now }
});

const voteSchema = new mongoose.Schema({
  candidate: { type: mongoose.Schema.Types.ObjectId, index: true },
  election: { type: mongoose.Schema.Types.ObjectId, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, index: true },
  timestamp: { type: Date, default: Date.now }
});
voteSchema.index({ election: 1, userId: 1 }, { unique: true });

const User = mongoose.model("User", userSchema);
const Candidate = mongoose.model("Candidate", candidateSchema);
const Election = mongoose.model("Election", electionSchema);
const Vote = mongoose.model("Vote", voteSchema);

// Security Middleware
const auth = async (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

const adminAuth = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

// Rate limiter for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many login attempts, please try again later"
});

// Routes
app.post("/register",
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).trim(),
  body('name').trim().notEmpty().escape(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { name, email, password, eligibility } = req.body;
      const hash = await bcrypt.hash(password, 12);
      const user = new User({ name, email, password: hash, eligibility: eligibility || "general" });
      await user.save();
      res.json({ success: true, message: "Registered successfully. Awaiting admin approval." });
    } catch (e) {
      if (e.code === 11000) {
        res.status(400).json({ success: false, message: "Email already exists" });
      } else {
        res.status(500).json({ success: false, message: "Registration failed" });
      }
    }
  }
);

app.post("/login", loginLimiter, async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (!user.approved) {
      return res.status(400).json({ message: "Account not approved yet" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin, eligibility: user.eligibility }, JWT_SECRET, { expiresIn: "7d" });
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isApproved: user.approved,
        eligibility: user.eligibility
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

app.get("/dashboard", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user.approved) {
      return res.status(400).json({ message: "Not approved" });
    }
    const elections = await Election.find({ isActive: true, eligibility: user.eligibility }).sort({ start: -1 });
    res.json({ elections });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch dashboard" });
  }
});

app.get("/election/:id/candidates", auth, async (req, res) => {
  try {
    const candidates = await Candidate.find({ electionId: req.params.id, pending: false });
    const userVote = await Vote.findOne({ election: req.params.id, userId: req.user.userId });
    res.json({ candidates, hasVoted: !!userVote });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch candidates" });
  }
});

app.post("/vote", auth, async (req, res) => {
  try {
    const { candidateId, electionId } = req.body;
    if (!candidateId || !electionId) {
      return res.status(400).json({ message: "Missing candidateId or electionId" });
    }
    const candidate = await Candidate.findById(candidateId);
    if (!candidate || candidate.electionId.toString() !== electionId) {
      return res.status(400).json({ message: "Invalid candidate for this election" });
    }
    const existingVote = await Vote.findOne({ election: electionId, userId: req.user.userId });
    if (existingVote) {
      return res.status(400).json({ success: false, message: "You have already voted in this election" });
    }
    const user = await User.findById(req.user.userId);
    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }
    if (election.eligibility !== user.eligibility) {
      return res.status(403).json({ message: "You are not eligible for this election" });
    }
    const now = new Date();
    if (!election.isActive) {
      return res.status(400).json({ message: "Election is not active" });
    }
    if (now < election.start) {
      return res.status(400).json({ message: "Election has not started yet" });
    }
    if (now > election.end) {
      return res.status(400).json({ message: "Election has ended" });
    }
    const vote = new Vote({ candidate: candidateId, election: electionId, userId: req.user.userId });
    await vote.save();
    res.json({ success: true, message: "Vote cast successfully" });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ success: false, message: "Duplicate vote detected" });
    } else {
      res.status(500).json({ success: false, message: "Failed to cast vote" });
    }
  }
});

app.get("/results/:electionId", auth, async (req, res) => {
  try {
    const election = await Election.findById(req.params.electionId);
    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }
    const now = new Date();
    if (!req.user.isAdmin && now < election.end) {
      return res.status(403).json({ message: "Results not available until election ends" });
    }
    const votes = await Vote.aggregate([
      { $match: { election: new mongoose.Types.ObjectId(req.params.electionId) } },
      { $group: { _id: "$candidate", count: { $sum: 1 } } },
    ]);
    let total = votes.reduce((sum, v) => sum + v.count, 0);
    let candidateVotes = [];
    for (let v of votes) {
      let candidate = await Candidate.findById(v._id);
      if (candidate) {
        candidateVotes.push({
          _id: candidate._id,
          name: candidate.name,
          party: candidate.party,
          manifesto: candidate.manifesto,
          photo: candidate.photo,
          votes: v.count,
          percentage: parseFloat(((v.count / total) * 100).toFixed(2))
        });
      }
    }
    candidateVotes.sort((a, b) => b.votes - a.votes);
    res.json({ results: candidateVotes });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch results" });
  }
});

app.get("/stats/:electionId", auth, async (req, res) => {
  try {
    const election = await Election.findById(req.params.electionId);
    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }
    const eligibleVoters = await User.countDocuments({ approved: true, eligibility: election.eligibility });
    const totalVotes = await Vote.countDocuments({ election: req.params.electionId });
    const turnout = eligibleVoters > 0 ? parseFloat(((totalVotes / eligibleVoters) * 100).toFixed(2)) : 0;
    res.json({ totalVotes, eligibleVoters, turnout });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

app.post("/nominate", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user.approved) {
      return res.status(403).json({ message: "Your account is not approved" });
    }
    const { electionId, party, manifesto, photo } = req.body;
    const exists = await Candidate.findOne({ name: user.name, electionId });
    if (exists) {
      return res.status(400).json({ message: "You have already nominated for this election" });
    }
    const candidate = new Candidate({ name: user.name, party: party || "", electionId, photo: photo || "", manifesto: manifesto || "", pending: true });
    await candidate.save();
    res.json({ success: true, message: "Nomination submitted. Awaiting admin approval." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to submit nomination" });
  }
});

// Improved reporting: now stores in DB (optional collection: Report)
const reportSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  subject: String,
  description: String,
  timestamp: { type: Date, default: Date.now }
});
const Report = mongoose.model("Report", reportSchema);

app.post("/report", auth, async (req, res) => {
  try {
    const { subject, description } = req.body;
    const report = new Report({ userId: req.user.userId, subject, description });
    await report.save();
    res.json({ success: true, message: "Your report has been recorded. We'll look into it." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to submit report" });
  }
});

// Admin endpoints

app.get("/admin/pending-users", auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find({ approved: false }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pending users" });
  }
});

app.post("/admin/approve/:id", auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Send approval email
    const emailResult = await sendApprovalEmail(user.email, user.name);
    
    if (emailResult.success) {
      console.log(`✅ User approved and email sent to: ${user.email}`);
      res.json({ 
        success: true, 
        message: "User approved and notification email sent",
        emailSent: true
      });
    } else {
      console.log(`⚠️  User approved but email failed: ${emailResult.error || emailResult.message}`);
      res.json({ 
        success: true, 
        message: "User approved (email notification failed)",
        emailSent: false,
        emailError: emailResult.error || emailResult.message
      });
    }
  } catch (error) {
    console.error('❌ Error in approval process:', error);
    res.status(500).json({ success: false, message: "Failed to approve user" });
  }
});

app.post("/admin/reject/:id", auth, adminAuth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User rejected and removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to reject user" });
  }
});

app.get("/admin/pending-candidates", auth, adminAuth, async (req, res) => {
  try {
    const candidates = await Candidate.find({ pending: true }).sort({ createdAt: -1 });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pending candidates" });
  }
});

app.post("/admin/approve-candidate/:id", auth, adminAuth, async (req, res) => {
  try {
    await Candidate.findByIdAndUpdate(req.params.id, { pending: false });
    const candidate = await Candidate.findById(req.params.id);
    await Election.findByIdAndUpdate(candidate.electionId, { $addToSet: { candidates: candidate._id } });
    res.json({ success: true, message: "Candidate approved" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to approve candidate" });
  }
});

app.post("/admin/reject-candidate/:id", auth, adminAuth, async (req, res) => {
  try {
    await Candidate.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Candidate nomination rejected" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to reject candidate" });
  }
});

app.post("/admin/elections", auth, adminAuth, async (req, res) => {
  try {
    const { title, start, end, eligibility } = req.body;
    if (!title || !start || !end) {
      return res.status(400).json({ success: false, message: "Title, start date, and end date are required" });
    }
    const election = new Election({ title, start, end, eligibility: eligibility || "general" });
    await election.save();
    res.json({ success: true, election });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create election" });
  }
});

app.get("/elections", auth, async (req, res) => {
  try {
    const elections = await Election.find().populate("candidates").sort({ start: -1 });
    res.json(elections);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch elections" });
  }
});

app.put("/admin/elections/:id", auth, adminAuth, async (req, res) => {
  try {
    await Election.findByIdAndUpdate(req.params.id, req.body);
    res.json({ success: true, message: "Election updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update election" });
  }
});

app.delete("/admin/elections/:id", auth, adminAuth, async (req, res) => {
  try {
    await Candidate.deleteMany({ electionId: req.params.id });
    await Vote.deleteMany({ election: req.params.id });
    await Election.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Election deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete election" });
  }
});

app.post("/admin/candidates", auth, adminAuth, async (req, res) => {
  try {
    const { name, party, electionId, photo, manifesto } = req.body;
    if (!name || !electionId) {
      return res.status(400).json({ success: false, message: "Name and election are required" });
    }
    const candidate = new Candidate({ name, party, electionId, photo, manifesto, pending: false });
    await candidate.save();
    await Election.findByIdAndUpdate(electionId, { $addToSet: { candidates: candidate._id } });
    res.json({ success: true, candidate });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create candidate" });
  }
});

app.get("/admin/candidates", auth, adminAuth, async (req, res) => {
  try {
    const candidates = await Candidate.find({ pending: false }).sort({ createdAt: -1 });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch candidates" });
  }
});

app.put("/admin/candidates/:id", auth, adminAuth, async (req, res) => {
  try {
    await Candidate.findByIdAndUpdate(req.params.id, req.body);
    res.json({ success: true, message: "Candidate updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update candidate" });
  }
});

app.delete("/admin/candidates/:id", auth, adminAuth, async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (candidate) {
      await Election.findByIdAndUpdate(candidate.electionId, { $pull: { candidates: candidate._id } });
    }
    await Candidate.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Candidate deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete candidate" });
  }
});

// System / Health Check
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(), 
    uptime: process.uptime(),
    emailConfigured: !!emailTransporter
  });
});

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ message: "Internal server error", error: process.env.NODE_ENV === "development" ? err.message : undefined });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
    ╔════════════════════════════════════════╗
    ║  🗳️  Online Voting System Backend     ║
    ║  ✅ Server running on port ${PORT}       ║
    ║  📦 MongoDB connected                 ║
    ║  🔐 JWT authentication enabled        ║
    ║  📧 Email: ${emailTransporter ? 'Enabled' : 'Disabled'}                   ║
    ╚════════════════════════════════════════╝
  `);
});

process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});
