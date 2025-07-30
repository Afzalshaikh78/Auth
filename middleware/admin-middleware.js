const isAdminUser = (req, res, next) => {
  if(req.userInfo.role !== 'admin') {
    return res.status(401).json({
      success: false,
      message: "Access denied! You are not authorized to perform this action."
    });
  }
  next();
}

module.exports = isAdminUser;