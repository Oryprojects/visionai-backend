import express from 'express';
import Service from '../models/Service.js';
import { authenticateAdmin } from '../utils/auth.js';

const router = express.Router();

// Get all services (public)
router.get('/', async (req, res) => {
  try {
    const { status, featured, category } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (featured === 'true') filter.featured = true;
    if (category) filter.category = category;

    const services = await Service.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .select('-__v');

    res.json(services);
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ message: 'Server error fetching services.' });
  }
});

// Get service by slug (public)
router.get('/slug/:slug', async (req, res) => {
  try {
    const service = await Service.findOne({ 
      slug: req.params.slug,
      status: 'ACTIVE' 
    }).select('-__v');

    if (!service) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    res.json(service);
  } catch (error) {
    console.error('Get service by slug error:', error);
    res.status(500).json({ message: 'Server error fetching service.' });
  }
});

// Create new service (admin only)
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const serviceData = req.body;
    
    // Check if slug already exists
    if (serviceData.slug) {
      const existingService = await Service.findOne({ slug: serviceData.slug });
      if (existingService) {
        return res.status(400).json({ message: 'Service with this slug already exists.' });
      }
    }

    const service = new Service(serviceData);
    await service.save();

    res.status(201).json({
      message: 'Service created successfully',
      service
    });
  } catch (error) {
    console.error('Create service error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error creating service.' });
  }
});

// Update service (admin only)
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    res.json({
      message: 'Service updated successfully',
      service
    });
  } catch (error) {
    console.error('Update service error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error updating service.' });
  }
});

// Delete service (admin only)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ message: 'Server error deleting service.' });
  }
});

// Toggle service status (admin only)
router.patch('/:id/toggle-status', authenticateAdmin, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    service.status = service.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    await service.save();

    res.json({
      message: `Service ${service.status.toLowerCase()} successfully`,
      service
    });
  } catch (error) {
    console.error('Toggle service status error:', error);
    res.status(500).json({ message: 'Server error toggling service status.' });
  }
});

// Toggle featured status (admin only)
router.patch('/:id/toggle-featured', authenticateAdmin, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    service.featured = !service.featured;
    await service.save();

    res.json({
      message: `Service ${service.featured ? 'featured' : 'unfeatured'} successfully`,
      service
    });
  } catch (error) {
    console.error('Toggle featured status error:', error);
    res.status(500).json({ message: 'Server error toggling featured status.' });
  }
});

// Get service stats (admin only)
router.get('/stats/overview', authenticateAdmin, async (req, res) => {
  try {
    const totalServices = await Service.countDocuments();
    const activeServices = await Service.countDocuments({ status: 'ACTIVE' });
    const featuredServices = await Service.countDocuments({ featured: true });
    const inactiveServices = await Service.countDocuments({ status: 'INACTIVE' });

    res.json({
      totalServices,
      activeServices,
      featuredServices,
      inactiveServices
    });
  } catch (error) {
    console.error('Get service stats error:', error);
    res.status(500).json({ message: 'Server error fetching service stats.' });
  }
});

export default router;
