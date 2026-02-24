import express from 'express';
import Admin from '../models/Admin.js';
import { authenticateAdmin, generateToken } from '../utils/auth.js';
import { sendOTPEmail } from '../utils/emailService.js';

const router = express.Router();

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { username, password, adminId, resendOTP } = req.body;

    // Handle resend OTP request
    if (resendOTP && adminId) {
      const admin = await Admin.findById(adminId);
      if (!admin || !admin.isActive) {
        return res.status(401).json({ message: 'Invalid admin.' });
      }

      if (!admin.twoFactorEnabled) {
        return res.status(400).json({ message: '2FA is not enabled for this account.' });
      }

      await admin.generateOTP();
      await sendOTPEmail(admin.email, admin.twoFactorOTP);
      
      return res.json({
        message: 'OTP resent successfully',
        requiresTwoFactor: true,
        adminId: admin._id,
        email: admin.email
      });
    }

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    const admin = await Admin.findOne({ 
      $or: [{ username }, { email: username }] 
    });

    if (!admin || !admin.isActive) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // If 2FA is enabled, generate and send OTP
    if (admin.twoFactorEnabled) {
      await admin.generateOTP();
      await sendOTPEmail(admin.email, admin.twoFactorOTP);
      
      return res.json({
        message: '2FA verification required',
        requiresTwoFactor: true,
        adminId: admin._id,
        email: admin.email
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    const token = generateToken(admin._id);

    res.json({
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        twoFactorEnabled: admin.twoFactorEnabled
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// Verify 2FA OTP
router.post('/verify-2fa', async (req, res) => {
  try {
    const { adminId, otp } = req.body;

    console.log('2FA Verification attempt:', { adminId, otp: otp?.length ? '***' : 'empty' });

    if (!adminId || !otp) {
      return res.status(400).json({ message: 'Admin ID and OTP are required.' });
    }

    // Explicitly select OTP fields which are normally hidden
    const admin = await Admin.findById(adminId).select('+twoFactorOTP +twoFactorOTPExpires');
    if (!admin) {
      console.log('Admin not found:', adminId);
      return res.status(401).json({ message: 'Invalid admin.' });
    }

    console.log('Admin found:', admin.username);
    console.log('Stored OTP exists:', !!admin.twoFactorOTP);
    console.log('OTP expires:', admin.twoFactorOTPExpires);
    console.log('Current time:', new Date());
    console.log('Is expired:', admin.twoFactorOTPExpires ? Date.now() > admin.twoFactorOTPExpires.getTime() : 'N/A');

    const isValidOTP = admin.verifyOTP(otp);
    console.log('OTP verification result:', isValidOTP);
    
    if (!isValidOTP) {
      return res.status(401).json({ message: 'Invalid or expired OTP.' });
    }

    // Update last login and clear OTP fields in one save operation
    admin.lastLogin = new Date();
    await admin.save();

    const token = generateToken(admin._id);

    console.log('2FA verification successful for:', admin.username);

    res.json({
      message: '2FA verification successful',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        twoFactorEnabled: admin.twoFactorEnabled
      }
    });
  } catch (error) {
    console.error('2FA verification error:', error);
    res.status(500).json({ message: 'Server error during 2FA verification.' });
  }
});

// Get current admin profile
router.get('/profile', authenticateAdmin, async (req, res) => {
  res.json({
    admin: {
      id: req.admin._id,
      username: req.admin.username,
      email: req.admin.email,
      role: req.admin.role,
      lastLogin: req.admin.lastLogin,
      twoFactorEnabled: req.admin.twoFactorEnabled
    }
  });
});

// Update admin profile
router.put('/profile', authenticateAdmin, async (req, res) => {
  try {
    const { email } = req.body;
    const admin = req.admin;

    if (email && email !== admin.email) {
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({ message: 'Email already exists.' });
      }
      admin.email = email;
    }

    await admin.save();

    res.json({
      message: 'Profile updated successfully',
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        twoFactorEnabled: admin.twoFactorEnabled
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error during profile update.' });
  }
});

// Change password
router.put('/change-password', authenticateAdmin, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long.' });
    }

    const admin = req.admin;
    const isCurrentPasswordValid = await admin.comparePassword(currentPassword);

    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    admin.password = newPassword;
    await admin.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ message: 'Server error during password change.' });
  }
});

// Logout (client-side token removal)
router.post('/logout', authenticateAdmin, (req, res) => {
  res.json({ message: 'Logout successful' });
});

// Enable/Disable 2FA
router.put('/toggle-2fa', authenticateAdmin, async (req, res) => {
  try {
    const { enable } = req.body;
    const admin = req.admin;

    if (typeof enable !== 'boolean') {
      return res.status(400).json({ message: 'Enable field must be boolean.' });
    }

    admin.twoFactorEnabled = enable;
    await admin.save();

    res.json({
      message: `2FA ${enable ? 'enabled' : 'disabled'} successfully`,
      twoFactorEnabled: admin.twoFactorEnabled
    });
  } catch (error) {
    console.error('2FA toggle error:', error);
    res.status(500).json({ message: 'Server error during 2FA toggle.' });
  }
});

export default router;
