// Hook personalizado para gerenciar ações de categorias
export const useCategoryHandlers = ({ 
  categories, 
  setCategories, 
  products,
  setOpenCategoryDialog, 
  setEditingCategory 
}) => {
  const handleAddCategory = () => {
    setEditingCategory(null);
    setOpenCategoryDialog(true);
  };

  const handleEditCategory = (category) => {
    const categoryData = {
      name: category,
      icon: getCategoryIcon(category),
      description: getCategoryDescription(category)
    };
    setEditingCategory(categoryData);
    setOpenCategoryDialog(true);
  };

  const handleDeleteCategory = (categoryName) => {
    const productsInCategory = products.filter(p => p.category === categoryName);
    
    if (productsInCategory.length > 0) {
      alert(`Não é possível excluir a categoria "${categoryName}" pois ela possui ${productsInCategory.length} produto(s) associado(s).`);
      return;
    }
    
    if (window.confirm(`Tem certeza que deseja excluir a categoria "${categoryName}"?`)) {
      setCategories(categories.filter(c => c !== categoryName));
    }
  };

  const handleSaveCategory = (categoryData) => {
    if (categoryData.originalName) {
      // Editando categoria existente
      setCategories(categories.map(c => 
        c === categoryData.originalName ? categoryData.name : c
      ));
    } else {
      // Adicionando nova categoria
      if (!categories.includes(categoryData.name)) {
        setCategories([...categories, categoryData.name]);
      }
    }
    setOpenCategoryDialog(false);
    setEditingCategory(null);
  };

  return {
    handleAddCategory,
    handleEditCategory,
    handleDeleteCategory,
    handleSaveCategory
  };
};

// Funções auxiliares para categorias
const getCategoryIcon = (categoryName) => {
  const iconMap = {
    'Hambúrgueres': '🍔',
    'Pizzas': '🍕',
    'Bebidas': '🥤',
    'Sobremesas': '🍰',
    'Principais': '🍽️',
    'Acompanhamentos': '🍟'
  };
  return iconMap[categoryName] || '📂';
};

const getCategoryDescription = (categoryName) => {
  const descMap = {
    'Hambúrgueres': 'Deliciosos hambúrgueres artesanais',
    'Pizzas': 'Pizzas tradicionais e especiais',
    'Bebidas': 'Bebidas geladas e sucos naturais',
    'Sobremesas': 'Doces e sobremesas irresistíveis',
    'Principais': 'Pratos principais do nosso cardápio',
    'Acompanhamentos': 'Acompanhamentos saborosos'
  };
  return descMap[categoryName] || 'Categoria do cardápio';
};
