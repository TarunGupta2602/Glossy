-- Data fix: Statement Piecess → Statement Pieces + shorten product meta_titles (≤42 before brand)
-- Run in Supabase SQL Editor. Safe to re-run.

BEGIN;

UPDATE categories
SET
  name = trim(regexp_replace(name, 'Piecess', 'Pieces', 'gi')),
  slug = 'statement-pieces'
WHERE name ILIKE '%piecess%' OR slug ILIKE '%piecess%';

UPDATE products SET meta_title = 'Gold Wavy Pavé Crystal Bangle and Ring Set', updated_at = now() WHERE id = 'af5e91bb-7e63-436b-b301-8279850f98a3';
UPDATE products SET meta_title = 'Gold Pavé Crystal Bangle and Ring Set', updated_at = now() WHERE id = '267a2654-224f-4ca8-a574-ac37b5e9dad0';
UPDATE products SET meta_title = 'Gold Daisy Flower Stretch Bracelet', updated_at = now() WHERE id = '7281e9ad-b914-415e-bf7b-0c182504e71a';
UPDATE products SET meta_title = 'Ribbed Texture Gold Rectangular Hoop', updated_at = now() WHERE id = '58f440f1-a585-4f58-8c2a-aeaec742d486';
UPDATE products SET meta_title = 'Gold Zigzag Crystal Bangle and Ring Set', updated_at = now() WHERE id = '2a9d29b4-710d-4956-910a-84d27856192b';
UPDATE products SET meta_title = 'Gold-Tone Sculpted Square Hoop Earrings', updated_at = now() WHERE id = '8ce0e2dd-0798-4136-8de6-2cb91e53aec4';
UPDATE products SET meta_title = 'Gold Round Coin Pendant Necklace', updated_at = now() WHERE id = '5eedfad3-83b2-4197-8a39-33e983ed4a45';
UPDATE products SET meta_title = 'Gold Rectangular Tag Pendant Necklace', updated_at = now() WHERE id = '7f4c8a65-375c-4b39-8af7-f60b5e9ef595';
UPDATE products SET meta_title = 'Gold Snake Chain Necklace', updated_at = now() WHERE id = 'abeaff4a-5b25-4e13-bd15-73db238557ac';
UPDATE products SET meta_title = 'Gold Satellite Chain Necklace with Black', updated_at = now() WHERE id = '3cddf9d7-1b4a-46ce-9486-8d323ef10ad6';
UPDATE products SET meta_title = 'Gold ''11:11'' Engraved Heart Necklace', updated_at = now() WHERE id = 'c23cef0a-d637-499a-8079-daa0310ac3e4';
UPDATE products SET meta_title = 'Gold Heart Necklace with Mother-of-Pearl', updated_at = now() WHERE id = '76eda960-a322-47b4-a428-51e88f9b9052';
UPDATE products SET meta_title = 'Gold Satellite Chain Necklace with Puffed', updated_at = now() WHERE id = '00d11e9b-e0a9-4ee8-8567-656c289597fd';
UPDATE products SET meta_title = 'Adjustable Gold Lariat Necklace with', updated_at = now() WHERE id = '9e13e91c-367a-46b3-b4ce-99b3281acfbf';
UPDATE products SET meta_title = 'Gold Heart Charm Beaded Chain Necklace', updated_at = now() WHERE id = '0a40963c-a369-4f01-b2ed-22e95d6022aa';
UPDATE products SET meta_title = 'Mother-of-Pearl Rectangular Pendant', updated_at = now() WHERE id = 'db034670-8c26-4041-a046-28b7c6d3a1ad';
UPDATE products SET meta_title = 'Gold Open Heart Pendant Necklace', updated_at = now() WHERE id = '309b9e53-2f8c-431b-8730-e74867d257ab';
UPDATE products SET meta_title = 'Black Onyx Heart Pendant Necklace (Worn)', updated_at = now() WHERE id = '048f64a0-d5c9-427d-827c-e62f7c576aaa';
UPDATE products SET meta_title = 'Gold Screw-Motif Bangle Bracelet with CZ', updated_at = now() WHERE id = '6d391f25-b4e6-404e-b1a3-c82633960758';
UPDATE products SET meta_title = 'Pink and Purple Gemstone Vine Tennis', updated_at = now() WHERE id = 'becd53b4-12ee-4130-aca0-f6d5240234d1';
UPDATE products SET meta_title = 'Gold Nail Cuff Bracelet', updated_at = now() WHERE id = '372aaaa3-dca2-4939-9039-635c8f39e901';
UPDATE products SET meta_title = 'Gold Star, Evil Eye and Diamond-Accent', updated_at = now() WHERE id = '3b1c45bd-72c0-4fdc-ab78-68d737bd5b07';
UPDATE products SET meta_title = 'Vintage-Style Gold Link Watch Bracelet', updated_at = now() WHERE id = '5150d577-86c6-40e6-b314-8d99f7f05701';
UPDATE products SET meta_title = 'Gold Organic Hoop Drop Earrings with CZ', updated_at = now() WHERE id = 'f2e6e271-927c-4ede-bbc7-c76a9d33a53e';
UPDATE products SET meta_title = 'Gold Infinity CZ Stud Earrings', updated_at = now() WHERE id = 'c8460eee-b04f-4bfa-84a3-da7821b4b3cb';
UPDATE products SET meta_title = 'Gold Twisted Rope Hoop Earrings', updated_at = now() WHERE id = '6ddd5165-fe7c-45a6-9cfd-3f6763a04082';
UPDATE products SET meta_title = 'Gold Wave Link Mini Hoop Earrings', updated_at = now() WHERE id = '503dc977-ea48-49ab-8365-122e341976c6';
UPDATE products SET meta_title = 'Pink Tulip Pearl Stud Earrings with CZ', updated_at = now() WHERE id = '279818b2-cc8f-43ad-b6d0-800daa3cdcd6';
UPDATE products SET meta_title = 'Pearl Clover Stud Earrings with CZ Center', updated_at = now() WHERE id = '60659bc8-dc06-4c20-8fea-5f2cf318fa28';
UPDATE products SET meta_title = 'Gold Leaf Enamel Stud Earrings, Teal and', updated_at = now() WHERE id = 'd7df3b43-f3dc-4007-8055-2dc56dc9dedb';
UPDATE products SET meta_title = 'Bow and Double Heart Mother-of-Pearl Stud', updated_at = now() WHERE id = 'ff3acd0e-1fd5-4173-bc4a-699dae021130';
UPDATE products SET meta_title = 'Cat''s-Eye Moonstone Oval Stud Earrings', updated_at = now() WHERE id = '68017652-9ece-4581-b418-3592c4101937';
UPDATE products SET meta_title = 'Mother-of-Pearl Tulip Drop Earrings with', updated_at = now() WHERE id = 'f9163192-7fad-4fa4-947b-19788cea9fc7';
UPDATE products SET meta_title = 'Pink Tulip Enamel Stud Earrings', updated_at = now() WHERE id = 'a9a28b33-f5af-4eda-83af-6c47b7caa59e';
UPDATE products SET meta_title = 'Stackable Rhinestone Ring Set (Gold, Rose', updated_at = now() WHERE id = 'd3bd4776-f590-4638-844c-a16d2da4fb44';
UPDATE products SET meta_title = 'Gold Pave Chevron Ring', updated_at = now() WHERE id = '9b8357b3-192e-4eaf-babf-5acf90a39ec4';
UPDATE products SET meta_title = 'Gold Emerald Open Ring', updated_at = now() WHERE id = '3b24820d-b074-40e0-a993-12ea856591a3';
UPDATE products SET meta_title = 'Gold Heart Knot Jewelry Set (Necklace', updated_at = now() WHERE id = 'cdbd5e5d-d173-47fc-9f6b-bae8c399f6b8';
UPDATE products SET meta_title = 'Gold Layered Daisy Chain Necklace', updated_at = now() WHERE id = '32333ae0-914c-4084-a4bf-4ecd55032314';
UPDATE products SET meta_title = 'Silver Layered Daisy Chain Necklace', updated_at = now() WHERE id = '63310db2-cf27-4bd3-9b25-c935ae87b625';
UPDATE products SET meta_title = 'Gold Teardrop Charm Anklet', updated_at = now() WHERE id = 'e494fc72-35cc-42d1-90df-a93f76ba8dc3';
UPDATE products SET meta_title = 'Two-Tone Infinity Tennis Bracelet', updated_at = now() WHERE id = '1ba52a56-a358-413b-a6ed-94246e01c750';
UPDATE products SET meta_title = 'Gold Rainbow Cross Charm Bracelet', updated_at = now() WHERE id = 'f54d3b6b-4e04-4754-a08b-770a204c266a';
UPDATE products SET meta_title = 'Gold Emerald Pendant Necklace with Cubic', updated_at = now() WHERE id = 'b4328ff4-ef64-4b75-9f3b-3ce40379a108';
UPDATE products SET meta_title = 'Gold Dolphin Pendant Necklace with Cubic', updated_at = now() WHERE id = '70388af6-4eae-4410-929e-4fc323e12319';
UPDATE products SET meta_title = 'Gold Cherry Blossom & Pearl Charm Pendant', updated_at = now() WHERE id = 'ee1e9077-0753-44ab-9f98-880680f77859';
UPDATE products SET meta_title = 'Gold Multi-Gemstone Dangle Necklace', updated_at = now() WHERE id = 'f0659c38-b56b-4992-b2d6-cc7075474aae';
UPDATE products SET meta_title = 'Gold Evil Eye Bead Necklace', updated_at = now() WHERE id = 'b95da6f8-80ab-478a-8c82-07c3347443ff';
UPDATE products SET meta_title = 'Silver Evil Eye Bead Necklace', updated_at = now() WHERE id = '798f58d4-39a5-43a8-ba9f-edf11cd5e657';
UPDATE products SET meta_title = 'Gold Floral Branch Pendant Necklace', updated_at = now() WHERE id = '14a050f3-46e8-46df-b786-662d3fd291e2';
UPDATE products SET meta_title = 'Gold Floral Branch Pendant Necklace', updated_at = now() WHERE id = 'ae930d4f-4373-4e82-8955-e865900ee9f9';
UPDATE products SET meta_title = 'Gold Floral Branch Pendant Necklace', updated_at = now() WHERE id = '07bf36ab-04bd-4d46-b49a-6371c8b7510d';
UPDATE products SET meta_title = 'Gold Floral Branch Pendant Necklace', updated_at = now() WHERE id = '3e6d3f01-b1b5-4dc8-a7af-04693746b833';
UPDATE products SET meta_title = 'Gold Beaded Chain Heart Pendant Necklace', updated_at = now() WHERE id = 'e36a30cc-6866-4ca2-b83d-f0ab388c6947';
UPDATE products SET meta_title = 'Gold Butterfly Pendant Necklace with', updated_at = now() WHERE id = 'f629b4a3-9811-49e3-98dc-98b8eac7b933';
UPDATE products SET meta_title = 'Silver Panda Pendant Necklace', updated_at = now() WHERE id = 'cc969706-edd0-4feb-a442-ae535620cf35';
UPDATE products SET meta_title = 'Gold Bird in Circle Pendant Necklace', updated_at = now() WHERE id = '1a53a151-162e-48ce-b2d9-b2d44bb8b6af';
UPDATE products SET meta_title = 'Silver Butterfly Pendant Necklace with', updated_at = now() WHERE id = '27ce1eb0-374e-4005-917b-bb021e9528aa';
UPDATE products SET meta_title = 'Gold Double Heart Pendant Necklace with', updated_at = now() WHERE id = '088ab77c-b96c-495c-b1cf-f92c96a71cfe';
UPDATE products SET meta_title = 'Silver Infinity ''S'' Pendant Necklace with', updated_at = now() WHERE id = 'e33ca6d2-670e-4617-a11e-b52dbce3ef5d';
UPDATE products SET meta_title = 'Silver Heart Outline Pendant Necklace', updated_at = now() WHERE id = '8c86913d-89ac-470e-b2c9-c268f48dc610';
UPDATE products SET meta_title = 'Black Heart Pendant Necklace with Silver', updated_at = now() WHERE id = '388877ab-b594-4c54-8d35-185a8d0482f4';
UPDATE products SET meta_title = 'Black Star Pendant Necklace with Silver', updated_at = now() WHERE id = 'b9c45ea0-f139-41cd-ac0c-235f792dc93c';
UPDATE products SET meta_title = 'Minimalist Crystal Band Ring – Gold Plated', updated_at = now() WHERE id = 'dd93cde0-2b05-4542-87d4-c66267adca76';

UPDATE products SET
  meta_description = regexp_replace(COALESCE(meta_description, ''), 'Piecess', 'Pieces', 'gi'),
  meta_keywords = regexp_replace(COALESCE(meta_keywords, ''), 'Piecess', 'Pieces', 'gi'),
  image_alt = regexp_replace(COALESCE(image_alt, ''), 'Piecess', 'Pieces', 'gi')
WHERE meta_description ILIKE '%piecess%'
   OR meta_keywords ILIKE '%piecess%'
   OR image_alt ILIKE '%piecess%';

COMMIT;
