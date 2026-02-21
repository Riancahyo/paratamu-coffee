CREATE TABLE menus (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  description TEXT,
  price       INTEGER NOT NULL,
  category    VARCHAR(50) NOT NULL CHECK (category IN ('Coffee', 'Non-Coffee', 'Snacks')),
  image_url   TEXT,
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE reservations (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  phone      VARCHAR(20) NOT NULL,
  date       DATE NOT NULL,
  time       TIME NOT NULL,
  space      VARCHAR(50) NOT NULL CHECK (space IN ('Indoor', 'Outdoor', 'Private Room')),
  guests     INTEGER DEFAULT 1,
  notes      TEXT DEFAULT '',
  status     VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE testimonials (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  role       VARCHAR(100) DEFAULT '',
  message    TEXT NOT NULL,
  rating     INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  avatar_url TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT NOW()
);