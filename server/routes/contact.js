import express from 'express';
import Contact from '../models/Contact.js';
import { sendContactEmail } from '../utils/emailService.js';
import { authenticateAdmin } from '../utils/auth.js';

const router = express.Router();

// Submit contact form (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message, type = 'contact' } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const contact = new Contact({ name, email, subject, message, type });
    await contact.save();

    // Send email notification using Brevo
    try {
      await sendContactEmail({ name, email, subject, message });
      console.log('Contact emails sent successfully via Brevo');
    } catch (emailError) {
      console.error('Brevo email sending failed:', emailError);
    }

    res.status(201).json({ 
      message: 'Contact form submitted successfully',
      id: contact._id 
    });

  } catch (error) {
    console.error('Contact form submission error:', error);
    res.status(500).json({ message: 'Error submitting contact form' });
  }
});

// Get all contacts (admin only)
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (type) filter.type = type;

    const skip = (page - 1) * limit;
    
    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Contact.countDocuments(filter);

    res.json({
      contacts,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ 
      message: 'Error fetching contacts' 
    });
  }
});

// Get contact by ID (admin only)
router.get('/:id', authenticateAdmin, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json(contact);
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({ message: 'Error fetching contact' });
  }
});

// Update contact status (admin only)
router.patch('/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['new', 'in-progress', 'resolved'].includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status value. Must be new, in-progress, or resolved' 
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ 
        message: 'Contact not found' 
      });
    }

    res.json({
      message: 'Contact status updated successfully',
      contact
    });
  } catch (error) {
    console.error('Error updating contact status:', error);
    res.status(500).json({ 
      message: 'Error updating contact status' 
    });
  }
});

// Delete contact (admin only)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ message: 'Error deleting contact' });
  }
});

// Get contact stats (admin only)
router.get('/stats/overview', authenticateAdmin, async (req, res) => {
  try {
    const totalContacts = await Contact.countDocuments();
    const newContacts = await Contact.countDocuments({ status: 'new' });
    const inProgressContacts = await Contact.countDocuments({ status: 'in-progress' });
    const completedContacts = await Contact.countDocuments({ status: 'resolved' });
    
    const contactRequests = await Contact.countDocuments({ type: 'contact' });
    const demoRequests = await Contact.countDocuments({ type: 'demo' });

    // Get monthly stats for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyStats = await Contact.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.json({
      totalContacts,
      newContacts,
      inProgressContacts,
      completedContacts,
      contactRequests,
      demoRequests,
      monthlyStats
    });
  } catch (error) {
    console.error('Error fetching contact stats:', error);
    res.status(500).json({ message: 'Error fetching contact stats' });
  }
});

export default router;