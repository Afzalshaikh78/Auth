const isAdminUser = (req, res, next) => {
  if(req.userInfo.role !== 'admin') {
    return res.status(401).json({
      success: false,
      message: "Access denied. Admin access required",
    });
  }
  next();
}

module.exports = isAdminUser;