import { useState } from 'react';

// Hook específico para gerenciar categorias dentro da seção de produtos
export const useCategoryManager = ({ 
  categories, 
  setCategories, 
  products,
  setProducts 
}) => {
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const handleAddCategory = () => {
    setEditingCategory(null);
    setOpenCategoryDialog(true);
  };

  const handleEditCategory = (categoryName) => {
    const categoryData = {
      name: categoryName,
      icon: getCategoryIcon(categoryName),
      description: getCategoryDescription(categoryName)
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
    if (categoryData.originalName && categoryData.originalName !== categoryData.name) {
      // Editando categoria existente e mudando o nome
      const oldName = categoryData.originalName;
      const newName = categoryData.name;
      
      // Atualizar o nome da categoria na lista
      setCategories(categories.map(c => c === oldName ? newName : c));
      
      // Atualizar produtos que usam essa categoria
      setProducts(products.map(p => 
        p.category === oldName ? { ...p, category: newName } : p
      ));
    } else if (categoryData.originalName) {
      // Editando categoria existente sem mudar o nome
      // Por enquanto, apenas fecha o dialog (podemos expandir para salvar icon/description)
    } else {
      // Adicionando nova categoria
      if (!categories.includes(categoryData.name)) {
        setCategories([...categories, categoryData.name]);
      } else {
        alert('Uma categoria com este nome já existe!');
        return;
      }
    }
    
    setOpenCategoryDialog(false);
    setEditingCategory(null);
  };

  const handleCloseCategoryDialog = () => {
    setOpenCategoryDialog(false);
    setEditingCategory(null);
  };

  return {
    // Dialog state
    openCategoryDialog,
    editingCategory,
    
    // Handlers
    handleAddCategory,
    handleEditCategory,
    handleDeleteCategory,
    handleSaveCategory,
    handleCloseCategoryDialog
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
