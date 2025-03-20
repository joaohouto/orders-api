# Application Specifictions

## Use Cases

- Users must be able to sign up/in;
- Users must be able to mange their profiles (name, photo)

- Users must be able to create their own Pages;
- User that created a page is its owner;
- Owner can add collaborators (users) to his page;

- Pages have name, a icon url and banner url;
- Pages have products;

- Products have name, images, price;
- Products may have variations;
- Variations have name and price;

- Orders have a user, a page relation, the product ordered and its variation ordered;

## Entities

- User

- Page

  - owner
  - name
  - icon
  - banner
  - instagramUrl

- Products

  - name
  - price
  - images
  - description
  - variations (relation)
  - page (relation)

- Orders

  - product (relation)
  - selectedVariation (relation)
  - user (relation)
  - details
  - paidAt
  - deliveredAt
  - createdAt

- File

  - title
  - size
  - url
  - page (relation)
