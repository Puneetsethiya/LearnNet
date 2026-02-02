require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 3000;

// connect MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .catch(err => console.error('MongoDB error:', err));

// start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
