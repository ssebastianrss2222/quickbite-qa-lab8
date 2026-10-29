const { test, expect } = require('@playwright/test');

// R05: la regla de negocio exige rechazar el pedido si falta el nombre de entrega.
// Esta prueba debe FALLAR porque la aplicación tiene un defecto intencional.
test('R05 - No permite confirmar sin nombre de entrega', async ({ page }) => {
  await page.goto('/');
  // Precondición: al menos un producto en el carrito.
  await page.locator('.add[data-product="Pizza"]').click();
  await expect(page.locator('#cart-count')).toHaveText('1');
  // Precondición: el nombre de entrega está vacío.
  await expect(page.locator('#customer')).toHaveValue('');
  // Acción: intentar confirmar el pedido.
  await page.getByRole('button', { name: 'Confirmar pedido' }).click();
  // Verificación: el pedido NO debe quedar confirmado.
  await expect(page.locator('#message')).not.toContainText('Pedido confirmado');
});

// R06: buscar algo que no existe no debe mostrar ningún producto.
test('R06 - Búsqueda sin coincidencias', async ({ page }) => {
  await page.goto('/');
  // Acción: buscar un texto que no coincide con ningún producto.
  await page.locator('#search').fill('Sushi');
  // Verificación: no hay botones Agregar y la lista de productos queda vacía.
  await expect(page.locator('#products .add')).toHaveCount(0);
  await expect(page.locator('#products')).toBeEmpty();
});
