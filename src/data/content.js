export const routes = {
  '/': 'home',
  '/students': 'students',
  '/apply': 'apply',
  '/opportunities': 'opportunities',
  '/opportunities/manage': 'opportunityManage',
  '/opportunities/new': 'opportunityNew',
  '/partners': 'partners',
  '/about': 'about',
  '/privacy': 'privacy',
  '/terms': 'terms',
  '/community-guidelines': 'communityGuidelines',
  '/organization-posting-guidelines': 'organizationPostingGuidelines',
  '/safety-trust': 'safetyTrust',
  '/auth/organization': 'authOrganization',
  '/auth/student': 'authStudent',
  '/dashboard/organization': 'dashboardOrganization',
  '/dashboard/student': 'dashboardStudent',
  '/profile/organization': 'profileOrganization',
  '/profile/student': 'profileStudent',
}

export const navigation = [
  { label: 'Home', href: '/' },
  { label: 'Students', href: '/students' },
  { label: 'Opportunities', href: '/opportunities' },
  { label: 'Partners', href: '/partners' },
  { label: 'About', href: '/about' },
]

export const titleMap = {
  home: 'Kenisar | Student Opportunities Platform',
  students: 'Students | Kenisar',
  apply: 'Create Student Profile | Kenisar',
  opportunities: 'Opportunities | Kenisar',
  opportunityManage: 'Manage Listings | Kenisar',
  opportunityNew: 'Create Opportunity Listing | Kenisar',
  partners: 'Partners | Kenisar',
  about: 'About | Kenisar',
  privacy: 'Privacy Policy | Kenisar',
  terms: 'Terms of Service | Kenisar',
  communityGuidelines: 'Community Guidelines | Kenisar',
  organizationPostingGuidelines: 'Organization Posting Guidelines | Kenisar',
  safetyTrust: 'Safety & Trust | Kenisar',
  authOrganization: 'Organization Account | Kenisar',
  authStudent: 'Student Account | Kenisar',
  dashboardOrganization: 'Organization Dashboard | Kenisar',
  dashboardStudent: 'Student Dashboard | Kenisar',
  profileOrganization: 'Organization Profile | Kenisar',
  profileStudent: 'Student Profile | Kenisar',
}

export const footerPolicyLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Community Guidelines', href: '/community-guidelines' },
  { label: 'Organization Posting Guidelines', href: '/organization-posting-guidelines' },
  { label: 'Safety & Trust', href: '/safety-trust' },
]

export const gradeLevels = ['High School', 'College', 'University']

export const organizationTypes = [
  'Business',
  'Nonprofit',
  'School or University',
  'Community Organization',
  'Startup',
  'Other',
]

export const studentBenefits = [
  {
    title: 'Find beginner-friendly opportunities',
    description:
      'Explore internships, volunteering, mentorships, workshops, and project-based experiences designed for students.',
  },
  {
    title: 'Build experience before graduation',
    description:
      'Start building your resume, confidence, and practical skills early instead of waiting until after school.',
  },
  {
    title: 'Connect with real organizations',
    description:
      'Get closer to businesses, mentors, and organizations that want to support student growth and career discovery.',
  },
]

export const whoItsForCards = [
  {
    title: 'High School Students',
    description: 'Volunteer roles, mentorship, first resume experience, and school-friendly opportunities.',
  },
  {
    title: 'College Students',
    description: 'Internships, practical projects, workshops, and portfolio-building experience.',
  },
  {
    title: 'University Students',
    description: 'Career exposure, part-time roles, networking, mentorship, and industry experience.',
  },
]

export const howItWorksSteps = [
  {
    title: 'Create your profile',
    description: 'Share your basics, school level, and the types of opportunities you want to explore.',
  },
  {
    title: 'Tell us your interests',
    description: 'Help Kenisar understand which experiences fit your goals, from volunteering to internships.',
  },
  {
    title: 'Watch for opportunities',
    description: 'As student-friendly partners join, Kenisar will notify you when relevant opportunities open.',
  },
]

export const opportunityCategories = [
  'Internships',
  'Volunteering',
  'Mentorships',
  'Part-time roles',
  'Workshops',
  'Project-based experiences',
]

export const partnerBenefits = [
  {
    title: 'Reach motivated students early',
    description: 'Meet students who are actively looking for meaningful first experience and guided career exposure.',
  },
  {
    title: 'Offer beginner-friendly roles',
    description: 'Share internships, volunteer roles, mentorships, workshops, or project-based opportunities.',
  },
  {
    title: 'Build community impact',
    description: 'Support student growth while creating more accessible pathways into real-world experience.',
  },
  {
    title: 'Create a future talent pipeline',
    description: 'Build early relationships with students who may grow into strong future contributors.',
  },
]

export const aboutSections = [
  {
    title: 'What Kenisar is',
    description:
      'A student-focused platform that connects early learners with internships, volunteering, mentorships, workshops, part-time roles, and project-based opportunities.',
  },
  {
    title: 'Why it exists',
    description:
      'Many students need first experience, but most platforms are built for people who already have it. Kenisar is designed to close that gap.',
  },
  {
    title: 'What we are building',
    description:
      'We are building with students and organizations to create a cleaner place to start, with honest onboarding and a structure that can grow into a real opportunity platform.',
  },
]
