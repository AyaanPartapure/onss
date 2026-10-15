const fs = require('fs');
const path = require('path');
const User = require('./models/User');
const Note = require('./models/Note');

const seedData = async () => {
  try {
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log('[Seed] Database already contains records. Skipping seed.');
      return;
    }

    console.log('[Seed] Seeding database with initial users and notes...');

    // 1. Create Default Test User
    const testUser = await User.create({
      fullName: 'John Doe',
      mobileNumber: '9876543210',
      email: 'john12@gmail.com',
      password: 'Test@123',
      role: 'user',
    });

    // 2. Create Admin User
    const adminUser = await User.create({
      fullName: 'System Administrator',
      mobileNumber: '9998887776',
      email: 'admin@gmail.com',
      password: 'Admin@123',
      role: 'admin',
    });

    // 3. Create Additional Student
    const studentUser = await User.create({
      fullName: 'Sarah Jenkins',
      mobileNumber: '9123456789',
      email: 'sarah.j@example.com',
      password: 'Test@123',
      role: 'user',
    });

    // Find available files in uploads directory
    const uploadsDir = path.join(__dirname, 'uploads');
    let availableFiles = [];
    if (fs.existsSync(uploadsDir)) {
      availableFiles = fs.readdirSync(uploadsDir).filter((f) => f.endsWith('.pdf'));
    }

    // Default sample PDF filenames
    const f1 = availableFiles[0] || 'sample_note_part1.pdf';
    const f2 = availableFiles[1] || 'sample_note_part2.pdf';
    const f3 = availableFiles[2] || '';
    const f4 = availableFiles[3] || '';

    // If dummy file doesn't exist, create simple valid dummy PDF buffer
    if (availableFiles.length === 0) {
      const dummyPdfContent = `%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000010 00000 n\n0000000060 00000 n\n0000000118 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n212\n%%EOF`;
      fs.writeFileSync(path.join(uploadsDir, 'sample_note_part1.pdf'), dummyPdfContent);
      fs.writeFileSync(path.join(uploadsDir, 'sample_note_part2.pdf'), dummyPdfContent);
    }

    const sampleNotes = [
      {
        user: testUser._id,
        subject: 'Computer Science',
        notesTitle: 'Data Structures and Algorithms Masterclass',
        notesDescription:
          'Comprehensive notes covering Arrays, Linked Lists, Binary Trees, Graph Traversal algorithms (BFS/DFS), Dynamic Programming, and complexity analysis (Big-O).',
        file1: f1,
        file2: f2,
        file3: f3,
        file4: '',
      },
      {
        user: testUser._id,
        subject: 'Database Systems',
        notesTitle: 'Relational Database Design and Normalization',
        notesDescription:
          'Detailed lecture notes on ER modeling, relational algebra, SQL querying, 1NF to BCNF normalization proofs, indexing (B+ Trees), and ACID transaction management.',
        file1: f2 || f1,
        file2: '',
        file3: '',
        file4: '',
      },
      {
        user: studentUser._id,
        subject: 'Operating Systems',
        notesTitle: 'Process Scheduling and Memory Management',
        notesDescription:
          'Study guide explaining process synchronization, semaphores, deadlock detection (Banker algorithm), paging, virtual memory, and file systems.',
        file1: f1,
        file2: f2,
        file3: '',
        file4: '',
      },
      {
        user: studentUser._id,
        subject: 'Computer Networks',
        notesTitle: 'TCP/IP Protocol Suite & Network Security',
        notesDescription:
          'Overview of OSI 7-layer model, IP addressing (IPv4/IPv6), subnetting, TCP flow control, congestion window, DNS, TLS/SSL handshake, and packet routing protocols.',
        file1: f2 || f1,
        file2: '',
        file3: '',
        file4: '',
      },
      {
        user: adminUser._id,
        subject: 'Software Engineering',
        notesTitle: 'Agile Methodologies & Design Patterns',
        notesDescription:
          'Guide to Scrum, Kanban, clean architecture principles (SOLID), Creational/Structural/Behavioral Gang of Four design patterns, and automated CI/CD pipelines.',
        file1: f1,
        file2: '',
        file3: '',
        file4: '',
      },
      {
        user: testUser._id,
        subject: 'Mathematics',
        notesTitle: 'Linear Algebra and Calculus for Machine Learning',
        notesDescription:
          'Vector spaces, Eigenvalues and Eigenvectors, Matrix Factorization (SVD, PCA), Multivariate Calculus, and Gradient Descent optimization formulation.',
        file1: f1,
        file2: f2,
        file3: '',
        file4: '',
      },
    ];

    await Note.insertMany(sampleNotes);
    console.log('[Seed] Seed completed successfully!');
    console.log(`[Seed] Default User: john12@gmail.com / Test@123`);
    console.log(`[Seed] Admin User: admin@gmail.com / Admin@123`);
  } catch (error) {
    console.error('[Seed] Error seeding database:', error.message);
  }
};

// Standalone execution support
if (require.main === module) {
  const dotenv = require('dotenv');
  dotenv.config({ path: path.join(__dirname, '..', '.env') });
  const connectDB = require('./config/db');

  (async () => {
    await connectDB();
    await seedData();
    process.exit(0);
  })();
}

module.exports = seedData;
