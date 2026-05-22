// ─────────────────────────────────────────────────────────────────────────────
// FOUR PAWS — DEV / MOCK CLIENT DATA
// NOT FOR PRODUCTION. This file must never be imported by production modules.
//
// The deployment firewall (build/firewall/mockDataGuard.js) will
// BLOCK any build where this file reaches the production module graph.
//
// Used by:
//   - Admin dashboard demo mode (runtime toggle only)
//   - AcademyLockGate demo seed (dev/preview only)
//   - LoginPage demo credentials display (dev/preview only)
// ─────────────────────────────────────────────────────────────────────────────

/* eslint-disable no-unused-vars */

export const DEMO_CLIENTS = [
  {
    id: 'client-1',
    name: 'Victoria Hartley',
    email: 'v.hartley@hartleygroup.co.uk',
    phone: '+44 7700 900123',
    dog: { name: 'Caspian', breed: 'Golden Retriever', age: '2 years' },
    avatar: null,
    joinedDate: '2024-01-15',
    enrolledCourses: ['course-1', 'course-2'],
    ownedAddons: ['addon-3'],
    courseProgress: {
      'course-1': { completedLessons: ['c1-m1-l1','c1-m1-l2','c1-m1-l3','c1-m1-l4','c1-m1-l5','c1-m1-l6','c1-m2-l1','c1-m2-l2','c1-m2-l3'], completedModules: ['c1-m1'], percentComplete: 38 },
      'course-2': { completedLessons: ['c2-m1-l1','c2-m1-l2'], completedModules: [], percentComplete: 8 }
    },
    status: 'active',
    lastActive: '2024-03-20',
    totalMessages: 12,
    unreadMessages: 2,
    notes: 'Highly engaged client. Caspian making excellent progress.',
    pwaInstalled: true,
    role: 'client',
    password: 'demo123',
    academyId:            'ACM-A1B2',
    academyLinkCode:      'FPA-ELITE-4837',
    academyActivationKey: 'AK-VH-2024-001',
    academyStatus:        'active',
    linkedDevices:        [{ deviceId: 'DEV-DEMO-0001', linkedAt: '2024-01-15T10:00:00Z' }],
    registeredAt:         '2024-01-15T09:00:00Z',
    lastActivity:         '2024-03-20T14:20:00Z',
  },
  {
    id: 'client-2',
    name: 'Sebastian Montgomery',
    email: 's.montgomery@montprive.com',
    phone: '+44 7700 900456',
    dog: { name: 'Duchess', breed: 'Cavalier King Charles Spaniel', age: '4 years' },
    avatar: null,
    joinedDate: '2024-01-28',
    enrolledCourses: ['course-3'],
    ownedAddons: ['addon-1', 'addon-2'],
    courseProgress: {
      'course-3': { completedLessons: ['c3-m1-l1','c3-m1-l2','c3-m1-l3','c3-m1-l4','c3-m1-l5','c3-m1-l6','c3-m2-l1','c3-m2-l2','c3-m2-l3','c3-m2-l4','c3-m2-l5','c3-m2-l6'], completedModules: ['c3-m1','c3-m2'], percentComplete: 50 }
    },
    status: 'active',
    lastActive: '2024-03-21',
    totalMessages: 8,
    unreadMessages: 0,
    notes: 'Duchess showing remarkable improvement in reactivity.',
    pwaInstalled: true,
    role: 'client',
    password: 'demo123',
    academyId:            'ACM-C3D4',
    academyLinkCode:      'FPA-LUXE-9281',
    academyActivationKey: 'AK-SM-2024-002',
    academyStatus:        'active',
    linkedDevices:        [{ deviceId: 'DEV-DEMO-0002', linkedAt: '2024-01-28T09:00:00Z' }],
    registeredAt:         '2024-01-28T08:00:00Z',
    lastActivity:         '2024-03-21T09:45:00Z',
  },
  {
    id: 'client-3',
    name: 'Arabella Forsythe',
    email: 'arabella@forsytheprivate.com',
    phone: '+44 7700 900789',
    dog: { name: 'Atlas', breed: 'German Shepherd', age: '1.5 years' },
    avatar: null,
    joinedDate: '2024-02-10',
    enrolledCourses: ['course-4', 'course-5'],
    ownedAddons: ['addon-4', 'addon-5', 'addon-6'],
    courseProgress: {
      'course-4': { completedLessons: ['c4-m1-l1','c4-m1-l2','c4-m1-l3'], completedModules: [], percentComplete: 13 },
      'course-5': { completedLessons: [], completedModules: [], percentComplete: 0 }
    },
    status: 'active',
    lastActive: '2024-03-19',
    totalMessages: 5,
    unreadMessages: 1,
    notes: 'Exceptional commitment. Atlas is a brilliant student.',
    pwaInstalled: false,
    role: 'client',
    password: 'demo123',
    academyId:            'ACM-E5F6',
    academyLinkCode:      'FPA-GOLD-1047',
    academyActivationKey: 'AK-AF-2024-003',
    academyStatus:        'pending',
    linkedDevices:        [],
    registeredAt:         '2024-02-10T10:00:00Z',
    lastActivity:         '2024-03-19T14:00:00Z',
  },
  {
    id: 'client-4',
    name: 'Rupert Ashworth-Clarke',
    email: 'r.ashworth@ashworthestates.co.uk',
    phone: '+44 7700 900321',
    dog: { name: 'Marlowe', breed: 'Labrador Retriever', age: '3 years' },
    avatar: null,
    joinedDate: '2024-02-20',
    enrolledCourses: ['course-2'],
    ownedAddons: [],
    courseProgress: {
      'course-2': { completedLessons: ['c2-m1-l1'], completedModules: [], percentComplete: 4 }
    },
    status: 'inactive',
    lastActive: '2024-03-10',
    totalMessages: 3,
    unreadMessages: 0,
    notes: 'Slower progress — may need re-engagement.',
    pwaInstalled: false,
    role: 'client',
    password: 'demo123',
    academyId:            'ACM-G7H8',
    academyLinkCode:      'FPA-NOIR-3392',
    academyActivationKey: 'AK-RA-2024-004',
    academyStatus:        'pending',
    linkedDevices:        [],
    registeredAt:         '2024-02-20T10:00:00Z',
    lastActivity:         '2024-03-10T11:00:00Z',
  },
  {
    id: 'client-5',
    name: 'Imogen Blackwood',
    email: 'imogen@blackwoodfoundation.org',
    phone: '+44 7700 900654',
    dog: { name: 'Ophelia', breed: 'Border Collie', age: '2.5 years' },
    avatar: null,
    joinedDate: '2024-03-01',
    enrolledCourses: ['course-1', 'course-5'],
    ownedAddons: ['addon-5'],
    courseProgress: {
      'course-1': { completedLessons: ['c1-m1-l1','c1-m1-l2','c1-m1-l3','c1-m1-l4','c1-m1-l5','c1-m1-l6','c1-m2-l1','c1-m2-l2','c1-m2-l3','c1-m2-l4','c1-m2-l5','c1-m2-l6','c1-m3-l1'], completedModules: ['c1-m1','c1-m2'], percentComplete: 54 },
      'course-5': { completedLessons: ['c5-m1-l1','c5-m1-l2'], completedModules: [], percentComplete: 8 }
    },
    status: 'active',
    lastActive: '2024-03-22',
    totalMessages: 18,
    unreadMessages: 3,
    notes: 'Fastest progressing client. Ophelia is exceptional.',
    pwaInstalled: true,
    role: 'client',
    password: 'demo123',
    academyId:            'ACM-I9J0',
    academyLinkCode:      'FPA-APEX-7756',
    academyActivationKey: 'AK-IB-2024-005',
    academyStatus:        'active',
    linkedDevices:        [{ deviceId: 'DEV-DEMO-0005', linkedAt: '2024-03-01T08:00:00Z' }],
    registeredAt:         '2024-03-01T07:00:00Z',
    lastActivity:         '2024-03-22T08:00:00Z',
  },
]

export const DEMO_MESSAGES = [
  { id: 'msg-1', clientId: 'client-1', from: 'client', text: 'Hi! Just completed module 1 and Caspian is doing amazingly well with the bonding exercises.', timestamp: '2024-03-20T10:30:00', read: true },
  { id: 'msg-2', clientId: 'client-1', from: 'admin',  text: "That's wonderful to hear, Victoria! Caspian sounds like a natural.", timestamp: '2024-03-20T11:15:00', read: true },
  { id: 'msg-3', clientId: 'client-1', from: 'client', text: 'The morning connection ritual has been incredible. He now waits calmly at the door every single morning.', timestamp: '2024-03-20T14:20:00', read: false },
  { id: 'msg-4', clientId: 'client-2', from: 'client', text: 'The reactivity programme is changing everything. We had our first calm walk past another dog yesterday.', timestamp: '2024-03-21T09:00:00', read: true },
  { id: 'msg-5', clientId: 'client-2', from: 'admin',  text: 'Sebastian, this is such a significant milestone. That calm walk represents months of nervous system healing for Duchess.', timestamp: '2024-03-21T09:45:00', read: true },
  { id: 'msg-6', clientId: 'client-5', from: 'client', text: "Ophelia completed the entire Module 2 in 3 days. She's absolutely brilliant. Is it possible to accelerate the programme?", timestamp: '2024-03-22T08:00:00', read: false },
]

export const getAnalyticsData = () => ({
  totalClients:      DEMO_CLIENTS.length,
  activeClients:     DEMO_CLIENTS.filter(c => c.status === 'active').length,
  totalEnrollments:  DEMO_CLIENTS.reduce((acc, c) => acc + c.enrolledCourses.length, 0),
  avgProgress:       Math.round(DEMO_CLIENTS.reduce((acc, c) => {
    const progresses = Object.values(c.courseProgress).map(p => p.percentComplete)
    return acc + (progresses.length ? progresses.reduce((a, b) => a + b, 0) / progresses.length : 0)
  }, 0) / DEMO_CLIENTS.length),
  pwaInstalled:      DEMO_CLIENTS.filter(c => c.pwaInstalled).length,
  recentActivity: [
    { client: 'Imogen Blackwood',       action: 'Completed Module 2', course: 'Elite Puppy Foundations',      time: '2 hours ago' },
    { client: 'Victoria Hartley',       action: 'Sent a message',     course: null,                           time: '4 hours ago' },
    { client: 'Sebastian Montgomery',   action: 'Completed a lesson', course: 'Reactive Dog Recovery',        time: '6 hours ago' },
    { client: 'Arabella Forsythe',      action: 'Started lesson',     course: 'Advanced Obedience Psychology', time: '1 day ago' },
  ],
  weeklyProgress: [
    { day: 'Mon', lessons: 8  },
    { day: 'Tue', lessons: 12 },
    { day: 'Wed', lessons: 6  },
    { day: 'Thu', lessons: 15 },
    { day: 'Fri', lessons: 10 },
    { day: 'Sat', lessons: 18 },
    { day: 'Sun', lessons: 9  },
  ],
  coursePopularity: [
    { name: 'Elite Puppy',       enrolled: 2 },
    { name: 'Behaviour Trans.',  enrolled: 2 },
    { name: 'Reactive Recovery', enrolled: 1 },
    { name: 'Adv. Obedience',   enrolled: 1 },
    { name: 'Lifestyle Opt.',    enrolled: 2 },
  ],
})
