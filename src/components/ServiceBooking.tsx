import { useState } from 'react';
import DateTimePicker from './DateTimePicker';

type BookingType = 'salon' | 'instant';

type ServiceBookingProps = {
  onComplete: (booking: {
    service: { name: string; duration: string; price: string };
    dateTime: Date;
    bookingType: BookingType;
  }) => void;
};

type Service = {
  id: string;
  name: string;
  duration: string;
  price: string;
  description: string;
  image?: string;
  availableTypes: BookingType[];
};

type Category = {
  id: string;
  name: string;
  icon: string;
  services: Service[];
};

const CATEGORIES: Category[] = [
  {
    id: 'hair',
    name: 'Hair Services',
    icon: '💇‍♀️',
    services: [
      { 
        id: 'haircut', 
        name: 'Haircut & Styling', 
        duration: '60 min', 
        price: '£45', 
        description: 'Professional cut and style tailored to your preferences',
        availableTypes: ['salon']
      },
      { 
        id: 'color', 
        name: 'Hair Colour', 
        duration: '120 min', 
        price: '£85', 
        description: 'Full color treatment with premium products',
        availableTypes: ['salon']
      },
      { 
        id: 'highlights', 
        name: 'Highlights', 
        duration: '150 min', 
        price: '£120', 
        description: 'Partial or full highlights for dimensional color',
        availableTypes: ['salon']
      },
      { 
        id: 'treatment', 
        name: 'Hair Treatment', 
        duration: '45 min', 
        price: '£35', 
        description: 'Deep conditioning and repair treatment',
        availableTypes: ['salon', 'instant']
      }
    ]
  },
  {
    id: 'nails',
    name: 'Nail Care',
    icon: '💅',
    services: [
      { id: 'manicure', name: 'Classic Manicure', duration: '30 min', price: '£25', description: 'Nail shaping, cuticle care, and polish', availableTypes: ['salon'] },
      { id: 'pedicure', name: 'Luxury Pedicure', duration: '45 min', price: '£35', description: 'Complete foot care with massage', availableTypes: ['salon'] },
      { id: 'gel', name: 'Gel Polish', duration: '60 min', price: '£40', description: 'Long-lasting gel polish application', availableTypes: ['salon'] },
      { id: 'nailart', name: 'Nail Art Design', duration: '45 min', price: '£30', description: 'Custom nail art and decorative elements', availableTypes: ['salon'] }
    ]
  },
  {
    id: 'facial',
    name: 'Face & Skin',
    icon: '✨',
    services: [
      { id: 'facial', name: 'Classic Facial', duration: '60 min', price: '£65', description: 'Deep cleansing and rejuvenating facial', availableTypes: ['salon'] },
      { id: 'deepclean', name: 'Deep Cleansing', duration: '75 min', price: '£75', description: 'Intensive cleansing and extraction', availableTypes: ['salon'] },
      { id: 'antiaging', name: 'Anti-Aging', duration: '90 min', price: '£95', description: 'Advanced anti-aging treatment', availableTypes: ['salon'] },
      { id: 'microderm', name: 'Microdermabrasion', duration: '45 min', price: '£70', description: 'Exfoliating treatment for renewed skin', availableTypes: ['salon'] }
    ]
  }
];

export default function ServiceBooking({ onComplete }: ServiceBookingProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedBookingType, setSelectedBookingType] = useState<BookingType>('salon');

  const handleServiceSelect = (service: Service) => {
    if (!service.availableTypes.includes(selectedBookingType)) {
      setSelectedBookingType(service.availableTypes[0]);
    }
    setSelectedService(service);
    setShowDatePicker(true);
  };

  const handleBookingTypeChange = (type: BookingType) => {
    setSelectedBookingType(type);
    setSelectedService(null);
    setShowDatePicker(false);
  };

  const handleDateTimeSelect = (dateTime: Date | null) => {
    if (selectedService && dateTime) {
      onComplete({
        service: {
          name: selectedService.name,
          duration: selectedService.duration,
          price: selectedService.price
        },
        dateTime,
        bookingType: selectedBookingType
      });
    }
  };

  const filteredServices = selectedCategory?.services.filter(service => 
    service.availableTypes.includes(selectedBookingType)
  ) || [];

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2">
          <span className="text-[#8B7BF7]">AI</span> Beauty Agent ✨
        </h1>
        <div className="relative">
          <input
            type="search"
            placeholder="What are you looking for?"
            className="w-full px-4 py-3 pl-10 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#8B7BF7]/20 focus:border-[#8B7BF7] transition-all duration-200"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2">🔍</span>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button 
          onClick={() => handleBookingTypeChange('salon')}
          className={`px-4 py-2 rounded-full font-medium shadow-sm transition-all duration-200
            ${selectedBookingType === 'salon'
              ? 'bg-[#8B7BF7] text-white'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-[#8B7BF7] hover:text-[#8B7BF7]'
            }`}
        >
          🏠 Salon
        </button>
        <button 
          onClick={() => handleBookingTypeChange('instant')}
          className={`px-4 py-2 rounded-full font-medium shadow-sm transition-all duration-200
            ${selectedBookingType === 'instant'
              ? 'bg-[#8B7BF7] text-white'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-[#8B7BF7] hover:text-[#8B7BF7]'
            }`}
        >
          ⚡ Instant book
        </button>
      </div>

      {!selectedCategory ? (
        /* Categories Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category)}
              className="p-6 rounded-xl bg-white border border-gray-100 hover:border-[#8B7BF7] shadow-sm hover:shadow-md transition-all duration-200 text-left"
            >
              <div className="text-4xl mb-4">{category.icon}</div>
              <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">{category.name}</h3>
              <p className="text-gray-500 text-sm">
                {category.services.filter(s => s.availableTypes.includes(selectedBookingType)).length} services available
              </p>
            </button>
          ))}
        </div>
      ) : !selectedService ? (
        /* Services List */
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[#1A1A1A]">{selectedCategory.name}</h2>
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-[#8B7BF7] font-medium hover:text-[#7A68F6] transition-all duration-200"
            >
              ← Back
            </button>
          </div>
          {filteredServices.length > 0 ? (
            <div className="space-y-4">
              {filteredServices.map((service) => (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelect(service)}
                  className="w-full p-6 rounded-xl bg-white border border-gray-100 hover:border-[#8B7BF7] shadow-sm hover:shadow-md transition-all duration-200 text-left"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">{service.name}</h3>
                      <p className="text-gray-600 mb-3">{service.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center">⏱ {service.duration}</span>
                        <span className="flex items-center">💰 {service.price}</span>
                      </div>
                    </div>
                    {service.image && (
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No services available for {selectedBookingType} booking type.
            </div>
          )}
        </div>
      ) : (
        /* Date Time Picker */
        <DateTimePicker 
          selectedDate={null}
          onChange={handleDateTimeSelect}
          onConfirm={handleDateTimeSelect}
          instantBook={selectedBookingType === 'instant'}
        />
      )}
    </div>
  );
} 