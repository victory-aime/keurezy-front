export const countryList = [
  { label: "Cameroun", value: "CM" },
  { label: "Congo-Brazzaville", value: "CG" },
  { label: "Tunisie", value: "TN" },
  { label: "Gabon", value: "GA" },
];

export const citiesByCountry: Record<
  string,
  { label: string; value: string }[]
> = {
  CM: [
    { label: "Douala", value: "douala" },
    { label: "Yaoundé", value: "yaounde" },
    { label: "Bafoussam", value: "bafoussam" },
    { label: "Bamenda", value: "bamenda" },
  ],

  CG: [
    { label: "Brazzaville", value: "brazzaville" },
    { label: "Pointe-Noire", value: "pointe_noire" },
    { label: "Dolisie", value: "dolisie" },
  ],

  TN: [
    { label: "Tunis", value: "tunis" },
    { label: "Sfax", value: "sfax" },
    { label: "Sousse", value: "sousse" },
    { label: "Nabeul", value: "nabeul" },
  ],

  GA: [
    { label: "Libreville", value: "libreville" },
    { label: "Port-Gentil", value: "port_gentil" },
    { label: "Franceville", value: "franceville" },
  ],
};
