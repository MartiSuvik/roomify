import { UpdateItem } from '@/types';

export const updates: UpdateItem[] = [
  {
    id: '1',
    title: 'Add your own annotations',
    type: 'improvement',
    date: '2025-01-25',
    body: 'Enhanced the annotation system to allow custom notes and comments directly on interior images. Users can now add detailed feedback and collaborate more effectively.',
    hasChatDemo: true,
  },
  {
    id: '2',
    title: 'Responsive layout improvements',
    type: 'improvement',
    date: '2025-01-23',
    body: 'Improved mobile and tablet layouts across all pages. Better touch targets, optimized spacing, and enhanced navigation for smaller screens.',
  },
  {
    id: '3',
    title: 'Generate image based on annotations',
    type: 'feature',
    date: '2025-01-22',
    body: 'New AI-powered feature that transforms your annotated designs into stunning rendered images. Simply add annotations and let our AI create beautiful visualizations.',
    hasActionDemo: true,
    images: [
      {
        src: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
        alt: 'Before annotation example'
      },
      {
        src: 'https://images.pexels.com/photos/1571471/pexels-photo-1571471.jpeg?auto=compress&cs=tinysrgb&w=800',
        alt: 'After AI generation example'
      }
    ]
  },
  {
    id: '4',
    title: 'Landscape and Portrait Proportions Support',
    type: 'improvement',
    date: '2025-01-17',
    body: 'Enhanced our rendering engine to maintain original aspect ratios. Whether your design is landscape or portrait, the output will preserve the intended proportions.',
  },
  {
    id: '5',
    title: 'HomeGPT',
    type: 'feature',
    date: '2024-06-24',
    body: 'Introducing HomeGPT - our revolutionary AI assistant for interior design. Chat naturally about your space and get expert advice tailored to your needs.',
    hasChatDemo: true,
  },
  {
    id: '6',
    title: 'Industrial Style Improvements',
    type: 'improvement',
    date: '2024-06-19',
    body: 'Enhanced our industrial design style preset with better metal textures, improved lighting, and more authentic material rendering.',
    images: [
      {
        src: 'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=800',
        alt: 'Industrial style before improvement'
      },
      {
        src: 'https://images.pexels.com/photos/1571457/pexels-photo-1571457.jpeg?auto=compress&cs=tinysrgb&w=800',
        alt: 'Industrial style after improvement'
      }
    ]
  },
  {
    id: '7',
    title: 'Dark mode issues',
    type: 'bugfix',
    date: '2024-06-19',
    body: 'Fixed various dark mode display issues including contrast problems, icon visibility, and theme persistence across page reloads.',
  },
];