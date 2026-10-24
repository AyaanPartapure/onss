const mongoose = require('mongoose');
const net = require('net');

// Quick check if a host:port is listening
const checkPortOpen = (host, port, timeout = 500) => {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let isConnected = false;

    socket.setTimeout(timeout);

    socket.on('connect', () => {
      isConnected = true;
      socket.destroy();
      resolve(true);
    });

    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });

    socket.on('error', () => {
      socket.destroy();
      resolve(false);
    });

    socket.connect(port, host);
  });
};

const connectDB = async () => {
  if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI must be configured in production.');
  }
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/onssdb';

  // If URI points to local 127.0.0.1/localhost on port 27017, check if port is actually listening first
  const isLocalDefault = uri.includes('127.0.0.1:27017') || uri.includes('localhost:27017');

  if (isLocalDefault) {
    const isPortOpen = await checkPortOpen('127.0.0.1', 27017, 400);

    if (isPortOpen) {
      try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
        console.log(`[Database] Connected to local MongoDB on port 27017`);
        return;
      } catch (err) {
        console.warn(`[Database] Port 27017 open but connection failed: ${err.message}`);
      }
    } else {
      console.log('[Database] Local MongoDB port 27017 is inactive. Launching fast in-memory database...');
    }

    // Launch instant in-memory instance
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      await mongoose.connect(memoryUri);
      console.log(`[Database] In-memory MongoDB connected successfully at: ${memoryUri}`);
    } catch (memErr) {
      console.error('[Database] Failed to initialize in-memory database:', memErr.message);
      throw memErr;
    }
  } else {
    // Custom URI (e.g. MongoDB Atlas)
    try {
      await mongoose.connect(uri);
      console.log(`[Database] Connected to configured MongoDB: ${mongoose.connection.host}`);
    } catch (err) {
     console.error(`[Database] Connection failed: ${err.message}`);
      throw err;
    }
  }
};

module.exports = connectDB;
