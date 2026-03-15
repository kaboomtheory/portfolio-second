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
}

export const navItems: NavItem[] = [
  { group: 'Work', title: 'Home', path: '/', icon: 'lucide:house' },
  { group: 'Work', title: 'Resume', path: '/resume', icon: 'lucide:file-stack' },
  { group: 'Personal', title: 'About', path: '/about', icon: 'lucide:user' },
]

export const socialLinks = [
  { label: 'Instagram', icon: 'ri:instagram-fill', href: 'https://instagram.com/' },
  { label: 'LinkedIn', icon: 'ri:linkedin-fill', href: 'https://linkedin.com/' },
  { label: 'Threads', icon: 'ri:threads-fill', href: 'https://threads.net/' },
]
