import express from 'express';
import multer from 'multer';
import JobApplication from '../models/JobApplication.js';
import { sendJobApplicationEmail } from '../utils/emailService.js';
import { authenticateAdmin } from '../utils/auth.js';

const router = express.Router();

// Use memory storage for Vercel compatibility
const upload = multer({ storage: multer.memoryStorage() });

// Submit job application
router.post('/', upload.single('resume'), async (req, res) => {
  try {
    const { name, email, phone, position, message } = req.body;

    if (!name || !email || !position || !req.file) {
      return res.status(400).json({ message: 'Name, email, position, and resume are required' });
    }

    const jobApplication = new JobApplication({
      name, email, phone, position, message,
      resumeFilename: req.file.originalname,
    });
    await jobApplication.save();

    // Send email notification using Brevo
    try {
      await sendJobApplicationEmail({
        name, email, phone, position, message,
        resume: req.file, // Pass the entire file object
      });
      console.log('Career application emails sent successfully via Brevo');
    } catch (emailError) {
      console.error('Brevo email sending failed:', emailError);
    }

    res.status(201).json({ 
      message: 'Job application submitted successfully',
      id: jobApplication._id 
    });

  } catch (error) {
    console.error('Job application submission error:', error);
    res.status(500).json({ message: 'Error submitting job application' });
  }
});

// Get all job applications (for admin purposes)
router.get('/', async (req, res) => {
  try {
    const applications = await JobApplication.find()
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(applications);
  } catch (error) {
    console.error('Error fetching job applications:', error);
    res.status(500).json({ 
      message: 'Error fetching job applications' 
    });
  }
});

// Update application status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['submitted', 'reviewing', 'interview', 'rejected', 'hired'].includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status value' 
      });
    }

    const application = await JobApplication.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ 
        message: 'Job application not found' 
      });
    }

    res.json(application);
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ 
      message: 'Error updating application status' 
    });
  }
});

// Delete job application (admin only)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const application = await JobApplication.findByIdAndDelete(req.params.id);

    if (!application) {
      return res.status(404).json({ 
        message: 'Job application not found' 
      });
    }

    res.json({ message: 'Job application deleted successfully' });
  } catch (error) {
    console.error('Error deleting job application:', error);
    res.status(500).json({ 
      message: 'Error deleting job application' 
    });
  }
});

// Get career stats (admin only)
router.get('/stats/overview', authenticateAdmin, async (req, res) => {
  try {
    const totalApplications = await JobApplication.countDocuments();
    const newApplications = await JobApplication.countDocuments({ status: 'submitted' });
    const reviewingApplications = await JobApplication.countDocuments({ status: 'reviewing' });
    const interviewApplications = await JobApplication.countDocuments({ status: 'interview' });

    res.json({
      totalApplications,
      newApplications,
      reviewingApplications,
      interviewApplications
    });
  } catch (error) {
    console.error('Get career stats error:', error);
    res.status(500).json({ message: 'Server error fetching career stats.' });
  }
});

export default router;