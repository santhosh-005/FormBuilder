const { auth } = require('../utils/firebaseAdmin.js');

const firebaseAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const idToken = authHeader.split('Bearer ')[1];
    
    if (!idToken) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Verify the Firebase ID token
    const decodedToken = await auth.verifyIdToken(idToken);
    
    // Set user information on request object
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email
    };

    next();
  } catch (error) {
    console.error('❌ Firebase auth verification failed:', error.message);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = firebaseAuth;
