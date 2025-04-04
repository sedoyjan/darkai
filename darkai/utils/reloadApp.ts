import { reloadAppAsync } from 'expo';

export async function reloadApp() {
  try {
    await reloadAppAsync();
  } catch (e) {
    console.error(e);
  }
}
