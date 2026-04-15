export interface Course {
  id: string;
  number: string;
  title: string;
  description: string;
  slideUrl: string;
  content: CourseContent[];
}

export interface CourseContent {
  section: string;
  title: string;
  text: string;
}

export const courses: Course[] = [
  {
    id: 'web',
    number: '01',
    title: 'Web',
    description: 'Main battlefield',
    slideUrl: 'https://www.youtube.com/embed/PlH17E1EM-E',
    content: [
      {
        section: 'BAHAGIAN 1',
        title: 'Pengenalan Web Security',
        text: 'Memahami asas keselamatan web dan jenis-jenis serangan utama seperti SQL Injection, XSS, dan CSRF.',
      }
    ],
  },
  {
    id: 'osint',
    number: '02',
    title: 'OSINT',
    description: 'Intel phase',
    slideUrl: 'https://docs.google.com/presentation/d/1bK7dLuOmQyYWn9r3pWp_ySYh_OlST-04eSYuzXywsn4/edit?usp=sharing',
    content: [
      {
        section: 'BAHAGIAN 1',
        title: 'Open Source Intelligence (OSINT)',
        text: 'Teknik pengumpulan maklumat menggunakan sumber terbuka untuk tujuan perisikan dan keselamatan.',
      }
    ],
  },
  {
    id: 'forensics',
    number: '03',
    title: 'Forensics',
    description: 'Detection & investigation',
    slideUrl: 'https://www.youtube.com/embed/PlH17E1EM-E',
    content: [
      {
        section: 'BAHAGIAN 1',
        title: 'Digital Forensics',
        text: 'Penyiasatan jenayah siber dan pemulihan data dari sistem yang dikompromi.',
      }
    ],
  },
  {
    id: 'crypto',
    number: '04',
    title: 'Crypto',
    description: 'Secure systems & niche exploit',
    slideUrl: 'https://www.youtube.com/embed/PlH17E1EM-E',
    content: [
      {
        section: 'BAHAGIAN 1',
        title: 'Kriptografi',
        text: 'Asas penyulitan, jenis-jenis kriptografi, dan eksploitasi kelemahan dalam sistem kriptografi.',
      }
    ],
  },
  {
    id: 'reverse',
    number: '05',
    title: 'Reverse',
    description: 'Deep technical / malware',
    slideUrl: 'https://www.youtube.com/embed/PlH17E1EM-E',
    content: [
      {
        section: 'BAHAGIAN 1',
        title: 'Reverse Engineering',
        text: 'Membongkar kod perisian atau malware untuk memahami struktur dan cara ia berfungsi.',
      }
    ],
  },
  {
    id: 'analysis',
    number: '06',
    title: 'Analysis',
    description: 'SOC / network defense',
    slideUrl: 'https://www.youtube.com/embed/PlH17E1EM-E',
    content: [
      {
        section: 'BAHAGIAN 1',
        title: 'Analisis dan Pertahanan Rangkaian',
        text: 'Operasi Security Operations Center (SOC), pemantauan rangkaian, dan pertahanan terhadap serangan.',
      }
    ],
  },
  {
    id: 'misc',
    number: '07',
    title: 'Misc',
    description: 'Tambahan / puzzle',
    slideUrl: 'https://www.youtube.com/embed/PlH17E1EM-E',
    content: [
      {
        section: 'BAHAGIAN 1',
        title: 'Miscellaneous',
        text: 'Topik-topik tambahan, puzzle, dan cabaran pelbagai yang menguji kemahiran siber anda.',
      }
    ],
  },
];

export function getCourseById(id: string): Course | undefined {
  return courses.find((course) => course.id === id);
}

export function getAllCourses(): Course[] {
  return courses;
}
