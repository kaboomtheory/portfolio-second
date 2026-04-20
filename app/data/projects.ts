export interface ProjectStorySection {
  heading?: string
  body?: string
  image: string
}

export interface ProjectItem {
  slug: string
  name: string
  summary: string
  thumbnail: string
  protected?: boolean
  tags: string[]
  sections: ProjectStorySection[]
}

export const projectPasswords: Record<string, string> = {}

export const projects: ProjectItem[] = [
  {
    slug: 'victor',
    name: 'Victor',
    summary:
      'Premium A+ content created for Victor\u2019s online product listings, delivering visually captivating and functional assets to elevate the online shopping experience.',
    thumbnail: '/images/projects/victor/01.png',
    tags: ['Marketing', 'Branding', 'Digital'],
    sections: [
      {
        heading: 'Concept',
        body: 'By blending sleek, modern design with user-friendly layouts and purposeful imagery, the content was designed to emphasize the unique features and craftsmanship of Victor\u2019s record players and related products.',
        image: '/images/projects/victor/02.png',
      },
      {
        heading: 'Drafts',
        body: 'Multiple concepts and drafts were explored to find the perfect balance between brand heritage and modern retail presentation.',
        image: '/images/projects/victor/03.png',
      },
      {
        heading: 'Visual Development',
        body: 'Iterative design process refined the visual language through careful attention to typography, color, and composition.',
        image: '/images/projects/victor/04.png',
      },
      {
        heading: 'Typography & Layout',
        body: 'Custom typography choices that enhance readability while maintaining brand elegance.',
        image: '/images/projects/victor/05.png',
      },
      {
        heading: 'Final Version',
        body: 'The final A+ content delivers a cohesive visual story that elevates the brand while staying true to its timeless and sophisticated identity.',
        image: '/images/projects/victor/06.png',
      },
      {
        heading: 'Packaging Elements',
        body: 'Translating the new digital identity into physical touchpoints and packaging materials.',
        image: '/images/projects/victor/07.png',
      },
      {
        heading: 'Product Features',
        body: 'Highlighting key product features through focused, informative visual design.',
        image: '/images/projects/victor/08.png',
      },
      {
        heading: 'Lifestyle Context',
        body: 'Showcasing the product in real-world environments to help customers visualize ownership.',
        image: '/images/projects/victor/09.png',
      },
      {
        heading: 'Interface Components',
        body: 'Creating modular UI elements for seamless integration across digital platforms.',
        image: '/images/projects/victor/10.png',
      },
      {
        heading: 'Desktop + Mobile',
        body: 'Responsive designs ensure the content looks stunning across all devices, from desktop browsers to mobile shopping apps.',
        image: '/images/projects/victor/11.png',
      },
      {
        heading: 'Digital Advertising',
        body: 'Eye-catching promotional assets designed for various social media formats.',
        image: '/images/projects/victor/12.png',
      },
      {
        heading: 'Social Media Assets',
        body: 'A cohesive series of social posts that build brand awareness and engagement.',
        image: '/images/projects/victor/13.png',
      },
      {
        heading: 'Detail Views',
        body: 'Close-up product photography and feature callouts highlight the craftsmanship and premium quality of each item.',
        image: '/images/projects/victor/14.png',
      },
      {
        heading: 'Brand Ecosystem',
        body: 'A unified visual language tying together all aspects of the brand experience.',
        image: '/images/projects/victor/15.png',
      },
    ],
  },
  {
    slug: 'emerson',
    name: 'Emerson',
    summary:
      'A comprehensive branding project for Emerson, creating visual assets that communicate quality and innovation.',
    thumbnail: '/images/projects/emerson/01.png',
    tags: ['Branding', 'Marketing', 'Digital'],
    sections: [
      {
        heading: 'Brand Strategy',
        body: 'Developed a visual strategy that positions Emerson as a leader in their industry while maintaining approachability.',
        image: '/images/projects/emerson/02.png',
      },
      {
        heading: 'Identity Explorations',
        body: 'Testing diverse visual directions to establish a strong, resonant brand foundation.',
        image: '/images/projects/emerson/03.png',
      },
      {
        heading: 'Logo System',
        body: 'A versatile logo family designed to function flawlessly across different scales and mediums.',
        image: '/images/projects/emerson/04.png',
      },
      {
        heading: 'Visual Development',
        body: 'Created comprehensive visual assets including photography direction, typography, and color systems.',
        image: '/images/projects/emerson/05.png',
      },
      {
        heading: 'Iconography',
        body: 'Custom iconography that complements the brand\u2019s typographic voice and clarifies communication.',
        image: '/images/projects/emerson/06.png',
      },
      {
        heading: 'Color & Typography',
        body: 'A refined palette and type system that conveys professionalism while remaining warm and inviting.',
        image: '/images/projects/emerson/07.png',
      },
      {
        heading: 'Digital Guidelines',
        body: 'Comprehensive standards ensuring consistency across all digital touchpoints.',
        image: '/images/projects/emerson/08.png',
      },
      {
        heading: 'Final Deliverables',
        body: 'Delivered a complete suite of brand assets ready for implementation across all touchpoints.',
        image: '/images/projects/emerson/09.png',
      },
      {
        heading: 'Print Materials',
        body: 'High-quality print collateral that reinforces the premium, tactile feel of the brand.',
        image: '/images/projects/emerson/10.png',
      },
      {
        heading: 'Packaging Concepts',
        body: 'Translating the brand\u2019s core message into elegant packaging solutions.',
        image: '/images/projects/emerson/11.png',
      },
      {
        heading: 'Applications',
        body: 'The brand identity extends seamlessly across print, digital, and environmental applications.',
        image: '/images/projects/emerson/12.png',
      },
      {
        heading: 'Signage & Wayfinding',
        body: 'Environmental graphics that guide visitors while reinforcing brand presence.',
        image: '/images/projects/emerson/13.png',
      },
      {
        heading: 'Brand Launch',
        body: 'A coordinated launch strategy with cohesive visuals across all channels.',
        image: '/images/projects/emerson/14.png',
      },
    ],
  },
  {
    slug: 'cubby',
    name: 'Cubby',
    summary:
      'A modern storage solution brand identity and digital presence that combines functionality with playful design.',
    thumbnail: '/images/projects/cubby/01.png',
    tags: ['Branding', 'Product', 'Digital'],
    sections: [
      {
        heading: 'Brand Identity',
        body: 'Created a friendly and approachable brand identity that makes organization feel effortless and fun.',
        image: '/images/projects/cubby/02.png',
      },
      {
        heading: 'Logo Exploration',
        body: 'Explored multiple directions before landing on a mark that captures the playful yet functional essence of the brand.',
        image: '/images/projects/cubby/03.png',
      },
      {
        heading: 'Color Palette',
        body: 'A vibrant and energetic color palette that sparks joy and creativity.',
        image: '/images/projects/cubby/04.png',
      },
      {
        heading: 'Typography System',
        body: 'Playful yet legible typography that supports the brand\u2019s approachable voice.',
        image: '/images/projects/cubby/05.png',
      },
      {
        heading: 'Product Photography',
        body: 'Developed a photography style that showcases products in real-world contexts while highlighting their features.',
        image: '/images/projects/cubby/06.png',
      },
      {
        heading: 'Usage Scenarios',
        body: 'Illustrating how the product fits naturally into everyday life.',
        image: '/images/projects/cubby/07.png',
      },
      {
        heading: 'Material Details',
        body: 'Highlighting the quality and sustainability of the materials used.',
        image: '/images/projects/cubby/08.png',
      },
      {
        heading: 'Packaging Design',
        body: 'Packaging that stands out on shelves and communicates the brand\u2019s commitment to quality and design.',
        image: '/images/projects/cubby/09.png',
      },
      {
        heading: 'Unboxing Experience',
        body: 'Designing a delightful and memorable unboxing process for customers.',
        image: '/images/projects/cubby/10.png',
      },
      {
        heading: 'Digital Experience',
        body: 'Designed an intuitive digital experience that guides customers through product discovery and purchase.',
        image: '/images/projects/cubby/11.png',
      },
      {
        heading: 'Social Presence',
        body: 'Engaging social media templates that maintain consistent brand energy.',
        image: '/images/projects/cubby/12.png',
      },
      {
        heading: 'Retail Displays',
        body: 'Eye-catching point-of-sale displays that attract attention in physical stores.',
        image: '/images/projects/cubby/13.png',
      },
      {
        heading: 'Brand Extensions',
        body: 'The visual system scales across product lines, marketing materials, and retail environments.',
        image: '/images/projects/cubby/14.png',
      },
      {
        heading: 'The Future',
        body: 'A robust brand foundation built to grow and evolve with the company.',
        image: '/images/projects/cubby/15.png',
      },
    ],
  },
  {
    slug: 'puchicafe',
    name: 'Púchicafé',
    summary:
      'A vibrant brand identity for a specialty coffee shop that celebrates Latin American coffee culture.',
    thumbnail: '/images/projects/puchicafe/01.png',
    tags: ['Branding', 'Packaging', 'Food & Beverage'],
    sections: [
      {
        heading: 'Brand Concept',
        body: 'Developed a warm and inviting brand that honors traditional coffee culture while feeling fresh and contemporary.',
        image: '/images/projects/puchicafe/02.png',
      },
      {
        heading: 'Visual Identity',
        body: 'Created a colorful and expressive visual system that stands out in the competitive coffee market.',
        image: '/images/projects/puchicafe/03.png',
      },
      {
        heading: 'Packaging & Collateral',
        body: 'Extended the brand to cups, bags, and merchandise that customers want to take home.',
        image: '/images/projects/puchicafe/04.png',
      },
      {
        heading: 'Merchandise',
        body: 'Wearable items and accessories that loyal customers are proud to show off.',
        image: '/images/projects/puchicafe/05.png',
      },
      {
        heading: 'Motion Design',
        body: 'Animated brand elements bring the identity to life across digital platforms.',
        image: '/images/projects/puchicafe/06.gif',
      },
    ],
  },
  {
    slug: 'linkup',
    name: 'LinkUp',
    summary:
      'A social networking app designed to help people build meaningful professional connections.',
    thumbnail: '/images/projects/linkup/01.png',
    tags: ['App Design', 'UI/UX', 'Social'],
    sections: [
      {
        heading: 'User Experience',
        body: 'Designed an intuitive onboarding and connection flow that makes networking feel natural and authentic.',
        image: '/images/projects/linkup/02.png',
      },
      {
        heading: 'User Research',
        body: 'Insights gathered from target demographics to inform key design decisions.',
        image: '/images/projects/linkup/03.png',
      },
      {
        heading: 'Wireframes & Flows',
        body: 'Mapped out key user journeys to ensure a seamless experience from first launch to meaningful connection.',
        image: '/images/projects/linkup/04.png',
      },
      {
        heading: 'Design System',
        body: 'A comprehensive UI kit that ensures consistency and speeds up development.',
        image: '/images/projects/linkup/05.png',
      },
      {
        heading: 'Interaction Design',
        body: 'Thoughtful micro-interactions that provide feedback and delight users.',
        image: '/images/projects/linkup/06.png',
      },
      {
        heading: 'Interface Design',
        body: 'Created a clean, modern interface that puts the focus on people and conversations.',
        image: '/images/projects/linkup/07.png',
      },
      {
        heading: 'Messaging Flow',
        body: 'A streamlined chat experience that makes professional communication effortless.',
        image: '/images/projects/linkup/08.png',
      },
      {
        heading: 'Profile & Discovery',
        body: 'Profiles highlight professional achievements while discovery features surface relevant connections.',
        image: '/images/projects/linkup/09.png',
      },
      {
        heading: 'Search & Filters',
        body: 'Powerful search tools to help users find exactly the right connections.',
        image: '/images/projects/linkup/10.png',
      },
      {
        heading: 'Notifications',
        body: 'A balanced notification system that keeps users informed without being intrusive.',
        image: '/images/projects/linkup/11.png',
      },
      {
        heading: 'Feature Showcase',
        body: 'Key features are presented in an engaging way that highlights the app\u2019s unique value proposition.',
        image: '/images/projects/linkup/12.png',
      },
      {
        heading: 'Launch Marketing',
        body: 'Promotional graphics highlighting the app\u2019s value proposition for the public launch.',
        image: '/images/projects/linkup/13.png',
      },
    ],
  },
  {
    slug: 'kale-of-the-wild',
    name: 'Kale of the Wild',
    summary:
      'A nature-inspired brand identity for an organic food company that celebrates wild, sustainable ingredients.',
    thumbnail: '/images/projects/kale-of-the-wild/01.png',
    tags: ['Branding', 'Packaging', 'Food'],
    sections: [
      {
        heading: 'Brand Story',
        body: 'Developed a brand narrative that connects consumers with the source of their food and the values of sustainability.',
        image: '/images/projects/kale-of-the-wild/02.png',
      },
      {
        heading: 'Logo Development',
        body: 'The mark combines organic forms with modern typography to convey natural authenticity.',
        image: '/images/projects/kale-of-the-wild/03.png',
      },
      {
        heading: 'Illustration Style',
        body: 'Custom botanical illustrations that highlight the natural ingredients.',
        image: '/images/projects/kale-of-the-wild/04.png',
      },
      {
        heading: 'Color System',
        body: 'An earthy, natural palette derived from the ingredients themselves—greens, browns, and warm neutrals.',
        image: '/images/projects/kale-of-the-wild/05.png',
      },
      {
        heading: 'Packaging Design',
        body: 'Created eye-catching packaging that stands out on shelves while communicating the brand\u2019s natural ethos.',
        image: '/images/projects/kale-of-the-wild/06.png',
      },
      {
        heading: 'Label Variations',
        body: 'A flexible label system that easily adapts to new product lines and flavors.',
        image: '/images/projects/kale-of-the-wild/07.png',
      },
      {
        heading: 'Marketing Collateral',
        body: 'Brochures and recipe cards that educate consumers and inspire usage.',
        image: '/images/projects/kale-of-the-wild/08.png',
      },
      {
        heading: 'Website Design',
        body: 'An e-commerce experience that feels as fresh and natural as the products themselves.',
        image: '/images/projects/kale-of-the-wild/09.png',
      },
      {
        heading: 'Social Media Strategy',
        body: 'A content plan focused on sustainability, wellness, and culinary inspiration.',
        image: '/images/projects/kale-of-the-wild/10.png',
      },
      {
        heading: 'Brand Assets',
        body: 'Delivered comprehensive brand guidelines and assets for consistent application across all touchpoints.',
        image: '/images/projects/kale-of-the-wild/11.png',
      },
    ],
  },
  {
    slug: 'radiant-valley',
    name: 'Radiant Valley',
    summary:
      'A serene brand identity for a wellness retreat nestled in nature, offering transformative experiences.',
    thumbnail: '/images/projects/radiant-valley/01.png',
    tags: ['Branding', 'Wellness', 'Hospitality'],
    sections: [
      {
        heading: 'Brand Vision',
        body: 'Created a visual identity that captures the peaceful, restorative essence of the retreat experience.',
        image: '/images/projects/radiant-valley/02.jpg',
      },
      {
        heading: 'Concept Development',
        body: 'Translating the physical tranquility of the space into visual form.',
        image: '/images/projects/radiant-valley/03.jpg',
      },
      {
        heading: 'Logo Marks',
        body: 'A serene and balanced logo system inspired by natural landscapes.',
        image: '/images/projects/radiant-valley/04.jpg',
      },
      {
        heading: 'Photography Direction',
        body: 'Art-directed a photography style that showcases the natural beauty and tranquility of the retreat.',
        image: '/images/projects/radiant-valley/05.jpg',
      },
      {
        heading: 'Image Treatment',
        body: 'Consistent editing styles that evoke warmth, sunlight, and calm.',
        image: '/images/projects/radiant-valley/06.jpg',
      },
      {
        heading: 'Digital Interfaces',
        body: 'A booking experience designed to be as stress-free as the retreat itself.',
        image: '/images/projects/radiant-valley/07.jpg',
      },
      {
        heading: 'Visual Language',
        body: 'Developed a sophisticated color palette and typography system that evokes calm and luxury.',
        image: '/images/projects/radiant-valley/08.png',
      },
      {
        heading: 'Typography',
        body: 'Elegant serif selections paired with clean sans-serifs for modern readability.',
        image: '/images/projects/radiant-valley/09.png',
      },
      {
        heading: 'Print Collateral',
        body: 'Designed brochures, menus, and wayfinding that enhance the guest experience.',
        image: '/images/projects/radiant-valley/10.png',
      },
      {
        heading: 'Environmental Graphics',
        body: 'Signage that blends harmoniously with the natural surroundings.',
        image: '/images/projects/radiant-valley/11.jpg',
      },
      {
        heading: 'Applications',
        body: 'Extended the brand across digital and print touchpoints, from website to in-room collateral.',
        image: '/images/projects/radiant-valley/12.png',
      },
    ],
  },
  {
    slug: 'mixed-designs',
    name: 'Mixed Designs',
    summary:
      'A curated collection of design experiments and client work showcasing versatility across styles and mediums.',
    thumbnail: '/images/projects/mixed-designs/01.png',
    tags: ['Various', 'Experimental', 'Creative'],
    sections: [
      {
        heading: 'Design Exploration',
        body: 'A showcase of diverse design approaches, from minimal to expressive, demonstrating creative range.',
        image: '/images/projects/mixed-designs/02.jpg',
      },
      {
        heading: 'Abstract Forms',
        body: 'Experimenting with geometric and organic shapes to convey complex emotions.',
        image: '/images/projects/mixed-designs/03.jpg',
      },
      {
        heading: 'Color Studies',
        body: 'Exploring vibrant palettes and unique color interactions.',
        image: '/images/projects/mixed-designs/04.jpg',
      },
      {
        heading: 'Illustration Work',
        body: 'Custom illustrations and artwork created for various client projects and personal experiments.',
        image: '/images/projects/mixed-designs/05.jpg',
      },
      {
        heading: 'Character Design',
        body: 'Playful character explorations for various narrative contexts.',
        image: '/images/projects/mixed-designs/06.jpg',
      },
      {
        heading: 'Layout Techniques',
        body: 'Pushing the boundaries of grid systems and editorial design.',
        image: '/images/projects/mixed-designs/07.jpg',
      },
      {
        heading: 'Typography Studies',
        body: 'Experimental typography and lettering work pushing the boundaries of visual communication.',
        image: '/images/projects/mixed-designs/08.png',
      },
      {
        heading: '3D Rendering',
        body: 'Incorporating depth and texture through dimensional design techniques.',
        image: '/images/projects/mixed-designs/09.png',
      },
      {
        heading: 'Pattern Design',
        body: 'Repeating patterns and surface designs for textiles, packaging, and digital applications.',
        image: '/images/projects/mixed-designs/10.png',
      },
      {
        heading: 'Poster Art',
        body: 'Expressive poster designs combining typography, imagery, and bold messaging.',
        image: '/images/projects/mixed-designs/11.jpg',
      },
      {
        heading: 'Visual Systems',
        body: 'Custom visual systems and pattern designs created for various client projects.',
        image: '/images/projects/mixed-designs/12.png',
      },
    ],
  },
]
