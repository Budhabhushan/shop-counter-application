1. Server and Client Componentes
   The application uses Next.js App Route.

Shop Catalogue
The /shop and /shop/[sku] pages use Server Components. They retirve catalogue information through the shared getCatalog() function

The search and sort contorls use Client Component beacuse they require browser interactions and URL navigation.

Staff Desk
The staff desk uses a Client Component for form interactions, payment previews, and displaying payment queue updates.

The actual validation, payment recording, and stock updates happen on the server through route handlers.

Checkout
The checkout interface uses a Client Component for cart state, quantity updates, and displaying payment progress.

The server creates the immutable payment snapshot and uses that snapshot to create the final order.
