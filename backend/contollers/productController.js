export const getProducts = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Products fetched successfully',
  });
}

export const getProductById = async (req, res) => {
  const { id } = req.params;
  res.status(200).json({
    success: true,
    message: `Product with id ${id} fetched successfully`,
  });
}
