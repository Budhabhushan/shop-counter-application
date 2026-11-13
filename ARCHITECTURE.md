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

2. Caching Strategy
   The catalogue is cached independently using Next.js unstable_cache with a catalog cache tag.

The shop page reads URL search parameters, so it can render dynamically while reusing the cached catalog data.

The getCatalog() function increments the catalogue read counter only when the cached function executes.

After a successful staff payment, the catalogue cache is invalidated using revalidateTag.

This ensures the next catalogue request retrieves updated stock information.

The /api/catalog endpoint reads the live in-memory store directly and does not use the cached catalog function

3. URL-Based Search and Sorting
   Search and sorting values are stored in URL query paramenters.

For example:
/shop?q=lamp&sort=price-desc

This makes filters shareable, reload-safe, and compatible with browser navigation.

The server reads the query parameters and filters/sorts the cached catalogue.

4. Immutable Checkout Snapshot
   The browser sends product SKUs and quantities to the checkout begin endpoint.

The server ignores client-provided prices and calculates the amount using its own catalogue.

It stores an immutable checkout attempt containg product names, prices, quantites, and total amount.

When payment completes, the server retrives the original attempt and creates the order from that stored snapshot

This prevents subsequent cart changes or manipulated client prices from changing the amount charged.
