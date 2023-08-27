export const getMeetupFilters = (filterOptions: any) => {
  const meetupFilters = {};
  const tagFilters = {};
  for (let [key, value] of Object.entries(filterOptions)) {
    if (key == 'tags') {
      tagFilters[key] = { some: { tag: { title: { in: value } } } };
      continue;
    }
    meetupFilters[key] = { contains: value };
  }

  return { meetupFilters, tagFilters };
};
