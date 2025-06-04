 a submit button 
 
 'use client';

interface QuickPromptsProps {
  onPromptSelect: (prompt: string) => void;
  isLoading: boolean;
}

const QUICK_PROMPTS = [
  {
    category: 'Hair',
    prompts: [
      "I'd like to book a haircut",
      "I need a color treatment",
      "I want to book a hair styling appointment",
      "I need a root touch-up",
      "I'm interested in a hair treatment"
    ]
  },
  {
    category: 'Nails',
    prompts: [
      "I'd like to book a manicure",
      "I need a pedicure",
      "I want gel nails",
      "I need a nail repair",
      "I'm interested in nail art"
    ]
  },
  {
    category: 'Face & Skin',
    prompts: [
      "I'd like to book a facial",
      "I need a skin consultation",
      "I want to book a makeup session",
      "I'm interested in a skin treatment",
      "I need eyebrow shaping"
    ]
  }
];

export default function QuickPrompts({ onPromptSelect, isLoading }: QuickPromptsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-500">Quick Booking Options</h3>
      <div className="space-y-3">
        {QUICK_PROMPTS.map((category) => (
          <div key={category.category} className="space-y-2">
            <h4 className="text-xs font-semibold text-gray-400">{category.category}</h4>
            <div className="flex flex-wrap gap-2">
              {category.prompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => onPromptSelect(prompt)}
                  disabled={isLoading}
                  className={`text-sm px-3 py-1.5 rounded-full border transition-colors
                    ${isLoading 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200'
                    }`}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 