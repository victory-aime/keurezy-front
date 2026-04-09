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

export const SENEGAL_CITIES = [
  { label: "Dakar", value: "dakar" },
  { label: "Thiès", value: "thies" },
  { label: "Saint-Louis", value: "saint-louis" },
  { label: "Ziguinchor", value: "ziguinchor" },
  { label: "Kaolack", value: "kaolack" },
  { label: "Tambacounda", value: "tambacounda" },
  { label: "Kolda", value: "kolda" },
  { label: "Diourbel", value: "diourbel" },
  { label: "Louga", value: "louga" },
  { label: "Fatick", value: "fatick" },
  { label: "Matam", value: "matam" },
  { label: "Kaffrine", value: "kaffrine" },
  { label: "Kédougou", value: "kedougou" },
  { label: "Sédhiou", value: "sedhiou" },
  { label: "Touba", value: "touba" },
  { label: "Mbour", value: "mbour" },
  { label: "Rufisque", value: "rufisque" },
  { label: "Pikine", value: "pikine" },
  { label: "Guédiawaye", value: "guediawaye" },
  { label: "Richard-Toll", value: "richard-toll" },
  { label: "Kayar", value: "kayar" },
  { label: "Joal-Fadiouth", value: "joal-fadiouth" },
  { label: "Bignona", value: "bignona" },
  { label: "Mbacké", value: "mbacke" },
  { label: "Tivaouane", value: "tivaouane" },
  { label: "Foundiougne", value: "foundiougne" },
  { label: "Gossas", value: "gossas" },
  { label: "Nioro du Rip", value: "nioro-du-rip" },
  { label: "Vélingara", value: "velingara" },
  { label: "Podor", value: "podor" },
];
