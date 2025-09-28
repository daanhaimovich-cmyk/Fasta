import type { Medal } from './types';
import { BronzeMedalIcon, SilverMedalIcon, GoldMedalIcon, DiamondMedalIcon, TrophyIcon } from './components/IconComponents';

export const ALL_MEDALS: Medal[] = [
  {
    id: 'first_step',
    name: 'First Step',
    description: 'Awarded for completing your very first training session. The journey begins!',
    milestone: 1,
    Icon: BronzeMedalIcon,
  },
  {
    id: 'consistent_contender',
    name: 'Consistent Contender',
    description: 'Awarded for completing 5 training sessions. You\'re building a habit!',
    milestone: 5,
    Icon: SilverMedalIcon,
  },
  {
    id: 'dedicated_warrior',
    name: 'Dedicated Warrior',
    description: 'Awarded for completing 10 training sessions. Your dedication is impressive!',
    milestone: 10,
    Icon: GoldMedalIcon,
  },
  {
    id: 'gym_veteran',
    name: 'Gym Veteran',
    description: 'Awarded for completing 25 training sessions. You\'re a regular!',
    milestone: 25,
    Icon: DiamondMedalIcon,
  },
  {
    id: 'fitness_legend',
    name: 'Fitness Legend',
    description: 'Awarded for completing 50 training sessions. An inspiration to all!',
    milestone: 50,
    Icon: TrophyIcon,
  },
];
