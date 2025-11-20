
import { ViewerType } from '@/types/Movie';

interface SnackSuggestion {
  emoji: string;
  title: string;
  subtitle: string;
}

export function getSnackSuggestion(viewerType: ViewerType, genres: string[]): SnackSuggestion {
  const hasGenre = (genre: string) => genres.some(g => g.toLowerCase().includes(genre.toLowerCase()));

  if (hasGenre('Horror') || hasGenre('Thriller')) {
    return {
      emoji: '🍕',
      title: 'This movie screams pizza night.',
      subtitle: 'Get something cheesy to balance the scares!',
    };
  }

  if (hasGenre('Romance') || hasGenre('Drama')) {
    return {
      emoji: '🍷',
      title: 'Wine and something sweet.',
      subtitle: 'Perfect for a cozy emotional journey.',
    };
  }

  if (hasGenre('Animation') || hasGenre('Family')) {
    return {
      emoji: '🍿',
      title: 'Big bowl of popcorn and gummies.',
      subtitle: 'Classic movie snacks for all ages!',
    };
  }

  if (hasGenre('Action') || hasGenre('Sci-Fi')) {
    return {
      emoji: '🍔',
      title: 'Burgers and fries for blockbuster mode.',
      subtitle: 'Fuel up for the action!',
    };
  }

  if (hasGenre('Comedy')) {
    return {
      emoji: '🌮',
      title: 'Tacos and laughs.',
      subtitle: 'Light bites for light-hearted fun!',
    };
  }

  if (viewerType === 'partner') {
    return {
      emoji: '🍫',
      title: 'Chocolate and cuddles.',
      subtitle: 'The perfect date night combo.',
    };
  }

  if (viewerType === 'friends') {
    return {
      emoji: '🍕',
      title: 'Pizza party time!',
      subtitle: 'Order a few pies and enjoy.',
    };
  }

  return {
    emoji: '🍿',
    title: 'Classic popcorn time!',
    subtitle: 'You can never go wrong with popcorn.',
  };
}
