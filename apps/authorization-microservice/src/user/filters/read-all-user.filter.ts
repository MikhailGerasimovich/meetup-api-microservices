export const getUserFilters = (filterOptions: any) => {
  const userFilters = {};
  for (let [key, value] of Object.entries(filterOptions)) {
    userFilters[key] = { contains: value };
  }

  return { userFilters };
};
