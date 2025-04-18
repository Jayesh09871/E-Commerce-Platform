const User = require('../models/user.model');
const ApprovedEmail = require('../models/approvedEmail.model');
const jwt = require('jsonwebtoken');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if email is approved
    const approvedEmail = await ApprovedEmail.findOne({ email });
    if (!approvedEmail) {
      return res.status(401).json({
        success: false,
        message: 'Email not approved for registration',
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    // Create user
    user = await User.create({
      name,
      email,
      password,
      phone,
      role: approvedEmail.role || 'user',
    });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message,
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message,
    });
  }
};

// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User logged out successfully',
  });
};

// @desc    Google OAuth callback
// @route   GET /api/auth/google/callback
// @access  Public
exports.googleCallback = (req, res) => {
  try {
    // Check if user exists
    if (!req.user) {
      console.error('No user found in request');
      return res.status(400).send('Authentication failed - No user found');
    }
    
    // Create token
    const token = req.user.getSignedJwtToken();
    console.log('Generated token for user:', req.user.email);
    
    // Create redirect URL
    const redirectUrl = `${process.env.FRONTEND_URL}/auth-callback?token=${token}`;
    console.log('Redirecting to:', redirectUrl);
    
    // Use a more reliable redirect with HTML to prevent WebSocket issues
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authentication Successful</title>
          <script>
            // Store the token in sessionStorage temporarily
            sessionStorage.setItem('temp_auth_token', '${token}');
            
            // Redirect after a short delay
            setTimeout(function() {
              window.location.href = '${process.env.FRONTEND_URL}/auth-callback?token=${token}';
            }, 500);
          </script>
        </head>
        <body>
          <h2>Authentication successful!</h2>
          <p>You will be redirected to the application in a moment...</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Google callback error:', error);
    res.status(500).send('Authentication error: ' + error.message);
  }
};

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  });
};
