export const theme = {
  colors: {
    background: '#050916',
    backgroundAlt: '#0B1224',
    card: '#111A33',
    border: '#1F2B4D',
    text: '#F5F7FF',
    textMuted: '#8B93B8',
    blue: '#2563FF',
    blueGlow: '#3B82F6',
    red: '#E5342B',
    redGlow: '#FF5B4E',
    orange: '#F97316',
  },
  radius: 16,
};

export const categoryColor = (category: string) => {
  switch (category) {
    case 'sport':
      return theme.colors.orange;
    case 'manga':
      return theme.colors.blue;
    default:
      return theme.colors.red;
  }
};
