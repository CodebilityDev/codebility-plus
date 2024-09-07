export const setLink = (table: string) => {
  if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    localStorage.setItem('link', JSON.stringify(table));
  }
}

export const getLink = (key: string) => {
  if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    const data = localStorage.getItem(key);
    
    if (data) {
      return JSON.parse(data)
    }
  }
}

export const deleteLink = (key: string) => {
  if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    localStorage.removeItem(key);
  }
}