// utils.js

// Define the cn function or variable
export function cn(...classes) {
    return classes.filter(Boolean).join(' ');
  }