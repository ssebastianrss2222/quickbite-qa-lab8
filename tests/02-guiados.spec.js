const { test, expect } = require('@playwright/test');

// R01: con credenciales incorrectas la aplicación debe rechazar el acceso.
test('R01 - Rechaza credenciales incorrectas', async ({ page }) => {
  // Preparación: abrir la página inicial.
  await page.goto('/');
  // Acción: escribir un usuario y una contraseña que no existen y presionar Ingresar.
  await page.locator('#user').fill('usuario_falso');
  await page.locator('#password').fill('clave_falsa');
  await page.getByRole('button', { name: 'Ingresar' }).click();
  // Verificación: debe aparecer el mensaje de rechazo y no el de bienvenida.
  await expect(page.locator('#login-result')).toHaveText('Credenciales incorrectas');
  await expect(page.locator('#login-result')).not.toHaveText('Bienvenido');
});

// R02: la búsqueda debe dejar solo los productos que coinciden.
test('R02 - Filtra productos por búsqueda', async ({ page }) => {
  await page.goto('/');
  // Acción: buscar la palabra Pizza.
  await page.locator('#search').fill('Pizza');
  // Verificación: Pizza aparece, Tacos no aparece y queda un solo producto en la lista.
  await expect(page.locator('#products')).toContainText('Pizza');
  await expect(page.locator('#products')).not.toContainText('Tacos');
  await expect(page.locator('#products .add')).toHaveCount(1);
});

// R03: el contador del carrito debe reflejar los productos agregados.
test('R03 - Actualiza contador del carrito', async ({ page }) => {
  await page.goto('/');
  // Precondición: el carrito empieza en cero.
  await expect(page.locator('#cart-count')).toHaveText('0');
  // Acción: agregar dos productos distintos.
  await page.locator('.add[data-product="Pizza"]').click();
  await page.locator('.add[data-product="Tacos"]').click();
  // Verificación: el contador debe mostrar 2.
  await expect(page.locator('#cart-count')).toHaveText('2');
});

// R04: sin productos en el carrito no se debe confirmar el pedido.
test('R04 - Impide pedido sin productos', async ({ page }) => {
  await page.goto('/');
  // Acción: confirmar sin haber agregado nada.
  await page.getByRole('button', { name: 'Confirmar pedido' }).click();
  // Verificación: aparece la advertencia y no el mensaje de pedido confirmado.
  await expect(page.locator('#message')).toHaveText('Agregue productos al carrito');
  await expect(page.locator('#message')).not.toContainText('Pedido confirmado');
});
