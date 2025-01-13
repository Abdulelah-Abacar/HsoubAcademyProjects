export const getFromLocalStorge = (key) => localStorage.getItem(key);
export const setToLocalStorge = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}