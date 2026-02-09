const errorHandler = (err, req, res, next) => {
  console.error("ERROR =>", err);
  //MongoDB duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      message: "Duplicate field value entered",
    });
  }
  res.status(500).json({mesage: err.mesage});
};

export default errorHandler;
