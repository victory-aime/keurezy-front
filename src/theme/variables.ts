/**
 * Couleurs statiques (hors composants Chakra : SVG, canvas, graphiques). Valeurs identiques à
 * `colors.ts` : toujours préférer les jetons du thème (`primary.solid`, `danger.fg`…) quand c'est
 * possible, ils suivent le mode sombre et la couleur personnalisée de l'agence.
 */

export const VariablesColors = {
  primary: '#673ab6', // colors.primary[500]
  secondary: '#e7b008', // colors.secondary[500]
  tertiary: '#00B3A8', // colors.tertiary[500]
  danger: '#D62828', // colors.danger[500]
  success: '#009E65', // colors.success[500]
  warning: '#E6B800', // colors.warning[500]
  info: '#0D6EFD', // colors.info[500]
  error: '#f44336', // colors.error[500]
  red: '#ec2f4e', // colors.red[500]
  orange: '#f97316', // colors.orange[500]
  blue: '#3b82f6', // colors.blue[500]
  overlay: '#18181b', // colors.overlay[500]
  lighter: '#C7C7D2', // colors.lighter[500]
  grayScale: '#64748B', // custom static
  gray400: '#a1a1aa',
  gray100: '#f4f4f5',
  gray200: '#e4e4e7',
  white: '#ffffff',
  black: '#18181b',
  transparent: 'transparent',
};
