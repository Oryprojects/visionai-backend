import express from 'express';
import About from '../models/About.js';
import { authenticateAdmin } from '../utils/auth.js';

const router = express.Router();

// Get about info (public)
router.get('/', async (req, res) => {
  try {
    let aboutInfo = await About.findOne();
    
    if (!aboutInfo) {
      // Create default about info if none exists
      aboutInfo = new About({
        companyInfo: {
          mission: 'Our mission is to transform businesses through innovative AI solutions.',
          vision: 'To be the global leader in AI-powered business transformation.',
          description: 'We are a team of passionate AI experts dedicated to helping businesses leverage the power of artificial intelligence.',
          foundedYear: 2020,
          teamSize: '50+',
          headquarters: 'San Francisco, CA'
        },
        contactInfo: {
          email: 'sales@visionai.jp',
          phone: '+81-50-8894-4567',
          address: '305-0861, Ibaraki, Tsukuba, Yatabe 1077-58'
        },
        directors: [],
        stats: {
          projectsCompleted: 100,
          clientsServed: 50,
          yearsExperience: 4,
          teamMembers: 50
        }
      });
      await aboutInfo.save();
    }

    res.json(aboutInfo);
  } catch (error) {
    console.error('Get about info error:', error);
    res.status(500).json({ message: 'Server error fetching about info.' });
  }
});

// Update company info (admin only)
router.put('/company-info', authenticateAdmin, async (req, res) => {
  try {
    let aboutInfo = await About.findOne();
    
    if (!aboutInfo) {
      aboutInfo = new About();
    }

    aboutInfo.companyInfo = { ...aboutInfo.companyInfo, ...req.body };
    await aboutInfo.save();

    res.json({
      message: 'Company info updated successfully',
      companyInfo: aboutInfo.companyInfo
    });
  } catch (error) {
    console.error('Update company info error:', error);
    res.status(500).json({ message: 'Server error updating company info.' });
  }
});

// Update contact info (admin only)
router.put('/contact-info', authenticateAdmin, async (req, res) => {
  try {
    let aboutInfo = await About.findOne();
    
    if (!aboutInfo) {
      aboutInfo = new About();
    }

    aboutInfo.contactInfo = { ...aboutInfo.contactInfo, ...req.body };
    await aboutInfo.save();

    res.json({
      message: 'Contact info updated successfully',
      contactInfo: aboutInfo.contactInfo
    });
  } catch (error) {
    console.error('Update contact info error:', error);
    res.status(500).json({ message: 'Server error updating contact info.' });
  }
});

// Add director (admin only)
router.post('/directors', authenticateAdmin, async (req, res) => {
  try {
    let aboutInfo = await About.findOne();
    
    if (!aboutInfo) {
      aboutInfo = new About();
    }

    aboutInfo.directors.push(req.body);
    await aboutInfo.save();

    res.status(201).json({
      message: 'Director added successfully',
      director: aboutInfo.directors[aboutInfo.directors.length - 1]
    });
  } catch (error) {
    console.error('Add director error:', error);
    res.status(500).json({ message: 'Server error adding director.' });
  }
});

// Update director (admin only)
router.put('/directors/:id', authenticateAdmin, async (req, res) => {
  try {
    const aboutInfo = await About.findOne();
    
    if (!aboutInfo) {
      return res.status(404).json({ message: 'About info not found.' });
    }

    const director = aboutInfo.directors.id(req.params.id);
    
    if (!director) {
      return res.status(404).json({ message: 'Director not found.' });
    }

    Object.assign(director, req.body);
    await aboutInfo.save();

    res.json({
      message: 'Director updated successfully',
      director
    });
  } catch (error) {
    console.error('Update director error:', error);
    res.status(500).json({ message: 'Server error updating director.' });
  }
});

// Delete director (admin only)
router.delete('/directors/:id', authenticateAdmin, async (req, res) => {
  try {
    const aboutInfo = await About.findOne();
    
    if (!aboutInfo) {
      return res.status(404).json({ message: 'About info not found.' });
    }

    aboutInfo.directors.pull(req.params.id);
    await aboutInfo.save();

    res.json({ message: 'Director deleted successfully' });
  } catch (error) {
    console.error('Delete director error:', error);
    res.status(500).json({ message: 'Server error deleting director.' });
  }
});

// Toggle director status (admin only)
router.patch('/directors/:id/toggle-status', authenticateAdmin, async (req, res) => {
  try {
    const aboutInfo = await About.findOne();
    
    if (!aboutInfo) {
      return res.status(404).json({ message: 'About info not found.' });
    }

    const director = aboutInfo.directors.id(req.params.id);
    
    if (!director) {
      return res.status(404).json({ message: 'Director not found.' });
    }

    director.isActive = !director.isActive;
    await aboutInfo.save();

    res.json({
      message: `Director ${director.isActive ? 'activated' : 'deactivated'} successfully`,
      director
    });
  } catch (error) {
    console.error('Toggle director status error:', error);
    res.status(500).json({ message: 'Server error toggling director status.' });
  }
});

// Update stats (admin only)
router.put('/stats', authenticateAdmin, async (req, res) => {
  try {
    let aboutInfo = await About.findOne();
    
    if (!aboutInfo) {
      aboutInfo = new About();
    }

    aboutInfo.stats = { ...aboutInfo.stats, ...req.body };
    await aboutInfo.save();

    res.json({
      message: 'Stats updated successfully',
      stats: aboutInfo.stats
    });
  } catch (error) {
    console.error('Update stats error:', error);
    res.status(500).json({ message: 'Server error updating stats.' });
  }
});

export default router;
