
export interface AppBanner {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: Date;
  isDeleted?: boolean;
}

// No mock data needed since we're using API

// Mock data for app banners




export const mockBanners: AppBanner[] = [
  {
    id: '1',
    title: 'Summer Cleaning Offer',
    description: 'Get 20% off on all cleaning services this summer',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    isActive: true,
    createdAt: new Date('2023-06-15')
  },
  {
    id: '2',
    title: 'New Service Launch',
    description: 'Try our new carpet cleaning service with special discount',
    imageUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    isActive: true,
    createdAt: new Date('2023-07-10')
  },
  {
    id: '3',
    title: 'Holiday Season Deals',
    description: 'Book now for the holiday season and get priority scheduling',
    imageUrl: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81',
    isActive: false,
    createdAt: new Date('2023-08-05')
  },
];
