const isAdminUser = (req, res, next) => {
  if(req.userInfo.role !== 'admin') {
    return res.status(401).json({
      success: false,
      message: "Access denied. Only admin users can access this route.",
    });
  }
  next();
}

module.exports = isAdminUser;