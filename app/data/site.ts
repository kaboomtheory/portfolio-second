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
  photo: 'https://picsum.photos/seed/profile-avery/300/300',
  email: 'hello@bryanxmendez.com',
}

export const navItems: NavItem[] = [
  { group: 'Work', title: 'Home', path: '/', icon: 'lucide:house' },
]

export const socialLinks = [
  { label: 'LinkedIn', icon: 'ri:linkedin-fill', href: 'https://linkedin.com/' },
]
