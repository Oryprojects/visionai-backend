import express from 'express';
import Job from '../models/Job.js';
import JobApplication from '../models/JobApplication.js';
import { authenticateAdmin } from '../utils/auth.js';

const router = express.Router();

// Get all jobs (public)
router.get('/', async (req, res) => {
  try {
    const { status, featured, department } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    else filter.status = 'OPEN'; // Default to open jobs for public
    if (featured === 'true') filter.featured = true;
    if (department) filter.department = department;

    const jobs = await Job.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .select('-__v');

    res.json(jobs);
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Server error fetching jobs.' });
  }
});

// Get job by slug (public)
router.get('/slug/:slug', async (req, res) => {
  try {
    const job = await Job.findOne({ 
      slug: req.params.slug,
      status: 'OPEN' 
    }).select('-__v');

    if (!job) {
      return res.status(404).json({ message: 'Job not found.' });
    }

    res.json(job);
  } catch (error) {
    console.error('Get job by slug error:', error);
    res.status(500).json({ message: 'Server error fetching job.' });
  }
});

// Create new job (admin only)
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const jobData = req.body;
    
    // Check if slug already exists
    if (jobData.slug) {
      const existingJob = await Job.findOne({ slug: jobData.slug });
      if (existingJob) {
        return res.status(400).json({ message: 'Job with this slug already exists.' });
      }
    }

    const job = new Job(jobData);
    await job.save();

    res.status(201).json({
      message: 'Job created successfully',
      job
    });
  } catch (error) {
    console.error('Create job error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error creating job.' });
  }
});

// Update job (admin only)
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({ message: 'Job not found.' });
    }

    res.json({
      message: 'Job updated successfully',
      job
    });
  } catch (error) {
    console.error('Update job error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error updating job.' });
  }
});

// Delete job (admin only)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found.' });
    }

    // Also delete all applications for this job
    await JobApplication.deleteMany({ jobId: req.params.id });

    res.json({ message: 'Job and its applications deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ message: 'Server error deleting job.' });
  }
});

// Toggle job status (admin only)
router.patch('/:id/toggle-status', authenticateAdmin, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found.' });
    }

    job.status = job.status === 'OPEN' ? 'CLOSED' : 'OPEN';
    await job.save();

    res.json({
      message: `Job ${job.status.toLowerCase()} successfully`,
      job
    });
  } catch (error) {
    console.error('Toggle job status error:', error);
    res.status(500).json({ message: 'Server error toggling job status.' });
  }
});

// Get all jobs (admin only - includes closed jobs)
router.get('/admin/all', authenticateAdmin, async (req, res) => {
  try {
    const { status, department } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (department) filter.department = department;

    const jobs = await Job.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .select('-__v');

    res.json(jobs);
  } catch (error) {
    console.error('Get all jobs error:', error);
    res.status(500).json({ message: 'Server error fetching jobs.' });
  }
});

// Get job applications for a specific job (admin only)
router.get('/:id/applications', authenticateAdmin, async (req, res) => {
  try {
    const applications = await JobApplication.find({ jobId: req.params.id })
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json(applications);
  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({ message: 'Server error fetching job applications.' });
  }
});

// Get job stats (admin only)
router.get('/stats/overview', authenticateAdmin, async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments();
    const openJobs = await Job.countDocuments({ status: 'OPEN' });
    const closedJobs = await Job.countDocuments({ status: 'CLOSED' });
    const featuredJobs = await Job.countDocuments({ featured: true });
    const totalApplications = await JobApplication.countDocuments();

    res.json({
      totalJobs,
      openJobs,
      closedJobs,
      featuredJobs,
      totalApplications
    });
  } catch (error) {
    console.error('Get job stats error:', error);
    res.status(500).json({ message: 'Server error fetching job stats.' });
  }
});

export default router;
