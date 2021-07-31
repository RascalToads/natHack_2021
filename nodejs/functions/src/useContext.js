const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

const useContext = async (req, res, next) => {
  try {
    const { params } = req;
    const { id } = params;
    req.context = await getContextData(id);
    if (req.context) {
      next();
    } else {
      res.status(404).json({ error: 'Access Denied - no context.' });
    }
  } catch (error) {
    res.status(500).json({ error: `Context error occurred ${error.message}` });
  }
};

const getContextData = async (id) => {
  const documentRef = await db.doc(`contexts/${id}`).get();
  return documentRef.exists && documentRef.data();
};

module.exports = {
  useContext,
  getContextData,
};
