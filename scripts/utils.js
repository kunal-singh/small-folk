export function toClassName(name) {
  // Remove special characters and split into words
  const words = name.replace(/[^a-zA-Z0-9]+/g, ' ').split(' ');
  
  // Capitalize first letter of each word and join
  return words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join('');
}

