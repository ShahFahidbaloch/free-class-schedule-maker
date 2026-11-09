import type { Course, TaskItem } from '../components/AcademicStudioApp';

export interface SchedulePreset {
  id: string;
  name: string;
  major: string;
  credits: number;
  description: string;
  courses: Course[];
  tasks: TaskItem[];
}

export const MAJOR_PRESETS: Record<string, SchedulePreset> = {
  'computer-science': {
    id: 'computer-science',
    name: 'Computer Science',
    major: 'B.S. Computer Science (Sophomore)',
    credits: 15,
    description: 'Data Structures, Calculus II, Computer Systems with hardware lab, and Technical Writing.',
    courses: [
      {
        id: 'cs-301',
        code: 'CS 301',
        title: 'Data Structures & Algorithms',
        credits: 4,
        colorIndex: 0,
        selectedSectionId: 'sec-cs301',
        sections: [
          {
            id: 'sec-cs301',
            name: 'Lecture MWF',
            days: ['Mon', 'Wed', 'Fri'],
            startTime: '10:00 AM',
            endTime: '11:15 AM',
            room: 'Turing Hall 101'
          }
        ]
      },
      {
        id: 'math-141',
        code: 'MATH 141',
        title: 'Calculus & Analytical Geometry II',
        credits: 4,
        colorIndex: 1,
        selectedSectionId: 'sec-math141',
        sections: [
          {
            id: 'sec-math141',
            name: 'Lecture MWF',
            days: ['Mon', 'Wed', 'Fri'],
            startTime: '11:30 AM',
            endTime: '12:45 PM',
            room: 'Science Quad 304'
          }
        ]
      },
      {
        id: 'cs-250',
        code: 'CS 250',
        title: 'Computer Architecture & Assembly',
        credits: 3,
        colorIndex: 2,
        selectedSectionId: 'sec-cs250',
        sections: [
          {
            id: 'sec-cs250',
            name: 'Lecture TTh',
            days: ['Tue', 'Thu'],
            startTime: '09:30 AM',
            endTime: '10:45 AM',
            room: 'Engineering Center 210'
          }
        ]
      },
      {
        id: 'cs-250l',
        code: 'CS 250L',
        title: 'Hardware Architecture Lab',
        credits: 1,
        colorIndex: 3,
        selectedSectionId: 'sec-cs250l',
        sections: [
          {
            id: 'sec-cs250l',
            name: 'Lab Tue',
            days: ['Tue'],
            startTime: '02:00 PM',
            endTime: '04:50 PM',
            room: 'Digital Systems Lab 12'
          }
        ]
      },
      {
        id: 'eng-102',
        code: 'ENG 102',
        title: 'Technical Academic Writing',
        credits: 3,
        colorIndex: 4,
        selectedSectionId: 'sec-eng102',
        sections: [
          {
            id: 'sec-eng102',
            name: 'Lecture TTh',
            days: ['Tue', 'Thu'],
            startTime: '11:00 AM',
            endTime: '12:15 PM',
            room: 'Humanities Hall 202'
          }
        ]
      }
    ],
    tasks: [
      { id: 't-cs1', title: 'Complete Red-Black Tree Implementation', completed: false },
      { id: 't-cs2', title: 'Calculus Integration Techniques Problem Set', completed: true }
    ]
  },

  'nursing': {
    id: 'nursing',
    name: 'Nursing Student',
    major: 'B.S. Nursing (BSN Clinical Track)',
    credits: 15,
    description: 'Clinical Pharmacology, Adult Health Pathophysiology, Simulation Lab, Holistic Health Assessment, and Hospital Rotation.',
    courses: [
      {
        id: 'nurs-210',
        code: 'NURS 210',
        title: 'Clinical Pharmacology I',
        credits: 3,
        colorIndex: 0,
        selectedSectionId: 'sec-nurs210',
        sections: [
          {
            id: 'sec-nurs210',
            name: 'Lecture MW',
            days: ['Mon', 'Wed'],
            startTime: '09:00 AM',
            endTime: '10:30 AM',
            room: 'Health Sciences 104'
          }
        ]
      },
      {
        id: 'nurs-220',
        code: 'NURS 220',
        title: 'Adult Health Pathophysiology',
        credits: 3,
        colorIndex: 1,
        selectedSectionId: 'sec-nurs220',
        sections: [
          {
            id: 'sec-nurs220',
            name: 'Lecture MW',
            days: ['Mon', 'Wed'],
            startTime: '11:00 AM',
            endTime: '12:30 PM',
            room: 'Pharmacy Hall 202'
          }
        ]
      },
      {
        id: 'nurs-240c',
        code: 'NURS 240C',
        title: 'Medical-Surgical Hospital Rotation',
        credits: 4,
        colorIndex: 2,
        selectedSectionId: 'sec-nurs240c',
        sections: [
          {
            id: 'sec-nurs240c',
            name: 'Clinical Tue',
            days: ['Tue'],
            startTime: '06:30 AM',
            endTime: '06:45 PM',
            room: 'Memorial Hospital Ward 4B'
          }
        ]
      },
      {
        id: 'nurs-230l',
        code: 'NURS 230L',
        title: 'Simulation Skills Practicum Lab',
        credits: 2,
        colorIndex: 3,
        selectedSectionId: 'sec-nurs230l',
        sections: [
          {
            id: 'sec-nurs230l',
            name: 'Lab Fri',
            days: ['Fri'],
            startTime: '08:30 AM',
            endTime: '12:30 PM',
            room: 'Sim Center Lab 3'
          }
        ]
      },
      {
        id: 'nurs-250',
        code: 'NURS 250',
        title: 'Holistic Health Assessment',
        credits: 3,
        colorIndex: 4,
        selectedSectionId: 'sec-nurs250',
        sections: [
          {
            id: 'sec-nurs250',
            name: 'Lecture Fri',
            days: ['Fri'],
            startTime: '01:30 PM',
            endTime: '03:30 PM',
            room: 'Clinical Skills 108'
          }
        ]
      }
    ],
    tasks: [
      { id: 't-nur1', title: 'Prepare clinical pharmacology drug cards', completed: false },
      { id: 't-nur2', title: 'Complete medical-surgical pre-shift assessment chart', completed: true }
    ]
  },

  'engineering': {
    id: 'engineering',
    name: 'Engineering',
    major: 'B.S. Mechanical & Electrical Engineering',
    credits: 15,
    description: 'Engineering Statics, Differential Equations, Physics II (E&M) with lab, and CAD Design.',
    courses: [
      {
        id: 'engr-201',
        code: 'ENGR 201',
        title: 'Statics & Vector Mechanics',
        credits: 3,
        colorIndex: 0,
        selectedSectionId: 'sec-engr201',
        sections: [
          {
            id: 'sec-engr201',
            name: 'Lecture MWF',
            days: ['Mon', 'Wed', 'Fri'],
            startTime: '09:00 AM',
            endTime: '10:15 AM',
            room: 'Engineering West 101'
          }
        ]
      },
      {
        id: 'math-240',
        code: 'MATH 240',
        title: 'Ordinary Differential Equations',
        credits: 4,
        colorIndex: 1,
        selectedSectionId: 'sec-math240',
        sections: [
          {
            id: 'sec-math240',
            name: 'Lecture MWF',
            days: ['Mon', 'Wed', 'Fri'],
            startTime: '10:30 AM',
            endTime: '11:45 AM',
            room: 'Math Tower 410'
          }
        ]
      },
      {
        id: 'phys-202',
        code: 'PHYS 202',
        title: 'University Physics II: Electricity & Magnetism',
        credits: 4,
        colorIndex: 2,
        selectedSectionId: 'sec-phys202',
        sections: [
          {
            id: 'sec-phys202',
            name: 'Lecture TTh',
            days: ['Tue', 'Thu'],
            startTime: '09:30 AM',
            endTime: '10:45 AM',
            room: 'Physics Hall 150'
          }
        ]
      },
      {
        id: 'phys-202l',
        code: 'PHYS 202L',
        title: 'Electromagnetism Lab',
        credits: 1,
        colorIndex: 3,
        selectedSectionId: 'sec-phys202l',
        sections: [
          {
            id: 'sec-phys202l',
            name: 'Lab Tue',
            days: ['Tue'],
            startTime: '01:30 PM',
            endTime: '04:20 PM',
            room: 'Experimental Optics Lab'
          }
        ]
      },
      {
        id: 'engr-105',
        code: 'ENGR 105',
        title: 'SolidWorks CAD & Prototyping',
        credits: 3,
        colorIndex: 4,
        selectedSectionId: 'sec-engr105',
        sections: [
          {
            id: 'sec-engr105',
            name: 'Studio TTh',
            days: ['Tue', 'Thu'],
            startTime: '11:00 AM',
            endTime: '12:15 PM',
            room: 'Makerspace Studio 3'
          }
        ]
      }
    ],
    tasks: [
      { id: 't-eng1', title: 'Truss Force Analysis Finite Element Model', completed: false },
      { id: 't-eng2', title: 'Submit 2nd-Order Laplace Transform Homework', completed: false }
    ]
  },

  'premed': {
    id: 'premed',
    name: 'Pre-Med / Biology',
    major: 'B.S. Molecular Biology (Pre-Med Track)',
    credits: 15,
    description: 'Organic Chemistry I with synthesis lab, Molecular Biology with lab, and Medical Sociology.',
    courses: [
      {
        id: 'chem-221',
        code: 'CHEM 221',
        title: 'Organic Chemistry I: Mechanisms',
        credits: 4,
        colorIndex: 0,
        selectedSectionId: 'sec-chem221',
        sections: [
          {
            id: 'sec-chem221',
            name: 'Lecture MWF',
            days: ['Mon', 'Wed', 'Fri'],
            startTime: '09:00 AM',
            endTime: '10:15 AM',
            room: 'Chemistry Auditorium 100'
          }
        ]
      },
      {
        id: 'chem-221l',
        code: 'CHEM 221L',
        title: 'Organic Synthesis Lab',
        credits: 2,
        colorIndex: 1,
        selectedSectionId: 'sec-chem221l',
        sections: [
          {
            id: 'sec-chem221l',
            name: 'Lab Wed',
            days: ['Wed'],
            startTime: '01:30 PM',
            endTime: '05:00 PM',
            room: 'Organic Chemistry Lab 3'
          }
        ]
      },
      {
        id: 'biol-201',
        code: 'BIOL 201',
        title: 'Cell & Molecular Biology',
        credits: 4,
        colorIndex: 2,
        selectedSectionId: 'sec-biol201',
        sections: [
          {
            id: 'sec-biol201',
            name: 'Lecture TTh',
            days: ['Tue', 'Thu'],
            startTime: '09:30 AM',
            endTime: '10:45 AM',
            room: 'Life Sciences Hall 205'
          }
        ]
      },
      {
        id: 'biol-201l',
        code: 'BIOL 201L',
        title: 'Molecular Genetics Lab',
        credits: 1,
        colorIndex: 3,
        selectedSectionId: 'sec-biol201l',
        sections: [
          {
            id: 'sec-biol201l',
            name: 'Lab Thu',
            days: ['Thu'],
            startTime: '01:30 PM',
            endTime: '04:30 PM',
            room: 'Genetics Lab 2B'
          }
        ]
      },
      {
        id: 'soc-101',
        code: 'SOC 101',
        title: 'Sociology of Healthcare Systems',
        credits: 4,
        colorIndex: 4,
        selectedSectionId: 'sec-soc101',
        sections: [
          {
            id: 'sec-soc101',
            name: 'Lecture TTh',
            days: ['Tue', 'Thu'],
            startTime: '11:00 AM',
            endTime: '12:15 PM',
            room: 'Social Sciences Hall 101'
          }
        ]
      }
    ],
    tasks: [
      { id: 't-pm1', title: 'SN2 vs E2 Reaction Mechanism Practice Problems', completed: true },
      { id: 't-pm2', title: 'Prepare Cell Culture Assay Lab Report', completed: false }
    ]
  },

  'business': {
    id: 'business',
    name: 'Business & Finance',
    major: 'B.B.A. Finance & Marketing Management',
    credits: 15,
    description: 'Financial Accounting, Microeconomics, Corporate Finance, Marketing, and Business Stats.',
    courses: [
      {
        id: 'acct-201',
        code: 'ACCT 201',
        title: 'Financial Accounting Principles',
        credits: 3,
        colorIndex: 0,
        selectedSectionId: 'sec-acct201',
        sections: [
          {
            id: 'sec-acct201',
            name: 'Lecture MWF',
            days: ['Mon', 'Wed', 'Fri'],
            startTime: '10:00 AM',
            endTime: '11:15 AM',
            room: 'Business Hall 105'
          }
        ]
      },
      {
        id: 'econ-101',
        code: 'ECON 101',
        title: 'Principles of Microeconomics',
        credits: 3,
        colorIndex: 1,
        selectedSectionId: 'sec-econ101',
        sections: [
          {
            id: 'sec-econ101',
            name: 'Lecture MWF',
            days: ['Mon', 'Wed', 'Fri'],
            startTime: '11:30 AM',
            endTime: '12:45 PM',
            room: 'Executive Lecture Hall B'
          }
        ]
      },
      {
        id: 'fin-301',
        code: 'FIN 301',
        title: 'Corporate Finance & Valuation',
        credits: 3,
        colorIndex: 2,
        selectedSectionId: 'sec-fin301',
        sections: [
          {
            id: 'sec-fin301',
            name: 'Lecture TTh',
            days: ['Tue', 'Thu'],
            startTime: '09:30 AM',
            endTime: '10:45 AM',
            room: 'Wall Street Lab 201'
          }
        ]
      },
      {
        id: 'mktg-301',
        code: 'MKTG 301',
        title: 'Marketing Strategy & Analytics',
        credits: 3,
        colorIndex: 3,
        selectedSectionId: 'sec-mktg301',
        sections: [
          {
            id: 'sec-mktg301',
            name: 'Lecture TTh',
            days: ['Tue', 'Thu'],
            startTime: '11:00 AM',
            endTime: '12:15 PM',
            room: 'Business Tower 302'
          }
        ]
      },
      {
        id: 'stat-200',
        code: 'STAT 200',
        title: 'Applied Business Statistics',
        credits: 3,
        colorIndex: 4,
        selectedSectionId: 'sec-stat200',
        sections: [
          {
            id: 'sec-stat200',
            name: 'Lecture TTh',
            days: ['Tue', 'Thu'],
            startTime: '02:00 PM',
            endTime: '03:15 PM',
            room: 'Computing Center 115'
          }
        ]
      }
    ],
    tasks: [
      { id: 't-bus1', title: 'Complete Discounted Cash Flow (DCF) Model in Excel', completed: false },
      { id: 't-bus2', title: 'Case Study: Consumer Brand Segmentation', completed: true }
    ]
  }
};

