import type { Preview } from '@storybook/nextjs-vite'
import '../src/app/globals.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo'
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: 'hsl(216 60% 10%)' },
        { name: 'light', value: 'hsl(40 33% 97%)' },
      ],
    },
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'dark',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'dark', title: 'Dark', icon: 'moon' },
          { value: 'light', title: 'Light', icon: 'sun' },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'dark';
      return (
        <div data-theme={theme} className="min-h-screen">
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
