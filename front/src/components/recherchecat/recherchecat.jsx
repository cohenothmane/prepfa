// Fonction utilitaire pour mapper les termes de recherche vers les catégories backend
export const mapSearchToCategory = (searchTerm) => {
  const normalizedSearch = searchTerm.toLowerCase().trim();
  
  // Mapping des termes de recherche vers les catégories backend
  const categoryMap = {
    // Cafés
    'café': 'café',
    'cafe': 'café',
    'cafés': 'café',
    'cafes': 'café',
    'coffee': 'café',
    'coffeeshop': 'café',
    
    // Restaurants
    'restaurant': 'restaurant',
    'restaurants': 'restaurant',
    'resto': 'restaurant',
    'restos': 'restaurant',
    'manger': 'restaurant',
    'diner': 'restaurant',
    'déjeuner': 'restaurant',
    'dejeuner': 'restaurant',
    
    // Bars
    'bar': 'bar',
    'bars': 'bar',
    'pub': 'bar',
    'pubs': 'bar',
    'boire': 'bar',
    'cocktail': 'bar',
    'cocktails': 'bar',
    
    // Pâtisserie
    'pâtisserie': 'pâtisserie',
    'patisserie': 'pâtisserie',
    'pâtisseries': 'pâtisserie',
    'patisseries': 'pâtisserie',
    'patissier': 'pâtisserie',
    'gâteau': 'pâtisserie',
    'gateau': 'pâtisserie',
    'gâteaux': 'pâtisserie',
    'gateaux': 'pâtisserie',
    'dessert': 'pâtisserie',
    'desserts': 'pâtisserie',
    
    // Pizzeria
    'pizzeria': 'pizzeria',
    'pizzerias': 'pizzeria',
    'pizza': 'pizzeria',
    'pizzas': 'pizzeria',
    
    // Glacier
    'glacier': 'glacier',
    'glaciers': 'glacier',
    'glace': 'glacier',
    'glaces': 'glacier',
    'icecream': 'glacier',
    'ice cream': 'glacier',
  };
  
  return categoryMap[normalizedSearch] || null;
};

// Fonction pour vérifier si un terme de recherche correspond à une catégorie
export const matchesCategory = (searchTerm, category) => {
  if (!searchTerm || !category) return false;
  
  const normalizedSearch = searchTerm.toLowerCase().trim();
  const normalizedCategory = category.toLowerCase().trim();
  
  // Vérifier correspondance directe
  if (normalizedCategory.includes(normalizedSearch) || normalizedSearch.includes(normalizedCategory)) {
    return true;
  }
  
  // Vérifier via le mapping
  const mappedCategory = mapSearchToCategory(normalizedSearch);
  if (mappedCategory && mappedCategory === normalizedCategory) {
    return true;
  }
  
  return false;
};

