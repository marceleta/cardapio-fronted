// Hook personalizado para gerenciar ações de produtos
export const useProductHandlers = ({ 
  products, 
  setProducts, 
  setOpenProductDialog, 
  setEditingProduct 
}) => {
  const handleAddProduct = () => {
    setEditingProduct(null);
    setOpenProductDialog(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setOpenProductDialog(true);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const handleSaveProduct = (productData) => {
    if (productData.id) {
      // Editando produto existente
      setProducts(products.map(p => 
        p.id === productData.id ? { ...p, ...productData } : p
      ));
    } else {
      // Adicionando novo produto
      const newProduct = {
        ...productData,
        id: Math.max(...products.map(p => p.id), 0) + 1
      };
      setProducts([...products, newProduct]);
    }
    setOpenProductDialog(false);
    setEditingProduct(null);
  };

  return {
    handleAddProduct,
    handleEditProduct,
    handleDeleteProduct,
    handleSaveProduct
  };
};
