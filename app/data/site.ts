export interface NavItem {
  group: 'Work' | 'Personal'
  title: string
  path: string
  icon: string
}

export const profile = {
  name: 'Bryan X. Mendez',
  role: 'Visual Designer',
  location: 'Los Angeles, CA',
  photo: '/profile-photo.webp',
}

export const navItems: NavItem[] = [
  { group: 'Work', title: 'Home', path: '/#intro', icon: 'lucide:house' },
  { group: 'Work', title: 'Work', path: '/#work', icon: 'lucide:layout-grid' },
  { group: 'Personal', title: 'About', path: '/#story', icon: 'lucide:user' },
]

export const socialLinks = [
  { label: 'LinkedIn', icon: 'ri:linkedin-fill', href: 'https://www.linkedin.com/in/bryan-mendez/' },
]
