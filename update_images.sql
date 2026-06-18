USE rumah_kosim;

-- Delete all current dummy books to prevent duplicates
DELETE FROM products;

-- Insert the 8 books matching the actual images and real IDR prices
INSERT INTO products (title, price, image, description, quantity) VALUES 
('Atomic Habits', 145000, '/images/buku1.jpg', 'Tiny Changes, Remarkable Results. An Easy & Proven Way to Build Good Habits & Break Bad Ones by James Clear.', 100),
('Deep Work', 125000, '/images/buku2.jpg', 'Rules for Focused Success in a Distracted World by Cal Newport.', 50),
('Sapiens', 165000, '/images/buku3.jpg', 'A Brief History of Humankind by Yuval Noah Harari.', 200),
('Range', 135000, '/images/buku4.jpg', 'Why Generalists Triumph in a Specialized World by David Epstein.', 150),
('AI and Machine Learning for Coders', 450000, '/images/buku5.jpg', 'A Programmer''s Guide to Artificial Intelligence by Laurence Moroney.', 120),
('The Psychology of Money', 115000, '/images/buku6.jpg', 'Timeless lessons on wealth, greed, and happiness by Morgan Housel.', 180),
('Web Scalability for Startup Engineers', 480000, '/images/buku7.jpg', 'Tips & Techniques for Scaling Your Web Application by Artur Ejsmont.', 90),
('Breath', 138000, '/images/buku8.jpg', 'The New Science of a Lost Art by James Nestor.', 110);
