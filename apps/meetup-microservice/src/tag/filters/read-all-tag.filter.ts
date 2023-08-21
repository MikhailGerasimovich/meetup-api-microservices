export const getTagFilters = (filterOptions: any) => {
  const tagFilters = {};
  for (let [key, value] of Object.entries(filterOptions)) {
    tagFilters[key] = { contains: value };
  }

  return { tagFilters };
};
