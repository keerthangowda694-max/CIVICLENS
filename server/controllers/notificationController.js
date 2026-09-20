const Notification = require('../models/Notification');

const getNotifications = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : null;
    const query = userId ? { $or: [{ userId }, { userId: null }] } : { userId: null };

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(20);

    const unreadCount = await Notification.countDocuments({ ...query, read: false });

    res.json({ notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    if (id === 'all') {
      const userId = req.user ? req.user._id : null;
      const query = userId ? { $or: [{ userId }, { userId: null }] } : {};
      await Notification.updateMany(query, { read: true });
      return res.json({ message: 'All notifications marked as read' });
    }

    await Notification.findByIdAndUpdate(id, { read: true });
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking notification read' });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
};
