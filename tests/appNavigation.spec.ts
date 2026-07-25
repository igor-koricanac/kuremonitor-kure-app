import { test, expect } from './fixtures';

test.describe('navigating Kure Monitor app', () => {
  test('dashboard should render Kure Insights and Chatbot correctly', async ({ gotoPage, page }) => {
    await gotoPage('/');
    await expect(page.getByText('Kure Insights')).toBeVisible();
    await expect(page.getByText('Chatbot')).toBeVisible();
  });

  test('should be able to switch between Failure Feed and Chat History tabs', async ({ gotoPage, page }) => {
    await gotoPage('/');
    
    // Verify Failure Feed tab is visible by default
    await expect(page.getByText('Failure Feed')).toBeVisible();

    // Click on Chat History tab
    await page.getByText('Chat History').click();
    await expect(page.getByText('No chat history yet.')).toBeVisible();

    // Click back to Failure Feed tab
    await page.getByText('Failure Feed').click();
    await expect(page.getByText('Kure Insights')).toBeVisible();
  });
});
