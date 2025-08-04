import axios from 'axios';

export interface Service {
  id ?: string;
  name: string;
  thumbnail?: string;
  imageBase64?:string;
  description: string;
  pricingmodel: string;
  status: "active" | "inactive";
  variants?: string[];
  additionalService?: string;
}

// Available variants for the multiselect
export const availableVariants = [
  "Basic", "Standard", "Premium", "Deep Clean", "Quick", 
  "Luxury", "Spray Wax", "Paste Wax", "Ceramic Coating"
];

// API Configuration


// Interface for API response




// Mock service data - used as fallback if API fails
export const mockServices: Service[] = [
  {
    id: "srv-001",
    name: "Car Wash",
    thumbnail: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    description: "Basic exterior washing service for your vehicle",
    pricingmodel: "per kg",
    status: "active",
    variants: ["Basic", "Premium"],
    additionalService: "Interior vacuuming",
  },
  {
    id: "srv-002",
    name: "Interior Detailing",
    thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    description: "Comprehensive cleaning of your vehicle's interior",
    pricingmodel: "per kg",
    status: "active",
    variants: ["Standard", "Deep Clean"],
    additionalService: "Leather conditioning",
  },
  {
    id: "srv-003",
    name: "Full Vehicle Detail",
    thumbnail: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    description: "Complete interior and exterior detailing service",
    pricingmodel: "per kg",
    status: "inactive",
    variants: ["Standard", "Premium", "Luxury"],
    additionalService: "Paint protection",
  },
  {
    id: "srv-004",
    name: "Express Wash",
    thumbnail: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    description: "Quick exterior wash service, ready in 15 minutes",
    pricingmodel: "per kg",
    status: "active",
    variants: ["Quick", "Standard"],
    additionalService: "Tire shine",
  },
  {
    id: "srv-005",
    name: "Wax Treatment",
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    description: "Premium wax application for long-lasting shine and protection",
    pricingmodel: "per kg",
    status: "active",
    variants: ["Spray Wax", "Paste Wax", "Ceramic Coating"],
    additionalService: "Paint correction",
  },
];

// Example usage in a component:
/*
import { fetchServices } from './thisFile';

const [services, setServices] = useState<Service[]>([]);

useEffect(() => {
  const loadServices = async () => {
    const fetchedServices = await fetchServices();
    setServices(fetchedServices);
  };
  loadServices();
}, []);
*/