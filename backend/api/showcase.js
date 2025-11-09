const { showcase } = require('../shared/data')

module.exports = (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' })
    return
  }

  res.status(200).json({ projects: showcase })
}

