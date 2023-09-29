export const getMeetupFilters = (filterOptions: any) => {
  const meetupFilters = {};
  const tagFilters = {};
  const geoFilters: { geoposition?: { latitude?: number; longitude?: number } } = {};
  for (let [key, value] of Object.entries(filterOptions)) {
    if (key == 'tags') {
      tagFilters[key] = { some: { tag: { title: { in: value } } } };
      continue;
    }
    if (key == 'geoposition') {
      geoFilters['geoposition'] = value;
      continue;
    }
    if (key == 'organizerId') {
      meetupFilters[key] = { contains: Number(value) };
      continue;
    }
    meetupFilters[key] = { contains: value };
  }

  return { meetupFilters, tagFilters, geoFilters };
};
